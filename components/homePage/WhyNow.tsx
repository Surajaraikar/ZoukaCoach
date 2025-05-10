import React from 'react';
import Image from 'next/image';

export default function WhyNow() {
    return (
        <section className="margin-top margin-bottom bg-white section-width ">
            <div className=" items-center">
                {/* Text column */}
                <div>
                    <span className="text-sm text-purple-600 font-medium">
                        Why now?
                    </span>
                    <h2 className="mt-2 text-black">
                        Your yesterday shaped today.<br />
                        Your today is shaping tomorrow.
                    </h2>
                    <p className="mt-4 text-gray-700 text-base md:text-lg">
                        Most people wait for clarity to act. But clarity comes from <em>action</em>.<br />
                        If you’re stuck in overthinking, comparison, or low self-worth—this is your sign to interrupt the cycle.
                    </p>

                    <div className="mt-8 space-y-8">
                        {/* Item 1 */}

                    </div>
                </div>
            </div>

            <div className='flex w-full'>
                <div className=''>
                    <div className="flex mb-5">
                        <div className="w-1 bg-[#9E77ED] rounded-full mr-4 mb-2" />
                        <div className='w-1/2'>
                            <h6 className="text-gray-900">
                                Join us weekly                            </h6>
                            <ul className="space-y-2 text-[#535862] mt-2">
                                {[
                                    "Break free from limiting patterns",
                                    "Take intentional steps toward your goals",
                                    "Master your time, energy, and focus",
                                    "Shape the future you’re ready to live",
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start xl:text-lg md:text-base sm:text-sm text-xs font-medium leading-relaxed">
                                        <span className="text-black mr-2">✔</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex mb-5">
                        <div className="w-1 bg-[#9E77ED] rounded-full mr-4 mb-2" />
                        <div className='w-1/2'>
                            <h6 className="text-lg font-semibold text-gray-900">
                                Group Training and Mentoring
                            </h6>
                            <p className="mt-2 text-[#535862]">
                                An all-in-one customer service platform that helps you balance everything your customers need to be happy.
                            </p>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex">
                        <div className="w-1 bg-[#9E77ED] rounded-full mr-4 mb-2" />
                        <div className='w-2/3'>
                            <h6 className="text-lg font-semibold text-gray-900">
                                Manage your team with reports
                            </h6>
                            <p className="mt-2 text-[#535862]">
                                Measure what matters with Untitled’s easy-to-use reports. You can filter, export, and drilldown on the data in a couple clicks.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Image column */}
                <div className="flex justify-center lg:justify-end w-3/4">
                    <div className="w-full overflow-hidden shadow-lg">
                        <Image
                            src="/images/home/whynow.png"
                            alt="Coaching session"
                            width={1000}
                            height={1000}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
