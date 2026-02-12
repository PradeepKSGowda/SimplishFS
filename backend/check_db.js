const { Pool } = require('pg'); // Use pg directly to isolate from config issues
const fs = require('fs');
require('dotenv').config();

async function checkDb() {
    console.log('Using DATABASE_URL:', process.env.DATABASE_URL);
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        const client = await pool.connect();
        console.log('Connection successful!');

        const tables = await client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
        const tableNames = tables.rows.map(r => r.tablename);
        console.log('Tables found:', tableNames);
        fs.writeFileSync('db_success.txt', `Tables: ${tableNames.join(', ')}`);

        client.release();
    } catch (err) {
        console.error('Database connection error:', err.message);
        fs.writeFileSync('db_conn_error.txt', `Error: ${err.message}\nStack: ${err.stack}`);
    } finally {
        await pool.end();
    }
}

checkDb();
