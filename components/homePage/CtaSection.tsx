"use client";

import React from 'react';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="bg-[url('/images/home/ready.svg')]  bg-center bg-cover  rounded-3xl section-width margin-bottom margin-top">
      <div className=" mx-auto text-center px-6 py-16 flex flex-col items-center justify-center">
        <h2 className=" text-[#4C2E84]">
          Ready to meet the next version of you?
        </h2>
        <p className="mt-4 text-[#5C4582] max-w-2xl">
          You don’t need to have it all figured out. You just need to start showing up for yourself—one step at a time.
        </p>
        <div className="mt-8 flex items-center justify-center">
        <Link
            href="/sign-in"
            className="
              block w-fit sm:w-fit 
               py-2 px-4 
              bg-white border border-gray-300 text-black font-medium 
              rounded-lg 
              shadow-inner shadow-[#d1d5db] 
              hover:bg-[#f0f0f0]
              text-center
            "
          >
            Join the community
          </Link>
        </div>
      </div>
    </section>
  );
}
