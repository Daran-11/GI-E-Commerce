import { getServerSession } from 'next-auth';
import prisma from '../../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const userId = session.user.id;
  const { items, addressId, farmerId } = await request.json();

  if (!items || items.length === 0 || !addressId || !farmerId) {
    console.log('Missing required fields', items);
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  try {
    // ตรวจสอบจำนวนสินค้าในว่ามีพอกับที่จะซื้อไหม
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { ProductID: item.productId },
        select: { Amount: true },
      });

      if (!product) {
        return new Response(
          JSON.stringify({ message: `Product with ID ${item.productId} not found` }),
          { status: 404 }
        );
      }

      if (product.amount < item.quantity) {
        return new Response(
          JSON.stringify({
            message: `Insufficient stock for product ID ${item.productId}. Available: ${product.amount}, Requested: ${item.quantity}`,
          }),
          { status: 400 }
        );
      }
    }

    // Get the selected address
    const selectedAddress = await prisma.address.findFirst({
      where: {
        userId: userId,
        isDefault: true,
      },
      include: {
        province: true,
        amphoe: true,
        tambon: true,
      },
    });

    if (!selectedAddress) {
      return new Response(JSON.stringify({ message: 'Address not found' }), { status: 404 });
    }

    // Prepare the address text
    const addressText = `${selectedAddress.addressLine}, ${selectedAddress.tambon.name_th}, ${selectedAddress.amphoe.name_th}, ${selectedAddress.province.name_th}, ${selectedAddress.postalCode}`;

    // Start a transaction to create the order and order items
    const createdOrder = await prisma.$transaction(async (prisma) => {
      // Create the main order
      const order = await prisma.order.create({
        data: {
          userId: userId,
          farmerId: farmerId, 
          totalPrice: items.reduce((total, item) => total + item.quantity * item.productPrice, 0),
          addressText: addressText,
          status: 'Pending',
          deliveryStatus: 'Preparing',
          paymentStatus: 'Pending',
        },
      });

      // Create all order items
      await prisma.orderItem.createMany({
        data: items.map(item => ({
          orderId: order.id,
          productId: item.productId,
          farmerId: farmerId,
          quantity: item.quantity,
          price: item.productPrice,
        })),
      });

      // Update product amounts
      for (const item of items) {
        await prisma.product.update({
          where: { ProductID: item.productId },
          data: {
            Amount: {
              decrement: item.quantity
            },
            soldCount: {
              increment: item.quantity
            }
          }
        });
      }

      return order;
    });

    return new Response(JSON.stringify({
      message: 'Order created successfully',
      order: createdOrder,
    }), { status: 200 });

  } catch (error) {
    console.error('Failed to create order:', error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const lastFetchTime = url.searchParams.get('lastFetchTime');

    if (!lastFetchTime) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    const newOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gt: new Date(lastFetchTime),
        },
      },
      select: {
        id: true,
      },
    });

    return new Response(JSON.stringify(newOrders), { status: 200 });
  } catch (error) {
    console.error('Error fetching new orders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch new orders' }), { status: 500 });
  }
}