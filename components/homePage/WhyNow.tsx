import React from "react";
import Image from "next/image";

export default function WhyNow() {
  return (
    <section className="section-width margin-top margin-bottom">
      <div className="">
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <span className="text-sm text-purple-600 font-medium">Why now?</span>
          <h2 className="mt-2 sm:mt-4 text-black">
            Your yesterday shaped today.
            <br className="hidden md:block" />
            Your today is shaping tomorrow.
          </h2>
          <p className="mt-2 sm:mt-4 text-gray-700 max-w-4xl">
            Most people wait for clarity to act. But clarity comes from{" "}
            <em>action</em>.<br className="hidden md:block" />
            If you're stuck in overthinking, comparison, or low self-worth—this
            is your sign to interrupt the cycle.
          </p>
        </div>

        {/* Content grid - changes from stacked to side-by-side layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Text column */}
          <div className="w-full lg:w-1/2">
            {/* Item 1 */}
            <div className="flex mb-8">
              <div className="w-[3px] bg-purple-600 rounded-full mr-4 mb-2 flex-shrink-0" />
              <div>
                <h6 className="text-lg font-semibold text-gray-900">
                  Join us weekly
                </h6>
                <ul className="space-y-2 text-gray-600 mt-2">
                  {[
                    "Break free from limiting patterns",
                    "Take intentional steps toward your goals",
                    "Master your time, energy, and focus",
                    "Shape the future you're ready to live",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-sm md:text-base"
                    >
                      <span className="text-black mr-2 flex-shrink-0">✔</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex mb-8">
              <div className="w-[3px] bg-purple-600 rounded-full mr-4 mb-2 flex-shrink-0" />
              <div>
                <h6 className="text-lg font-semibold text-gray-900">
                  Group Training and Mentoring
                </h6>
                <p className="mt-2 text-gray-600 text-sm md:text-base">
                  An all-in-one customer service platform that helps you balance
                  everything your customers need to be happy.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex">
              <div className="w-[3px] bg-purple-600 rounded-full mr-4 mb-2 flex-shrink-0" />
              <div>
                <h6 className="text-lg font-semibold text-gray-900">
                  Learn about self and transformation happens
                </h6>
                <p className="mt-2 text-gray-600 text-sm md:text-base">
                  Measure what matters with Untitled's easy-to-use reports. You
                  can filter, export, and drilldown on the data in a couple
                  clicks.
                </p>
              </div>
            </div>
          </div>

          {/* Image column - full width on mobile, half width on desktop */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-full w-full overflow-hidden shadow-lg">
              <Image
                src="/images/home/whynow.png"
                alt="Coaching session"
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
