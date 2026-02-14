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

const fs = require('fs');
const path = require('path');

exports.getAllLessons = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM lessons ORDER BY display_order ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lessons' });
    }
};

exports.updateLesson = async (req, res) => {
    const { id } = req.params;
    const { title, description, level, mediaType, displayOrder } = req.body;
    let mediaUrl = req.body.mediaUrl; // Keep old one if no new file

    if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
        // Optional: Delete old file here if you want to be clean
    }

    try {
        const result = await db.query(
            'UPDATE lessons SET title = $1, description = $2, level = $3, media_type = $4, media_url = $5, display_order = $6 WHERE id = $7 RETURNING *',
            [title, description, level, mediaType, mediaUrl, displayOrder, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        res.json({ message: 'Lesson updated successfully', lesson: result.rows[0] });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: 'Error updating lesson' });
    }
};

exports.deleteLesson = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Get lesson to find media path
        const lesson = await db.query('SELECT media_url FROM lessons WHERE id = $1', [id]);

        if (lesson.rows.length === 0) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        const mediaPath = lesson.rows[0].media_url;

        // 2. Delete from DB
        await db.query('DELETE FROM lessons WHERE id = $1', [id]);

        // 3. Delete file from disk (safely)
        if (mediaPath && mediaPath.startsWith('/uploads/')) {
            const fullPath = path.join(__dirname, '..', mediaPath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: 'Error deleting lesson' });
    }
};
