// เปลียนข้อมูลที่มีอยู่ก่่อนหน้า
import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { writeFile, unlink } from "fs/promises";
import path from "path";

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

export async function PUT(request) {
  try {
    const formData = await request.formData();
    
    const id = formData.get("ProductID");
    const plotCode = formData.get("plotCode");
    const ProductName = formData.get("ProductName");
    const ProductType = formData.get("ProductType");
    const Price = formData.get("Price");
    const Amount = formData.get("Amount");
    const status = formData.get("status");

    // Extract file (if provided)
    const newImageFile = formData.get("imageUrl");
    let imageUrl = null;

    // Fetch existing product to get the old image URL
    const existingProduct = await prisma.product.findUnique({
      where: { ProductID: parseInt(id, 10) },
    });

    // Handle file upload if the image file is provided
    if (newImageFile && newImageFile.size > 0) {
      // Delete old image if it exists
      if (existingProduct && existingProduct.imageUrl) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          "uploads",
          path.basename(existingProduct.imageUrl)
        );
        await deleteFile(oldImagePath);
      }

      // Upload new image and get the URL
      imageUrl = await handleFileUpload(newImageFile);
    } else {
      // Use existing image URL if no new image is uploaded
      imageUrl = existingProduct?.imageUrl || null;
    }

    // Update the product in the database
    const updatedProduct = await prisma.product.update({
      where: { ProductID: parseInt(id, 10) },
      data: {
        plotCode,
        ProductName,
        ProductType,
        Price: parseFloat(Price),
        Amount: parseFloat(Amount),
        status,
        imageUrl, // Update the image URL if changed
      },
    });

    console.log("updated:", updatedProduct);

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}
