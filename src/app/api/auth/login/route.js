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
    const Users = await prisma.Users.findFirst({
      where: { phone: login }
    });

    console.log('Users found:', Users); // Debugging statement

    if (Users && await bcrypt.compare(password, Users.password)) {
      const token = jwt.sign(
        { id: Users.id, name: Users.name, lastname: Users.lastname, role: Users.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return new Response(JSON.stringify({
        token,
        name: Users.name,
        lastname: Users.lastname,
        role: Users.role,
        id: Users.id
      }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}