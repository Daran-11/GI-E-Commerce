import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { items, addressId, farmerId } = await request.json();  // FarmerId is passed from frontend
  
  if (!items || items.length === 0 || !addressId || !farmerId) {
    console.log('Missing required fields',items);
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
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
      return NextResponse.json({ message: 'Address not found' }, { status: 404 });
    }

    // Prepare the address text
    const addressText = `${selectedAddress.addressLine}, ${selectedAddress.tambon.name_th}, ${selectedAddress.amphoe.name_th}, ${selectedAddress.province.name_th}, ${selectedAddress.postalCode}`;

    // Start a transaction to create the order and order items
    const createdOrder = await prisma.$transaction(async (prisma) => {
      // Create the main order
      const order = await prisma.order.create({
        data: {
          userId: userId,
          farmerId: farmerId,  // Link the order to the specific farmer
          totalPrice: items.reduce((total, item) => total + item.quantity * item.productPrice, 0),  // Sum total price
          addressText: addressText,
          status: 'Pending',
          deliveryStatus: 'Preparing',
          paymentStatus: 'Pending',
        },
      });

      // Create all order items in a single step
      const orderItems = await prisma.orderItem.createMany({
        data: items.map(item => ({
          orderId: order.id,
          productId: item.productId,
          farmerId: farmerId,  // Associate the farmerId with each order item
          quantity: item.quantity,
          price: item.productPrice,
        })),
      });

      return { order, orderItems };
    });

    // Return success response with the created order
    return NextResponse.json({
      message: 'Order created successfully',
      order: createdOrder.order,
      orderItem: createdOrder.orderItems
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
  }
}




  //get all order for the order-confirm page
  export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const orderIdsString  = searchParams.get('id'); // Get the orderId from query params
  
    if (!orderIdsString) {
      return new Response(JSON.stringify({ error: 'Order IDs are required' }), { status: 400 });
    }

  
    try {
      // Fetch the order details by ID, including related order items and product details

      const orderIds = orderIdsString .split(',').map(id => parseInt(id));

      const orders = await prisma.order.findMany({
        where: {
          id: { in: orderIds },
        },
        include: {
          orderItems: {
            include: {
              product: true,  // Include product details for each order item
              farmer: true,   // Include farmer details for each order item
            },
          },
        },
      });
  
      // Check if the order exists
      if (!orders || orders.length === 0) {
        return new Response(JSON.stringify({ error: 'Orders not found' }), { status: 404 });
      }
  
      // Return the order details in the response
      return new Response(JSON.stringify({
        message: 'Order details fetched successfully',
        orders: orders,
      }), { status: 200 });
  
    } catch (error) {
      console.error('Error fetching order details:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch order details' }), { status: 500 });
    }
  }


  