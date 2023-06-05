import React, { useState } from "react";
import styles from "./Calculator.module.css";

const GraphingCalculator = () => {
  const [equation, setEquation] = useState("");
  const [showConstructionMessage, setShowConstructionMessage] = useState(false);

  const handleEquationChange = (event) => {
    setEquation(event.target.value);
  };

  const handleGraph = () => {
    setShowConstructionMessage(true);
    setTimeout(() => {
      setShowConstructionMessage(false);
    }, 6000);
  };

  return (
    <div className={styles["graphing-calculator"]}>
      <h2>Graphing Calculator</h2>
      <div className={styles["input-area"]}>
        <input
          className={styles["equation-input"]}
          type="text"
          placeholder="Enter equation"
          value={equation}
          onChange={handleEquationChange}
        />
        <button className={styles["graph-button"]} onClick={handleGraph}>
          Graph
        </button>
      </div>
      <div className={styles["graph-area"]}>
        {showConstructionMessage && (
          <div className={styles["construction-message"]}>
            <h3 className={styles.messagetext}>
              <i>
                CONSTRUCTION UNDER PROGRESS
              </i>
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphingCalculator;
