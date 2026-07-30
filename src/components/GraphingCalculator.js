import React, { useState, useCallback } from "react";
import Plot from "react-plotly.js";
import * as math from "mathjs";
import styles from "./graphing.module.css";

const PALETTE = ["#7c5cff", "#2ee6d6", "#ff5ca8", "#ffb347", "#35e29a", "#5ca8ff"];

const EXAMPLES = ["x^2", "sin(x)", "1/x", "sqrt(x)", "x^3 - 2x", "e^(-x^2)", "tan(x)", "abs(x)"];

let uid = 0;
const newFn = (expr = "", i = 0) => ({
  id: ++uid,
  expr,
  color: PALETTE[i % PALETTE.length],
  visible: true,
});

/* Sanitize user text into a mathjs expression. */
const clean = (raw) =>
  raw
    .replace(/^\s*[a-z]\s*\(\s*x\s*\)\s*=/i, "") // strip "f(x)="
    .replace(/^\s*y\s*=/i, "") // strip "y="
    .trim();

const GraphingCalculator = () => {
  const [functions, setFunctions] = useState([newFn("x^2", 0)]);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [traces, setTraces] = useState([]);
  const [errors, setErrors] = useState({});

  const updateExpr = (id, expr) =>
    setFunctions((fs) => fs.map((f) => (f.id === id ? { ...f, expr } : f)));

  const toggleVisible = (id) =>
    setFunctions((fs) => fs.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f)));

  const addFn = () => setFunctions((fs) => [...fs, newFn("", fs.length)]);

  const removeFn = (id) =>
    setFunctions((fs) => (fs.length > 1 ? fs.filter((f) => f.id !== id) : fs));

  const plot = useCallback(() => {
    const min = Number(xMin);
    const max = Number(xMax);
    const nextErrors = {};

    if (!isFinite(min) || !isFinite(max) || min >= max) {
      setErrors({ range: "Please enter a valid range where X-min < X-max." });
      return;
    }

    const N = 2000;
    const step = (max - min) / N;
    const nextTraces = [];

    functions.forEach((f) => {
      const expr = clean(f.expr);
      if (!expr) return;

      let compiled;
      try {
        compiled = math.compile(expr);
      } catch (e) {
        nextErrors[f.id] = "Invalid expression";
        return;
      }

      const xs = [];
      const ys = [];
      let prev = null;
      let plottedAny = false;

      for (let i = 0; i <= N; i++) {
        const x = min + i * step;
        let y;
        try {
          y = compiled.evaluate({ x });
        } catch {
          y = null;
        }
        if (typeof y !== "number" || !isFinite(y) || Math.abs(y) > 1e6) {
          y = null;
        }
        // break the line across steep discontinuities (e.g. tan asymptotes)
        if (y !== null && prev !== null && Math.abs(y - prev) > 1e5) {
          xs.push(x);
          ys.push(null);
        }
        xs.push(x);
        ys.push(y);
        if (y !== null) plottedAny = true;
        prev = y;
      }

      if (!plottedAny) {
        nextErrors[f.id] = "No real values in range";
        return;
      }

      nextTraces.push({
        x: xs,
        y: ys,
        type: "scatter",
        mode: "lines",
        name: f.expr,
        line: { color: f.color, width: 2.5, shape: "spline" },
        connectgaps: false,
        visible: f.visible ? true : "legendonly",
        hovertemplate: "x=%{x:.3f}<br>y=%{y:.3f}<extra></extra>",
      });
    });

    setErrors(nextErrors);
    setTraces(nextTraces);
  }, [functions, xMin, xMax]);

  const layout = {
    autosize: true,
    margin: { l: 48, r: 20, t: 20, b: 40 },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0.18)",
    font: { color: "#a6b0d4", family: "Inter, sans-serif" },
    xaxis: {
      range: [Number(xMin), Number(xMax)],
      gridcolor: "rgba(255,255,255,0.08)",
      zerolinecolor: "rgba(255,255,255,0.35)",
      zerolinewidth: 1.5,
    },
    yaxis: {
      gridcolor: "rgba(255,255,255,0.08)",
      zerolinecolor: "rgba(255,255,255,0.35)",
      zerolinewidth: 1.5,
    },
    showlegend: true,
    legend: { orientation: "h", y: -0.18, font: { color: "#eaf0ff" } },
    hoverlabel: { bgcolor: "#111634", bordercolor: "#7c5cff" },
  };

  const config = {
    responsive: true,
    displaylogo: false,
    scrollZoom: true,
    modeBarButtonsToRemove: ["lasso2d", "select2d"],
  };

  return (
    <div>
      <div className="page-head">
        <h1 className="gradient-text">Graphing Calculator</h1>
        <p>Plot any function of x — trig, exponential, rational and more</p>
      </div>

      <div className={styles.layout}>
        {/* Controls */}
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Functions</h3>

          {functions.map((f, i) => (
            <div key={f.id} className={styles.fnRow}>
              <button
                className={styles.swatch}
                style={{ background: f.visible ? f.color : "transparent", borderColor: f.color }}
                onClick={() => toggleVisible(f.id)}
                title="Toggle visibility"
              />
              <div className={styles.fnInputWrap}>
                <span className={styles.yPrefix}>y =</span>
                <input
                  className={styles.fnInput}
                  value={f.expr}
                  placeholder="e.g. sin(x)"
                  onChange={(e) => updateExpr(f.id, e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && plot()}
                  spellCheck={false}
                />
              </div>
              <button
                className={styles.removeBtn}
                onClick={() => removeFn(f.id)}
                disabled={functions.length === 1}
                title="Remove"
              >
                ×
              </button>
              {errors[f.id] && <span className={styles.fnError}>{errors[f.id]}</span>}
            </div>
          ))}

          <button className={styles.addBtn} onClick={addFn}>
            + Add function
          </button>

          <div className={styles.examples}>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                className={styles.exampleChip}
                onClick={() => {
                  const empty = functions.find((f) => !f.expr.trim());
                  if (empty) updateExpr(empty.id, ex);
                  else setFunctions((fs) => [...fs, newFn(ex, fs.length)]);
                }}
              >
                {ex}
              </button>
            ))}
          </div>

          <h3 className={styles.panelTitle}>Range (x-axis)</h3>
          <div className={styles.rangeGrid}>
            <label>
              X-min
              <input
                type="number"
                value={xMin}
                onChange={(e) => setXMin(e.target.value)}
              />
            </label>
            <label>
              X-max
              <input
                type="number"
                value={xMax}
                onChange={(e) => setXMax(e.target.value)}
              />
            </label>
          </div>
          {errors.range && <span className={styles.fnError}>{errors.range}</span>}

          <button className={styles.plotBtn} onClick={plot}>
            Plot Graph
          </button>
        </div>

        {/* Plot */}
        <div className={styles.plotCard}>
          {traces.length === 0 ? (
            <div className={styles.plotEmpty}>
              <div className={styles.plotEmptyIcon}>📈</div>
              <p>Enter a function and hit <strong>Plot Graph</strong></p>
            </div>
          ) : (
            <Plot
              data={traces}
              layout={layout}
              config={config}
              useResizeHandler
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphingCalculator;
