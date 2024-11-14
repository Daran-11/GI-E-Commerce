//completed
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { unlink, writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from "path";
import prisma from "../../../../../../../../lib/prisma";


// Helper function to handle file uploads
async function handleFileUpload(file) {
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
}

// Function to delete a file from the filesystem
async function deleteFile(filePath) {
  await unlink(filePath);
}

export async function PUT(request, { params }) {
  const session = await getServerSession({ request, ...authOptions });
  const { userId, ProductID } = params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.id !== parseInt(userId) && session.user.role !== "farmer") {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Fetch the farmer data using the userId
  const farmer = await prisma.farmer.findUnique({
    where: { userId: parseInt(userId) }
  });

  if (!farmer) {
    return NextResponse.json({ error: 'Farmer profile not found for this user.' }, { status: 404 });
  }

  const existingProduct = await prisma.product.findUnique({
    where: {
      ProductID: parseInt(ProductID, 10),
      farmer: { userId: parseInt(userId) },
    },
    include: { images: true },
  });

  if (!existingProduct) {
    return NextResponse.json({ error: 'Product not found for this user.' }, { status: 404 });
  }

  try {
    const formData = await request.formData();  
    const id = formData.get("ProductID");
    const ProductName = formData.get("ProductName");
    const ProductType = formData.get("ProductType");
    const Price = formData.get("Price");
    const Cost = formData.get("Cost");
    const Amount = formData.get("Amount");
    const status = formData.get("status");
    const Description = formData.get("Description");
    const newImageFiles = formData.getAll("images");
    const imagesToDelete = formData.getAll("imagesToDelete");
    const Details = formData.get("Details");

    // Handle image deletions
    if (imagesToDelete.length > 0) {
      const deletePromises = imagesToDelete.map(async (imageUrl) => {
        const filePath = path.join(process.cwd(), "public", "uploads", path.basename(imageUrl));
        await deleteFile(filePath);
      });
      await Promise.all(deletePromises);

      await prisma.productImage.deleteMany({
        where: { imageUrl: { in: imagesToDelete } },
      });
    }

    // Handle new image uploads
    let newImageUrls = [];
    if (newImageFiles.length > 0) {
      const uploadPromises = newImageFiles.map(async (file) => {
        return await handleFileUpload(file);
      });
      newImageUrls = await Promise.all(uploadPromises);
    }

    // Combine existing images with new ones, avoiding duplicates
    const existingImageUrls = existingProduct.images.map(image => image.imageUrl);
    const allImageUrls = [...new Set([...existingImageUrls, ...newImageUrls])];

    // Update the product in the database
    const updatedProduct = await prisma.product.update({
      where: { ProductID: parseInt(id, 10) },
      data: {
        ProductName,
        ProductType,
        Description,
        Price: parseFloat(Price),
        Cost: parseFloat(Cost),
        Amount: parseFloat(Amount),
        Details,
        status,
      },
    });

    // Handle new images for productImage model
    if (newImageUrls.length > 0) {
      await prisma.productImage.createMany({
        data: newImageUrls.map(url => ({
          imageUrl: url,
          productId: parseInt(id, 10),
        })),
      });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
