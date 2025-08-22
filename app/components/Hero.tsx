'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slideImages = [
    {
      src: '/images/pic1.jpg',
      alt: 'Modern Bus Fleet - Comfortable seating and spacious interior'
    },
    {
      src: '/images/pic2.jpg',
      alt: 'Professional Service - Experienced and courteous drivers'
    },
    {
      src: '/images/pic3.jpg',
      alt: 'Clean Interior - Well-maintained and hygienic bus interior'
    },
    {
      src: '/images/pic4.jpg',
      alt: 'Safety First - Modern safety equipment and protocols'
    },
    {
      src: '/images/515503000_122125777136850013_6204647943194804784_n.jpg',
      alt: 'Bus Terminal - Modern terminal facilities'
    },
    {
      src: '/images/524133444_24263317243310404_1487806328901969944_n.jpg',
      alt: 'Customer Service - Excellent customer support'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [slideImages.length])

  return (
    <section className="relative bg-gradient-primary text-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 overflow-hidden">
      {/* Slideshow Background */}
      <div className="absolute inset-0">
        {slideImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
              quality={85}
            />
            {/* Blur overlay for text readability */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            {/* Additional gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-primary-800/60 to-primary-700/80"></div>
          </div>
        ))}
      </div>

      {/* Pattern overlay for texture */}
      <div className="absolute inset-0 opacity-5 z-10">
        <svg width="60" height="60" viewBox="0 0 60 60" className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="white" fillOpacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slideImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight text-shadow-lg">
            Modern Bus Transportation
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mt-1 sm:mt-2 text-blue-200 text-shadow-lg">
              Across Nigeria
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto text-blue-100 animate-slide-up px-4 sm:px-0 text-shadow-md">
            Experience comfortable, safe, and reliable travel with our modern fleet. 
            Book your journey online and travel with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link href="/trips" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 flex items-center space-x-2">
              <span>View Available Trips</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            
            <Link href="/book" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600">
              Book Now
            </Link>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Happy Passengers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Daily Trips</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">99%</div>
              <div className="text-blue-200">On-time Arrival</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}