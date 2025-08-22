import { 
  TruckIcon, 
  MapPinIcon, 
  ClockIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline'

export default function Services() {
  const services = [
    {
      icon: TruckIcon,
      title: 'Daily Trips to/from Abuja',
      description: 'Regular scheduled trips between major cities with comfortable seating and air conditioning.',
      features: ['Air-conditioned buses', 'Professional drivers', 'Scheduled departures']
    },
    {
      icon: MapPinIcon,
      title: 'Car Hire & Charter Services',
      description: 'Private vehicle rentals and charter services for groups and special occasions.',
      features: ['Flexible scheduling', 'Group discounts', 'Professional chauffeurs']
    },
    {
      icon: ClockIcon,
      title: 'Airport Pickup & Drop-off',
      description: 'Reliable airport transfer services with on-time guarantee and luggage assistance.',
      features: ['24/7 availability', 'Flight tracking', 'Meet & greet service']
    },
    {
      icon: ShieldCheckIcon,
      title: 'Haulage Services',
      description: 'Secure cargo and freight transportation across Nigeria with tracking and insurance.',
      features: ['Cargo insurance', 'Real-time tracking', 'Secure handling']
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Transportation Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive transportation solutions designed for your comfort, 
            safety, and convenience across Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="card text-center group hover:scale-105 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                <service.icon className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {service.title}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                    <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Travel with Us?
            </h3>
            <p className="text-gray-600 mb-8">
              Experience the difference with our modern fleet and professional service. 
              Book your trip today and travel in comfort.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/trips" className="btn-primary">
                View Available Trips
              </a>
              <a href="/branches" className="btn-secondary">
                Find Our Offices
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
