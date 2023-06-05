import React, { useState } from "react";
import styles from "./Calculator.module.css";
import * as math from "mathjs";


const Calculator = () => {
  const [display, setDisplay] = useState("");

  const handleInput = (event) => {
    setDisplay(event.target.value);
  };

  const handleClick = (value) => {
    setDisplay((prevDisplay) => prevDisplay + value);
  };

  const handleClear = () => {
    setDisplay("");
  };

  const handleBackspace = () => {
    setDisplay(display.slice(0, -1));
  };

  const handleEqual = () => {
    try {
      const result = math.evaluate(display, {
        sin: (x) => math.sin(math.unit(x, "deg")),
        cos: (x) => math.cos(math.unit(x, "deg")),
        tan: (x) => math.tan(math.unit(x, "deg")),
        sqrt: math.sqrt,
        log: math.log,
      });
      setDisplay(result.toString());
    } catch (error) {
      setDisplay("Error");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleEqual();
    }
  };


  return (
    <div className="calculator my-1">
      <h2>Scientific Calculator</h2>
      <div className={styles.displaybox}>
        <textarea
          className="display"
          placeholder="Output"
          cols={26}
          rows={2}
          value={display}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="buttons my-3">
        <div className="row">
          <button onClick={() => handleClick("sin(")}>sin</button>
          <button onClick={() => handleClick("cos(")}>cos</button>
          <button onClick={() => handleClick("tan(")}>tan</button>
          <button onClick={() => handleClick("^")}>^</button>
        </div>
        <div className="row">
          <button onClick={() => handleClick("7")}>7</button>
          <button onClick={() => handleClick("8")}>8</button>
          <button onClick={() => handleClick("9")}>9</button>
          <button onClick={() => handleClick("/")}>/</button>
        </div>
        <div className="row">
          <button onClick={() => handleClick("4")}>4</button>
          <button onClick={() => handleClick("5")}>5</button>
          <button onClick={() => handleClick("6")}>6</button>
          <button onClick={() => handleClick("*")}>*</button>
        </div>
        <div className="row">
          <button onClick={() => handleClick("1")}>1</button>
          <button onClick={() => handleClick("2")}>2</button>
          <button onClick={() => handleClick("3")}>3</button>
          <button onClick={() => handleClick("-")}>-</button>
        </div>
        <div className="row">
          <button onClick={() => handleClick("0")}>0</button>
          <button onClick={() => handleClick(".")}>.</button>
          <button onClick={() => handleClick("log(")}>log</button>

          <button onClick={() => handleClick("+")}>+</button>
        </div>
        <div className="row">
          <button onClick={() => handleClick("(")}>(</button>
          <button onClick={() => handleClick(")")}>)</button>
          <button onClick={() => handleClick("sqrt(")}>√</button>
          <button onClick={handleEqual}>=</button>
        </div>
        <div className="row">
          <button onClick={handleClear}>C</button>
          <button onClick={handleBackspace}>Del</button>
        </div>
      </div>
    </div>
  );
};
export default Calculator;