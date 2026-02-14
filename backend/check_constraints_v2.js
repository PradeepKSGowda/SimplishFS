const { Client } = require('pg');
require('dotenv').config();

async function run() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        const res = await client.query(`
            SELECT column_name, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'users'
        `);
        console.log('User Table Constraints:');
        res.rows.forEach(row => {
            console.log(`${row.column_name}: Nullable=${row.is_nullable}, Default=${row.column_default}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
run();
