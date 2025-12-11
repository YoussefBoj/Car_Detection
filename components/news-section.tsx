"use client"

import { motion } from "framer-motion"
import { Calendar, TrendingUp, AlertTriangle, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const newsItems = [
  {
    id: 1,
    title: "Insurance Claims Rise 15% Due to Weather-Related Accidents",
    excerpt:
      "Recent storms across Tunisia have led to a significant increase in vehicle damage claims, with most incidents involving flooding and hail damage.",
    date: "2024-01-15",
    category: "Statistics",
    icon: TrendingUp,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "New AI Technology Reduces Fraudulent Claims by 40%",
    excerpt:
      "Advanced machine learning algorithms are helping insurance companies detect and prevent fraudulent damage claims more effectively than ever before.",
    date: "2024-01-12",
    category: "Technology",
    icon: Shield,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    title: "Road Safety Alert: Increased Accidents on Highway A1",
    excerpt:
      "Authorities report a 25% increase in accidents on the main Tunis-Sfax highway due to ongoing construction work. Drivers advised to exercise caution.",
    date: "2024-01-10",
    category: "Safety Alert",
    icon: AlertTriangle,
    gradient: "from-red-500 to-orange-500",
  },
  {
    id: 4,
    title: "Digital Insurance Processing Speeds Up Claims by 60%",
    excerpt:
      "New digital platforms and AI-powered assessment tools are dramatically reducing the time needed to process vehicle damage claims.",
    date: "2024-01-08",
    category: "Innovation",
    icon: TrendingUp,
    gradient: "from-purple-500 to-pink-500",
  },
]

export default function NewsSection() {
  return (
    <section className="py-20 px-4 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6">
            Insurance & Accident{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">News</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest news and trends in automotive insurance and road safety
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="group cursor-pointer"
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-full bg-gradient-to-r ${item.gradient} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${item.gradient} text-white`}
                        >
                          {item.category}
                        </span>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                        {item.title}
                      </h3>

                      <p className="text-gray-300 leading-relaxed">{item.excerpt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            View All News
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
