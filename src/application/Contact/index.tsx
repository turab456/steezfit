import HeroSection from '../../components/common/HeroSection'
import ContactFormSection from './components/ContactForm'
import ContactStatsBar from './components/ContactStats'
const index = () => {
  return (
    <div>
        <HeroSection
        title='Contact Us'
        subtitle='Got a query? Drop us a message and we’ll get back soon.'/>
        <ContactFormSection/>
        <ContactStatsBar/>
      
    </div>
  )
}

export default index
