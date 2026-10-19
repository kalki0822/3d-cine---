import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const handleNavClick = (e, targetP, hash) => {
    e.preventDefault();
    if (targetP !== null && typeof window.scrollToProgress === 'function') {
      window.scrollToProgress(targetP);
    } else {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="cinematic-nav">
      <a href="#hero" className="brand-wrapper" onClick={(e) => handleNavClick(e, 0.0, '#hero')}>
        <div className="brand-glyph">M+</div>
        <div className="brand-text-block">
          <span className="brand-name">MEDSOURCE</span>
          <span className="brand-sub">PHARMA · MEDICAL · SOURCING</span>
        </div>
      </a>

      <nav>
        <ul className="nav-links">
          <li><a href="#hero" className="nav-link active" onClick={(e) => handleNavClick(e, 0.0, '#hero')}>Overview</a></li>
          <li><a href="#pharma" className="nav-link" onClick={(e) => handleNavClick(e, 0.20, '#pharma')}>Pharmaceuticals</a></li>
          <li><a href="#devices" className="nav-link" onClick={(e) => handleNavClick(e, 0.40, '#devices')}>Medical Devices</a></li>
          <li><a href="#diagnostic" className="nav-link" onClick={(e) => handleNavClick(e, 0.60, '#diagnostic')}>Diagnostics</a></li>
          <li><a href="#sourcing" className="nav-link" onClick={(e) => handleNavClick(e, 0.80, '#sourcing')}>Sourcing & Supply</a></li>
        </ul>
      </nav>

      <a href="#enquiry" className="nav-cta-btn" onClick={(e) => handleNavClick(e, null, '#enquiry')}>
        Request Quote <ArrowUpRight size={14} />
      </a>
    </header>
  );
}
