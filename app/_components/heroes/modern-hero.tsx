"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Star, Users, Zap, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function ModernHero() {
  const [currentStat, setCurrentStat] = useState(0)

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Orders Completed", value: "125K+", icon: Zap },
    { label: "Success Rate", value: "99.8%", icon: TrendingUp },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [stats.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-green-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-green-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 left-1/6 w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm border border-primary/20">
                <Star className="w-4 h-4 mr-2 fill-current" />
                #1 SMM Panel Platform
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-gray-900 dark:text-white">Boost Your</span>
                  <br />
                  <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                    Social Media
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-white">Presence</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                  Get real followers, likes, and engagement across all major social platforms. Fast delivery, premium
                  quality, and unbeatable prices.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
                  >
                    Start Growing Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-primary hover:text-primary transition-all duration-300 group bg-transparent"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 pt-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-gray-600 dark:text-gray-300 ml-2">4.9/5 Rating</span>
                </div>
                <div className="text-gray-400">•</div>
                <div className="text-gray-600 dark:text-gray-300">50,000+ Happy Customers</div>
              </div>
            </div>

            {/* Right Content - Stats Dashboard */}
            <div className="relative animate-fade-in delay-300">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Live Statistics</h3>
                    <p className="text-gray-600 dark:text-gray-300">Real-time platform metrics</p>
                  </div>

                  {/* Animated Stat Display */}
                  <div className="bg-gradient-to-r from-primary to-green-600 rounded-2xl p-6 text-white text-center transform transition-all duration-500 hover:scale-105">
                    <div className="flex items-center justify-center mb-3">
                      {React.createElement(stats[currentStat].icon, { className: "w-8 h-8" })}
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats[currentStat].value}</div>
                    <div className="text-green-100">{stats[currentStat].label}</div>
                  </div>

                  {/* Mini Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                      <div
                        key={index}
                        className={`text-center p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                          index === currentStat
                            ? "bg-primary/10 border-2 border-primary/30"
                            : "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => setCurrentStat(index)}
                      >
                        <div className="flex items-center justify-center mb-2">
                          {React.createElement(stat.icon, {
                            className: `w-5 h-5 ${index === currentStat ? "text-primary" : "text-gray-500"}`,
                          })}
                        </div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{stat.value}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Progress Indicators */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Instagram</span>
                      <span className="text-primary font-semibold">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary to-green-600 h-2 rounded-full w-[95%] transition-all duration-1000"></div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">YouTube</span>
                      <span className="text-primary font-semibold">88%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary to-green-600 h-2 rounded-full w-[88%] transition-all duration-1000"></div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">TikTok</span>
                      <span className="text-primary font-semibold">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary to-green-600 h-2 rounded-full w-[92%] transition-all duration-1000"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-200 dark:border-gray-700 animate-bounce">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Orders</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-200 dark:border-gray-700 animate-bounce delay-500">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
