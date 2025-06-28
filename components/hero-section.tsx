"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Створюємо анімацію тіньових елементів
      gsap.to(".shadow-element", {
        x: "random(-20, 20)",
        y: "random(-20, 20)",
        opacity: "random(0.2, 0.5)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.1,
      })

      // Анімація заголовку та кнопки
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.5,
      })

      gsap.from(buttonRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 1,
      })

      // Анімація пульсації кнопки
      gsap.to(buttonRef.current, {
        boxShadow: "0 0 15px rgba(124, 58, 237, 0.8)",
        repeat: -1,
        yoyo: true,
        duration: 1.5,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const scrollToCharacters = () => {
    const element = document.querySelector("#characters")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
    >
      {/* Тіньові елементи для фонової анімації */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="shadow-element absolute w-32 h-32 rounded-full bg-purple-900/20 blur-3xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 text-center z-10">
        <h2
          ref={titleRef}
          className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"
        >
          Стань найсильнішим мисливцем!
        </h2>
        <Button
          ref={buttonRef}
          onClick={scrollToCharacters}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
        >
          Дізнатися більше
        </Button>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-primary" />
        </div>
      </div>
    </section>
  )
}
