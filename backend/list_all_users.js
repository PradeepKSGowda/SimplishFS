const { Client } = require('pg');
require('dotenv').config();

async function run() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        const res = await client.query('SELECT * FROM users LIMIT 10');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

run();
