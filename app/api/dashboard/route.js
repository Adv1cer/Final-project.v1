import mysql from 'mysql2/promise';

export async function GET(req) {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'medcheckv2',
        });

        const [rows] = await connection.execute(`
            SELECT
                ticket.ticket_id,
                student.student_id,
                student.student_name AS student_name,
                ticket.datetime,
                ticket.status,  -- Include status
                GROUP_CONCAT(DISTINCT symptomrecord.symptomrecord_id ORDER BY symptomrecord.symptom_id) AS symptomrecord_ids,
                GROUP_CONCAT(DISTINCT symptom.symptom_name ORDER BY symptom.symptom_id) AS symptom_names
            FROM
                ticket
            JOIN
                student ON ticket.student_id = student.student_id
            JOIN
                symptomrecord ON ticket.ticket_id = symptomrecord.ticket_id
            JOIN
                symptom ON symptom.symptom_id = symptomrecord.symptom_id
            GROUP BY
                ticket.ticket_id,
                student.student_id,
                student.student_name,
                ticket.datetime,
                ticket.status  -- Include status in GROUP BY
            ORDER BY
                ticket.ticket_id;
        `);

        await connection.end();

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
