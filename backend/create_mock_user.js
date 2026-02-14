const { Client } = require('pg');
require('dotenv').config();

async function run() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        const mockId = 'f0000000-0000-0000-0000-000000000000';

        // Insert mock user if it doesn't exist
        const query = `
            INSERT INTO users (id, full_name, email, password_hash, role)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (id) DO NOTHING
            RETURNING *
        `;
        const values = [mockId, 'Demo User', 'demo@example.com', 'mock_hash', 'student'];
        const res = await client.query(query, values);

        if (res.rows.length > 0) {
            console.log("Mock user created:", res.rows[0]);
        } else {
            console.log("Mock user already exists or could not be created.");
        }
    } catch (err) {
        console.error("Error creating mock user:", err);
    } finally {
        await client.end();
    }
}

run();
