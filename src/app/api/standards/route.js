import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

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
      const bytes = await logo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = Date.now() + '-' + logo.name;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await writeFile(path.join(uploadDir, filename), buffer);

      logoUrl = `/uploads/${filename}`;
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
      const bytes = await logo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = Date.now() + '-' + logo.name;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await writeFile(path.join(uploadDir, filename), buffer);

      updatedData.logoUrl = `/uploads/${filename}`;
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