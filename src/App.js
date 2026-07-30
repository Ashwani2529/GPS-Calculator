import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calculator from './components/Calculator';
import GraphingCalculator from './components/GraphingCalculator';
import PolynomialRootsCalculator from './components/PolynomialRootsCalculator';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Calculator />} />
            <Route path="/GraphingCalculator" element={<GraphingCalculator />} />
            <Route path="/PolynomialRootsCalculator" element={<PolynomialRootsCalculator />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
