import { FiFile, FiCheckCircle, FiXCircle, FiClock, FiTrash2 } from "react-icons/fi";

const statusConfig = {
  pending: { label: "Pending", icon: FiClock, class: "status-pending" },
  verified: { label: "Verified", icon: FiCheckCircle, class: "status-verified" },
  rejected: { label: "Rejected", icon: FiXCircle, class: "status-rejected" },
};

const DocumentCard = ({ document, onDelete, showUser = false }) => {
  const { label, icon: Icon, class: statusClass } = statusConfig[document.status] || statusConfig.pending;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatSize = (bytes) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const isImage = (url) => /\.(jpg|jpeg|png)$/i.test(url);

  return (
    <div className={`doc-card ${statusClass}`}>
      <div className="doc-card-header">
        <div className="doc-type-badge">
          <FiFile />
          {document.docType}
        </div>
        <div className={`status-badge ${statusClass}`}>
          <Icon size={14} />
          {label}
        </div>
      </div>

      {isImage(document.fileUrl) && (
        <div className="doc-preview">
          <img src={document.fileUrl} alt="Document preview" />
        </div>
      )}

      <div className="doc-meta">
        {showUser && document.user && (
          <div className="doc-meta-row">
            <span className="meta-label">User</span>
            <span className="meta-value">{document.user.name} ({document.user.email})</span>
          </div>
        )}
        <div className="doc-meta-row">
          <span className="meta-label">File</span>
          <span className="meta-value">{document.fileName || "—"}</span>
        </div>
        <div className="doc-meta-row">
          <span className="meta-label">Size</span>
          <span className="meta-value">{formatSize(document.fileSize)}</span>
        </div>
        <div className="doc-meta-row">
          <span className="meta-label">Uploaded</span>
          <span className="meta-value">{formatDate(document.createdAt)}</span>
        </div>
        {document.reviewedAt && (
          <div className="doc-meta-row">
            <span className="meta-label">Reviewed</span>
            <span className="meta-value">{formatDate(document.reviewedAt)}</span>
          </div>
        )}
      </div>

      {document.status === "rejected" && document.rejectionReason && (
        <div className="rejection-reason">
          <FiXCircle size={14} />
          <span>{document.rejectionReason}</span>
        </div>
      )}

      {document.adminNote && document.status === "verified" && (
        <div className="admin-note">
          <FiCheckCircle size={14} />
          <span>{document.adminNote}</span>
        </div>
      )}

      <div className="doc-card-actions">
        <a
          href={document.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-view"
          id={`view-doc-${document._id}`}
        >
          View File
        </a>
        {onDelete && (
          <button
            className="btn-delete"
            onClick={() => onDelete(document._id)}
            id={`delete-doc-${document._id}`}
          >
            <FiTrash2 size={14} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;
