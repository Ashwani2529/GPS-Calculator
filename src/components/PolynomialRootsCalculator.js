import React, { useState, useMemo } from "react";
import styles from "./polynomial.module.css";

/* ---------- minimal complex arithmetic ---------- */
const cAdd = (a, b) => ({ re: a.re + b.re, im: a.im + b.im });
const cSub = (a, b) => ({ re: a.re - b.re, im: a.im - b.im });
const cMul = (a, b) => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});
const cDiv = (a, b) => {
  const d = b.re * b.re + b.im * b.im;
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
};
const cAbs = (a) => Math.hypot(a.re, a.im);

/* ---------- Durand-Kerner root finder (any degree) ---------- */
const solvePolynomial = (coeffs) => {
  let c = coeffs.slice();
  while (c.length > 1 && Math.abs(c[0]) < 1e-14) c.shift(); // trim leading zeros
  const n = c.length - 1;
  if (n < 1) return [];

  const lead = c[0];
  const monic = c.map((v) => v / lead);

  const evalP = (z) => {
    let r = { re: monic[0], im: 0 };
    for (let i = 1; i < monic.length; i++) {
      r = cAdd(cMul(r, z), { re: monic[i], im: 0 });
    }
    return r;
  };

  // spread initial guesses around the complex plane
  let roots = [];
  let p = { re: 1, im: 0 };
  const seed = { re: 0.4, im: 0.9 };
  for (let k = 0; k < n; k++) {
    roots.push({ ...p });
    p = cMul(p, seed);
  }

  for (let iter = 0; iter < 500; iter++) {
    let maxDelta = 0;
    for (let i = 0; i < n; i++) {
      const num = evalP(roots[i]);
      let denom = { re: 1, im: 0 };
      for (let j = 0; j < n; j++) {
        if (i !== j) denom = cMul(denom, cSub(roots[i], roots[j]));
      }
      if (cAbs(denom) < 1e-300) continue;
      const delta = cDiv(num, denom);
      roots[i] = cSub(roots[i], delta);
      maxDelta = Math.max(maxDelta, cAbs(delta));
    }
    if (maxDelta < 1e-14) break;
  }
  return roots;
};

/* ---------- formatting ---------- */
const trim = (x) => {
  const r = parseFloat(x.toPrecision(10));
  return Object.is(r, -0) ? 0 : r;
};

const formatRoot = (root) => {
  const re = trim(root.re);
  const im = trim(root.im);
  const isReal = Math.abs(im) < 1e-9;
  if (isReal) return { text: String(re), real: true };
  const sign = im >= 0 ? "+" : "−";
  return { text: `${re} ${sign} ${Math.abs(im)}i`, real: false };
};

const superscript = (n) => {
  const map = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  return String(n).split("").map((d) => map[d]).join("");
};

const MIN_DEG = 1;
const MAX_DEG = 10;

const PolynomialRootsCalculator = () => {
  const [degree, setDegree] = useState(2);
  const [coeffs, setCoeffs] = useState(() => ["1", "", ""]); // highest -> lowest
  const [roots, setRoots] = useState(null);
  const [message, setMessage] = useState("");

  const resize = (deg) => {
    setDegree(deg);
    setCoeffs((prev) => {
      const size = deg + 1;
      const next = new Array(size).fill("");
      for (let i = 0; i < size; i++) {
        // keep values aligned to the leading coefficient
        const oldIdx = prev.length - size + i;
        if (oldIdx >= 0 && oldIdx < prev.length) next[i] = prev[oldIdx];
      }
      if (!next[0]) next[0] = "1";
      return next;
    });
    setRoots(null);
    setMessage("");
  };

  const setCoeff = (idx, val) => {
    if (!/^-?\d*\.?\d*$/.test(val)) return;
    setCoeffs((prev) => prev.map((c, i) => (i === idx ? val : c)));
  };

  const equationText = useMemo(() => {
    const parts = [];
    coeffs.forEach((c, i) => {
      const power = degree - i;
      const val = c === "" || c === "-" ? "a" : c;
      const varPart =
        power === 0 ? "" : power === 1 ? "x" : `x${superscript(power)}`;
      parts.push(`${val}${varPart}`);
    });
    return parts.join(" + ").replace(/\+ -/g, "− ") + " = 0";
  }, [coeffs, degree]);

  const handleSolve = (e) => {
    e.preventDefault();
    const nums = coeffs.map((c) => (c === "" || c === "-" ? 0 : parseFloat(c)));
    if (nums.every((v) => v === 0)) {
      setMessage("Please enter at least one non-zero coefficient.");
      setRoots(null);
      return;
    }
    if (Math.abs(nums[0]) < 1e-14) {
      setMessage("The leading coefficient can't be zero for a degree-" + degree + " equation.");
      setRoots(null);
      return;
    }
    const result = solvePolynomial(nums).map(formatRoot);
    setRoots(result);
    setMessage("");
  };

  const handleClear = () => {
    setCoeffs(new Array(degree + 1).fill("").map((_, i) => (i === 0 ? "1" : "")));
    setRoots(null);
    setMessage("");
  };

  return (
    <div>
      <div className="page-head">
        <h1 className="gradient-text">Polynomial Solver</h1>
        <p>Find every root — real and complex — for any equation up to degree {MAX_DEG}</p>
      </div>

      <div className={styles.layout}>
        <form className={styles.panel} onSubmit={handleSolve}>
          <label className={styles.degreeLabel}>
            Degree
            <div className={styles.stepper}>
              <button
                type="button"
                onClick={() => degree > MIN_DEG && resize(degree - 1)}
                disabled={degree <= MIN_DEG}
              >
                −
              </button>
              <span>{degree}</span>
              <button
                type="button"
                onClick={() => degree < MAX_DEG && resize(degree + 1)}
                disabled={degree >= MAX_DEG}
              >
                +
              </button>
            </div>
          </label>

          <div className={styles.eqPreview}>{equationText}</div>

          <div className={styles.coeffGrid}>
            {coeffs.map((c, i) => {
              const power = degree - i;
              return (
                <div key={i} className={styles.coeffField}>
                  <input
                    className={styles.coeffInput}
                    value={c}
                    inputMode="decimal"
                    placeholder="0"
                    onChange={(e) => setCoeff(i, e.target.value)}
                  />
                  <span className={styles.coeffLabel}>
                    {power === 0 ? "const" : power === 1 ? "x" : `x${superscript(power)}`}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.solveBtn}>
              Solve
            </button>
            <button type="button" className={styles.clearBtn} onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>

        <div className={styles.panel}>
          <h3 className={styles.resultTitle}>Roots</h3>
          {message && <p className={styles.warn}>{message}</p>}
          {!message && roots === null && (
            <p className={styles.placeholder}>
              Enter your coefficients and press <strong>Solve</strong> to see the roots.
            </p>
          )}
          {!message && roots && roots.length === 0 && (
            <p className={styles.placeholder}>No roots found.</p>
          )}
          {!message && roots && roots.length > 0 && (
            <div className={styles.rootsList}>
              {roots.map((r, i) => (
                <div key={i} className={styles.rootCard}>
                  <span className={styles.rootIndex}>x{superscript(i + 1)}</span>
                  <span className={styles.rootValue}>{r.text}</span>
                  <span className={`${styles.rootTag} ${r.real ? styles.tagReal : styles.tagComplex}`}>
                    {r.real ? "real" : "complex"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolynomialRootsCalculator;
