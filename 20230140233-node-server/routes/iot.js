const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');
router.get('/history', iotController.getSensorHistory);
// Endpoint penerima data sensor
// URL: http://localhost:3001/api/iot/data
router.post('/data', iotController.receiveSensorData);

module.exports = router;
