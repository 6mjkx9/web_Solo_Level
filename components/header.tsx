"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  { name: "Головна", href: "#hero" },
  { name: "Персонажі", href: "#characters" },
  { name: "Сюжет", href: "#story" },
  { name: "Галерея", href: "#gallery" },
  { name: "Контакти", href: "#contact" },
]

export default function Header() {
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate logo on load
    gsap.from(logoRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power3.out",
    })
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div ref={logoRef} className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-2">
            <span className="text-primary-foreground font-bold">SL</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Solo Leveling
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="text-foreground/80 hover:text-primary transition-colors relative group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </button>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col space-y-4 mt-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-foreground/80 hover:text-primary transition-colors py-2"
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}