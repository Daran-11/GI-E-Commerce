"use client"

function RegisterPage() {
  return (
    
        <div className='top-container'>
            <p>Register</p>
            <div className='form mt-[50px]'>
                
            <form action="" >          
                <input className="input-box p-2 my-5 w-[500px] h-15" 
                type="text" 
                placeholder="ใส่ชื่อ"
                required
                />

                <input className="input-box p-2 my-5 w-[500px] h-15" 
                type="email" 
                placeholder="ใส่อีเมล"
                required
                />

                <input className="input-box p-2 my-5 w-[500px] h-15" 
                type="password" 
                placeholder="รหัสผ่าน"
                required
                />

                <input className="input-box p-2 my-5 w-[500px] h-15" 
                type="password" 
                id = "confirmpass"
                placeholder="ยืนยันรหัสผ่าน"
                required
                />

                <button className="bg-green-100 p-2 my-5 " type="submit" > สมัคร </button>
            </form>

            </div>


        </div>


  )
}

export default RegisterPage