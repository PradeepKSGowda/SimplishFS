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
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|mpeg|wav|mp4|png|jpg|jpeg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Only PDF, Audio, Video, and Images (.png, .jpg, .jpeg) are allowed!'));
    }
});

router.post('/upload', upload.single('media'), lessonController.uploadLesson);
router.get('/', lessonController.getAllLessons);
router.put('/:id', upload.single('media'), lessonController.updateLesson);
router.delete('/:id', lessonController.deleteLesson);

module.exports = router;
