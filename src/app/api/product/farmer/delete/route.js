// /api/product/delete.js
import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

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
      const imagePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        path.basename(product.imageUrl),
      );
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
      { status: 500 },
    );
  }
}
