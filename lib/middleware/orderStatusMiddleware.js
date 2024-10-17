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
        // Update the order status to "Completed"
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "Completed" },
        });

        // Check if there's a corresponding history entry
        const historyEntry = await prisma.history.findFirst({
          where: {
            orderId: order.id,
            userId: parseInt(userId), // Assuming userId is the one placing the order
          },
        });

        // If a history entry exists, update it
        if (historyEntry) {
          await prisma.history.update({
            where: { id: historyEntry.id },
            data: {
              status: "Completed",
              completedAt: new Date(), // Update the completion time
            },
          });
        } else {
          // Optionally, you can create a new history entry if it doesn't exist
          await prisma.history.create({
            data: {
              orderId: order.id,
              userId: parseInt(userId),
              farmerId: order.farmerId, // Ensure you have this field in your order model
              totalPrice: order.totalPrice, // Ensure this field exists in your order model
              status: "Completed",
              paymentStatus: order.paymentStatus,
              deliveryStatus: order.deliveryStatus,
            },
          });
        }
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
