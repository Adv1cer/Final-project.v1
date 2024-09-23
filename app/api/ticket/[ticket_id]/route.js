import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  database: 'medcheckv2',
};

export async function GET(request, { params }) {
  const { ticket_id } = params;

  if (!ticket_id) {
    return new Response(JSON.stringify({ error: 'Ticket ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Fetch ticket details along with student name
    const [ticketRows] = await connection.execute(
      `
      SELECT t.ticket_id, t.datetime, s.student_name
      FROM ticket t
      JOIN student s ON t.student_id = s.student_id
      WHERE t.ticket_id = ?
      `,
      [ticket_id]
    );

    if (ticketRows.length === 0) {
      return new Response(JSON.stringify({ error: 'Ticket not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const ticket = ticketRows[0];

    // Fetch symptoms related to the ticket along with symptom names
    const [symptomsRows] = await connection.execute(
      `
      SELECT sr.symptomrecord_id, sr.ticket_id, sy.symptom_name
      FROM symptomrecord sr
      JOIN symptom sy ON sr.symptom_id = sy.symptom_id
      WHERE sr.ticket_id = ?
      `,
      [ticket_id]
    );

    return new Response(JSON.stringify({ ...ticket, symptoms: symptomsRows }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
