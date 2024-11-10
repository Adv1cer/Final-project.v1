import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export async function POST(req) {
  const { pillName, dose, typeName, status } = await req.json();

  let connection;

  try {
    // Initialize the connection
    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    // Fetch the type_id based on typeName from the pill_type table
    const [typeResult] = await connection.query('SELECT type_id FROM pill_type WHERE type_name = ?', [typeName]);
    
    if (typeResult.length === 0) {
      return NextResponse.json({ message: 'Invalid type name' }, { status: 400 });
    }
  
    const typeId = typeResult[0].type_id;

    // Check if the pill already exists
    const [existingPill] = await connection.execute(
      'SELECT pill_id FROM pill WHERE pill_name = ?',
      [pillName]
    );

    let pillId;

    if (existingPill.length > 0) {
      // Pill already exists, use the existing pill_id
      pillId = existingPill[0].pill_id;
    } else {
      // Pill does not exist, insert a new record
      const [pillResult] = await connection.execute(
        'INSERT INTO pill (pill_name, dose, type_id, status) VALUES (?, ?, ?, ?)',
        [pillName, dose, typeId, status]
      );
      pillId = pillResult.insertId;
    }

    await connection.commit();
    return NextResponse.json({ message: 'Data saved successfully' }, { status: 200 });
  } catch (err) {
    await connection.rollback();
    console.error('Error saving data:', err);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}