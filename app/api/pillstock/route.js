import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};


export async function GET(req) {
  let connection;
  const { searchParams } = new URL(req.url);
  const pillId = searchParams.get('p');

  try {
    connection = await mysql.createConnection(dbConfig);

    let query = `
      SELECT 
        pillstock.pillstock_id, 
        pill.pill_id, 
        pill.pill_name,
        pill.dose, 
        pill_type.type_name,
        pillstock.expire, 
        pillstock.total, 
        unit.unit_id,
        unit.unit_type
      FROM pillstock
      JOIN pill ON pillstock.pill_id = pill.pill_id
      JOIN unit ON pill.unit_id = unit.unit_id
      JOIN pill_type ON pill.type_id = pill_type.type_id
    `;

    if (pillId) {
      query += ` WHERE pill.pill_id = ? ORDER BY pillstock.pillstock_id ASC`;
    } else {
      query += ` ORDER BY pillstock.pillstock_id ASC`;
    }

    const [pills] = await connection.query(query, [pillId]);

    return NextResponse.json(pills);
  } catch (error) {
    console.error('Error fetching pills:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function POST(req) {
  // Implement POST method if needed
}

export async function PUT(req) {
  // Implement PUT method if needed
}

export async function DELETE(req) {
  // Implement DELETE method if needed
}