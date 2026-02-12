const db = require('../config/db');

// LOGIC: Multimedia Handling
// - Why Multer? It's the industry standard for handling 'multipart/form-data'.
// - Metadata Storage: We store the 'mediaUrl' in Postgres as a string, while the file lives on the server.
exports.uploadLesson = async (req, res) => {
    const { title, description, level, mediaType, displayOrder } = req.body;
    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!mediaUrl) {
        return res.status(400).json({ message: 'Media file is required' });
    }

    try {
        const result = await db.query(
            'INSERT INTO lessons (title, description, level, media_type, media_url, display_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, level, mediaType, mediaUrl, displayOrder]
        );

        res.status(201).json({
            message: 'Lesson created successfully',
            lesson: result.rows[0]
        });
    } catch (error) {
        console.error("Lesson Upload Error:", error);
        res.status(500).json({ message: 'Error creating lesson' });
    }
};

exports.getAllLessons = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM lessons ORDER BY display_order ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lessons' });
    }
};
