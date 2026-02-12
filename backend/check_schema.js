const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function checkSchema() {
    try {
        const res = await pool.query(
            "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'lessons'"
        );
        console.log(JSON.stringify(res.rows, null, 2));
        await pool.end();
    } catch (err) {
        console.error(err);
    }
}

checkSchema();
