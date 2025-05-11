// app/components/Offerings.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut } from '@clerk/nextjs';

export default function Offerings() {
  const offerings = [
    {
      title: 'Weekly live classes',
      desc: `Step into our weekly live Zoom sessions—a space for clarity, growth, and unstoppable momentum. Together, we build the mindset and habits to design the life you truly want.`,
    },
    {
      title: 'Life coaching',
      desc: `Every answer you seek is already within you. Through powerful coaching, we help you unlock it, live it, and lead with it.`,
    },
    {
      title: 'Mentoring/Training',
      desc: `Grow faster with the right guidance. Our mentoring and training programs are tailored to help you build clarity, confidence, and real-world results for yourself or your team.`,
    },
    {
      title: 'Big dreams need steady steps',
      desc: `At Zouka Coach, we walk with you—keeping you focused, consistent, and accountable to your highest vision.`,
    },
    {
      title: '6-phase meditation',
      desc: `The 6-Phase Meditation is not about emptying your mind, it's about aligning it. At Zouka Coach, we guide you to clarity, inner peace, and a life driven by purpose.`,
    },
  ];

  return (
    <section className="section-width mt-10 mb-10 px-4 sm:px-6 lg:px-8">
      <div className="py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div>
            <span className="text-sm text-[#6941C6] font-medium">What we offer</span>
            <h2 className="mt-2 text-black">
              Your weekly anchor for clarity &amp; momentum
            </h2>
            <p className="mt-4 text-[#535862] ">
              Our offerings are designed to meet you where you are and gently move you
              forward.
            </p>
          </div>
          <SignedOut>

            <Link
              href="/sign-in"
              className="w-full sm:w-auto text-center py-2 px-4 bg-[#4D2E82] text-white font-medium rounded-lg shadow-inner shadow-[#2a1d5c] hover:bg-[#5f3791] transition"
            >
              Join the community
            </Link>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashBoard"
              className="w-full sm:w-auto text-center py-2 px-4 bg-[#4D2E82] text-white font-medium rounded-lg shadow-inner shadow-[#2a1d5c] hover:bg-[#5f3791] transition"
            >
              Go to Dashboard
            </Link>

          </SignedIn>
        </div>

        {/* Offerings grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mt-12">
          {offerings.map(({ title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <img src="/images/mission/bar.svg" alt="bar" className='h-32' />
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#553888]">{title}</h3>
                <p className="mt-2 text-[#535862] ">
                  {desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
