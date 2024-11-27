import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Storage } from "@google-cloud/storage";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from "path";
import prisma from "../../../../../../../../lib/prisma";

// Initialize Google Cloud Storage client
const storage = new Storage({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, // ระบุพาธของไฟล์ service account
});
const bucketName = 'gipineapple'; // เปลี่ยนเป็นชื่อของ bucket ของคุณ


async function handleFileUpload(file) {
  try {
    if (!file) {
      throw new Error("No file uploaded");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.name.replace(/\.[^/.]+$/, "") + "-" + uniqueSuffix + path.extname(file.name);

    const blob = storage.bucket(bucketName).file(filename);
    const blobStream = blob.createWriteStream();

    // Pipe the buffer to Google Cloud Storage
    blobStream.end(buffer);

    // Return the file's public URL
    await new Promise((resolve, reject) => {
      blobStream.on('finish', resolve);
      blobStream.on('error', reject);
    });

    // Generate the public URL for the uploaded file
    return `https://storage.googleapis.com/${bucketName}/${filename}`;
  } catch (error) {
    console.error("Error in file upload:", error);
    throw error;
  }
}

// Helper function to delete file from Google Cloud Storage
async function deleteFileFromCloudStorage(imageUrl) {
  try {
    const fileName = imageUrl.split('/').pop(); // Extract the file name from the URL
    const file = storage.bucket(bucketName).file(fileName);

    // Delete the file from the bucket
    await file.delete();
    console.log(`File deleted from cloud storage: ${imageUrl}`);
  } catch (error) {
    console.error("Error deleting file from Google Cloud Storage:", error);
    throw error;
  }
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
    where: { userId: parseInt(userId) },
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

    // Handle image deletions from Google Cloud Storage
    if (imagesToDelete.length > 0) {
      const deletePromises = imagesToDelete.map(async (imageUrl) => {
        // Call the function to delete file from Google Cloud Storage
        await deleteFileFromCloudStorage(imageUrl);
      });
      await Promise.all(deletePromises);

      // Delete the image records from the database
      await prisma.productImage.deleteMany({
        where: { imageUrl: { in: imagesToDelete } },
      });
    }

    // Handle new image uploads (to Google Cloud Storage)
    let newImageUrls = [];
    if (newImageFiles.length > 0) {
      const uploadPromises = newImageFiles.map(async (file) => {
        return await handleFileUpload(file); // Assume this function uploads files to Google Cloud Storage
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
