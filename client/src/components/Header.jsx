import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'

const Header = () => {
    const {userData}=useContext(AppContent)
  return (
    <div className='flex flex-col mt-20 text-center items-center px-4 text-gray-800'>
        <img src={assets.header_img} alt="" className='rounded-full w-36 h-36 mb-6' />
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData?userData.name:'Developer'}! <img src={assets.hand_wave}className='w-8 aspect-square'/></h1>
        <h2 className='text-3xl font-semibold sm:text-5xl mb-4'>Welcome to our Web App</h2>
        <p className='max-w-md mb-8'>Let's with a quick product tour  and we will have you up and running in no time</p>
        <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all cursor-pointer'>Get started</button>
    </div>
  )
}

export default Header