"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, MapPin, Phone, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const garages = [
  {
    id: 1,
    name: "AutoFix Pro Garage",
    rating: 4.8,
    location: "Tunis, Tunisia",
    speciality: "Luxury & Sport Cars",
    phone: "+216 71 123 456",
    distance: "2.5 km away",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "MechaniCar Center",
    rating: 4.6,
    location: "Ariana, Tunisia",
    speciality: "All Vehicle Types",
    phone: "+216 71 234 567",
    distance: "4.1 km away",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Elite Auto Repair",
    rating: 4.9,
    location: "Sfax, Tunisia",
    speciality: "Insurance Claims",
    phone: "+216 74 345 678",
    distance: "1.8 km away",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "TechCar Solutions",
    rating: 4.4,
    location: "Sousse, Tunisia",
    speciality: "Modern Vehicles",
    phone: "+216 73 456 789",
    distance: "3.2 km away",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    name: "Premium Auto Service",
    rating: 4.7,
    location: "Monastir, Tunisia",
    speciality: "European Cars",
    phone: "+216 73 987 654",
    distance: "5.1 km away",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function GarageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % garages.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % garages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + garages.length) % garages.length)
  }

  const getVisibleGarages = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % garages.length
      visible.push(garages[index])
    }
    return visible
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            Top Recommended{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Garages</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Based on your analysis results, here are the best repair centers near you
          </p>
        </motion.div>

        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Buttons */}
          <Button
            onClick={prevSlide}
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-r from-slate-600/80 to-slate-700/80 backdrop-blur-lg border-white/20 text-white hover:from-slate-500/90 hover:to-slate-600/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            onClick={nextSlide}
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-r from-slate-600/80 to-slate-700/80 backdrop-blur-lg border-white/20 text-white hover:from-slate-500/90 hover:to-slate-600/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Carousel Container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: `${-currentIndex * (100 / 3)}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {garages.map((garage, index) => (
                <motion.div
                  key={garage.id}
                  className="flex-shrink-0 w-full md:w-1/3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                        <img
                          src={garage.image || "/placeholder.svg"}
                          alt={garage.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <h3 className="text-xl font-bold text-cyan-400 mb-2">{garage.name}</h3>

                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(garage.rating) ? "text-yellow-400 fill-current" : "text-gray-400"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-yellow-400 ml-2 font-semibold">{garage.rating}/5</span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-4 h-4 mr-2 text-cyan-400" />
                          <span className="text-sm">{garage.location}</span>
                        </div>
                        <div className="text-gray-300 text-sm">
                          <strong>Speciality:</strong> {garage.speciality}
                        </div>
                        <div className="text-gray-300 text-sm">
                          <strong>Distance:</strong> {garage.distance}
                        </div>
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        onClick={() => window.open(`tel:${garage.phone}`, "_self")}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call {garage.phone}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {garages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-cyan-400 scale-125" : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
