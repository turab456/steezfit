import HeroSection from '../../components/common/HeroSection'
import ContactFormSection from './components/ContactForm'
import ContactStatsBar from './components/ContactStats'
const index = () => {
  return (
    <div>
        <HeroSection
        title='Contact Us'
        subtitle='This is contact us'/>
        <ContactFormSection/>
        <ContactStatsBar/>
      
    </div>
  )
}

export default index
