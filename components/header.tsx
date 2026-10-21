"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/programs", label: "Our Programs" },
    { href: "/devotional", label: "Devotional" },
    { href: "/gallery", label: "Gallery" },
    { href: "/books", label: "Books" },
    { href: "/contact", label: "Contact" },
    { href: "/donate", label: "Donate" },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Image
            loading="eager"
            src="/imgs/ekklisa-elite.jpeg"
            alt="Repairer of the Breach"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg">Ekklesia Elite</span>
            <span className="text-gray-900 text-xs">
              Repairer of the Breach
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-gray-700 hover:text-purple-600 transition-colors font-medium text-sm ${
                pathname === item.href ? "text-purple-600" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        {/* <div className="hidden md:block">
          <Link href="/contact">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Get Started
            </Button>
          </Link>
        </div> */}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="flex flex-col gap-4 px-6 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {/* <Link href="/contact" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Get Started
              </Button>
            </Link> */}
          </div>
        </div>
      )}
    </header>
  );
}
