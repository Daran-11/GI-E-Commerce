import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Ensure you import NextResponse
import prisma from "../../../../../../../../lib/prisma";
import fs from 'fs'; // Import the file system module
import path from 'path';

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

    // Delete images from the local uploads folder, but retain the paths in the database
    product.images.forEach(image => {
      const filePath = path.join(process.cwd(), 'public', image.imageUrl); // Assuming 'uploads' is your directory
      console.log(`Attempting to delete file: ${filePath}`); // Log the file path

      // Check if the file exists before attempting to delete it
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file: ${filePath}`, err);
          } else {
            console.log(`Deleted file: ${filePath}`);
          }
        });
      } else {
        console.log(`File not found: ${filePath}`);
      }
    });

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
