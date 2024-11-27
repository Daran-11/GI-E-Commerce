import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucketName = 'gipineapple';

async function uploadToGCS(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = Date.now() + '-' + file.name;
  const blob = storage.bucket(bucketName).file(filename);
  const blobStream = blob.createWriteStream();
  
  await new Promise((resolve, reject) => {
    blobStream.on('finish', resolve);
    blobStream.on('error', reject);
    blobStream.end(buffer);
  });

  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (id) {
      const standard = await prisma.standard.findUnique({
        where: { id: parseInt(id) },
      });
      if (!standard) {
        return NextResponse.json({ error: 'Standard not found' }, { status: 404 });
      }
      return NextResponse.json(standard);
    } else {
      const standards = await prisma.standard.findMany();
      return NextResponse.json(standards);
    }
  } catch (error) {
    console.error('Error fetching standards:', error);
    return NextResponse.json({ error: 'Failed to fetch standards' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.formData();
    const name = data.get('name');
    const description = data.get('description');
    const logo = data.get('logo');

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    let logoUrl = '';
    if (logo) {
      logoUrl = await uploadToGCS(logo);
    }

    const newStandard = await prisma.standard.create({
      data: {
        name,
        description: description || '',
        logoUrl,
      },
    });

    return NextResponse.json(newStandard, { status: 201 });
  } catch (error) {
    console.error('Error creating standard:', error);
    return NextResponse.json({ error: 'Failed to create standard' }, { status: 500 });
  }
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const data = await request.formData();
    const name = data.get('name');
    const description = data.get('description');
    const logo = data.get('logo');

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    let updatedData = {
      name,
      description: description || '',
    };

    if (logo) {
      updatedData.logoUrl = await uploadToGCS(logo);
    }

    const updatedStandard = await prisma.standard.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    return NextResponse.json(updatedStandard, { status: 200 });
  } catch (error) {
    console.error('Error updating standard:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Standard not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update standard' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const deletedStandard = await prisma.standard.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(deletedStandard, { status: 200 });
  } catch (error) {
    console.error('Error deleting standard:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Standard not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete standard' }, { status: 500 });
  }
}