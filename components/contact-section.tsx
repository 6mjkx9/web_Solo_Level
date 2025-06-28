"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Instagram, Twitter, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
  general?: string
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Анімація форми
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

      // Анімація соціальних іконок
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Валідація імені
    if (!formData.name.trim()) {
      newErrors.name = "Ім'я є обов'язковим"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Ім'я повинно містити принаймні 2 символи"
    }

    // Валідація email
    if (!formData.email.trim()) {
      newErrors.email = "Email є обов'язковим"
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Невірний формат email"
      }
    }

    // Валідація повідомлення
    if (!formData.message.trim()) {
      newErrors.message = "Повідомлення є обов'язковим"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Повідомлення повинно містити принаймні 10 символів"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Очищаємо помилку для поля, яке редагується
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrors({})

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus("success")
        setSubmitMessage("Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим часом.")
        setFormData({ name: "", email: "", message: "" })

        // Автоматично приховуємо повідомлення через 5 секунд
        setTimeout(() => {
          setSubmitStatus("idle")
          setSubmitMessage("")
        }, 5000)
      } else {
        setSubmitStatus("error")
        setSubmitMessage(result.error || "Виникла помилка при відправці повідомлення")

        // Приховуємо повідомлення про помилку через 5 секунд
        setTimeout(() => {
          setSubmitStatus("idle")
          setSubmitMessage("")
        }, 5000)
      }
    } catch (error) {
      console.error("Network error:", error)
      setSubmitStatus("error")
      setSubmitMessage("Помилка мережі. Спробуйте ще раз.")

      setTimeout(() => {
        setSubmitStatus("idle")
        setSubmitMessage("")
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="min-h-screen py-20 relative">
      {/* Фонові елементи */}
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
          {/* Повідомлення про статус */}
          {submitStatus !== "idle" && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                submitStatus === "success"
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {submitStatus === "success" ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <p>{submitMessage}</p>
            </div>
          )}

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-border mb-10 opacity-0 translate-y-10"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Ім'я *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ваше ім'я"
                  className={errors.name ? "border-red-500 focus:border-red-500" : ""}
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ваш@email.com"
                  className={errors.email ? "border-red-500 focus:border-red-500" : ""}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Повідомлення *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ваше повідомлення..."
                  rows={5}
                  className={errors.message ? "border-red-500 focus:border-red-500" : ""}
                  disabled={isSubmitting}
                />
                {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Надсилання...
                  </div>
                ) : (
                  "Надіслати повідомлення"
                )}
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
