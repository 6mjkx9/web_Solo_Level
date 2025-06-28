"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import CharactersSection from "@/components/characters-section"
import StorySection from "@/components/story-section"
import GallerySection from "@/components/gallery-section"
import ContactSection from "@/components/contact-section"

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger)

    // Enable smooth scrolling animations
    const sections = document.querySelectorAll("section")
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleClass: { targets: section, className: "active" },
        once: true,
      })
    })

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <main ref={mainRef} className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />
      <HeroSection />
      <CharactersSection />
      <StorySection />
      <GallerySection />
      <ContactSection />
    </main>
  )
}
