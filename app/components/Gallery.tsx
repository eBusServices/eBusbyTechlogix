import Image from 'next/image'

export default function Gallery() {
  const galleryImages = [
    {
      src: '/images/pic1.jpg',
      alt: 'Modern Bus Fleet - Comfortable seating and spacious interior',
      title: 'Comfortable Seating'
    },
    {
      src: '/images/pic2.jpg',
      alt: 'Professional Service - Experienced and courteous drivers',
      title: 'Professional Drivers'
    },
    {
      src: '/images/pic3.jpg',
      alt: 'Clean Interior - Well-maintained and hygienic bus interior',
      title: 'Clean & Modern Interior'
    },
    {
      src: '/images/pic4.jpg',
      alt: 'Safety First - Modern safety equipment and protocols',
      title: 'Safety Equipment'
    },
    {
      src: '/images/515503000_122125777136850013_6204647943194804784_n.jpg',
      alt: 'Bus Terminal - Modern terminal facilities',
      title: 'Modern Terminals'
    },
    {
      src: '/images/524133444_24263317243310404_1487806328901969944_n.jpg',
      alt: 'Customer Service - Excellent customer support',
      title: 'Excellent Service'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Fleet & Facilities
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take a look at our modern buses, comfortable interiors, and 
            professional service that makes your journey memorable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative h-64 sm:h-72 lg:h-80">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index < 3}
                  quality={85}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg font-semibold">{image.title}</h3>
                  <p className="text-sm text-gray-200 mt-1">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Section */}
        <div className="mt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 italic mb-6">
                "Excellent service! The buses are comfortable, clean, and always on time. 
                The booking process is so easy and the staff are very professional."
              </blockquote>
              <cite className="text-gray-600 font-medium">
                - Sharon, Regular Passenger
              </cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
