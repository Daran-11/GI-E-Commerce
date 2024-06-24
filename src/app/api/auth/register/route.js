import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

export async function POST(request) {
    try {
        const { name, email, password, phone } = await request.json();

        // Server-side validation
        if (!name || !email || !password || !phone) {
            return new Response(JSON.stringify({ error: 'โปรดใส่ข้อมูลให้ครบทุกช่อง' }), { status: 400 });
        }

        if (!email.includes('@') || !email.includes('.')) {
            return new Response(JSON.stringify({ error: "อีเมลต้องมี '@' และ '.' เช่น gipine@gmail.com" }), { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return new Response(JSON.stringify({ error: 'อีเมลนี้ถูกใช้ไปแล้ว' }), { status: 400 });
        }

        const hashedPassword = await  bcrypt.hashSync(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
            },
        });

        return new Response(JSON.stringify({ message: 'สมัครสมาชิกเรียบร้อยแล้ว', user }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' }), { status: 500 });
    }
}