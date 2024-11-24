import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from "path";
import prisma from "../../../../../../../lib/prisma";

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

export async function POST(request, { params }) {
  const session = await getServerSession({ request, ...authOptions });
  const { userId } = params;

  console.log('Checking session for adding product:', session); // Debug session
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
    console.log("Farmer data not found in Farmer table");
    return NextResponse.json({ error: 'Farmer profile not found for this user.' }, { status: 404 });
  }

  try {
    // Parse form data
    const formData = await request.formData();

    // Extract fields from formData
    const ProductName = formData.get("ProductName");
    const ProductType = formData.get("ProductType");
    const Price = formData.get("Price");
    const Cost = formData.get("Cost");
    const Amount = formData.get("Amount");
    const status = formData.get("status");
    const Description = formData.get("Description");
    const Details = formData.get("Details");
    const Certificates = formData.getAll("Certificates");

    // Ensure Certificates is an array of integers
    let certificateIds = [];
    if (Certificates.length === 1 && typeof Certificates[0] === "string") {
      // If it's a single string, split it by comma
      certificateIds = Certificates[0].split(',').map((id) => parseInt(id.trim()));
    } else {
      // Otherwise, map the array directly to integers
      certificateIds = Certificates.map((id) => parseInt(id.trim()));
    }

    // Filter out any NaN values (in case of invalid parsing)
    certificateIds = certificateIds.filter((id) => !isNaN(id));

    // Log the parsed certificate IDs for debugging
    console.log("Parsed certificate IDs:", certificateIds);

    // Handle multiple image files
    const imageFiles = formData.getAll("images"); // Adjusted for multiple images
    const imageUrls = [];

    // Handle file uploads for each image
    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        const imageUrl = await handleFileUpload(imageFile);
        imageUrls.push(imageUrl);
      }
    }

    // Create the new product in the database
    const product = await prisma.product.create({
      data: {
        ProductName,
        ProductType,
        Description: Description,
        Price: parseFloat(Price),
        Amount: parseInt(Amount, 10),
        Cost: parseInt(Cost, 10),
        status,
        farmerId: farmer.id, // Link the product to the farmer
        Details,
      },
    });

    // Now, add the associated images in the ProductImage model
    if (imageUrls.length > 0) {
      const imagePromises = imageUrls.map((url) =>
        prisma.productImage.create({
          data: {
            imageUrl: url,
            productId: product.ProductID, // Link the image to the created product
          },
        })
      );
      await Promise.all(imagePromises);
    }

    // Link the product to certificates
    if (certificateIds.length > 0) {
      const productCertificatePromises = certificateIds.map((certificateId) =>
        prisma.productCertificate.create({
          data: {
            productId: product.ProductID,
            certificateId: certificateId,
          },
        })
      );
      await Promise.all(productCertificatePromises);
    }

    console.log("Product added successfully:", product); // Debug successful addition
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to add product:", error); // Enhanced error logging
    return NextResponse.json(
      { error: error.message || "Failed to add product" },
      { status: 500 }
    );
  }
}
