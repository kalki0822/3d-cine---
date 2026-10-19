import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, ShieldCheck, CheckCircle2, Send, Cpu, Activity, Box } from 'lucide-react';

export default function Sections() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [category, setCategory] = useState('pharma');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="storyboard-wrapper">
      {/* 5-Stage Pinned Cinematic Showcase Track */}
      <div className="showcase-pin-track">
        {/* Invisible anchor checkpoints for native hash navigation */}
        <div id="hero" className="scroll-anchor" style={{ top: '0%' }} />
        <div id="pharma" className="scroll-anchor" style={{ top: '20%' }} />
        <div id="devices" className="scroll-anchor" style={{ top: '40%' }} />
        <div id="diagnostic" className="scroll-anchor" style={{ top: '60%' }} />
        <div id="sourcing" className="scroll-anchor" style={{ top: '80%' }} />

        <div className="showcase-viewport">
          {/* 1. HERO SECTION: Pharmaceutical Capsule */}
          <div className="story-panel active" id="hero-panel">
            <div className="story-content" id="hero-content">
              <div className="section-tag">
                <span className="tag-dot" />
                Healthcare Products · Connected Supply
              </div>

              <h1 className="hero-title">
                Healthcare Products.<br />
                <span>Connected Supply.</span>
              </h1>

              <p className="hero-desc">
                Pharmaceutical products, medical devices, and sourcing solutions for healthcare businesses. Engineered with institutional precision and seamless commercial connectivity.
              </p>

              <div className="hero-actions">
                <a href="#pharma" className="btn-primary" onClick={(e) => { e.preventDefault(); window.scrollToProgress?.(0.20); }}>
                  Explore Products <ArrowRight size={15} />
                </a>
                <a href="#enquiry" className="btn-secondary">
                  Request a Quote
                </a>
              </div>

              <div className="spec-cards-grid">
                <div className="spec-card">
                  <div className="spec-title">PRIMARY FORMAT</div>
                  <div className="spec-val">Modified-Release Hard Gelatin</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title">COMPONENT INTEGRATION</div>
                  <div className="spec-val">Dual-Lock Interlocking Shell</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title">INTERNAL MATRIX</div>
                  <div className="spec-val">Micro-Pellet Multiparticulate</div>
                </div>
              </div>

              <div className="illustrative-badge">
                <ShieldCheck size={14} /> Illustrative product visualization for commercial supply exploration.
              </div>
            </div>

            <div className="scroll-cue">
              <span>Scroll to explore assembly</span>
              <div className="scroll-line" />
            </div>
          </div>

          {/* 2. PHARMACEUTICAL PRODUCTS: Medicine Bottle & Liquid Elixir Formulation */}
          <div className="story-panel" id="pharma-panel">
            <div className="story-content" id="pharma-content">
              <div className="section-tag">
                <span className="tag-dot" />
                Oral Formulations · Liquid & Solid Dosage
              </div>

              <h2 className="hero-title">
                Pharmaceutical<br />
                <span>Products</span>
              </h2>

              <p className="hero-desc">
                Formulation excellence and high-integrity pharmaceutical containment. Precision-engineered oral solutions, active pharmaceutical ingredients (APIs), and sterile batch filling adhering to global cGMP standards.
              </p>

              <div className="spec-cards-grid">
                <div className="spec-card">
                  <div className="spec-title">FORMULATION PURITY</div>
                  <div className="spec-val">Multi-Dose Oral Elixir Solution</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title">CLOSURE INTEGRITY</div>
                  <div className="spec-val">Tamper-Evident Knurled Cap</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title">STABILITY MATRIX</div>
                  <div className="spec-val">USP Type III Hydrolytic Glass</div>
                </div>
              </div>

              <div className="illustrative-badge">
                <ShieldCheck size={14} /> Illustrative pharmaceutical formulation and fluid containment model for commercial supply.
              </div>
            </div>
          </div>

          {/* 3. MEDICAL DEVICES: Multiparameter Patient Monitor */}
          <div className="story-panel" id="devices-panel">
            <div className="story-content" id="devices-content">
              <div className="section-tag">
                <span className="tag-dot" />
                Critical Care & Telemetry
              </div>

              <h2 className="hero-title">
                Medical<br />
                <span>Devices</span>
              </h2>

              <p className="hero-desc">
                Medical equipment and diagnostic technologies for healthcare environments. Designed for continuous physiological data acquisition, ergonomic clinical mobility, and modular hardware serviceability.
              </p>

              <div className="spec-cards-grid">
                <div className="spec-card">
                  <div className="spec-title">DYNAMIC TELEMETRY</div>
                  <div className="spec-val">Multi-Lead Waveform Processor</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title">ENCLOSURE SPEC</div>
                  <div className="spec-val">Medical-Grade Impact ABS</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title">INTERNAL SHIELDING</div>
                  <div className="spec-val">EMI-Isolated Motherboard Array</div>
                </div>
              </div>

              <div className="illustrative-badge">
                <Activity size={14} /> Screen displays illustrative demonstration telemetry; not for real clinical diagnosis.
              </div>
            </div>
          </div>

          {/* 4. DIAGNOSTIC EQUIPMENT: Ultrasound System */}
          <div className="story-panel" id="diagnostic-panel">
            <div className="story-content" id="diagnostic-content">
              <div className="section-tag">
                <span className="tag-dot" />
                Precision Clinical Imaging
              </div>

              <h2 className="hero-title">
                Diagnostic<br />
                <span>Equipment</span>
              </h2>

              <p className="hero-desc">
                Explore diagnostic imaging equipment and related medical devices. High-resolution acoustic transducer arrays paired with intuitive ergonomic operator consoles for point-of-care accuracy.
              </p>

              <div className="spec-cards-grid">
                <div className="spec-card">
                  <div className="spec-title">TRANSDUCER PROBE</div>
                  <div className="spec-val">Convex Multi-Frequency Array</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title">SIGNAL OPTIMIZATION</div>
                  <div className="spec-val">8-Channel TGC Slide Array</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title">DISPLAY ARCHITECTURE</div>
                  <div className="spec-val">Dual-Axis Articulated Monitor</div>
                </div>
              </div>

              <div className="illustrative-badge">
                <Cpu size={14} /> Illustrative diagnostic simulation. Transducer probe connects via flexible clinical cable.
              </div>
            </div>
          </div>

          {/* 5. PRODUCT SOURCING & SUPPLY: Cold-Chain Shipper */}
          <div className="story-panel" id="sourcing-panel">
            <div className="story-content" id="sourcing-content">
              <div className="section-tag">
                <span className="tag-dot" />
                Cold-Chain Logistics & Sourcing
              </div>

              <h2 className="hero-title">
                Product Sourcing<br />
                <span>& Supply</span>
              </h2>

              <p className="hero-desc">
                Connect with pharmaceutical and medical-device sourcing opportunities. Comprehensive cold-chain shipping solutions featuring advanced vacuum insulation to maintain rigorous payload temperature stability.
              </p>

              <div className="spec-cards-grid">
                <div className="spec-card">
                  <div className="spec-title">THERMAL BARRIER</div>
                  <div className="spec-val">Vacuum Insulated Panels (VIP)</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title">TEMPERATURE CLASS</div>
                  <div className="spec-val">+2.0°C to +8.0°C Constant</div>
                </div>
                <div className="spec-card">
                  <div className="spec-title">CARGO PROTOCOL</div>
                  <div className="spec-val">Tamper-Evident Cryogenic Seal</div>
                </div>
              </div>

              <div className="illustrative-badge">
                <Box size={14} /> Illustrative logistics specification for temperature-sensitive injectable therapeutics.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. COMMERCIAL ENQUIRY & REQUEST A QUOTE */}
      <section className="enquiry-stage" id="enquiry">
        <div className="enquiry-container">
          <div className="story-content center-align">
            <div className="section-tag">
              <span className="tag-dot" />
              Direct Commercial Access
            </div>

            <h2 className="hero-title">
              Request an Institutional<br />
              <span>Product Quotation</span>
            </h2>

            <p className="hero-desc" style={{ margin: '0 auto 36px auto' }}>
              Submit your commercial volume requirements, regulatory jurisdiction, and logistics specifications directly to our global sourcing specialists.
            </p>

            <div className="enquiry-card">
              {formSubmitted ? (
                <div style={{ padding: '30px 10px', textAlign: 'center' }}>
                  <CheckCircle2 size={54} color="#00f0ff" style={{ margin: '0 auto 18px auto' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#ffffff' }}>Quotation Request Received</h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>
                    Thank you for your inquiry. Our healthcare product specialists will review your requirements and provide verified commercial terms within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" type="text" placeholder="Dr. Arthur Vance" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Enterprise / Organization</label>
                      <input className="form-input" type="text" placeholder="Northstar Health Systems" required />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Business Email</label>
                      <input className="form-input" type="email" placeholder="a.vance@northstar.org" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Product Category</label>
                      <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="pharma">Pharmaceutical Formulations & Blisters</option>
                        <option value="devices">Patient Telemetry & Monitoring Systems</option>
                        <option value="diagnostic">Diagnostic Ultrasound & Imaging</option>
                        <option value="sourcing">Cold-Chain Shipper & Global Sourcing</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Supply Requirements & Volume</label>
                    <textarea className="form-textarea" rows="3" placeholder="Specify unit volumes, target delivery timeline, and regulatory compliance standards..." required />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                    Submit Quotation Request <Send size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. LUXURY ENTERPRISE FOOTER */}
      <footer className="cinematic-footer">
        <div className="footer-grid">
          <div>
            <div className="brand-wrapper" style={{ marginBottom: '16px' }}>
              <div className="brand-glyph">M+</div>
              <div className="brand-text-block">
                <span className="brand-name">MEDSOURCE</span>
                <span className="brand-sub">PHARMA · MEDICAL · SOURCING</span>
              </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, maxWidth: '340px' }}>
              International healthcare product discovery, certified medical devices, and verified pharmaceutical sourcing network.
            </p>
          </div>

          <div className="footer-col">
            <h4>Products</h4>
            <ul>
              <li><a href="#pharma">Pharmaceutical Formulations</a></li>
              <li><a href="#pharma">Oral Solid Dose Packaging</a></li>
              <li><a href="#devices">Telemetry Patient Monitors</a></li>
              <li><a href="#diagnostic">Diagnostic Ultrasound</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Sourcing</h4>
            <ul>
              <li><a href="#sourcing">Cold-Chain Infrastructure</a></li>
              <li><a href="#sourcing">Thermal Shipper Systems</a></li>
              <li><a href="#enquiry">Institutional RFQ Portal</a></li>
              <li><a href="#enquiry">Regulatory Dossiers</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Quality & Standards</h4>
            <ul>
              <li><a href="#hero">ISO 13485:2016 Certified</a></li>
              <li><a href="#hero">cGMP & EU GDP Compliant</a></li>
              <li><a href="#hero">CE Mark Specifications</a></li>
              <li><a href="#hero">GAMP5 Computerized Systems</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; 2026 MEDSOURCE Global Supply Network. All rights reserved.</span>
          <span>Visual Concept Demonstration — High-Precision 3D Experience</span>
        </div>
      </footer>
    </div>
  );
}
