import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  database: 'medcheckv2',
};

export async function GET(request, { params }) {
  const { ticket_id } = params;

  if (!ticket_id) {
    return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const [ticketRows] = await connection.execute(
      `
      SELECT t.ticket_id, t.datetime, t.status, s.student_name
      FROM ticket t
      JOIN student s ON t.student_id = s.student_id
      WHERE t.ticket_id = ?
      `,
      [ticket_id]
    );

    if (ticketRows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    
    const ticket = ticketRows[0];

    const [symptomsRows] = await connection.execute(
      `
      SELECT sr.symptomrecord_id, sr.ticket_id, sy.symptom_name
      FROM symptomrecord sr
      JOIN symptom sy ON sr.symptom_id = sy.symptom_id
      WHERE sr.ticket_id = ?
      `,
      [ticket_id]
    );

    return NextResponse.json({ ...ticket, symptoms: symptomsRows }, { status: 200 });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}