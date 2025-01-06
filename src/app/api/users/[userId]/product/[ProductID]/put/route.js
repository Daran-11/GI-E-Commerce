import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Storage } from "@google-cloud/storage";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../../../../../lib/prisma";

// Initialize Google Cloud Storage
const storage = new Storage({
 keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucketName = 'gipineapple';

// Helper function to delete file from Google Cloud Storage
async function deleteFileFromCloudStorage(imageUrl) {
 try {
   const fileName = imageUrl.split('/').pop();
   const file = storage.bucket(bucketName).file(fileName);
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

 // Fetch farmer data
 const farmer = await prisma.farmer.findUnique({
   where: { userId: parseInt(userId) },
 });

 if (!farmer) {
   return NextResponse.json({ error: 'Farmer profile not found for this user.' }, { status: 404 });
 }

 try {
   const formData = await request.formData();
   const ProductName = formData.get("ProductName");
   const ProductType = formData.get("ProductType");
   const Price = formData.get("Price");
   const Cost = formData.get("Cost");
   const Amount = formData.get("Amount");
   const status = formData.get("status");
   const Description = formData.get("Description");
   const Details = formData.get("Details");
   const Certificates = formData.getAll("Certificates");

   // Parse certificate IDs
   let certificateIds = [];
   if (Certificates.length === 1 && typeof Certificates[0] === "string") {
     certificateIds = Certificates[0].split(',').map(id => parseInt(id.trim()));
   } else {
     certificateIds = Certificates.map(id => parseInt(id.trim()));
   }
   certificateIds = certificateIds.filter(id => !isNaN(id));

   const [product, certificate] = await prisma.$transaction(async (tx) => {
     // Update the product
     const updatedProduct = await tx.product.update({
       where: { ProductID: parseInt(ProductID) },
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

     // Update certificates if provided
     if (certificateIds.length > 0) {
       // Remove existing certificates
       await tx.productCertificate.deleteMany({
         where: { productId: parseInt(ProductID) }
       });

       // Add new certificates
       await tx.productCertificate.createMany({
         data: certificateIds.map(certificateId => ({
           productId: parseInt(ProductID),
           certificateId: certificateId,
         })),
       });
     }

     // Get updated certificate information
     const productCertificate = certificateIds.length > 0
       ? await tx.productCertificate.findFirst({
           where: { productId: parseInt(ProductID) },
           include: { certificate: true }
         })
       : null;

     // Update QR Code
     const farmerIdPadded = farmer.id.toString().padStart(4, '0');
     const varietyCode = productCertificate?.certificate?.variety?.toLowerCase() === 'นางแล' ? 'PN' :
                        productCertificate?.certificate?.variety?.toLowerCase() === 'ภูแล' ? 'PP' : 'XX';
     const productIdPadded = ProductID.toString().padStart(5, '0');
     const qrcodeId = `${farmerIdPadded}${varietyCode}${productIdPadded}`;

     // Find existing QR Code
     const existingQRCode = await tx.qR_Code.findFirst({
       where: { productId: parseInt(ProductID) }
     });

     if (existingQRCode) {
       // Update existing QR Code
       await tx.qR_Code.update({
         where: { id: existingQRCode.id },
         data: {
           qrcodeId,
           certificateId: productCertificate?.certificateId || null
         }
       });
     } else {
       // Create new QR Code if not exists
       await tx.qR_Code.create({
         data: {
           qrcodeId,
           farmerId: farmer.id,
           certificateId: productCertificate?.certificateId || null,
           productId: parseInt(ProductID),
           userId: farmer.userId
         }
       });
     }

     return [updatedProduct, productCertificate];
   });

   return NextResponse.json(product, { status: 200 });

 } catch (error) {
   console.error("Failed to update product:", error);
   return NextResponse.json(
     { error: "Failed to update product" },
     { status: 500 }
   );
 }
}