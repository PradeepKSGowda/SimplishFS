const express = require('express');
const router = express.Router();
const multer = require('multer');
const assessmentController = require('../controllers/assessmentController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = require('path').extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage });

router.get('/lesson/:lessonId', assessmentController.getAssessmentByLesson);
router.post('/lesson/:lessonId/questions', assessmentController.upsertAssessment);
router.post('/submit', upload.any(), assessmentController.submitAssessment);
router.post('/process-media', upload.single('media'), assessmentController.processMedia);

module.exports = router;
