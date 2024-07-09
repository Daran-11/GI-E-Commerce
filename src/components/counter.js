"use client"
import { useState } from 'react'

export default function Counter({productAmount}) {
    const [count,setCount] = useState(1)

    const decrement = () => {
        if (count > 1) {
            setCount(count - 1)
        }
    }

    const increment = () => {
        if (count < productAmount) {
            setCount(count + 1)            
        }

    }

  return (

    
    <div className=''>
        <div className='flex items-center '>
            <button className='btn w-10 h-10 border-2' onClick={decrement}>
                -
            </button>
            <h1 className='w-8 text-center'>
                {count}                 
            </h1>

            <button className='btn w-10 h-10 border-2' onClick={increment}>
                +
            </button>            
        </div>

    </div>
  )
}
