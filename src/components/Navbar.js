import React, { useEffect } from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";

const Navbar = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log(window.location.pathname);
  }, []);

  const handleGraphingCalculatorClick = () => {
    navigate("/GraphingCalculator");
  };
  const handlePolyCalculatorClick = () => {
    navigate("/PolynomialRootsCalculator");
  };


  const handleCalculatorClick = () => {
    navigate("/");
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-${props.mode} bg-${props.mode}`}>
      <div className="container-fluid">
        <button className="btn btn-primary mx-1" onClick={handleGraphingCalculatorClick} style={{ borderRadius: '8px', padding: '8px 16px', fontSize: '16px' }}>
          G-Cal
        </button>
        <button className="btn btn-primary mx-1" onClick={handlePolyCalculatorClick} style={{ borderRadius: '8px', padding: '8px 16px', fontSize: '16px' }}>
        P-Cal
        </button>
        <button className="btn btn-primary mx-1" onClick={handleCalculatorClick} style={{ borderRadius: '8px', padding: '8px 16px', fontSize: '16px' }}>
        S-Cal
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
