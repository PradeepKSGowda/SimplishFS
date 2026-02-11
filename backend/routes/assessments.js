const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');

router.get('/lesson/:lessonId', assessmentController.getAssessmentByLesson);
router.post('/submit', assessmentController.submitAssessment);

module.exports = router;
