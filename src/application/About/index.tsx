
import Features from './components/Features'
import HeroSection from '../../components/common/HeroSection'
import Stats from '../Contact/components/ContactStats'
const index = () => {
  return (
    <div>
        <HeroSection title="About Us" subtitle="AESTHCO is a small, detail-obsessed team building clean, everyday essentials with a focus on comfort, quality, and calm aesthetics." />
        <Features />
        <Stats/>
      
    </div>
  )
}

export default index
