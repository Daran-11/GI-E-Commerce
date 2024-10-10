import prisma from "../../lib/prisma";

export async function checkOrderStatus(req, userId) {
  try {
    // Fetch all orders for the specified farmer
    const orders = await prisma.order.findMany({
      where: {
        farmer: {
          userId: parseInt(userId),
        },
      },
    });

    // Automatically update status to "Completed" if conditions are met
    const updates = orders.map(async (order) => {
      if (
        order.deliveryStatus === "Delivered" &&
        order.paymentStatus === "Completed" &&
        order.status !== "Completed"
      ) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "Completed" },
        });
      }
    });

    // Await all updates
    await Promise.all(updates);

    // Return the updated orders after the status change
    return await prisma.order.findMany({
      where: {
        farmer: {
          userId: parseInt(userId),
        },
      },
    });
  } catch (error) {
    console.error("Error in order status middleware:", error);
    throw new Error("Error in processing order status updates");
  }
}
