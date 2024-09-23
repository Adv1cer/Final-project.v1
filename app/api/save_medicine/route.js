// app/api/save_medicine/route.js

import mysql from 'mysql2/promise';

export async function POST(request) {
    const { pillName, dose, typeName, expireDate, total, unit, checkboxes } = await request.json();
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '',
            database: process.env.MYSQL_DATABASE || 'medcheckv2',
        });

        await connection.beginTransaction(); // Start a transaction

        // Insert into pill table
        const [pillResult] = await connection.execute(
            'INSERT INTO pill (pill_name, dose, type_id) VALUES (?, ?, ?)',
            [pillName, dose, typeName]
        );

        const pillId = pillResult.insertId; // Get the inserted pill ID

        // Insert into pillstock table
        await connection.execute(
            'INSERT INTO pillstock (pill_id, expire, total, unit_id) VALUES (?, ?, ?, ?)',
            [pillId, expireDate, total, unit]
        );

        for (const [key, value] of Object.entries(checkboxes)) {
            if (value) {
                await connection.execute(
                    'INSERT INTO filter_pill (pill_id, symtomp_id) VALUES (?, ?)',
                    [pillId, key]
                );
            }
        }

        await connection.commit(); // Commit the transaction
        return new Response(JSON.stringify({ message: 'Data saved successfully' }), { status: 200 });
    } catch (err) {
        console.error('Error saving data:', err);
        if (connection) await connection.rollback(); // Rollback on error
        return new Response('Server error', { status: 500 });
    } finally {
        if (connection && connection.end) {
            await connection.end();
        }
    }
}
