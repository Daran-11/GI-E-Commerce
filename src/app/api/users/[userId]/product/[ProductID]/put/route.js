import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { unlink, writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Ensure you import NextResponse
import path from "path";
import prisma from "../../../../../../../../lib/prisma";


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

  export async function PUT(request,{ params }) {

    const session = await getServerSession({ request, ...authOptions });
    const { userId , ProductID } = params;
  
  
    console.log('check Session for updating product:', session); // Debug session
    console.log('User ID:', session?.user?.id); // Debug user ID
  
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
  
    const product = await prisma.product.findFirst({
      where: {
        ProductID: parseInt(ProductID, 10),
        farmer: {
          userId: parseInt(userId),
        },
      },
    });
  
    if (!product) {
      return NextResponse.json({ error: 'Product not found for this user.' }, { status: 404 });
    }
    
    try {

      const formData = await request.formData();
    
      const id = formData.get("ProductID");
      const plotCode = formData.get("plotCode");
      const ProductName = formData.get("ProductName");
      const ProductType = formData.get("ProductType");
      const Price = formData.get("Price");
      const Amount = formData.get("Amount");
      const Description = formData.get("Description");
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


      const updatedProduct = await prisma.product.update({
        where: { 
          ProductID: parseInt(id, 10)
        },
        data: {
          plotCode,
          ProductName,
          ProductType,
          Description,
          Price: parseFloat(Price),
          Amount: parseFloat(Amount),
          status,
          imageUrl,
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


  