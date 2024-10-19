import mysql from "mysql2/promise";

export async function GET(req) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    const [updateResult] = await connection.execute(`
      UPDATE ticket
      SET status = 0
      WHERE status = 1
        AND DATE(datetime) < CURDATE();
    `);
    console.log(
      `Updated ${updateResult.affectedRows} tickets to inactive if ticket is left from previous day.`
    );

    // Fetch the updated tickets along with pill information
    const [rows] = await connection.execute(`
SELECT
    ticket.ticket_id,
    student.student_id,
    student.student_name AS student_name,
    ticket.datetime,
    ticket.status,
    ticket.other_symptom,

    -- Fetch symptom records as a subquery to prevent duplication
    (SELECT GROUP_CONCAT(symptom.symptom_name ORDER BY symptom.symptom_id)
     FROM symptomrecord
     LEFT JOIN symptom ON symptom.symptom_id = symptomrecord.symptom_id
     WHERE symptomrecord.ticket_id = ticket.ticket_id) AS symptom_names,

    -- Fetch pill records as a subquery to prevent duplication
    (SELECT GROUP_CONCAT(pillrecord.pillstock_id ORDER BY pillrecord.pillrecord_id)
     FROM pillrecord
     WHERE pillrecord.ticket_id = ticket.ticket_id) AS pillstock_ids,
    
    (SELECT GROUP_CONCAT(pill.pill_name ORDER BY pillrecord.pillrecord_id)
     FROM pillrecord
     LEFT JOIN pillstock ON pillrecord.pillstock_id = pillstock.pillstock_id
     LEFT JOIN pill ON pillstock.pill_id = pill.pill_id
     WHERE pillrecord.ticket_id = ticket.ticket_id) AS pill_names,

    (SELECT GROUP_CONCAT(pillrecord.quantity ORDER BY pillrecord.pillrecord_id)
     FROM pillrecord
     WHERE pillrecord.ticket_id = ticket.ticket_id) AS pill_quantities

FROM
    ticket
JOIN
    student ON ticket.student_id = student.student_id
-- Other joins for necessary info, but we fetch symptom/pill info through subqueries
ORDER BY
    ticket.datetime DESC;
    `);

    await connection.end();

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching data:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
