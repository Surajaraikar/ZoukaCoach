"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

interface Testimonial {
  text: string;
  name: string;
  role: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    text:
      "Clear Vibe gave me the structure I needed without overwhelming me. I feel like I’m finally steering my life in the right direction.",
    name: "Aanya",
    role: "Marketing Manager, ABC Corp",
    avatar: "/images/home/girl.svg",
  },
  {
    text:
      "Clear Vibe gave me the structure I needed without overwhelming me. I feel like I’m finally steering my life in the right direction.",
    name: "Aanya",
    role: "Marketing Manager, ABC Corp",
    avatar: "/images/home/girl.svg",
  },];

export default function TestimonialCarousel() {
  return (
    <section className="margin-top margin-bottom ">
      <div className='section-width'>
        <div className=" p-8 bg-[#FFFAFF] rounded-3xl">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={40}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
          >
            {testimonials.map((t, idx) => (
              <SwiperSlide key={idx} className=''>
                <div className="relative bg-[#FFFFFF] rounded-3xl p-10 md:p-12 flex flex-col items-center">
                  {/* Star rating */}
                  <div className="flex justify-center space-x-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-gray-900 text-xl">★</span>
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <p className="text-center text-lg md:text-2xl text-gray-800 mb-6 font-weight[200] w-2/3">
                    “{t.text}”
                  </p>

                  {/* Author info */}
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <h6 className="font-semibold text-gray-900">{t.name}</h6>
                      <p className=" text-[#535862] ">
                      {t.role}</p>
                    </div>
                  </div>


                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
