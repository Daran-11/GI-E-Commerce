import mysql from 'mysql2/promise';

async function connectToDatabase() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
  });
}

export async function generateStaticParams() {
  const connection = await connectToDatabase();
  const [products] = await connection.query('SELECT ProductID FROM `product`');
  await connection.end();

  return products.map((product) => ({
    ProductID: product.ProductID.toString(),
  }));
}

export default async function ProductDetails({ params }) {
  const { ProductID } = params;

  const connection = await connectToDatabase();
  const [results] = await connection.query(
    'SELECT * FROM `product` WHERE ProductID = ?',
    [ProductID]
  );
  await connection.end();

  const product = results[0];

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    
    <main>
      <div className="top-container">
              <h1>Product ID: {product.ProductID}</h1>
      <p>Product Name: {product.ProductName}</p>
      <p>Price: ${product.Price}</p>
      {/* Other product details */}
      </div>

    </main>
  );
}