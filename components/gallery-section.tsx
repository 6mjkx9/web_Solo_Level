"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { X } from 'lucide-react'

const galleryImages = [
  {
    id: 1,
    src: "/images/Shadows.jpg",
    alt: "Сон Джін-У використовує свої сили",
    width: 720,
    height: 1280,
  },
  {
    id: 2,
    src: "/images/Army of shadows.jpg",
    alt: "Армія тіней Джін-У",
    width: 400,
    height: 600,
  },
  {
    id: 3,
    src: "/images/Battle with the monarch.jpg",
    alt: "Битва з монархом",
    width: 600,
    height: 400,
  },
  {
    id: 4,
    src: "/images/Guild 'Shadow of Monarch'.jpg",
    alt: "Гільдія 'Тіні Монарха'",
    width: 500,
    height: 500,
  },
  {
    id: 5,
    src: "/images/Army of shadows2.jpg",
    alt: "Джін-У та його тіні",
    width: 600,
    height: 400,
  },
  {
    id: 6,
    src: "/images/Chhah ha-in in battle.jpg",
    alt: "Чха Хе-Ін в бою",
    width: 400,
    height: 600,
  },
]

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedImage, setSelectedImage] = useState<(typeof galleryImages)[0] | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Animate gallery items
      gsap.from(".gallery-item", {
        opacity: 0,
        scale: 0.8,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const openModal = (image: (typeof galleryImages)[0]) => {
    setSelectedImage(image)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setSelectedImage(null)
    document.body.style.overflow = "auto"
  }

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="min-h-screen py-20 bg-gradient-to-b from-background/90 to-background"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Галерея</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className="gallery-item relative overflow-hidden rounded-lg border border-border group cursor-pointer"
              onClick={() => openModal(image)}
            >
              <div className="aspect-square sm:aspect-auto overflow-hidden">
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-center px-4">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={closeModal}>
            <div className="relative max-w-4xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={selectedImage.src || "/placeholder.svg"}
                alt={selectedImage.alt}
                className="max-h-[80vh] max-w-full object-contain"
              />
              <div className="bg-black/70 p-3 absolute bottom-0 left-0 right-0">
                <p className="text-white text-center">{selectedImage.alt}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}