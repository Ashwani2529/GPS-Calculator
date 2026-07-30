import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const links = [
  { to: "/", label: "Scientific", short: "S", end: true },
  { to: "/GraphingCalculator", label: "Graphing", short: "G", end: false },
  { to: "/PolynomialRootsCalculator", label: "Polynomial", short: "P", end: false },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `${styles.link} ${isActive ? styles.active : ""}`;

  return (
    <header className={styles.navWrap}>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.brandMark}>∑</span>
          <span className={styles.brandText}>
            GPS<span className={styles.brandDot}>·</span>Calc
          </span>
        </NavLink>

        <button
          className={styles.burger}
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span style={{ transform: open ? "translateY(6px) rotate(45deg)" : "" }} />
          <span style={{ opacity: open ? 0 : 1 }} />
          <span style={{ transform: open ? "translateY(-6px) rotate(-45deg)" : "" }} />
        </button>

        <div className={`${styles.links} ${open ? styles.linksOpen : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <span className={styles.linkBadge}>{l.short}</span>
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
