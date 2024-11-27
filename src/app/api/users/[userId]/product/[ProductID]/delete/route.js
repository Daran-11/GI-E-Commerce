import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Storage } from '@google-cloud/storage'; // Import the Google Cloud Storage library
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Ensure you import NextResponse
import prisma from "../../../../../../../../lib/prisma";

// สร้าง client ของ Google Cloud Storage
const storage = new Storage({
  keyFilename:  process.env.GOOGLE_APPLICATION_CREDENTIALS, // ระบุพาธของไฟล์ service account
});
const bucketName = 'gipineapple'; // ระบุชื่อของ Google Cloud Storage Bucket

export async function DELETE(request, { params }) {
  const session = await getServerSession({ request, ...authOptions });

  const { userId, ProductID } = params;
  console.log("Product ID on delete:", ProductID);

  console.log('Session for Delete Product:', session); // Debug session
  console.log('User ID:', session?.user?.id); // Debug user ID

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.id !== parseInt(userId) && session.user.role !== "farmer") {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const product = await prisma.product.findFirst({
    where: {
      ProductID: parseInt(ProductID, 10),
      farmer: {
        userId: parseInt(userId),
      },
    },
    include: {
      images: true, // Include related images
    },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found for this user.' }, { status: 404 });
  }

  try {
    if (!ProductID) {
      return NextResponse.json({ error: "No id provided" }, { status: 400 });
    }

    // ลบไฟล์จาก Google Cloud Storage
    for (const image of product.images) {
      const fileName = image.imageUrl.split('/').pop(); // Extract file name from the image URL
      console.log(`Attempting to delete file: ${fileName}`); // Log the file name

      // ลบไฟล์จาก Google Cloud Storage
      try {
        await storage.bucket(bucketName).file(fileName).delete();
        console.log(`Deleted file from Cloud Storage: ${fileName}`);
      } catch (err) {
        console.error(`Error deleting file from Cloud Storage: ${fileName}`, err);
      }
    }

    // Perform soft delete by updating the isDeleted field in the database, while retaining image paths
    await prisma.product.update({
      where: { 
        ProductID: parseInt(ProductID, 10),
      },
      data: {
        isDeleted: true,
      },
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
