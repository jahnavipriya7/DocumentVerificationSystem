import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiShield,
  FiUploadCloud,
  FiCheckCircle,
  FiUsers,
  FiArrowRight,
  FiLock,
  FiZap,
  FiEye,
} from "react-icons/fi";

const features = [
  {
    icon: FiUploadCloud,
    title: "Easy Upload",
    desc: "Drag-and-drop any document — Aadhaar, PAN, Passport, Driving License and more.",
  },
  {
    icon: FiZap,
    title: "Fast Review",
    desc: "Admins review submissions instantly and approve or reject with a single click.",
  },
  {
    icon: FiEye,
    title: "Real-time Status",
    desc: "Track your document's verification status live from your personal dashboard.",
  },
  {
    icon: FiLock,
    title: "Secure & Private",
    desc: "JWT-based authentication and role-based access keeps your data safe.",
  },
];

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-glow hero-glow-3" />

        <div className="hero-content">
          <div className="hero-badge">
            <FiShield size={14} />
            Trusted Document Verification
          </div>

          <h1 className="hero-title">
            Verify Documents
            <span className="hero-gradient"> Instantly &amp; Securely</span>
          </h1>

          <p className="hero-desc">
            Submit your identity documents online. Our team reviews and verifies
            them quickly — no paperwork, no queues.
          </p>

          <div className="hero-actions">
            {user ? (
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="btn-primary btn-hero"
                id="hero-go-dashboard"
              >
                Go to Dashboard
                <FiArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary btn-hero"
                  id="hero-get-started"
                >
                  Get Started Free
                  <FiArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="btn-outline btn-hero"
                  id="hero-login"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>Aadhaar</strong>
              <span>Card</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>PAN</strong>
              <span>Card</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>Passport</strong>
              <span>Supported</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>Driving</strong>
              <span>License</span>
            </div>
          </div>
        </div>

        {/* Floating card preview */}
        <div className="hero-visual">
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-dot red" />
              <div className="preview-dot yellow" />
              <div className="preview-dot green" />
              <span>DocVerify Dashboard</span>
            </div>
            <div className="preview-body">
              {[
                { type: "Aadhaar Card", status: "verified" },
                { type: "PAN Card", status: "pending" },
                { type: "Passport", status: "rejected" },
              ].map((item) => (
                <div className="preview-row" key={item.type}>
                  <div className="preview-icon">
                    <FiShield size={14} />
                  </div>
                  <div className="preview-info">
                    <strong>{item.type}</strong>
                  </div>
                  <span className={`status-badge status-${item.status}`}>
                    {item.status === "verified" && <FiCheckCircle size={11} />}
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="features-grid">
          {features.map(({ icon: Icon, title, desc }) => (
            <div className="feature-card" key={title}>
              <div className="feature-icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="cta-section">
          <div className="cta-box">
            <FiUsers size={32} className="cta-icon" />
            <h2>Ready to get verified?</h2>
            <p>Create your free account and upload your documents in minutes.</p>
            <Link to="/register" className="btn-primary btn-hero" id="cta-register">
              Create Account
              <FiArrowRight size={18} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
