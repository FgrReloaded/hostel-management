"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Menu, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAdmin } from '@/actions/admin/auth'
import GalleryHome from '@/components/GalleryHome'
import Features from '@/components/Features'
import Image from 'next/image'
import Testimonials from '@/components/Testimonials'


export default function HostelLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [, setScrollPosition] = useState(0)
  const [sliderImages] = useState([
    "/hostel.jpeg",
    "/front.jpeg",
  ]);
  const [currentImage, setCurrentImage] = useState(0);
  const { data: session } = useSession()
  const navigate = useRouter();

  useEffect(() => {
    (async () => {
      const { error } = await getAdmin();
      if (error) {
        navigate.push("/setup-admin");
      }
    })()

    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((currentImage + 1) % sliderImages.length)
    }, 2500)

    return () => {
      clearInterval(interval)
    }
  }, [currentImage, sliderImages])

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className={`fixed w-full z-50 transition-all duration-300 bg-white/10  backdrop-blur-lg`}>
        <div className="container mx-auto px-4 py-1 flex justify-between items-center">
          <div className='flex md:gap-4 gap-2 items-center relative'>
            <Image src="/logo.webp" alt="Logo" width={80} height={80} objectFit="cover" />
            <Link href="/" className="md:text-3xl text-xl font-bold text-blue-800">Savitribai Phule Bhawan</Link>
          </div>
          {
            session ?
              <Link href={session.user?.role === "ADMIN" ? "/hostel/admin" : "/hostel"} className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-colors">
                <span>
                  Dashboard
                </span>
              </Link>
              :
              <div className='flex gap-2'>
                <Link href={"/login/admin"} className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-colors">
                  Admin Login
                </Link>
                <Link href={"/auth/login"} className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-colors">
                  Student Login
                </Link>
              </div>
          }
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden shadow-md">
            <nav className="flex flex-col space-y-4 p-4">
              {
                session ?
                  <Link href={session.user?.role === "ADMIN" ? "/hostel/admin" : "/hostel"} className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-colors">
                    <span>
                      Dashboard
                    </span>
                  </Link>
                  :
                  <div className='flex gap-2'>
                    <Link href={"/login/admin"} className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-colors">
                      Admin Login
                    </Link>
                    <Link href={"/auth/login"} className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-colors">
                      Student Login
                    </Link>
                  </div>
              }
            </nav>
          </div>
        )}
      </header>

      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black opacity-20 z-10"></div>
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sliderImages[currentImage]}
            alt="Hostel exterior"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center max-w-4xl mx-auto px-4 bg-transparent">
          <h1 className="text-5xl md:text-7xl font-bold  mb-6 leading-tight">Experience Comfort and Community</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">Discover a home away from home at SBP Bhawan, where unforgettable memories and lifelong friendships await.</p>
          <Link href="/auth/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors transform hover:scale-105">
            Register Now
          </Link>
        </div>
      </section>

      <Features />
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mx-auto md:w-4/5 w-full  text-center">
            <div className="bg-blue-500 p-8 rounded-xl transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <p className="text-6xl font-bold mb-4">82</p>
              <p className="text-2xl">Happy Residents</p>
            </div>
            <div className="bg-blue-500 p-8 rounded-xl transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <p className="text-6xl font-bold mb-4">09</p>
              <p className="text-2xl">Dedicated Staff</p>
            </div>
            <div className="bg-blue-500 p-8 rounded-xl transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <p className="text-6xl font-bold mb-4">4.8/5</p>
              <p className="text-2xl">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Explore Our Hostel</h2>
          <GalleryHome />
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Hostel Administration</h2>
          <div className="flex justify-center items-center flex-wrap gap-12">
            <div className="text-center order-2 md:order-1 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 p-6 rounded-xl">
              <Image width={200} height={200} objectFit='cover' src="/admins/warden.jpeg" alt="Staff member" className="rounded-full mx-auto mb-6 border-4 border-blue-500" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Prof. Archana Singh</h3>
              <p className="text-blue-600 mb-4">Warden</p>
            </div>
            <div className="text-center order-1 md:order-2 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 p-6 md:mb-32 rounded-xl">
              <Image width={250} height={250} objectFit='cover' src="/admins/vcmam.jpeg" alt="Staff member" className="rounded-full mx-auto mb-6 border-4 border-blue-500" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Prof. Anshu Rani</h3>
              <p className="text-blue-600 mb-4">Vice Chancellor, Dr. Bhimrao Ambedkar University ,Agra</p>
            </div>
            <div className="text-center order-3 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 p-6 rounded-xl">
              <Image width={200} height={200} objectFit='cover' src="/admins/assistwarden.png" alt="Staff member" className="rounded-full mx-auto mb-6 border-4 border-blue-500" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Dr. Ratna Pandey</h3>
              <p className="text-blue-600 mb-4">Assistant Warden</p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Contact Us</h2>
          <form className="max-w-2xl mx-auto bg-gray-100 p-12 rounded-xl shadow-lg">
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Your Name</label>
              <Input id="name" type="text" placeholder="Your Name" className="w-full" />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Your Email</label>
              <Input id="email" type="email" placeholder="Your Email Address" className="w-full" />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Your Message</label>
              <Textarea id="message" placeholder="Enter your message" className="w-full" rows={6} />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
              Send Message
            </Button>
          </form>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between md:flex-row flex-col gap-16 px-16">
            <div>
                <div className="flex items-center md:flex-row flex-col max-md:justify-center text-center mb-8 gap-4">
                <Image src="/logo.webp" alt="Logo" width={100} height={100} objectFit="cover" />
                <h3 className="text-2xl font-bold">Savitribai Phule Bhawan</h3>
              </div>
              <p className="mb-4 max-md:text-center">Your home away from home, where adventures begin and memories are made.</p>
              <div className="flex space-x-4 max-md:justify-center">
                <a href="#" className="text-white hover:text-blue-400 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-blue-400 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-blue-400 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div className='max-md:text-center'>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <p className="mb-2">Savitribai Phule Bhawan, 100 Capacity Girls Hostel,</p>
              <p className="mb-2">Dr Bhimrao Ambedkar University,</p>
              <p className='mb-2'>Swami Vivekanand Khandari Campus, Agra 282002 UP</p>
              <p className="mb-2">Phone: <a href='phone:9105969848'>+91 9105969848</a></p>
              <p>Email: <a href="mailto:100capacitygirlshostel@gmail.com">100capacitygirlshostel@gmail.com</a></p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Savitribai Phule Bhawan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}