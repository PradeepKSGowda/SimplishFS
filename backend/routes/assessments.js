const express = require('express');
const router = express.Router();
const multer = require('multer');
const assessmentController = require('../controllers/assessmentController');

// Multer setup (same as server.js but local)
const upload = multer({ dest: 'uploads/' });

router.get('/lesson/:lessonId', assessmentController.getAssessmentByLesson);
router.post('/submit', upload.any(), assessmentController.submitAssessment);
router.post('/process-media', upload.single('media'), assessmentController.processMedia);

module.exports = router;
