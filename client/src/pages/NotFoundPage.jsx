import { Link } from "react-router-dom";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

const NotFoundPage = () => (
  <div className="page">
    <div className="not-found">
      <div className="not-found-code">404</div>
      <FiAlertTriangle size={48} className="not-found-icon" />
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary" id="back-home">
        <FiArrowLeft size={16} />
        Back to Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
