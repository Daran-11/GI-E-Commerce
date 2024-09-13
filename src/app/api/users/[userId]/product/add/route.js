import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"; // Ensure you import NextResponse
import path from "path";
import prisma from "../../../../../../../lib/prisma";



// Config to disable body parsing since we handle it manually this shit will disabled for the whole file bruh
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

export async function POST(request,{ params }) {

  const session = await getServerSession({ request, ...authOptions });
  const { userId } = params;


  console.log('checking Session for adding product:', session); // Debug session
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
    console.log("Farmer data not found in Farmer table")
    return NextResponse.json({ error: 'Farmer profile not found for this user.' }, { status: 404 });
    
  }

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

    const product = await prisma.product.create({
      data: {
        plotCode,
        ProductName,
        ProductType,
        Price: parseFloat(Price), // Convert to Float
        Amount: parseInt(Amount, 10), // Convert to Int
        status,
        farmerId: farmer.id,  // Link the product to the farmer
        imageUrl: imageUrl,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to add product:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}


