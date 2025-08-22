import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt="TechLogix Logo"
                  fill
                  className="rounded-full object-cover"
                  sizes="40px"
                  quality={90}
                />
              </div>
              <span className="text-xl font-bold">e-Bus by TechLogix</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted partner for comfortable and reliable bus transportation 
              services across Nigeria. Experience modern booking with safety and convenience.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://wa.me/2348107338827" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 transition-colors rounded-full p-2 block"
                title="Contact us on WhatsApp"
              >
                <Image
                  src="/images/whatsapp.png"
                  alt="Contact us on WhatsApp"
                  width={24}
                  height={24}
                  className="filter brightness-0 invert"
                  quality={90}
                />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61575500397143" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-full p-2 block"
                title="Follow us on Facebook"
              >
                <Image
                  src="/images/facebook.png"
                  alt="Follow us on Facebook"
                  width={24}
                  height={24}
                  className="filter brightness-0 invert"
                  quality={90}
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/trips" className="text-gray-300 hover:text-white transition-colors">
                  View Trips
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-gray-300 hover:text-white transition-colors">
                  Book a Trip
                </Link>
              </li>
              <li>
                <Link href="/branches" className="text-gray-300 hover:text-white transition-colors">
                  Our Branches
                </Link>
              </li>
              <li>
                <Link href="/find-ticket" className="text-gray-300 hover:text-white transition-colors">
                  Find Ticket
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Daily Trips to/from Abuja</li>
              <li>Car Hire Services</li>
              <li>Airport Pickup & Drop-off</li>
              <li>Haulage Services</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 TechLogix Solutions Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
