import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { ProductID } = params;

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
  });

  try {
    const [results] = await connection.query(
      'SELECT * FROM `product` WHERE ProductID = ?',
      [ProductID]
    );
    await connection.end();

    if (results.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(results[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}