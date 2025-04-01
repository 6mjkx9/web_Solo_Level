"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Instagram, Twitter, MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Animate form
      ScrollTrigger.create({
        trigger: formRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(formRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          })
        },
      })

      // Animate social icons
      gsap.from(".social-icon", {
        opacity: 0,
        scale: 0,
        stagger: 0.2,
        duration: 0.6,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".social-icons",
          start: "top 85%",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Повідомлення надіслано!",
        description: "Дякуємо за ваш відгук. Ми зв'яжемося з вами найближчим часом.",
      })
      setFormData({ name: "", email: "", message: "" })
    }, 1500)
  }

  return (
    <section id="contact" ref={sectionRef} className="min-h-screen py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background to-background/95" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-purple-900/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Контакти</span>
        </h2>

        <div className="max-w-3xl mx-auto">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-border mb-10 opacity-0 translate-y-10"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Ім'я
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ваше ім'я"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ваш@email.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Повідомлення
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ваше повідомлення..."
                  rows={5}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Надсилання..." : "Надіслати"}
              </Button>
            </div>
          </form>

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Слідкуйте за нами</h3>
            <div className="social-icons flex justify-center space-x-6">
              <a href="#" className="social-icon relative group" aria-label="Instagram">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-card border border-border group-hover:border-transparent transition-colors duration-300">
                  <Instagram className="h-5 w-5 text-foreground group-hover:text-white transition-colors duration-300" />
                </div>
              </a>
              <a href="#" className="social-icon relative group" aria-label="Twitter">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-card border border-border group-hover:border-transparent transition-colors duration-300">
                  <Twitter className="h-5 w-5 text-foreground group-hover:text-white transition-colors duration-300" />
                </div>
              </a>
              <a href="#" className="social-icon relative group" aria-label="Discord">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-card border border-border group-hover:border-transparent transition-colors duration-300">
                  <MessageSquare className="h-5 w-5 text-foreground group-hover:text-white transition-colors duration-300" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}