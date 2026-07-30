import React, { useState, useEffect, useCallback } from "react";
import * as math from "mathjs";
import styles from "./Calculator.module.css";

/* Convert the pretty on-screen expression into a mathjs-parseable string. */
const toMathExpr = (raw) =>
  raw
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/π/g, "pi")
    .replace(/∛\(/g, "cbrt(")
    .replace(/√\(/g, "sqrt(")
    .replace(/log\(/g, "log10(")
    .replace(/ln\(/g, "log(")
    .replace(/%/g, "/100");

/* Degree-mode trig overrides (mathjs works in radians by default). */
const degScope = {
  sin: (x) => Math.sin((x * Math.PI) / 180),
  cos: (x) => Math.cos((x * Math.PI) / 180),
  tan: (x) => Math.tan((x * Math.PI) / 180),
  asin: (x) => (Math.asin(x) * 180) / Math.PI,
  acos: (x) => (Math.acos(x) * 180) / Math.PI,
  atan: (x) => (Math.atan(x) * 180) / Math.PI,
};

const formatResult = (value) => {
  if (typeof value === "number") {
    if (!isFinite(value)) return "Error";
    // strip binary floating-point noise
    const rounded = parseFloat(value.toPrecision(12));
    return String(rounded);
  }
  return math.format(value, { precision: 12 });
};

const evaluateExpr = (raw, mode, ans) => {
  const expr = toMathExpr(raw);
  const scope = { pi: Math.PI, e: Math.E, Ans: ans };
  if (mode === "DEG") Object.assign(scope, degScope);
  return math.evaluate(expr, scope);
};

const Calculator = () => {
  const [display, setDisplay] = useState("");
  const [mode, setMode] = useState("DEG"); // DEG | RAD
  const [second, setSecond] = useState(false);
  const [ans, setAns] = useState(0);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(false);

  const insert = useCallback((token) => {
    setError(false);
    setDisplay((prev) => prev + token);
  }, []);

  const clear = useCallback(() => {
    setDisplay("");
    setError(false);
  }, []);

  const backspace = useCallback(() => {
    setError(false);
    setDisplay((prev) => prev.slice(0, -1));
  }, []);

  const equals = useCallback(() => {
    if (!display.trim()) return;
    try {
      const result = evaluateExpr(display, mode, ans);
      const formatted = formatResult(result);
      if (formatted === "Error") throw new Error("bad");
      setAns(typeof result === "number" ? result : ans);
      setHistory((h) => [{ expr: display, result: formatted }, ...h].slice(0, 30));
      setDisplay(formatted);
      setError(false);
    } catch (e) {
      setError(true);
    }
  }, [display, mode, ans]);

  /* Live preview of the current expression. */
  let preview = "";
  if (display && !error) {
    try {
      const r = evaluateExpr(display, mode, ans);
      const f = formatResult(r);
      if (f !== "Error" && f !== display) preview = f;
    } catch {
      preview = "";
    }
  }

  /* Physical keyboard support. */
  useEffect(() => {
    const handler = (e) => {
      const k = e.key;
      if (/^[0-9]$/.test(k)) insert(k);
      else if (k === ".") insert(".");
      else if (k === "+") insert("+");
      else if (k === "-") insert("−");
      else if (k === "*") insert("×");
      else if (k === "/") insert("÷");
      else if (k === "^") insert("^");
      else if (k === "(" || k === ")") insert(k);
      else if (k === "%") insert("%");
      else if (k === "Enter" || k === "=") {
        e.preventDefault();
        equals();
      } else if (k === "Backspace") backspace();
      else if (k === "Escape") clear();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [insert, equals, backspace, clear]);

  // sin/cos/tan/ln/log/√ swap when "2nd" is active
  const fn = second
    ? [
        { label: "sin⁻¹", token: "asin(" },
        { label: "cos⁻¹", token: "acos(" },
        { label: "tan⁻¹", token: "atan(" },
        { label: "eˣ", token: "e^(" },
        { label: "10ˣ", token: "10^(" },
        { label: "x²", token: "^2" },
      ]
    : [
        { label: "sin", token: "sin(" },
        { label: "cos", token: "cos(" },
        { label: "tan", token: "tan(" },
        { label: "ln", token: "ln(" },
        { label: "log", token: "log(" },
        { label: "√", token: "√(" },
      ];

  return (
    <div>
      <div className="page-head">
        <h1 className="gradient-text">Scientific Calculator</h1>
        <p>Full-featured expression engine · degrees &amp; radians · keyboard ready</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.card}>
          {/* Display */}
          <div className={styles.screen}>
            <div className={styles.screenTop}>
              <span className={`${styles.chip} ${styles.chipMode}`}>{mode}</span>
              {second && <span className={styles.chip}>2nd</span>}
            </div>
            <div className={`${styles.expr} ${error ? styles.exprError : ""}`}>
              {error ? "Error" : display || "0"}
            </div>
            <div className={styles.preview}>{preview && `= ${preview}`}</div>
          </div>

          {/* Keypad */}
          <div className={styles.pad}>
            <button
              className={`${styles.btn} ${styles.fn} ${second ? styles.fnActive : ""}`}
              onClick={() => setSecond((s) => !s)}
            >
              2nd
            </button>
            <button
              className={`${styles.btn} ${styles.fn}`}
              onClick={() => setMode((m) => (m === "DEG" ? "RAD" : "DEG"))}
            >
              {mode}
            </button>
            <button className={`${styles.btn} ${styles.warn}`} onClick={clear}>
              C
            </button>
            <button className={`${styles.btn} ${styles.fn}`} onClick={backspace}>
              ⌫
            </button>
            <button className={`${styles.btn} ${styles.op}`} onClick={() => insert("÷")}>
              ÷
            </button>

            {fn.slice(0, 3).map((f) => (
              <button key={f.label} className={`${styles.btn} ${styles.fn}`} onClick={() => insert(f.token)}>
                {f.label}
              </button>
            ))}
            <button className={`${styles.btn} ${styles.fn}`} onClick={() => insert("π")}>
              π
            </button>
            <button className={`${styles.btn} ${styles.op}`} onClick={() => insert("×")}>
              ×
            </button>

            {fn.slice(3, 6).map((f) => (
              <button key={f.label} className={`${styles.btn} ${styles.fn}`} onClick={() => insert(f.token)}>
                {f.label}
              </button>
            ))}
            <button className={`${styles.btn} ${styles.fn}`} onClick={() => insert("e")}>
              e
            </button>
            <button className={`${styles.btn} ${styles.op}`} onClick={() => insert("−")}>
              −
            </button>

            <button className={`${styles.btn} ${styles.num}`} onClick={() => insert("7")}>7</button>
            <button className={`${styles.btn} ${styles.num}`} onClick={() => insert("8")}>8</button>
            <button className={`${styles.btn} ${styles.num}`} onClick={() => insert("9")}>9</button>
            <button className={`${styles.btn} ${styles.fn}`} onClick={() => insert("^")}>xʸ</button>
            <button className={`${styles.btn} ${styles.op}`} onClick={() => insert("+")}>+</button>

            <button className={`${styles.btn} ${styles.num}`} onClick={() => insert("4")}>4</button>
            <button className={`${styles.btn} ${styles.num}`} onClick={() => insert("5")}>5</button>
            <button className={`${styles.btn} ${styles.num}`} onClick={() => insert("6")}>6</button>
            <button className={`${styles.btn} ${styles.fn}`} onClick={() => insert("(")}>(</button>
            <button className={`${styles.btn} ${styles.fn}`} onClick={() => insert("!")}>x!</button>

            <button className={`${styles.btn} ${styles.num}`} onClick={() => insert("1")}>1</button>
            <button className={`${styles.btn} ${styles.num}`} onClick={() => insert("2")}>2</button>
            <button className={`${styles.btn} ${styles.num}`} onClick={() => insert("3")}>3</button>
            <button className={`${styles.btn} ${styles.fn}`} onClick={() => insert(")")}>)</button>
            <button className={`${styles.btn} ${styles.fn}`} onClick={() => insert("%")}>%</button>

            <button className={`${styles.btn} ${styles.num}`} onClick={() => insert("0")}>0</button>
            <button className={`${styles.btn} ${styles.num}`} onClick={() => insert(".")}>.</button>
            <button className={`${styles.btn} ${styles.fn}`} onClick={() => insert("Ans")}>Ans</button>
            <button className={`${styles.btn} ${styles.equals}`} onClick={equals}>=</button>
          </div>
        </div>

        {/* History */}
        <div className={styles.historyCard}>
          <div className={styles.historyHead}>
            <span>History</span>
            {history.length > 0 && (
              <button className={styles.clearHistory} onClick={() => setHistory([])}>
                Clear
              </button>
            )}
          </div>
          <div className={styles.historyList}>
            {history.length === 0 ? (
              <p className={styles.historyEmpty}>Your calculations will appear here.</p>
            ) : (
              history.map((h, i) => (
                <button
                  key={i}
                  className={styles.historyItem}
                  onClick={() => {
                    setDisplay(h.result);
                    setError(false);
                  }}
                >
                  <span className={styles.hExpr}>{h.expr}</span>
                  <span className={styles.hResult}>= {h.result}</span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
