"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Play, Star, Users, Zap, TrendingUp } from "lucide-react"
import Link from "next/link"
import { mockStats } from "@/lib/mock-data"

export default function Hero() {
  const [currentStat, setCurrentStat] = useState(0)
  const stats = [
    { label: "Happy Customers", value: mockStats.totalUsers, icon: Users },
    { label: "Orders Completed", value: mockStats.ordersCompleted, icon: Zap },
    { label: "Services Available", value: mockStats.servicesAvailable, icon: TrendingUp },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [stats.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 pt-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm">
                <Star className="w-4 h-4 mr-2" />
                #1 SMM Panel Worldwide
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Boost Your
                <span className="gradient-text block">Social Media</span>
                Presence Today
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Get real followers, likes, views, and engagement across all major social media platforms. Fast delivery,
                premium quality, and 24/7 support.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/services">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="group bg-transparent">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-gray-600 dark:text-gray-300">4.9/5 Rating</span>
              </div>
              <div className="text-gray-600 dark:text-gray-300">50,000+ Happy Customers</div>
            </div>
          </div>

          {/* Right Content - Animated Stats Dashboard */}
          <div className="relative animate-slide-in-right">
            <div className="relative">
              {/* Main Dashboard Card */}
              <Card className="glass hover-lift">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold">Live Stats</h3>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>

                    <div className="space-y-4">
                      {stats.map((stat, index) => {
                        const Icon = stat.icon
                        const isActive = index === currentStat
                        return (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                              isActive ? "bg-primary/10 scale-105" : "bg-gray-50 dark:bg-gray-800"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-lg ${isActive ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700"}`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className="font-medium">{stat.label}</span>
                            </div>
                            <span className="text-2xl font-bold gradient-text">{stat.value.toLocaleString()}+</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center animate-bounce-in">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center animate-bounce-in"
                style={{ animationDelay: "0.5s" }}
              >
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
