import React, { useState } from 'react';
import styles from "./polynomial.module.css";

function PolynomialRootsCalculator() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [d, setD] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [z, setZ] = useState('');
  const [quadraticRoots, setQuadraticRoots] = useState([]);
  const [cubicRoots, setCubicRoots] = useState([]);

  const solveQuadraticEquation = () => {
    const coefficientX = parseFloat(x);
    const coefficientY = parseFloat(y);
    const coefficientZ = parseFloat(z);

    const discriminant = coefficientY* coefficientY- 4 * coefficientX * coefficientZ;

    if (discriminant > 0) {
      const rootOne = (-coefficientY + Math.sqrt(discriminant)) / (2 * coefficientX);
      const rootTwo = (-coefficientY - Math.sqrt(discriminant)) / (2 * coefficientX);
      setQuadraticRoots([rootOne, rootTwo]);
    } else if (discriminant === 0) {
      const root = -coefficientY / (2 * coefficientX);
      setQuadraticRoots([root]);
    } else {
      setQuadraticRoots([]);
    }
  };

  const solveCubicEquation = () => {
    const coefficientA = parseFloat(a);
    const coefficientB = parseFloat(b);
    const coefficientC = parseFloat(c);
    const coefficientD = parseFloat(d);

    if (coefficientA === 0) {
      throw new Error('This is not a cubic equation');
    }

    const delta0 = coefficientB ** 2 - 3 * coefficientA * coefficientC;
    const delta1 = 2 * coefficientB ** 3 - 9 * coefficientA * coefficientB * coefficientC + 27 * coefficientA ** 2 * coefficientD;
    const C = Math.cbrt((delta1 + Math.sqrt(delta1 ** 2 - 4 * delta0 ** 3)) / 2);

    const roots = [];

    for (let k = 0; k < 3; k++) {
      const omega = (-1 / 2) + (Math.sqrt(3) / 2) * (k === 2 ? -1 : 1);
      const x = (-1 / (3 * coefficientA)) * (coefficientB + omega * C + (delta0 / (omega * C)));
      roots.push(x);
    }

    setCubicRoots(roots);
  };

  const handleCalculateQuadraticRoots = (event) => {
    event.preventDefault();
    solveQuadraticEquation();
  };
  const handleClearInputs2 = () => {
    setA('');
    setB('');
    setC('');
    setD('');
    setCubicRoots([]);
  };
  const handleClearInputs1 = () => {
    setX('');
    setY('');
    setZ('');
    setQuadraticRoots([]);
   
  };

  const handleCalculateCubicRoots = (event) => {
    event.preventDefault();
    solveCubicEquation();
  };

  return (
    <div className={styles.calc} id="calculatorWrap my-2">
      <div id="quadratic" className={styles.equationBox}>
        <h2>Quadratic Equation Solver</h2>
       <div className={styles.bizz} ><span style={{ fontSize: '1.2em' }}>
        <span style={{ verticalAlign: 'middle' }}>a</span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>x<sup>2</sup></span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>+</span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>b</span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>x</span>    
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>+</span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>c</span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>=</span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>0</span>
      </span></div>
        <form onSubmit={handleCalculateQuadraticRoots}>
          <div className={styles.calculatorInputGroup} my-3>
          <label htmlFor="a">a =</label>
            <input
              name="a"
              id="a"
              value={x}
              className="nmbr_real real my-2"
              type="text"
              title="real number"
              placeholder="coefficient a"
              required
              onChange={(event) => setX(event.target.value)}
            />
          </div>
          <div className={styles.calculatorInputGroup} my-3>
            <label htmlFor="b">b =</label>
            <input
              name="b"
              id="b"
              value={y}
              className="nmbr_real real my-2"
              type="text"
              title="real number"
              placeholder="coefficient b"
              required
              onChange={(event) => setY(event.target.value)}
            />
          </div>
          <div className={styles.calculatorInputGroup} my-3>
            <label htmlFor="c">c =</label>
            <input
              name="c"
              id="c"
              value={z}
              className="nmbr_real real my-2"
              type="text"
              title="real number"
              placeholder="coefficient c"
              required
              onChange={(event) => setZ(event.target.value)}
            />
          </div>
          <div className={styles.combobutton}>
          <button className="btn btn-success my-3" type={styles.submit} >Calculate</button>
          <button type="button" onClick={handleClearInputs1}>Clear</button></div>
        </form>
        <div className={styles.rootsOutput}>
          {quadraticRoots.length > 0 ? (
            <p>
              The roots of the quadratic equation are: {quadraticRoots.map((root, index) => (
                <span key={index}>{root.toFixed(2)}</span>
              ))}
            </p>
          ) : (
            <p>No real roots exist.</p>
          )}
        </div>
      </div>

      <div id="cubic" className={styles.equationBox} >
        <h2>Cubic Equation Solver</h2>
        <div className={styles.bizz}  ><span style={{ fontSize: '1.2em' }}>
        <span style={{ verticalAlign: 'middle' }}>a</span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>x<sup>3</sup></span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>+</span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>b</span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>x<sup>2</sup></span>
              
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>+</span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>c</span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>x</span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>+</span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>d</span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>=</span>
        <span style={{ verticalAlign: 'middle', paddingLeft: '5px' }}>0</span>
      </span></div>
        <form onSubmit={handleCalculateCubicRoots}>
        <div className={styles.calculatorInputGroup} my-3>
            <label htmlFor="a">a =</label>
            <input
              name="a"
              id="a"
              value={a}
              className="nmbr_real real my-2"
              type="text"
              title="real number"
              placeholder="coefficient a"
              required
              onChange={(event) => setA(event.target.value)}
            />
          </div>
          <div className={styles.calculatorInputGroup} my-3>
            <label htmlFor="b">b =</label>
            <input
              name="b"
              id="b"
              value={b}
              className="nmbr_real real my-2"
              type="text"
              title="real number"
              placeholder="coefficient b"
              required
              onChange={(event) => setB(event.target.value)}
            />
          </div>
          <div className={styles.calculatorInputGroup} my-3>
            <label htmlFor="c">c =</label>
            <input
              name="c"
              id="c"
              value={c}
              className="nmbr_real real my-2"
              type="text"
              title="real number"
              placeholder="coefficient c"
              required
              onChange={(event) => setC(event.target.value)}
            />
          </div>
          <div className={styles.calculatorInputGroup} my-3>
            <label htmlFor="d">d =</label>
            <input
              name="d"
              id="d"
              value={d}
              className="nmbr_real real my-2"
              type="text"
              title="real number"
              placeholder="coefficient d"
              required
              onChange={(event) => setD(event.target.value)}
            />
          </div>
          <div className={styles.combobutton}>
          <button type={styles.submit} className="btn btn-success my-3" >Calculate</button>
          <button type="button" onClick={handleClearInputs2}>Clear</button></div>
        </form>
        <div className={styles.rootsOutputx} >
          {cubicRoots.length > 0 ? (
            <p>
              The roots of the cubic equation are: {cubicRoots.map((root, index) => (
                <span key={index}>{root.toFixed(2)}</span>
              ))}
            </p>
          ) : (
            <p>No real roots exist.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PolynomialRootsCalculator;
