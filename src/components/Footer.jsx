import React from 'react'
import { assets } from '../assests/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

            {/* left  */}
            <div >
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 leading-6 text-gray-600'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et, vel commodi dolorum soluta harum nostrum deleniti rerum corporis laboriosam libero?</p>
            </div>

            {/* center  */}
            <div>
                <p className='text-xl font-medium mb-5'>Company</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy policy</li>
                </ul>
            </div>

            {/* right  */}
            <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+91 9875487212</li>
                    <li>CliniqueNow@hotmail.com</li>
                </ul>
            </div>
        </div>

        {/* copyright */}
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2024@ CliniqueNow - All Right Reserved</p>
        </div>
    </div>
  )
}

export default Footer