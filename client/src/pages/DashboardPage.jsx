import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DocumentCard from "../components/DocumentCard";
import API from "../api/axios";
import {
  FiUpload,
  FiFile,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className={`stat-card ${colorClass}`}>
    <div className="stat-icon">
      <Icon size={24} />
    </div>
    <div className="stat-info">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/documents/my");
      setDocuments(data);
    } catch (err) {
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await API.delete(`/documents/${id}`);
      setDocuments((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert("Failed to delete document");
    }
  };

  const stats = {
    total: documents.length,
    pending: documents.filter((d) => d.status === "pending").length,
    verified: documents.filter((d) => d.status === "verified").length,
    rejected: documents.filter((d) => d.status === "rejected").length,
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name} 👋</p>
        </div>
        <Link to="/upload" className="btn-primary" id="goto-upload">
          <FiUpload size={16} />
          Upload Document
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon={FiFile} label="Total Submitted" value={stats.total} colorClass="stat-blue" />
        <StatCard icon={FiClock} label="Pending Review" value={stats.pending} colorClass="stat-yellow" />
        <StatCard icon={FiCheckCircle} label="Verified" value={stats.verified} colorClass="stat-green" />
        <StatCard icon={FiXCircle} label="Rejected" value={stats.rejected} colorClass="stat-red" />
      </div>

      {/* Documents */}
      <div className="section">
        <h2 className="section-title">My Documents</h2>

        {loading ? (
          <div className="loading-state">
            <div className="spinner-large" />
            <p>Loading your documents...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : documents.length === 0 ? (
          <div className="empty-state">
            <FiFile size={56} className="empty-icon" />
            <h3>No documents yet</h3>
            <p>Upload your first document to get it verified</p>
            <Link to="/upload" className="btn-primary" id="empty-upload-btn">
              <FiUpload size={16} />
              Upload Document
            </Link>
          </div>
        ) : (
          <div className="docs-grid">
            {documents.map((doc) => (
              <DocumentCard
                key={doc._id}
                document={doc}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
