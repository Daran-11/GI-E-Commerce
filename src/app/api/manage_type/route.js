import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET - ดึงข้อมูลทั้งหมดหรือตาม ID
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // ดึงข้อมูลตาม ID
      const type = await prisma.manageType.findUnique({
        where: { id: parseInt(id) },
        include: {
          varieties: true
        }
      });
      
      if (!type) {
        return NextResponse.json({ error: 'ไม่พบข้อมูล' }, { status: 404 });
      }
      
      return NextResponse.json(type);
    }
    
    // ดึงข้อมูลทั้งหมด
    const types = await prisma.manageType.findMany({
      include: {
        varieties: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(types);
  } catch (error) {
    console.error('Error fetching types:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถโหลดข้อมูลได้' }, 
      { status: 500 }
    );
  }
}

// POST - สร้างข้อมูลใหม่
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate
    if (!body.type?.trim()) {
      return NextResponse.json(
        { error: 'กรุณาระบุชนิด' },
        { status: 400 }
      );
    }
    
    if (!Array.isArray(body.varieties) || body.varieties.length === 0) {
      return NextResponse.json(
        { error: 'กรุณาระบุสายพันธุ์อย่างน้อย 1 รายการ' },
        { status: 400 }
      );
    }

    // Create type with varieties
    const newType = await prisma.manageType.create({
      data: {
        type: body.type.trim(),
        varieties: {
          create: body.varieties.map(v => ({
            name: v.name.trim()
          }))
        }
      },
      include: {
        varieties: true
      }
    });

    return NextResponse.json(newType, { status: 201 });
  } catch (error) {
    console.error('Error creating type:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถสร้างข้อมูลได้' },
      { status: 500 }
    );
  }
}

// PUT - อัปเดตข้อมูล
export async function PUT(request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'กรุณาระบุ ID' },
        { status: 400 }
      );
    }

    if (!body.type?.trim()) {
      return NextResponse.json(
        { error: 'กรุณาระบุชนิด' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.varieties) || body.varieties.length === 0) {
      return NextResponse.json(
        { error: 'กรุณาระบุสายพันธุ์อย่างน้อย 1 รายการ' },
        { status: 400 }
      );
    }

    // Update type and varieties
    const updatedType = await prisma.manageType.update({
      where: { id: parseInt(body.id) },
      data: {
        type: body.type.trim(),
        varieties: {
          deleteMany: {}, // ลบสายพันธุ์เดิมทั้งหมด
          create: body.varieties.map(v => ({
            name: v.name.trim()
          }))
        }
      },
      include: {
        varieties: true
      }
    });

    return NextResponse.json(updatedType);
  } catch (error) {
    console.error('Error updating type:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถอัปเดตข้อมูลได้' },
      { status: 500 }
    );
  }
}

// DELETE - ลบข้อมูล
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'กรุณาระบุ ID' },
        { status: 400 }
      );
    }

    // Delete type (varieties จะถูกลบอัตโนมัติด้วย cascade)
    await prisma.manageType.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'ลบข้อมูลเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Error deleting type:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถลบข้อมูลได้' },
      { status: 500 }
    );
  }
}