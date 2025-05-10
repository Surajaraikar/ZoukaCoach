import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#FAFAFA] border-gray-200 ">
<div className='section-width'>
        {/* Top navigation */}
        <div className=" py-14 flex flex-col gap-5">
        {/* Logo */}
        <div className="mb-6 md:mb-0">
          <Link href="/" className="text-2xl font-bold text-purple-800">Zouka Coach
          </Link>
        </div>
        {/* Nav links */}
        <nav className="flex flex-wrap justify-center md:justify-start space-x-6 text-[#535862]">
          <Link href="#" className="hover:text-gray-900">Overview</Link>
          <Link href="#" className="hover:text-gray-900">Features</Link>
          <Link href="#" className="hover:text-gray-900">Pricing</Link>
          <Link href="#" className="hover:text-gray-900">Careers</Link>
          <Link href="#" className="hover:text-gray-900">Help</Link>
          <Link href="#" className="hover:text-gray-900">Privacy</Link>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className=" py-8 border-t border-gray-200 flex flex-col md:flex-row items-center gap-5 hover:text-gray-700 text-[#717680] text-sm">
        <p>© 2025 Zoukacoach. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0 justify-center md:justify-end">
          <Link href="#"><p className="hover:text-gray-700 text-[#717680]">Terms</p></Link>
          <Link href="#"><p className="hover:text-gray-700 text-[#717680]">Privacy</p></Link>
          <Link href="#"><p className="hover:text-gray-700 text-[#717680]">Cookies</p></Link>
        </div>
      </div>
</div>
    </footer>
  );
}
