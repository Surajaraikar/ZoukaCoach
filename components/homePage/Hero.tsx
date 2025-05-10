import React from 'react'
import Link from 'next/link'

const Hero = () => {
  return (
    <div
      className="
        bg-[url('/images/home/home.png')] bg-center bg-cover 
        h-[90vh] sm:h-[90vh]
      "
    >
      <div
        className="
          relative z-10 
          flex flex-col items-center text-center 
          section-width px-4 sm:px-0 
          pt-44 sm:pt-24 lg:pt-32 
          
        "
      >
        <h1
          className="
            
            bg-gradient-to-br from-[#2B044B] to-[#49008B] 
            bg-clip-text text-transparent
          "
        >
          Live life to the fullest
        </h1>
        <p
          className="
            sm:mt-4 mt-2 
            
            text-[#7A64A6] 
            w-full max-w-md sm:max-w-lg lg:max-w-xl
          "
        >
          Zouka coach helps you cut through the noise, reconnect with yourself,
          and start living with direction, confidence, and joy
        </p>

        <div
          className="
            sm:mt-8  mt-4 
            flex flex-col sm:flex-row 
            gap-4 
            w-full max-w-xs sm:max-w-md 
            justify-center
          "
        >
          <Link
            href="/sign-in"
            className="
              block w-full sm:w-auto 
              py-2 px-4 
              bg-[#4D2E82] text-white font-medium 
              rounded-lg 
              shadow-inner shadow-[#2a1d5c] 
              hover:bg-[#5f3791]
              text-center
            "
          >
            Login          </Link>
          <Link
            href="/sign-up"
            className="
              block w-full sm:w-auto 
              py-2 px-4 
              bg-white border border-gray-300 text-black font-medium 
              rounded-lg 
              shadow-inner shadow-[#d1d5db] 
              hover:bg-[#f0f0f0]
              text-center
            "
          >
            Book a free session
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Hero
