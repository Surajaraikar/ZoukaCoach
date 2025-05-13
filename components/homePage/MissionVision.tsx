"use client";

import React from "react";

export default function MissionVision() {
    return (
        <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden section-width margin-top">
            {/* Purple "blob" gradient */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at bottom, rgba(203,188,232,0.4), transparent 70%)",
                }}
            />

            {/* Content container */}
            <div className="relative z-10 w-full p-4 sm:p-6 md:p-8 lg:p-10">
                {/* Content area - responsive width */}
                <div className="w-full md:w-5/6 lg:w-2/3">
                    <span className="text-sm text-[#6941C6] font-medium">
                        Mission &amp; Vision
                    </span>
                    <h2 className="sm:mt-5 mt-2 text-black">
                        Elevate yourself. Elevate the world
                    </h2>
                    <p className="sm:mt-5 mt-2 text-[#535862]">
                        We believe in parallel growth and personal growth doesn't happen in
                        isolation. When you nurture your mind, your body, actions, and life
                        grow stronger, together with the world around you.
                    </p>
                    <div className="">
                        <h2
                            className=" sm:mt-5 mt-2 
    bg-gradient-to-br from-[#D0AED6] to-[#A383C1]
    bg-clip-text text-transparent
    leading-snug tracking-tight font-medium
  "
                        >
                            this is your space to grow
                            <br />
                            boldly, gently, and
                            <br />
                            meaningfully with others who
                            <br />
                            are on the same path.
                        </h2>

                    </div>

                </div>
            </div>
        </div>
    );
}