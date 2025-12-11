"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Phone, Mail, CreditCard, BarChart3, History, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">User Dashboard</h1>
              <p className="text-gray-300">Manage your profile and view analysis history</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/analysis">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  New Analysis
                </Button>
              </Link>
              <Link href="/">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-white">{user.username[0].toUpperCase()}</span>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">{user.username}</h2>
                <p className="text-gray-300 mb-6">Premium Member</p>

                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    <span className="text-gray-300">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-cyan-400" />
                    <span className="text-gray-300">{user.phoneNumber}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-cyan-400" />
                    <span className="text-gray-300">CIN: {user.cinNumber}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <span className="text-gray-300">Born: {user.dateOfBirth}</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-300">Member since</span>
                    <span className="text-white font-semibold">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Analyses performed</span>
                    <span className="text-cyan-400 font-bold text-xl">{user.analysesCount}</span>
                  </div>
                </div>

                <Button
                  onClick={logout}
                  className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Analysis History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <History className="w-6 h-6 mr-3 text-cyan-400" />
                    Recent Analysis History
                  </h3>
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>

                {user.analysisHistory && user.analysisHistory.length > 0 ? (
                  <div className="space-y-4">
                    {user.analysisHistory
                      .slice(-5)
                      .reverse()
                      .map((analysis, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                              <span className="text-cyan-300 font-semibold">
                                {new Date(analysis.date).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="text-green-400 font-bold">{analysis.cost} DT</span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Vehicle:</span>
                              <p className="text-white font-medium">{analysis.brand}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Damage:</span>
                              <p className="text-white font-medium">{analysis.damage}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Severity:</span>
                              <p className="text-white font-medium">{analysis.severity}</p>
                            </div>
                            <div>
                              <span className="text-gray-400">Time:</span>
                              <p className="text-white font-medium">
                                {new Date(analysis.date).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-400 mb-2">No Analysis History</h4>
                    <p className="text-gray-500 mb-6">Start analyzing your vehicle images to see your history here!</p>
                    <Link href="/analysis">
                      <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        Start Your First Analysis
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
