import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#FAFAFA] border-gray-200 margin-top">
<div className='section-width'>
        {/* Top navigation */}
        <div className=" py-4 sm:py-8 flex flex-col sm:gap-5 gap-1">
        {/* Logo */}
        <div className="mb-6 md:mb-0">
                          {/* Logo */}
                          <Link href="/">
                  <Image
                    src="/images/home/logo.svg"
                    width={100}
                    height={100}
                    alt="logo"
                  />
                </Link>
        </div>
        {/* Nav links */}
        {/* <nav className="flex flex-wrap justify-start sm:space-x-6 space-x-3 text-[#535862]">
          <Link href="#" className="hover:text-gray-900 link">Overview</Link>
          <Link href="#" className="hover:text-gray-900 link">Features</Link>
          <Link href="#" className="hover:text-gray-900 link">Pricing</Link>
          <Link href="#" className="hover:text-gray-900 link">Careers</Link>
          <Link href="#" className="hover:text-gray-900 link">Help</Link>
          <Link href="#" className="hover:text-gray-900 link">Privacy</Link>
        </nav> */}
      </div>

      {/* Bottom bar */}
      <div className="py-4 sm:py-8 border-t border-gray-200 flex flex-col md:flex-row items-center sm:gap-5 hover:text-gray-700 text-[#717680] text-sm">
        <p>© 2025 Zoukacoach. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0 justify-center md:justify-end">
          <Link href="#"><p className="hover:text-gray-700 text-[#717680]">Terms</p></Link>
          <Link href="#"><p className="hover:text-gray-700 text-[#717680]">Privacy</p></Link>
          {/* <Link href="#"><p className="hover:text-gray-700 text-[#717680]">Cookies</p></Link> */}
        </div>
      </div>
</div>
    </footer>
  );
}
