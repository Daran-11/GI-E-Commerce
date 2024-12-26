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
    
      window.location.href = '/'; // Redirect to the home page after login

    } catch (error) {
      setError("Unable to connect to server");
      console.log("error", error);
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen ">
      
        <title>Login Form</title>
        <link rel="icon" href="/favicon.ico" />
      
      
      <form onSubmit={handleSubmit} className="bg-white p-10 w-[400px] items-center rounded-lg shadow-lg flex flex-col">
        <div className='mb-4 w-full'>
          <h2 className="text-4xl text-[#535353] text-center pb-2 border-b-2 mb-2 ">เข้าสู่ระบบ </h2>

        </div>
        <div className='w-full px-2'>
          <h3>อีเมล</h3>
          <input 
            className="textbox mb-4 p-2 w-full  text-start rounded-3xl border border-gray-300 outline-none  transition" 
            value={identifier}
            placeholder="กรอกอีเมล หรือ เบอร์โทร" 
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />          
        </div>
        <div className='w-full px-2'>
          <h3>รหัสผ่าน</h3>
          <input 
            className="textbox  w-full  mb-4 p-2  text-start rounded-3xl border border-gray-300 outline-none transition" 
            type="password" 
            value={password}
            placeholder="กรอกรหัสผ่าน" 
            onChange={(e) => setPassword(e.target.value)}
            required
          />          
        </div>

        <div className='flex items-start'>
          <button 
            className="btn-submit mt-2 w-[130px] h-[40px] p-2 rounded-3xl bg-[#4eac14] text-white cursor-pointer hover:bg-[#4eac14] hover:opacity-70 transition focus:ring-2 focus:ring-offset-2 focus:ring-[#4eac14]" 
            type="submit" 
            value="Login"
            onClick={handleSubmit}
            >
              
            เข้าสู่ระบบ

          </button>          
        </div>
        <div className='flex mt-4 items-center justify-center space-x-2 w-full '>
            <p className=''>ยังไม่มีบัญชี? </p>
            <a className='text-blue-500' href="/register">สมัครเลย!</a>          
        </div>

        {error && <div className='pt-5 text-red-500 text-sm py-1 px-3'>{error}</div>}
      </form>
    </div>
  )
}
