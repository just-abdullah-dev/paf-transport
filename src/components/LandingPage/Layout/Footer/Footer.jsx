import Button from '@/components/utils/Button'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-primary text-white relative">
    <div className="container mx-auto max-w-7xl px-8 xl:px-0 pt-10 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">PAF Transport</h3>
          <p className="text-sm text-gray-300">
            Providing reliable and efficient transportation solutions since 2024.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className=" text-gray-300 hover:text-secondary transition-colors">About Us</Link></li>
            <li><Link href="/services" className=" text-gray-300 hover:text-secondary transition-colors">Our Services</Link></li>
            <li><Link href="/contact" className=" text-gray-300 hover:text-secondary transition-colors">Contact</Link></li>
            <li><Link href="/terms" className=" text-gray-300 hover:text-secondary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
          <p className="text-sm mb-4 text-gray-300">Stay updated with our latest news and offers.</p>
          <Button className=" text-gray-300 ">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
      <div className=' w-full absolute border border-white' />
      <div className="mt-8 pb-6 text-gray-300 text-center text-sm">
        <p>&copy; 2024 PAF Transport. All rights reserved.</p>
      </div>
  </footer>
  )
}
