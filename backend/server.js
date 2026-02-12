const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. LOGIC EXPLANATION: Middleware
// ==========================================
// - CORS: Allows frontend to communicate with backend.
// - Morgan: HTTP request logger for development.
// - express.json: Essential to parse JSON bodies from frontend.
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 2. MULTER CONFIGURATION (Multimedia Uploads)
// ==========================================
// Logic: We store files in a 'uploads' folder and save the metadata (path) in DB.
// In a production app, you'd use S3 or Cloudinary.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
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
        cb(new Error('Only PDF, Audio, Video, and Images are allowed!'));
    }
});

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// ==========================================
// 3. ROUTES
// ==========================================

const authRoutes = require('./routes/auth');
const lessonRoutes = require('./routes/lessons');
const assessmentRoutes = require('./routes/assessments');

app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/assessments', assessmentRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'SIMPLISH LMS API is running' });
});

// Serve static upload files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 4. ERROR HANDLING
// ==========================================
app.use((err, req, res, next) => {
    const errorLog = `[${new Date().toISOString()}] ${err.stack}\n`;
    fs.appendFileSync('error.log', errorLog);
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`SERVER RESTART DETECTED: Code Version ${Date.now()}`);
    console.log(`Server running on port ${PORT}`);
});
