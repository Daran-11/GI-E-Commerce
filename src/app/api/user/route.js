// src/app/api/user/route.js
export async function GET(request) {
    return new Response(JSON.stringify({ message: 'Hello from user' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }