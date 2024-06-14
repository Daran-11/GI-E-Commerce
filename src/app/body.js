import Head from 'next/head'

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 to-green-400">
      <Head>
        <title>Login Form</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <form className="bg-white p-10 rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-2xl font-light mb-6">Login</h2>
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
