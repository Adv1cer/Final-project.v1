// pages/api/dashboard.js

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

    // Fetch the updated tickets
    const [rows] = await connection.execute(`
    SELECT
        ticket.ticket_id,
        student.student_id,
        student.student_name AS student_name,
        ticket.datetime,
        ticket.status,
        ticket.other_symptom,
        GROUP_CONCAT(DISTINCT symptomrecord.symptomrecord_id ORDER BY symptomrecord.symptom_id) AS symptomrecord_ids,
        GROUP_CONCAT(DISTINCT symptom.symptom_name ORDER BY symptom.symptom_id) AS symptom_names,
        GROUP_CONCAT(DISTINCT pillrecord.pillrecord_id ORDER BY pillrecord.pillrecord_id) AS pillrecord_ids,
        GROUP_CONCAT(DISTINCT pillrecord.pillstock_id ORDER BY pillrecord.pillrecord_id) AS pillstock_ids,
        GROUP_CONCAT(DISTINCT pillrecord.quantity ORDER BY pillrecord.pillrecord_id) AS pill_quantities,
        GROUP_CONCAT(DISTINCT pill.pill_name ORDER BY pillrecord.pillrecord_id) AS pill_names
    FROM
        ticket
    JOIN
        student ON ticket.student_id = student.student_id
    LEFT JOIN
        symptomrecord ON ticket.ticket_id = symptomrecord.ticket_id
    LEFT JOIN
        symptom ON symptom.symptom_id = symptomrecord.symptom_id
    LEFT JOIN
        pillrecord ON ticket.ticket_id = pillrecord.ticket_id
    LEFT JOIN
        pillstock ON pillrecord.pillstock_id = pillstock.pillstock_id
    LEFT JOIN
        pill ON pillstock.pill_id = pill.pill_id
    GROUP BY
        ticket.ticket_id,
        student.student_id,
        student.student_name,
        ticket.datetime,
        ticket.status,
        ticket.other_symptom
    ORDER BY
        ticket.datetime DESC
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
