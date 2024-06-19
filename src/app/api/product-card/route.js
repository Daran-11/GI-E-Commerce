// Get the client
import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
// Create the connection to database
const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});



export async function GET(request) {
    try {
      const [results] = await connection.query('SELECT ProductID,ProductName FROM `product`');
  
      return NextResponse.json(results, { status: 200 });
    } catch (error) {
      console.error('Error fetching product names and prices:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }