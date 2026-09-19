# 🛡️ DocVerify — Automated Document Verification System

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=mongodb)](https://github.com/jahnavipriya7/DocumentVerificationSystem)
[![Hackathon](https://img.shields.io/badge/Hackathon-Hack%20Devengers%202.0-violet?style=for-the-badge)](https://unstop.com/hackathons/hack-devengers-20-devengers-1749441)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)](https://github.com/jahnavipriya7/DocumentVerificationSystem)

> **Submission for Hack Devengers 2.0 Hackathon (Unstop)**  
> **Author:** Pala Jahnavi Priya ([@jahnavipriya7](https://github.com/jahnavipriya7))  
> **Repository:** [https://github.com/jahnavipriya7/DocumentVerificationSystem](https://github.com/jahnavipriya7/DocumentVerificationSystem)

---

## 📌 Executive Summary

**DocVerify** is a full-stack **MERN (MongoDB, Express.js, React, Node.js)** document verification application designed to streamline identity document verification for individuals and organizations. It provides a secure, modern, dark glassmorphism web interface where users can upload official documents (Aadhaar, PAN, Passport, Driving License, Voter ID), track review status in real-time, and admins can review, verify, or reject submissions with feedback notes.

---

## ✨ Key Features

### 👤 User Portal
- **🔐 Secure Authentication:** JWT-based signup and login with hashed passwords (`bcryptjs`).
- **📤 Smart Document Upload:** Drag-and-drop document uploader with file type validation (JPEG, PNG, PDF) and real-time client-side preview.
- **📄 Supported Document Types:** Aadhaar Card, PAN Card, Passport, Driving License, Voter ID, and Custom Documents.
- **📊 Interactive Dashboard:** Overview of all submitted documents with status badges (`Pending`, `Verified`, `Rejected`).
- **🗑️ Document Management:** Capability to delete or re-upload rejected document entries.

### 🛡️ Admin Verification Portal
- **📈 Global Analytics Dashboard:** Real-time metrics showing Total Submissions, Pending Reviews, Verified Documents, and Rejected Documents.
- **🔍 Filter & Search:** Categorized document table view with filter tabs for fast processing.
- **⚡ Instant Action Modal:** One-click Approve / Reject modal with custom rejection feedback notes and administrative notes.
- **🔒 Role-Based Access Control (RBAC):** Admin endpoints and routes protected by strict server-side authorization middleware.

---

## 🏗️ System Architecture & Workflow

```
[ User / Admin Client (React + Vite) ]
                │
                │ HTTP / REST API (JWT Bearer Token)
                ▼
[ Express.js Server (Port 5000) ]
       ├── CORS & JSON Middleware
       ├── Auth Routes (/api/auth)
       └── Document Routes (/api/documents)
                │
         ┌──────┴─────────────────────────┐
         ▼                                ▼
[ MongoDB Atlas Database ]        [ Multer File Storage ]
  • User Schemas                    • Local / Cloudinary Storage
  • Document Schemas                • Uploads Directory (/uploads)
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios, React Icons, Custom Glassmorphism CSS3 |
| **Backend** | Node.js, Express.js, Multer (Multipart File Upload), CORS, Dotenv |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Security** | JSON Web Tokens (JWT), BcryptJS Password Hashing, Role Middleware |

---

## 📡 API Reference

### 🔐 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new User or Admin account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT Token |
| `GET`  | `/api/auth/me` | Private | Get authenticated user profile |

### 📑 Document Endpoints (`/api/documents`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/documents/upload` | User | Upload a document (FormData with `file` & `docType`) |
| `GET`  | `/api/documents/my` | User | Fetch all documents owned by current user |
| `DELETE` | `/api/documents/:id` | Owner / Admin | Delete document by ID |
| `GET`  | `/api/documents/all` | Admin | Fetch all system documents & stats summary |
| `PUT`  | `/api/documents/:id/status` | Admin | Update document status (`verified`/`rejected`) & note |

---

## 💻 Local Setup & Installation

### Prerequisites
- Node.js (v18.x or higher)
- npm or yarn
- MongoDB Atlas Connection URI or Local MongoDB instance

### 1. Clone the Repository
```bash
git clone https://github.com/jahnavipriya7/DocumentVerificationSystem.git
cd DocumentVerificationSystem
```

### 2. Configure Backend Server
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://jahnavipriyapala_db_user:Gvpce12345@documentverificationdb.g5b3d3n.mongodb.net/documentVerification?retryWrites=true&w=majority
JWT_SECRET=mySuperSecretKey123
```

Start the backend development server:
```bash
npm run dev
```
*(Server will start on `http://localhost:5000`)*

### 3. Configure Frontend Client
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
*(Client will start on `http://localhost:5173` or `http://localhost:5174`)*

---

## 🎨 User Interface Highlights

- **Modern Glassmorphism Design:** Dark theme with subtle backdrop blur, neon accents, and smooth CSS keyframe animations.
- **Responsive Layout:** Optimized for desktop, tablet, and mobile browsers.
- **Drag & Drop Upload:** Dynamic file preview with automatic format validation.
- **Admin Review Modal:** Instant status toggle with contextual reason inputs.

---

## 🏆 Hackathon Submission Details

- **Event:** Hack Devengers 2.0 (Unstop)
- **Track:** Open Innovation / Web Development
- **Repository:** [jahnavipriya7/DocumentVerificationSystem](https://github.com/jahnavipriya7/DocumentVerificationSystem)
- **Developer:** Pala Jahnavi Priya (jahnavipriyapala@gmail.com)

---

<p align="center">
  Made with ❤️ by <b>Pala Jahnavi Priya</b> for <b>Hack Devengers 2.0</b>
</p>
