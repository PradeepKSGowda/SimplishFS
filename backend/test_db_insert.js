const { Pool } = require('./config/db');
require('dotenv').config();

async function testInsert() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const result = await pool.query(
            'INSERT INTO lessons (title, description, level, media_type, media_url, display_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            ['Trial Lesson', 'Test desc', 'Basic', 'video', '/uploads/test.mp4', 1]
        );
        console.log('SUCCESS:', result.rows[0]);
    } catch (err) {
        console.error('INSERT ERROR:', err.message);
        console.error('FULL ERROR:', err);
    } finally {
        await pool.end();
    }
}

testInsert();
