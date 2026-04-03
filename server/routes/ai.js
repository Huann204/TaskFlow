const express = require('express');
const router = express.Router();
const { generateTaskBreakdown, chatWithAI } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateTaskBreakdown);
router.post('/chat', protect, chatWithAI);

module.exports = router;
