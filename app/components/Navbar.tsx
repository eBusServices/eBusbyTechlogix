'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Book Trip', href: '/trips' },
    { name: 'Branches', href: '/branches' },
    { name: 'Find Ticket', href: '/find-ticket' },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/images/logo.jpg"
                alt="TechLogix Logo"
                fill
                className="rounded-full object-cover"
                priority
                quality={90}
                sizes="40px"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gradient">
                e-Bus by TechLogix
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="nav-link text-sm xl:text-base"
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-3 xl:space-x-4">
              <Link href="/auth/login" className="nav-link text-sm xl:text-base">
                Login
              </Link>
              <Link href="/auth/register" className="btn-primary text-sm xl:text-base px-4 py-2 xl:px-6 xl:py-3">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <Link
                href="/auth/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="block mx-3 mt-2 btn-primary text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
