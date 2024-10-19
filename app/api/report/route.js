import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export async function GET() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // Query to get all tickets
    const [tickets] = await connection.query(`
      SELECT * FROM ticket
    `);

    // Get the start of the week (last Sunday)
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); 

    // Query to get statistics of symptom_id for the current week
    const [symptomStats] = await connection.query(`
      SELECT sr.symptom_id, COUNT(*) as count, s.symptom_name
      FROM symptomrecord sr
      JOIN symptom s ON sr.symptom_id = s.symptom_id
      JOIN ticket t ON sr.ticket_id = t.ticket_id
      WHERE t.datetime >= ?
      GROUP BY sr.symptom_id
      ORDER BY count DESC
      LIMIT 3
    `, [startOfWeek]);

    // Query to get statistics of pillstock_id for the current week, including pill names
    const [pillStats] = await connection.query(`
      SELECT ps.pillstock_id, COUNT(pr.pillstock_id) as count, p.pill_name
      FROM pillrecord pr
      JOIN ticket t ON pr.ticket_id = t.ticket_id
      JOIN pillstock ps ON pr.pillstock_id = ps.pillstock_id
      JOIN pill p ON ps.pill_id = p.pill_id
      WHERE t.datetime >= ?
      GROUP BY ps.pillstock_id, p.pill_name
      ORDER BY count DESC
      LIMIT 3
    `, [startOfWeek]);


    return NextResponse.json({
      tickets,
      symptomStats,
      pillStats,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
