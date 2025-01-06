import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Storage } from "@google-cloud/storage";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from "path";
import prisma from "../../../../../../../lib/prisma";

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucketName = 'gipineapple';

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
    
    await new Promise((resolve, reject) => {
      blobStream.on('finish', resolve);
      blobStream.on('error', reject);
      blobStream.end(buffer);
    });

    return `https://storage.googleapis.com/${bucketName}/${filename}`;
  } catch (error) {
    console.error("Error in file upload:", error);
    throw error;
  }
}

export async function POST(request, { params }) {
  const session = await getServerSession({ request, ...authOptions });
  const { userId } = params;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.id !== parseInt(userId) && session.user.role !== "farmer") {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const farmer = await prisma.farmer.findUnique({
    where: { userId: parseInt(userId) }
  });

  if (!farmer) {
    return NextResponse.json({ error: 'Farmer profile not found' }, { status: 404 });
  }

  try {
    const formData = await request.formData();

    // รับข้อมูลจาก form
    const ProductName = formData.get("ProductName");
    const ProductType = formData.get("ProductType");
    const Price = formData.get("Price");
    const Cost = formData.get("Cost");
    const Amount = formData.get("Amount");
    const status = formData.get("status");
    const Description = formData.get("Description");
    const HarvestedAt = formData.get("HarvestedAt");
    const Details = formData.get("Details");
    const Certificates = formData.getAll("Certificates");

    // แปลง certificates
    let certificateIds = [];
    if (Certificates.length === 1 && typeof Certificates[0] === "string") {
      certificateIds = Certificates[0].split(',').map(id => parseInt(id.trim()));
    } else {
      certificateIds = Certificates.map(id => parseInt(id.trim()));
    }
    certificateIds = certificateIds.filter(id => !isNaN(id));

    // จัดการรูปภาพ
    const imageFiles = formData.getAll("images");
    const imageUrls = [];

    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        const imageUrl = await handleFileUpload(imageFile);
        imageUrls.push(imageUrl);
      }
    }

    // สร้างสินค้าด้วย transaction
    const [product, certificate] = await prisma.$transaction(async (tx) => {
      // สร้างสินค้า
      const newProduct = await tx.product.create({
        data: {
          ProductName,
          ProductType,
          Description,
          Price: parseFloat(Price),
          Amount: parseInt(Amount),
          Cost: parseInt(Cost),
          status,
          farmerId: farmer.id,
          Details,
          HarvestedAt: new Date(HarvestedAt),
        },
      });

      // เพิ่มรูปภาพ
      if (imageUrls.length > 0) {
        await tx.productImage.createMany({
          data: imageUrls.map(url => ({
            imageUrl: url,
            productId: newProduct.ProductID,
          })),
        });
      }

      // เชื่อมโยงใบรับรอง
      if (certificateIds.length > 0) {
        await tx.productCertificate.createMany({
          data: certificateIds.map(certificateId => ({
            productId: newProduct.ProductID,
            certificateId: certificateId,
          })),
        });
      }

      // ดึงข้อมูลใบรับรอง
      const productCertificate = certificateIds.length > 0 
        ? await tx.productCertificate.findFirst({
            where: { productId: newProduct.ProductID },
            include: { certificate: true }
          })
        : null;

      // สร้าง QR Code ID
      const farmerIdPadded = farmer.id.toString().padStart(4, '0');
      const varietyCode = productCertificate?.certificate?.variety?.toLowerCase() === 'นางแล' ? 'PN' : 
                         productCertificate?.certificate?.variety?.toLowerCase() === 'ภูแล' ? 'PP' : 'XX';
      const productIdPadded = newProduct.ProductID.toString().padStart(5, '0');
      
      const qrcodeId = `${farmerIdPadded}${varietyCode}${productIdPadded}`;

      // สร้าง QR Code
      await tx.qR_Code.create({
        data: {
          qrcodeId,
          farmerId: farmer.id,
          certificateId: productCertificate?.certificateId,
          productId: newProduct.ProductID,
          userId: farmer.userId
        }
      });

      return [newProduct, productCertificate];
    });

    return NextResponse.json(product, { status: 201 });

  } catch (error) {
    console.error("Failed to add product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add product" },
      { status: 500 }
    );
  }
}