import React from 'react';
import './App.css';
import Calculator from './components/Calculator';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GraphingCalculator from './components/GraphingCalculator';
import Navbar from './components/Navbar';
import PolynomialRootsCalculator from './components/PolynomialRootsCalculator';

function App() {
  return (
    <div className='App'>
      <Router>
      <Navbar/>
        <Routes>
        <Route path="/PolynomialRootsCalculator" element={<PolynomialRootsCalculator />} />
          <Route path="/" element={<Calculator />} />
          <Route path="/GraphingCalculator" element={<GraphingCalculator />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
