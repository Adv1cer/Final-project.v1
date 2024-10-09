import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  database: 'medcheckv2',
};

export async function POST(req) {
  const { ticket_id, pillRecords } = await req.json();

  if (!ticket_id || !pillRecords || !Array.isArray(pillRecords)) {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    await connection.beginTransaction();

    for (const record of pillRecords) {
      const { pillstock_id, quantity } = record;

      // Insert into pillrecord table
      await connection.execute(
        'INSERT INTO pillrecord (ticket_id, pillstock_id, quantity) VALUES (?, ?, ?)',
        [ticket_id, pillstock_id, quantity]
      );

      // Update the total in pillstock table
      await connection.execute(
        'UPDATE pillstock SET total = total - ? WHERE pillstock_id = ?',
        [quantity, pillstock_id]
      );
    }

    // Update the ticket status
    await connection.execute(
      'UPDATE ticket SET status = 0 WHERE ticket_id = ?',
      [ticket_id]
    );

    await connection.commit();

    return NextResponse.json({ message: 'Pill records submitted successfully' }, { status: 200 });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Database error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}