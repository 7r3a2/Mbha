'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const services = [
    { id: 1, image: '/images/main-card 1.png', title: 'Courses' },
    { id: 2, image: '/images/main-card 2.png', title: 'Services' },
    { id: 3, image: '/images/main-card 3.png', title: 'Resources' },
    { id: 4, image: '/images/main-card 4.png', title: 'Support' },
  ];

  const courses = [
    { id: 1, image: '/images/internal med course.png', title: 'Internal Med' },
    { id: 2, image: '/images/surgery course.png', title: 'Surgery' },
    { id: 3, image: '/images/gyne course.png', title: 'Obs & Gyne' },
    { id: 4, image: '/images/PEDIATRICS course.png', title: 'Pediatrics' },
  ];

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % services.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, services.length]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1E1E1E]/95 backdrop-blur-md border-b border-gray-800/50 shadow-xl">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-12 h-12 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Image 
                src="/images/logo.png" 
                alt="MBHA Logo" 
                width={48} 
                height={48} 
                className="w-12 h-12 object-contain"
              />
            </div>
            <span className="text-white font-bold text-3xl tracking-wide group-hover:text-[#3A8431] transition-colors duration-300">MBHA</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <button
              onClick={() => scrollToSection('home')}
              className="text-white hover:text-[#3A8431] transition-all duration-300 font-medium text-xl relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3A8431] group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-white hover:text-[#3A8431] transition-all duration-300 font-medium text-xl relative group"
            >
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3A8431] group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection('courses')}
              className="text-white hover:text-[#3A8431] transition-all duration-300 font-medium text-xl relative group"
            >
              Courses
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3A8431] group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-white hover:text-[#3A8431] transition-all duration-300 font-medium text-xl relative group"
            >
              Contact Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#3A8431] group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-gradient-to-r from-[#3A8431] to-[#2d6a27] text-white px-6 py-3 rounded-xl hover:from-[#2d6a27] hover:to-[#1e4a1e] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-[#3A8431]/20"
            >
              Login
            </button>
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-[#3A8431] transition-colors duration-300"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#1E1E1E]/95 backdrop-blur-md border-t border-gray-800/50">
            <div className="container mx-auto px-6 py-4">
              <nav className="flex flex-col space-y-4">
                <button
                  onClick={() => {
                    scrollToSection('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-[#3A8431] transition-all duration-300 font-medium text-lg text-left py-2"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    scrollToSection('services');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-[#3A8431] transition-all duration-300 font-medium text-lg text-left py-2"
                >
                  Services
                </button>
                <button
                  onClick={() => {
                    scrollToSection('courses');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-[#3A8431] transition-all duration-300 font-medium text-lg text-left py-2"
                >
                  Courses
                </button>
                <button
                  onClick={() => {
                    scrollToSection('contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-[#3A8431] transition-all duration-300 font-medium text-lg text-left py-2"
                >
                  Contact Us
                </button>
                <button
                  onClick={() => {
                    window.location.href = '/login';
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-[#3A8431] to-[#2d6a27] text-white px-6 py-3 rounded-xl hover:from-[#2d6a27] hover:to-[#1e4a1e] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-[#3A8431]/20 w-full text-center"
                >
                  Login
                </button>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 min-h-screen flex items-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E1E1E] via-[#1E1E1E] to-[#2A2A2A]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
                Welcome to MBHA
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl text-right" dir="rtl" style={{ lineHeight: '1.8', textAlign: 'justify' }}>
                منصة تعليمية متكاملة تهدف إلى تهيئة الطلبة للامتحانات الوزارية الخاصة بوزارة التعليم العراقية، من خلال كورسات شاملة تغطي المواد الأساسية، وأسئلة تم تجميعها من المصادر الرسمية المعتمدة، بالإضافة إلى اختبارات وزارية سابقة لمساعدة الطلبة على فهم نمط الأسئلة والاستعداد الفعال للامتحان النهائي.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="bg-gradient-to-r from-[#3A8431] to-[#2d6a27] text-white px-8 py-4 rounded-xl hover:from-[#2d6a27] hover:to-[#1e4a1e] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-[#3A8431]/20"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="w-96 h-96 bg-gradient-to-br from-[#3A8431] to-[#2d6a27] rounded-full flex items-center justify-center relative shadow-2xl group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src="/images/hero main page.png"
                    alt="Hero"
                    width={350}
                    height={350}
                    className="object-contain w-full h-full z-10"
                    priority
                  />
                  {/* Sparkle icons around the circle */}
                  <div className="absolute -top-4 -left-4 w-6 h-6 bg-white rounded-full shadow-lg animate-pulse"></div>
                  <div className="absolute -top-4 -right-4 w-6 h-6 bg-white rounded-full shadow-lg animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-white rounded-full shadow-lg animate-pulse"></div>
                  <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-white rounded-full shadow-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Just Photos Sliding */}
      <section id="services" className="py-32 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            Our Services
          </h2>
          
          <div className="max-w-6xl mx-auto">
            {/* Pure Photo Slider */}
            <div 
              className="relative overflow-hidden rounded-3xl"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {services.map((service, index) => (
                  <div key={service.id} className="w-full flex-shrink-0">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={1200}
                      height={600}
                      className="w-full h-[600px] object-cover"
                      priority
                    />
                  </div>
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <button 
                onClick={() => setCurrentSlide((prev) => (prev - 1 + services.length) % services.length)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => setCurrentSlide((prev) => (prev + 1) % services.length)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Slider Indicators */}
            <div className="flex justify-center space-x-3 mt-8">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-[#3A8431] scale-125 shadow-lg' 
                      : 'bg-white/50 hover:bg-white/70 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-32 bg-gradient-to-b from-[#2A2A2A] to-[#1E1E1E] relative">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            Courses
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {courses.map((course) => (
              <div key={course.id} className="group">
                <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1E1E1E] border-4 border-[#3A8431] rounded-3xl p-8 hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-[#3A8431]/20 group-hover:border-[#2d6a27]">
                  <div className="flex justify-center mb-6">
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={400}
                      height={250}
                      className="object-contain rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white text-center mb-6">
                    {course.title}
                  </h3>
                  <div className="text-center">
                    <button className="bg-gradient-to-r from-[#3A8431] to-[#2d6a27] text-white px-8 py-4 rounded-xl hover:from-[#2d6a27] hover:to-[#1e4a1e] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Contact Us Section */}
      <section id="contact" className="py-32 bg-gradient-to-b from-[#1E1E1E] to-[#2A2A2A] relative">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            Contact Us
          </h2>
          
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-[#3A8431] to-[#2d6a27] rounded-2xl p-4 flex space-x-6 shadow-2xl">
              <a
                href="https://t.me/Haider3laaa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:scale-125 transition-all duration-300 p-3 rounded-full hover:bg-white/10 hover:shadow-lg"
              >
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/7r3laa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:scale-125 transition-all duration-300 p-3 rounded-full hover:bg-white/10 hover:shadow-lg"
              >
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/9647739887598"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:scale-125 transition-all duration-300 p-3 rounded-full hover:bg-white/10 hover:shadow-lg"
              >
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Updated with Copyright */}
      <footer className="bg-gradient-to-r from-[#3A8431] to-[#2d6a27] py-6 shadow-2xl">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-white text-lg font-semibold">
              © MBHA 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 