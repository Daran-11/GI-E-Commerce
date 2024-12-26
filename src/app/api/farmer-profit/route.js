import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';
import { getServerSession } from 'next-auth';
import prisma from '../../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';
export async function GET(request) {
  const session = await getServerSession({ ...authOptions });
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const url = new URL(request.url);
  const timeFrame = url.searchParams.get('timeFrame') || 'weekly'; // Default to weekly

  try {
    // Fetch farmer data and their products
    const farmer = await prisma.farmer.findUnique({
      where: { userId: session.user.id },
      include: {
        products: true, // Include products related to the farmer
      },
    });

    if (!farmer) {
      return new Response('Farmer not found', { status: 404 });
    }

    // Filter products based on time frame (weekly or monthly)
    const currentDate = new Date();
    let startDate, endDate;

    if (timeFrame === 'weekly') {
      startDate = startOfWeek(currentDate);
      endDate = endOfWeek(currentDate);
    } else if (timeFrame === 'monthly') {
      startDate = startOfMonth(currentDate);
      endDate = endOfMonth(currentDate);
    }

    // Filter products that were harvested in the selected time frame
    const filteredProducts = farmer.products.filter(product => {
      const harvestedAt = new Date(product.HarvestedAt);
      return harvestedAt >= startDate && harvestedAt <= endDate;
    });

    // Calculate profit and loss for each product
    const profits = filteredProducts.map(product => {
      const profit = (product.Price - product.Cost) * product.soldCount;
      return {
        productName: product.ProductName,
        profit,
      };
    });

    // Sum up the total profit and loss
    const totalProfit = profits.reduce((sum, p) => sum + p.profit, 0);

    return new Response(
      JSON.stringify({ profits, totalProfit, timeFrame, startDate: format(startDate, 'yyyy-MM-dd'), endDate: format(endDate, 'yyyy-MM-dd') }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response('Server error', { status: 500 });
  }
}
