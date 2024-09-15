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
    const { productId, quantity, productName, productPrice, farmerId } = await request.json();
    if (!productId || quantity == null || !productPrice || !farmerId) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    try {
      // Get the default address
      const defaultAddress = await prisma.address.findFirst({
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
  
      if (!defaultAddress) {
        return NextResponse.json({ message: 'Default address not found' }, { status: 404 });
      }
  
      // Prepare the address text
      const addressText = `${defaultAddress.addressLine}, ${defaultAddress.tambon.name_th}, ${defaultAddress.amphoe.name_th}, ${defaultAddress.province.name_th}, ${defaultAddress.postalCode}`;
  
      const createdOrder = await prisma.$transaction(async (prisma) => {
        // Step 2: Create the main order
        const order = await prisma.order.create({
          data: {
            userId: userId,
            totalPrice: quantity * productPrice, // Calculate total price from quantity and product price
            addressText: addressText,    // Store address as plain text
            status: 'Pending',           // Initial order status
            deliveryStatus: 'Preparing', // Initial delivery status
            paymentStatus: 'Pending',    // Initial payment status
          },
        });
  
        // Step 3: Create the order item linked to the order
        const orderItem = await prisma.orderItem.create({
          data: {
            orderId: order.id,       // Link this order item to the created order
            productId: productId,    // ID of the product being ordered
            farmerId: farmerId,      // ID of the farmer selling the product
            quantity: quantity,      // Quantity of the product being ordered
            price: productPrice,     // Price of the product at the time of ordering
          },
        });
  
        return { order, orderItem };
      });

    // Step 4: Return a success response with the created order and order item
      return NextResponse.json({
        message: 'Order created successfully',
        order: createdOrder.order,
        orderItem: createdOrder.orderItem
      }, { status: 200 });

    } catch (error) {
      console.error('Failed to create order:', error);
      return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
    }
  }


  //get all order for the order-confirm page
  export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id'); // Get the orderId from query params
  
    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Order ID is required' }), { status: 400 });
    }
  
    try {
      // Fetch the order details by ID, including related order items and product details
      const order = await prisma.order.findUnique({
        where: {
          id: parseInt(orderId),
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
      if (!order) {
        return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
      }
  
      // Return the order details in the response
      return new Response(JSON.stringify({
        message: 'Order details fetched successfully',
        order: order,
      }), { status: 200 });
  
    } catch (error) {
      console.error('Error fetching order details:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch order details' }), { status: 500 });
    }
  }


  