const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const multer = require('multer');
const path = require('path');

// Multer Config (Repeated here for clarity/modularity, or can be moved to a middleware file)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.post('/upload', upload.single('media'), lessonController.uploadLesson);
router.get('/', lessonController.getAllLessons);

module.exports = router;
