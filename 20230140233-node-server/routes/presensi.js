const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");

const presensiController = require('../controllers/presensiController');
const { auth } = require('../middleware/authMiddleware');

// ==========================================
//   MULTER CONFIG (langsung di file ini)
// ==========================================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Hanya file gambar!"), false);
  }
});

// ==========================================
//                 ROUTES
// ==========================================

// CHECK-IN (WAJIB FOTO)
router.post(
  '/check-in',
  auth,
  upload.single("image"),
  presensiController.CheckIn
);

// CHECK-OUT
router.post(
  '/check-out',
  auth,
  presensiController.CheckOut
);

// UPDATE PRESENSI (OPSIONAL FOTO)
router.put(
  '/:id',
  auth,
  upload.single("image"),
  presensiController.updatePresensi
);

// DELETE PRESENSI
router.delete('/:id', auth, presensiController.deletePresensi);

module.exports = router;
