import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export async function PUT(req, { params }) {
  const { pill_id } = params;
  const { pillName, dose, typeName, status } = await req.json();

  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    let query, queryParams;

    if (status === 0 || status === 1) {
      query = `
        UPDATE pill
        SET status = ?
        WHERE pill_id = ?
      `;
      queryParams = [status, pill_id];
    } else {
      // Update all columns except status
      query = `
        UPDATE pill
        SET pill_name = ?, dose = ?, type_id = (SELECT type_id FROM pill_type WHERE type_name = ?)
        WHERE pill_id = ?
      `;
      queryParams = [pillName, dose, typeName, pill_id];
    }

    const [result] = await connection.query(query, queryParams);

    if (result.affectedRows === 0) {
      console.log(`Pill with id ${pill_id} not found`);
      return NextResponse.json({ message: 'Pill not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Pill updated successfully' });
  } catch (error) {
    console.error('Error updating pill:', error);
    return NextResponse.json({ message: 'Error updating pill' }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
