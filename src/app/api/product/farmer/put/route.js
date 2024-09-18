import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';
import path from 'path';
import fs from 'fs';
import { handleFileUpload, deleteFile } from '../../../../../../utils/file-utils';

export async function PUT(request) {
  try {
    const formData = await request.formData();

    const id = formData.get("ProductID");
    const plotCode = formData.get("plotCode");
    const ProductName = formData.get("ProductName");
    const ProductType = formData.get("ProductType");
    const Price = formData.get("Price");
    const Amount = formData.get("Amount");
    const status = formData.get("status");
    const Description = formData.get("Description");
    const newImageFiles = formData.getAll("images");
    const imagesToDelete = formData.getAll("imagesToDelete");

    const existingProduct = await prisma.product.findUnique({
      where: { ProductID: parseInt(id, 10) },
      include: { images: true },
    });

    if (imagesToDelete.length > 0) {
      const deletePromises = imagesToDelete.map(async (imageUrl) => {
        const filePath = path.join(process.cwd(), "public", "uploads", path.basename(imageUrl));
        if (fs.existsSync(filePath)) {
          await deleteFile(filePath);
        }
      });
      await Promise.all(deletePromises);

      await prisma.productImage.deleteMany({
        where: { imageUrl: { in: imagesToDelete } },
      });
    }

    let existingImageUrls = existingProduct?.images.map(image => image.imageUrl) || [];
    let newImageUrls = [];

    if (newImageFiles.length > 0) {
      const uploadPromises = newImageFiles.map(async (file) => {
        const imageUrl = await handleFileUpload(file);
        return imageUrl;
      });
      newImageUrls = await Promise.all(uploadPromises);
    }

    const allImageUrls = [...new Set([...existingImageUrls, ...newImageUrls])];

    const updatedProduct = await prisma.product.update({
      where: { ProductID: parseInt(id, 10) },
      data: {
        plotCode,
        ProductName,
        ProductType,
        Price: parseFloat(Price),
        Amount: parseFloat(Amount),
        status,
        Description,
      },
    });

    const imagesToAdd = allImageUrls.filter(url => !existingImageUrls.includes(url));

    if (imagesToAdd.length > 0) {
      await prisma.productImage.createMany({
        data: imagesToAdd.map(url => ({
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
