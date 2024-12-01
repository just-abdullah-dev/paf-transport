import React from 'react'
import Header from './Header/Header'
import Footer from './Footer/Footer'

export default function Layout({children}) {
  return (
    <div className=' bg-white'>
        <Header />
        <div className='h-[72px] w-full'/>
        {children}
        <Footer />
    </div>
  )
}
