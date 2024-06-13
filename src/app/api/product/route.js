// Get the client
import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
// Create the connection to database
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'gipineapple',
});

// A simple SELECT query


export async function GET(request) {
    try {
      // Execute SQL query to fetch products
      const [results, fields] = await connection.query(
        'SELECT * FROM `product` WHERE `ProductName` = "สับปะรด"'
      );
  
      console.log(results); // Log the results to console for testing
  
      // Return the fetched data as JSON response
      return NextResponse.json(results, { status: 200 }); // Return JSON response with status 200
    } catch (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 }); // Return JSON response with status 500
    }
  }
