"use client"

import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    // ทำงานบางอย่าง เช่น ตรวจสอบฟอร์ม
    // แล้วนำทางไปยังหน้า dashboard
    router.push('/profile')
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-green-600">
      
        <title>Login Form</title>
        <link rel="icon" href="/favicon.ico" />
      
      
      <form className="bg-white p-10 rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-4xl font-light mb-6">Login</h2>
        <input 
          className="textbox mb-4 p-3 w-64 text-center rounded-lg border border-gray-300 outline-none focus:border-teal-500 transition" 
          type="text" 
          placeholder="Username" 
        />
        <input 
          className="textbox mb-6 p-3 w-64 text-center rounded-lg border border-gray-300 outline-none focus:border-teal-500 transition" 
          type="password" 
          placeholder="Password" 
        />
        <input 
          className="btn-submit p-3 w-64 bg-teal-500 text-white rounded-lg cursor-pointer hover:bg-teal-600 transition" 
          type="submit" 
          value="Login" 
        />
      </form>
    </div>
  )
}
