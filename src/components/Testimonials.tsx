import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image';
import React, { useState } from 'react'

import testarchana from '../images/test/testarchana.png'
import testdiv from '../images/test/testdiv.png'
import testdivyara from '../images/test/testdivyara.jpg'
import testkanu from '../images/test/testkanu.jpeg'
import testpunno from '../images/test/testpunno.jpg'
import testsaloni from '../images/test/testsaloni.jpg'
import testshemai from '../images/test/testshemai.jpg'



const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const testimonials = [
    { img: testarchana, name: "Archana Singh", text: "The hostel provides a secure environment with 24/7 CCTV surveillance, friendly security staff, delicious food, WiFi, and cleanliness in bathrooms and common spaces." },
    { img: testdiv, name: "Diya Varshney", text: "The hostel is a safe and friendly place where students feel at home. It's full of warmth and helps build close friendships. The rooms are comfortable, and the staff is caring and helpful. It's a secure place where everyone can study and enjoy their time." },
    { img: testsaloni, name: "Saloni Singh", text: "The hostel provides all necessities and facilities, with serene surroundings, a ragging-free environment, high security, and a market location with easy access to everything. Highly recommend!" },
    { img: testpunno, name: "Purnima Tyagi", text: "Savitribai Phule Girls Hostel is exceptional, offering an ideal living environment with cleanliness, security, amenities, and discipline. Highly recommended for students seeking a secure and convenient place to stay." },
    { img: testdivyara, name: "Divya Rajput", text: "This hostel is absolutely superb. The staff are friendly and helpful, and it provides all necessary facilities for a comfortable stay. It also offers a familiar environment to everyone." },
    { img: testshemai, name: "Shemaila Parveen", text: "The hostel has comfortable rooms, great food, friendly staff, and all the necessary facilities like strong Wi-Fi, clean showers and toilets, and a fully fitted kitchen. The location is great, with easy access to anywhere." },
    { img: "", name: "Devyanshi Singh", text: "The girls' hostel exceeded my expectations. The environment is perfect for balancing academic focus and personal well-being. The staff is supportive, and the study areas are well-equipped and quiet. Nutritious meals and a strong sense of community make it a welcoming place." },
    { img: testkanu, name: "Kanu Priya", text: "This hostel provides a secure and welcoming space, fostering friendship and community. With a safe and secure environment, students can focus on their studies and personal growth while enjoying a homely vibe." },
    { img: "", name: "Priyanka Chauhan", text: "This hostel is highly recommended. The staff are friendly, helpful, and go the extra mile. The facilities are cleaned daily, and the hostel provides a safe, secure, and peaceful environment. It's like a second home in an unknown city." }
  ];


  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">What Our Students Say</h2>
        <div className="max-w-4xl mx-auto bg-white p-12 rounded-xl shadow-lg relative">
          <button onClick={prevTestimonial} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextTestimonial} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="text-center">
            {
              testimonials[currentTestimonial].img &&
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-8">
                <Image width={100} height={100} objectFit='cover' src={testimonials[currentTestimonial].img} alt={testimonials[currentTestimonial].name} />
              </div>
            }
            <p className="md:text-2xl text-lg mb-8 text-gray-700 italic">&quot;{testimonials[currentTestimonial].text}&quot;</p>
            <p className="font-semibold text-xl text-gray-800">{testimonials[currentTestimonial].name}</p>
          </div>
        </div>
      </div>
    </section>)
}

export default Testimonials