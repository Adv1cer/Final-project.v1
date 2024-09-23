import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  database: 'medcheckv2',
};

export async function GET() {
  let connection;

  try {

    connection = await mysql.createConnection(dbConfig);

    const [tickets] = await connection.query(`
      SELECT * FROM ticket
    `);

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
