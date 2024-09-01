

import prisma from '@/app/lib/db';
import bcrypt from 'bcryptjs'; 

export async function POST(req) {
  const { login, password } = await req.json();

  try {
    
    const farmer = await prisma.farmer.findFirst({
      where: {
        OR: [
          { email: login },
          { phone: login } 
        ]
      }
    });

    if (farmer && (await bcrypt.compare(password, farmer.password))) {
     
      return new Response(JSON.stringify({
        token: 'your-token-here', 
        name: farmer.name,
        role: farmer.role,
        id: farmer.id
        
      }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}

// Optionally handle other HTTP methods
export async function GET(req) {
  return new Response(JSON.stringify({ message: 'GET method not supported for this endpoint' }), { status: 405 });
}
