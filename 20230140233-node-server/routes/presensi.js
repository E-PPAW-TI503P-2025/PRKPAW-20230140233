const express = require('express');
const router = express.Router();

const presensiController = require('../controllers/presensiController');
const { auth } = require('../middleware/authMiddleware'); // gunakan JWT

// ROUTES PRESENSI
router.post('/check-in', auth, presensiController.CheckIn);
router.post('/check-out', auth, presensiController.CheckOut);

router.put('/:id', auth, presensiController.updatePresensi);
router.delete('/:id', auth, presensiController.deletePresensi);

module.exports = router;
