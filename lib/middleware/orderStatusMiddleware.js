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

    // Automatically update status to "Completed" if conditions are met, or roll back if conditions change
    const updates = orders.map(async (order) => {
      // Update status to "Completed" if conditions are met
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
            userId: parseInt(userId),
          },
        });

        // If a history entry exists, update it
        if (historyEntry) {
          await prisma.history.update({
            where: { id: historyEntry.id },
            data: {
              status: "Completed",
              completedAt: new Date(),
            },
          });
        } else {
          // Optionally, create a new history entry if it doesn't exist
          await prisma.history.create({
            data: {
              orderId: order.id,
              userId: parseInt(userId),
              farmerId: order.farmerId,
              totalPrice: order.totalPrice,
              status: "Completed",
              paymentStatus: order.paymentStatus,
              deliveryStatus: order.deliveryStatus,
            },
          });
        }
      }

      // Rollback to the previous status if deliveryStatus is no longer "Delivered" and status is "Completed"
      if (
        order.deliveryStatus !== "Delivered" &&
        order.status === "Completed"
      ) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "Pending" }, // Replace "Pending" with the desired status when rolling back
        });

        // Update the history entry if it exists, but do not update completedAt
        const historyEntry = await prisma.history.findFirst({
          where: {
            orderId: order.id,
            userId: parseInt(userId),
          },
        });

        if (historyEntry) {
          await prisma.history.update({
            where: { id: historyEntry.id },
            data: {
              status: "Pending", // Match the rollback status
              // Do not set completedAt to null or update it
            },
          });
        }
      }

      // Delete history entry if deliveryStatus changes from "Delivered" to something else
      if (order.deliveryStatus !== "Delivered") {
        const historyEntry = await prisma.history.findFirst({
          where: {
            orderId: order.id,
            userId: parseInt(userId),
          },
        });

        if (historyEntry) {
          await prisma.history.delete({
            where: { id: historyEntry.id },
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
