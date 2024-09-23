import mysql from 'mysql2/promise';

export async function POST(request) {
  try {

    const { student_id, student_name, symptom_ids, other_symptom } = await request.json();

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'medcheckv2',
    });


    const checkSql = `
      SELECT COUNT(*) AS count FROM student WHERE student_id = ?
    `;
    const [rows] = await connection.execute(checkSql, [student_id]);
    const { count } = rows[0];


    if (count === 0) {
      const insertStudentSql = `
        INSERT INTO student (student_id, student_name) 
        VALUES (?, ?)
      `;
      await connection.execute(insertStudentSql, [student_id, student_name]);
    }


    const insertTicketSql = `
      INSERT INTO ticket (student_id, other_symptom) 
      VALUES (?, ?)
    `;
    const [ticketResult] = await connection.execute(insertTicketSql, [student_id, other_symptom]);
    const ticket_id = ticketResult.insertId; 


    const insertSymptomSql = `
      INSERT INTO symptomrecord (ticket_id, symptom_id) 
      VALUES (?, ?)
    `;
    for (const symptom_id of symptom_ids) {
      await connection.execute(insertSymptomSql, [ticket_id, symptom_id]);
    }

    await connection.end();


    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Error inserting data:', err);
    return new Response(JSON.stringify({ error: 'Failed to insert data' }), { status: 500 });
  }
}
