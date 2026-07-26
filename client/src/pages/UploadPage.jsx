import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { FiUploadCloud, FiFile, FiCheckCircle, FiX } from "react-icons/fi";

const DOC_TYPES = [
  "Aadhaar Card",
  "PAN Card",
  "Passport",
  "Driving License",
  "Voter ID",
  "Other",
];

const UploadPage = () => {
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(f.type)) {
      setError("Only JPEG, PNG, or PDF files are allowed");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB");
      return;
    }
    setError("");
    setFile(f);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    handleFile(dropped);
  }, []);

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Please select a file"); return; }
    if (!docType) { setError("Please select a document type"); return; }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("docType", docType);

      await API.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError("");
  };

  if (success) {
    return (
      <div className="page">
        <div className="success-screen">
          <div className="success-icon">
            <FiCheckCircle size={64} />
          </div>
          <h2>Document Uploaded Successfully!</h2>
          <p>Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Upload Document</h1>
          <p className="page-subtitle">Submit a document for verification</p>
        </div>
      </div>

      <div className="upload-container">
        <form onSubmit={handleSubmit} className="upload-form">
          {/* Document Type */}
          <div className="form-group">
            <label htmlFor="doc-type-select">Document Type</label>
            <div className="doc-type-grid">
              {DOC_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  id={`dtype-${type.replace(/\s/g, "-").toLowerCase()}`}
                  className={`doc-type-btn ${docType === type ? "selected" : ""}`}
                  onClick={() => { setDocType(type); setError(""); }}
                >
                  <FiFile size={18} />
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Drop Zone */}
          <div
            className={`drop-zone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => !file && document.getElementById("file-input").click()}
            id="drop-zone"
          >
            <input
              id="file-input"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {file ? (
              <div className="file-selected">
                {preview ? (
                  <img src={preview} alt="Preview" className="file-preview-img" />
                ) : (
                  <div className="pdf-icon">
                    <FiFile size={48} />
                    <span>PDF File</span>
                  </div>
                )}
                <div className="file-info">
                  <strong>{file.name}</strong>
                  <span>{(file.size / 1024).toFixed(1)} KB</span>
                </div>
                <button
                  type="button"
                  className="remove-file"
                  onClick={(e) => { e.stopPropagation(); clearFile(); }}
                  id="remove-file-btn"
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <div className="drop-placeholder">
                <FiUploadCloud size={52} />
                <p>Drag & drop your document here</p>
                <span>or click to browse</span>
                <small>JPEG, PNG, PDF — max 5MB</small>
              </div>
            )}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button
            type="submit"
            className="btn-primary btn-lg"
            id="upload-submit"
            disabled={uploading || !file || !docType}
          >
            {uploading ? (
              <>
                <span className="spinner" />
                Uploading...
              </>
            ) : (
              <>
                <FiUploadCloud size={18} />
                Upload for Verification
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
