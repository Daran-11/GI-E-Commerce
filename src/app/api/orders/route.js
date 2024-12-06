import { getServerSession } from 'next-auth';
import prisma from '../../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

// Handle POST request for creating an order
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const userId = session.user.id;
  const { items, addressId, farmerId } = await request.json(); // FarmerId is passed from frontend

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

    // Get the selected address (you can choose between the selected address or default)
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
          farmerId: farmerId, // Link the order to the specific farmer
          totalPrice: items.reduce((total, item) => total + item.quantity * item.productPrice, 0), // Sum total price
          addressText: addressText,
          status: 'Pending',
          deliveryStatus: 'Preparing',
          paymentStatus: 'Pending',
        },
      });

      // Create all order items in a single step
      await prisma.orderItem.createMany({
        data: items.map(item => ({
          orderId: order.id,
          productId: item.productId,
          farmerId: farmerId, // Associate the farmerId with each order item
          quantity: item.quantity,
          price: item.productPrice,
        })),
      });

      return order; // Return the created order
    });

    // Return success response with the created order
    return new Response(JSON.stringify({
      message: 'Order created successfully',
      order: createdOrder,
    }), { status: 200 });

  } catch (error) {
    console.error('Failed to create order:', error);
    return new Response(JSON.stringify({ message: 'Failed to create order' }), { status: 500 });
  }
}

// Handle GET request for fetching new incoming orders
export async function GET(request) {
  try {
    // Extract the last fetch time from the query parameters or headers
    const url = new URL(request.url);
    const lastFetchTime = url.searchParams.get('lastFetchTime'); // Get the last fetch time from query parameters

    // Ensure lastFetchTime is valid
    if (!lastFetchTime) {
      return new Response(JSON.stringify([]), { status: 200 }); // No last fetch time provided, return an empty array
    }

    const newOrders = await prisma.order.findMany({
      where: {
        // Check for orders created after the last fetch time
        createdAt: {
          gt: new Date(lastFetchTime), // Compare to the last fetch time
        },
      },
      select: {
        id: true, // Only select the order ID
      },
    });

    return new Response(JSON.stringify(newOrders), { status: 200 });
  } catch (error) {
    console.error('Error fetching new orders:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch new orders' }), { status: 500 });
  }
}
