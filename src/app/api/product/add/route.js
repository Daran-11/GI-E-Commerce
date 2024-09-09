import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

// Config to disable body parsing since we handle it manually
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function for file uploads
async function handleFileUpload(file) {
  try {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.name.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + path.extname(file.name);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);

    // Write file to the filesystem
    await writeFile(filepath, buffer);

    // Return the file's public URL
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error in file upload:', error);
    throw error;
  }
}

// POST: Create a new product with file upload
export async function POST(request) {
  try {
    // Parse form data
    const formData = await request.formData();

    // Extract fields from formData
    const plotCode = formData.get("plotCode");
    const ProductName = formData.get("ProductName");
    const ProductType = formData.get("ProductType");
    const Price = formData.get("Price");
    const Amount = formData.get("Amount");
    const status = formData.get("status");
    
    // Extract file (if provided)
    const imageFile = formData.get("imageUrl");
    let imageUrl = null;

    // Handle file upload if the image file is provided
    if (imageFile && imageFile.size > 0) {
      imageUrl = await handleFileUpload(imageFile);
    }

    // Create the new product in the database
    const product = await prisma.product.create({
      data: {
        plotCode,
        ProductName,
        ProductType,
        Price: parseFloat(Price),
        Amount: parseInt(Amount, 10),
        status,
        imageUrl: imageUrl, // Store the uploaded image URL
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to add product:', error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("ProductID");

  if (id) {
    try {
      
      const product = await prisma.product.findUnique({
        where: { ProductID: parseInt(id, 10) },
        // No need to include 'farmer' here as it's not in the Product model
        
      });
      console.log("Get product Id:",id)
      if (product) {
        return NextResponse.json(product);
      } else {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      return NextResponse.json(
        { error: "Error fetching product" },
        { status: 500 }
      );
    }
  } else {
    // Fetching all products
    try {
      const products = await prisma.product.findMany();
      return NextResponse.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { error: "Error fetching products" },
        { status: 500 }
      );
    }
  }
}



export async function PUT(request) {
  try {

    const data = await request.json();
    const updatedProduct = await prisma.product.update({
      where: { ProductID: parseInt(data.id, 10) },
      data: {
        plotCode: data.plotCode,
        ProductName: data.ProductName,
        ProductType: data.ProductType,
        Price: parseFloat(data.Price),
        Amount: parseFloat(data.Amount),
        status: data.status,
      },
    });
    console.log("updated:",updatedProduct)
    
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// Function to delete a file from the filesystem
async function deleteFile(filePath) {
  try {
    await unlink(filePath);
    console.log(`Successfully deleted file: ${filePath}`);
  } catch (error) {
    console.error(`Failed to delete file: ${filePath}`, error);
    throw error;
  }
}

// DELETE: Delete a product and its associated image
export async function DELETE(request) {
  try {
    const { searchParams, href } = new URL(request.url);

    console.log("Request URL:", href); // Log the entire URL
    const id = searchParams.get("ProductID");

    if (!id) {
      console.warn("No 'id' provided in the URL query string:", href);
      return NextResponse.json({ error: "No id provided" }, { status: 400 });
    }

    // Fetch the product to get the image URL
    const product = await prisma.product.findUnique({
      where: { ProductID: parseInt(id, 10) },
    });

    if (!product) {
      console.warn("Product not found:", id);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete the image file if it exists
    if (product.imageUrl) {
      const imagePath = path.join(process.cwd(), 'public', 'uploads', path.basename(product.imageUrl));
      await deleteFile(imagePath);
    }

    // Delete the product
    await prisma.product.delete({
      where: { ProductID: parseInt(id, 10) },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}