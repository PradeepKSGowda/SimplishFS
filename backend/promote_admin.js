const { Client } = require('pg');
require('dotenv').config();

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address: node promote_admin.js user@example.com');
    process.exit(1);
}

async function run() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();

        // 1. Update all users to 'User' if they are 'student' or null (Cleanup)
        await client.query("UPDATE users SET role = 'User' WHERE role IS NULL OR role = 'student'");
        console.log('Cleaned up existing roles to "User".');

        // 2. Promote specific user to 'Admin'
        const res = await client.query(
            "UPDATE users SET role = 'Admin' WHERE email = $1 RETURNING id, full_name, role",
            [email]
        );

        if (res.rows.length === 0) {
            console.log(`User with email ${email} not found.`);
        } else {
            console.log(`Success! User ${res.rows[0].full_name} is now an ${res.rows[0].role}.`);
        }
    } catch (err) {
        console.error('Error promoting user:', err);
    } finally {
        await client.end();
    }
}

run();
