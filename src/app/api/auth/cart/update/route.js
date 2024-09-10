
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { debounce } from "../../../../../../utils/debounce";
import { authOptions } from "../../[...nextauth]/route";
// Define a debounce delay (in milliseconds)
const DEBOUNCE_DELAY = 1500; // Adjust as per your requirements

// Function to update cart item quantity with debounce
const updateCartItemQuantityDebounced = debounce(async (userId, productId, quantity) => {
  try {
    // Update cart item in database
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
      data: { quantity: quantity },
    });

    console.log('Updated cart item:', updatedCartItem);
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
  }
}, DEBOUNCE_DELAY);

export async function PUT(req, res) {
  const session = await getServerSession({ authOptions });
  console.log('session establised');
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { productId, quantity } = await req.json();
  const userEmail = session.user.email;

  try {
    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Call the debounced function to update cart item quantity
    updateCartItemQuantityDebounced(user.id, Number(productId), Number(quantity));
    
    return NextResponse.json({ message: 'Quantity update scheduled' });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return NextResponse.json({ message: 'Unable to update cart quantity' }, { status: 500 });
  }
}