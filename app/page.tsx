import Hero from './components/Hero'
import Services from './components/Services'
import TripSearch from './components/TripSearch'
import Gallery from './components/Gallery'
import FeaturedTrips from './components/FeaturedTrips'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <TripSearch />
      <Services />
      <FeaturedTrips />
      <Gallery />
    </div>
  )
}
