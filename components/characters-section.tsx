"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const characters = [
  {
    id: 1,
    name: "Сон Джін-У",
    role: "Головний герой",
    description: "Колишній найслабший мисливець E-рангу, який отримав силу після інциденту в подвійному підземеллі.",
    image: "/images/sung-jin-woo.jpg",
    fullDescription:
      "Сон Джін-У був найслабшим мисливцем E-рангу, якого всі зневажали. Після майже смертельного інциденту в подвійному підземеллі, він отримує унікальну силу 'Системи', яка дозволяє йому зростати в силі, виконуючи квести та підвищуючи рівень. Його мета - стати найсильнішим мисливцем, щоб захистити свою родину та помститися тим, хто його зрадив.",
  },
  {
    id: 2,
    name: "Чха Хе-Ін",
    role: "S-ранг мисливець",
    description: "Одна з найсильніших мисливців S-рангу в Кореї, яка згодом стає союзницею Джін-У.",
    image: "/images/cha-hae-in.jpg",
    fullDescription:
      "Чха Хе-Ін - одна з найсильніших мисливців S-рангу в Кореї. Вона володіє здатністю відчувати магічну силу інших мисливців. Спочатку вона не звертає уваги на Джін-У, але згодом помічає його зростаючу силу і стає його союзницею. Вона є однією з небагатьох, хто бачить справжній потенціал Джін-У.",
  },
  {
    id: 3,
    name: "Ю Джін-Хо",
    role: "Помічник",
    description: "Вірний помічник Джін-У, який допомагає йому керувати гільдією.",
    image: "/images/YuGin-Ho.jpg",
    fullDescription:
      "Ю Джін-Хо - вірний помічник Джін-У, який допомагає йому керувати гільдією. Він походить із заможної родини, але вирішує працювати з Джін-У після того, як бачить його потенціал. Джін-Хо відповідає за адміністративні завдання, фінанси та логістику, дозволяючи Джін-У зосередитися на полюванні та підвищенні рівня.",
  },
  {
    id: 4,
    name: "Го Гун-Хі",
    role: "Голова Асоціації",
    description: "Голова Асоціації Мисливців Кореї, який спостерігає за розвитком Джін-У.",
    image: "/images/HUN-XI.jpg",
    fullDescription:
      "Го Гун-Хі - голова Асоціації Мисливців Кореї. Він є одним із найвпливовіших людей у світі мисливців і має величезний досвід. Він швидко помічає незвичайний розвиток Джін-У і починає спостерігати за ним. Незважаючи на свій вік, він все ще є потужним мисливцем і має глибоке розуміння світу підземель.",
  },
]

export default function CharactersSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedCharacter, setSelectedCharacter] = useState<(typeof characters)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        onEnter: () => {
          gsap.to(".character-card", {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: "power3.out",
          })
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const nextCharacter = () => {
    setCurrentIndex((prev) => (prev + 1) % characters.length)
  }

  const prevCharacter = () => {
    setCurrentIndex((prev) => (prev - 1 + characters.length) % characters.length)
  }

  const openCharacterDetails = (character: (typeof characters)[0]) => {
    setSelectedCharacter(character)
    setIsDialogOpen(true)
  }

  return (
    <section
      id="characters"
      ref={sectionRef}
      className="min-h-screen py-20 bg-gradient-to-b from-background to-background/90"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Персонажі</span>
        </h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Mobile Character Slider */}
          <div className="md:hidden">
            <div className="character-card opacity-0 translate-y-10 bg-card rounded-lg overflow-hidden shadow-lg border border-border">
              <div className="aspect-[3/4] relative">
                <img
                  src={characters[currentIndex].image || "/placeholder.svg"}
                  alt={characters[currentIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-card-foreground">{characters[currentIndex].name}</h3>
                <p className="text-sm text-card-foreground/70 mb-2">{characters[currentIndex].role}</p>
                <p className="text-card-foreground/80 mb-4">{characters[currentIndex].description}</p>
                <Button
                  onClick={() => openCharacterDetails(characters[currentIndex])}
                  variant="outline"
                  className="w-full"
                >
                  Детальніше
                </Button>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button onClick={prevCharacter} variant="outline" size="icon" className="rounded-full">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex space-x-1">
                {characters.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i === currentIndex ? "bg-primary" : "bg-muted"}`} />
                ))}
              </div>
              <Button onClick={nextCharacter} variant="outline" size="icon" className="rounded-full">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Desktop Character Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {characters.map((character, index) => (
              <div
                key={character.id}
                className="character-card opacity-0 translate-y-10 bg-card rounded-lg overflow-hidden shadow-lg border border-border hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={character.image || "/placeholder.svg"}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-card-foreground">{character.name}</h3>
                  <p className="text-xs text-card-foreground/70 mb-2">{character.role}</p>
                  <p className="text-sm text-card-foreground/80 mb-4 line-clamp-3">{character.description}</p>
                  <Button
                    onClick={() => openCharacterDetails(character)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Детальніше
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Character Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            {selectedCharacter && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedCharacter.name}</DialogTitle>
                  <DialogDescription>{selectedCharacter.role}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={selectedCharacter.image || "/placeholder.svg"}
                      alt={selectedCharacter.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <p className="text-foreground/80">{selectedCharacter.fullDescription}</p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}