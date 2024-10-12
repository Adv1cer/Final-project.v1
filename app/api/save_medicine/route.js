
import mysql from 'mysql2/promise';

export async function POST(request) {
    const { pillName, dose, typeName, expireDate, total, unit, checkboxes } = await request.json();
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });

        await connection.beginTransaction(); 


        const [pillResult] = await connection.execute(
            'INSERT INTO pill (pill_name, dose, type_id) VALUES (?, ?, ?)',
            [pillName, dose, typeName]
        );

        const pillId = pillResult.insertId;


        await connection.execute(
            'INSERT INTO pillstock (pill_id, expire, total, unit_id) VALUES (?, ?, ?, ?)',
            [pillId, expireDate, total, unit]
        );


        await connection.commit(); 
        return new Response(JSON.stringify({ message: 'Data saved successfully' }), { status: 200 });
    } catch (err) {
        console.error('Error saving data:', err);
        if (connection) await connection.rollback(); 
        return new Response('Server error', { status: 500 });
    } finally {
        if (connection && connection.end) {
            await connection.end();
        }
    }
}
