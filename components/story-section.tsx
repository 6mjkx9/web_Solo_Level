"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const storyHighlights = [
  "Сон Джін-У отримує таємничу силу 'Системи'",
  "Перетворення з найслабшого мисливця E-рангу на легенду",
  "Створення власної гільдії 'Тіні Монарха'",
  "Битва з Монархами та Правителями",
  "Становлення Королем Тіней",
]

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const highlightsRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Parallax effect for background shadows
      gsap.to(".shadow-parallax", {
        y: (i, el) => -ScrollTrigger.maxScroll(window) * Number.parseFloat(el.dataset.speed || "0.1"),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // Animate story text
      ScrollTrigger.create({
        trigger: textRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(textRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          })
        },
      })

      // Animate story highlights
      const highlights = gsap.utils.toArray(".story-highlight")
      highlights.forEach((highlight, i) => {
        gsap.from(highlight as Element, {
          opacity: 0,
          x: i % 2 === 0 ? -50 : 50,
          scrollTrigger: {
            trigger: highlight as Element,
            start: "top 85%",
            end: "bottom 70%",
            toggleActions: "play none none reverse",
          },
          duration: 0.8,
          delay: i * 0.1,
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="story" ref={sectionRef} className="min-h-screen py-20 relative overflow-hidden">
      {/* Parallax shadow elements */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="shadow-parallax absolute w-64 h-64 rounded-full bg-purple-900/10 blur-3xl"
          data-speed={(0.1 + i * 0.05).toString()}
          style={{
            left: `${(i * 20) % 100}%`,
            top: `${(i * 15) % 100}%`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Сюжет</span>
        </h2>

        <div
          ref={textRef}
          className="max-w-3xl mx-auto bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-border mb-12 opacity-0 translate-y-10"
        >
          <p className="text-card-foreground/90 leading-relaxed">
            Десять років тому у світі з'явилися "Ворота" - портали, що з'єднують наш світ із світом монстрів. Разом з
            ними з'явилися люди, які отримали надприродні здібності - "Мисливці". Сон Джін-У - найслабший мисливець
            E-рангу, який ледве зводить кінці з кінцями, працюючи в найнебезпечніших підземеллях.
          </p>
          <p className="text-card-foreground/90 leading-relaxed mt-4">
            Після смертельного інциденту в подвійному підземеллі, де його команда зрадила його, Джін-У отримує унікальну
            силу "Системи", яка дозволяє йому зростати в силі, виконуючи квести та підвищуючи рівень. З цією силою він
            починає свій шлях від найслабшого до найсильнішого мисливця, розкриваючи таємниці світу Воріт, Монархів та
            Правителів.
          </p>
        </div>

        <ul ref={highlightsRef} className="max-w-2xl mx-auto space-y-4">
          {storyHighlights.map((highlight, index) => (
            <li
              key={index}
              className="story-highlight flex items-center bg-card/60 backdrop-blur-sm p-4 rounded-lg border border-border shadow-md"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-4 shrink-0">
                <span className="text-primary-foreground font-bold">{index + 1}</span>
              </div>
              <p className="text-card-foreground">{highlight}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
