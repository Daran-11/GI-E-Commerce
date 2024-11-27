"use client"

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('') 
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault()
    // ทำงานบางอย่าง เช่น ตรวจสอบฟอร์ม
    // แล้วนำทางไปยังหน้า dashboard
    try {
      const result = await signIn('credentials',{
        redirect: false,
        identifier,
        password,
      })
      console.log(result);
  
      if (result.error) {
        setError(result.error)
        return false
      }
    
      router.push('/')

    } catch (error) {
      setError("Unable to connect to server");
      console.log("error", error);
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen ">
      
        <title>Login Form</title>
        <link rel="icon" href="/favicon.ico" />
      
      
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-4xl font-light mb-6">GI Pineapple :)</h2>
        <input 
          className="textbox mb-4 p-3 w-64 text-center rounded-lg border border-gray-300 outline-none focus:border-teal-500 transition" 
          value={identifier}
          placeholder="กรอกอีเมล หรือ เบอร์โทร" 
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input 
          className="textbox mb-6 p-3 w-64 text-center rounded-lg border border-gray-300 outline-none focus:border-teal-500 transition" 
          type="password" 
          value={password}
          placeholder="กรอกรหัสผ่าน" 
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button 
          className="btn-submit h-[50px] p-3 w-64 bg-teal-500 text-white rounded-lg cursor-pointer hover:bg-teal-600 transition" 
          type="submit" 
          value="Login"
          onClick={handleSubmit}
          >
            
          เข้าสู่ระบบ

        </button>
        {error && <div className='bg-red-500 text-sm text-white py-1 px-3'>{error}</div>}
      </form>
    </div>
  )
}
