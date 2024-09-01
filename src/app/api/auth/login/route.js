import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }
    
    const { login, password } = await req.json();

    if (!login || !password) {
      return new Response(JSON.stringify({ message: 'Login and password are required' }), { status: 400 });
    }

    console.log('Login:', login); // Debugging statement
    const farmer = await prisma.farmer.findFirst({
      where: { phone: login }
    });

    console.log('Farmer found:', farmer); // Debugging statement

    if (farmer && await bcrypt.compare(password, farmer.password)) {
      const token = jwt.sign(
        { id: farmer.id, name: farmer.name, lastname: farmer.lastname, role: farmer.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return new Response(JSON.stringify({
        token,
        name: farmer.name,
        lastname: farmer.lastname,
        role: farmer.role,
        id: farmer.id
      }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}