const express = require("express");
const router = express.Router();
const {
  uploadDocument,
  getMyDocuments,
  getAllDocuments,
  updateDocumentStatus,
  deleteDocument,
} = require("../controllers/documentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../utils/cloudinaryUpload");

// User routes
router.post("/upload", protect, upload.single("file"), uploadDocument);
router.get("/my", protect, getMyDocuments);
router.delete("/:id", protect, deleteDocument);

// Admin routes
router.get("/all", protect, adminOnly, getAllDocuments);
router.put("/:id/status", protect, adminOnly, updateDocumentStatus);

module.exports = router;
