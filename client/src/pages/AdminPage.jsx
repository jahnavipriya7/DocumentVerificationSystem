import { useState, useEffect } from "react";
import API from "../api/axios";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUsers,
  FiFile,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const StatusBadge = ({ status }) => {
  const config = {
    pending: { label: "Pending", icon: FiClock, class: "status-pending" },
    verified: { label: "Verified", icon: FiCheckCircle, class: "status-verified" },
    rejected: { label: "Rejected", icon: FiXCircle, class: "status-rejected" },
  };
  const { label, icon: Icon, class: cls } = config[status] || config.pending;
  return (
    <span className={`status-badge ${cls}`}>
      <Icon size={13} />
      {label}
    </span>
  );
};

const ReviewModal = ({ doc, onClose, onUpdate }) => {
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!status) return;
    setLoading(true);
    try {
      await API.put(`/documents/${doc._id}/status`, {
        status,
        rejectionReason: reason,
        adminNote: note,
      });
      onUpdate(doc._id, status, reason, note);
      onClose();
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Review Document</h3>
          <button className="modal-close" onClick={onClose} id="modal-close">
            <FiXCircle />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-doc-info">
            <span className="doc-type-badge"><FiFile />{doc.docType}</span>
            <span className="modal-user">{doc.user?.name} ({doc.user?.email})</span>
          </div>

          {doc.fileUrl && /\.(jpg|jpeg|png)$/i.test(doc.fileUrl) && (
            <img src={doc.fileUrl} alt="Document" className="modal-doc-preview" />
          )}

          <form onSubmit={handleSubmit} className="review-form">
            <div className="status-choice">
              <button
                type="button"
                id="approve-btn"
                className={`choice-btn choice-approve ${status === "verified" ? "active" : ""}`}
                onClick={() => setStatus("verified")}
              >
                <FiCheckCircle size={20} />
                Approve
              </button>
              <button
                type="button"
                id="reject-btn"
                className={`choice-btn choice-reject ${status === "rejected" ? "active" : ""}`}
                onClick={() => setStatus("rejected")}
              >
                <FiXCircle size={20} />
                Reject
              </button>
            </div>

            {status === "rejected" && (
              <div className="form-group">
                <label htmlFor="rejection-reason">Rejection Reason *</label>
                <textarea
                  id="rejection-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why the document is being rejected..."
                  rows={3}
                  required
                />
              </div>
            )}

            {status === "verified" && (
              <div className="form-group">
                <label htmlFor="admin-note">Admin Note (optional)</label>
                <textarea
                  id="admin-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note for the user..."
                  rows={2}
                />
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                id="review-submit"
                disabled={!status || loading}
              >
                {loading ? <span className="spinner" /> : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/documents/all");
      setDocuments(data.documents);
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpdate = (id, status, rejectionReason, adminNote) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d._id === id
          ? { ...d, status, rejectionReason, adminNote, reviewedAt: new Date() }
          : d
      )
    );
    setStats((prev) => {
      const oldDoc = documents.find((d) => d._id === id);
      const updated = { ...prev };
      if (oldDoc) updated[oldDoc.status] = Math.max(0, updated[oldDoc.status] - 1);
      updated[status] = (updated[status] || 0) + 1;
      return updated;
    });
  };

  const filtered = filter === "all" ? documents : documents.filter((d) => d.status === filter);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">Review and manage document submissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon"><FiFile size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Submissions</span>
          </div>
        </div>
        <div className="stat-card stat-yellow">
          <div className="stat-icon"><FiClock size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending Review</span>
          </div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon"><FiCheckCircle size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.verified}</span>
            <span className="stat-label">Verified</span>
          </div>
        </div>
        <div className="stat-card stat-red">
          <div className="stat-icon"><FiXCircle size={24} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats.rejected}</span>
            <span className="stat-label">Rejected</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {["all", "pending", "verified", "rejected"].map((f) => (
          <button
            key={f}
            id={`filter-${f}`}
            className={`filter-tab ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="filter-count">
              {f === "all" ? documents.length : documents.filter((d) => d.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="loading-state">
            <div className="spinner-large" />
            <p>Loading documents...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <FiUsers size={48} className="empty-icon" />
            <h3>No documents found</h3>
            <p>No submissions match the selected filter</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Document Type</th>
                <th>Status</th>
                <th>Uploaded</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc._id} className="table-row">
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-sm">
                        {doc.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{doc.user?.name}</strong>
                        <small>{doc.user?.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="doc-type-badge">
                      <FiFile size={13} />
                      {doc.docType}
                    </span>
                  </td>
                  <td><StatusBadge status={doc.status} /></td>
                  <td className="date-cell">{formatDate(doc.createdAt)}</td>
                  <td>
                    <div className="table-actions">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-view-sm"
                        id={`view-${doc._id}`}
                      >
                        View
                      </a>
                      <button
                        className="btn-review"
                        id={`review-${doc._id}`}
                        onClick={() => setSelectedDoc(doc)}
                      >
                        Review
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedDoc && (
        <ReviewModal
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default AdminPage;
