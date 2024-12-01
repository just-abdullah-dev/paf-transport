import { Phone, Mail, MapPin } from 'lucide-react'
import Button from '../../utils/Button'
import Link from 'next/link'

export default function Contact() {
  return (
    <section className="py-20 bg-white" id="contact">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">Get in Touch</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-primary">Contact Information</h3>
            <div className="space-y-4">
            <Link target='_blank' href={"tel:+921234567890"} className="flex items-center text-[#292F36]">
                <Phone className="w-5 h-5 mr-2 text-[#4ECDC4]" />
                +92 123 456 7890
              </Link>
              <Link target='_blank' href={"mailto:info@paf-iast.edu.pk"} className="flex items-center text-[#292F36]">
                <Mail className="w-5 h-5 mr-2 text-[#4ECDC4]" />
                info@paf-iast.edu.pk
              </Link>
              <Link target='_blank' href={"https://maps.app.goo.gl/zdXnPDWVNJCCyNhG7"} className="flex items-center text-[#292F36]">
                <MapPin className="w-5 h-5 mr-2 text-[#4ECDC4]" />
                PAF-IAST, Mang, Haripur, Pakistan
              </Link>
            </div>
            <div className="mt-16">
              <h3 className="text-2xl font-semibold mb-6 text-primary">Office Hours</h3>
              <p className="text-[#292F36]">Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p className="text-[#292F36]">Saturday - Sunday: Closed</p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">Send us a Message</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#292F36]">Name</label>
                <input type="text" id="name" name="name" required className="mt-1 block inputTag w-full" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#292F36]">Email</label>
                <input type="email" id="email" name="email" required className="mt-1 block inputTag w-full" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#292F36]">Subject</label>
                <input type="text" id="subject" name="subject" required className="mt-1 block inputTag w-full" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#292F36]">Message</label>
                <textarea id="message" name="message" rows={4} required className="mt-1 block inputTag w-full" />
              </div>
              <Button type="submit" className={" w-full "}>
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

