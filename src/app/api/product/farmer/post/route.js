// /api/product/post.js
import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

// Config to disable body parsing since we handle it manually
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to handle file uploads
async function handleFileUpload(file) {
  try {
    if (!file) {
      throw new Error("No file uploaded");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.name.replace(/\.[^/.]+$/, "") +
      "-" +
      uniqueSuffix +
      path.extname(file.name);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadDir, filename);

    // Write file to the filesystem
    await writeFile(filepath, buffer);

    // Return the file's public URL
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Error in file upload:", error);
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
    console.error("Failed to add product:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 },
    );
  }
}
