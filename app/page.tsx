import CtaSection from '@/components/homePage/CtaSection'
import Footer from '@/components/homePage/Footer'
import Hero from '@/components/homePage/Hero'
import MissionVision from '@/components/homePage/MissionVision'
import Offerings from '@/components/homePage/Offerings'
import TestimonialCarousel from '@/components/homePage/TestimonialCarousel'
import WhyNow from '@/components/homePage/WhyNow'
import React from 'react'

const page = () => {
  return (
    <>
    <Hero/>
    <div className="bg-[url('/images/home/vector.svg')]">
    <MissionVision/>
    <Offerings/>
    </div>
    <TestimonialCarousel/>
    <WhyNow/>
    <CtaSection/>
    <Footer/>
    </>
  )
}

export default page
