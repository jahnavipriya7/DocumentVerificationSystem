const Document = require("../models/Document");
const path = require("path");

// @desc    Upload a document
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { docType } = req.body;
    if (!docType) {
      return res.status(400).json({ message: "Document type is required" });
    }

    // Build file URL for local storage
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const document = await Document.create({
      user: req.user._id,
      docType,
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's documents
// @route   GET /api/documents/my
// @access  Private
const getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all documents (admin)
// @route   GET /api/documents/all
// @access  Admin
const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const stats = {
      total: documents.length,
      pending: documents.filter((d) => d.status === "pending").length,
      verified: documents.filter((d) => d.status === "verified").length,
      rejected: documents.filter((d) => d.status === "rejected").length,
    };

    res.json({ documents, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update document status (admin)
// @route   PUT /api/documents/:id/status
// @access  Admin
const updateDocumentStatus = async (req, res) => {
  try {
    const { status, rejectionReason, adminNote } = req.body;

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.status = status;
    document.rejectionReason = rejectionReason || "";
    document.adminNote = adminNote || "";
    document.reviewedAt = new Date();

    await document.save();

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Only owner or admin can delete
    if (
      document.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete this document" });
    }

    await document.deleteOne();
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadDocument,
  getMyDocuments,
  getAllDocuments,
  updateDocumentStatus,
  deleteDocument,
};
