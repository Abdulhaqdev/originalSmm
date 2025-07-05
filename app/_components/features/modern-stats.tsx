"use client"

import { useEffect, useState } from "react"
import { Users, ShoppingCart, Star, TrendingUp } from "lucide-react"
import { mockStats } from "@/lib/mock-data"

export default function ModernStats() {
  const [counters, setCounters] = useState({
    users: 0,
    orders: 0,
    services: 0,
    satisfaction: 0,
  })

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    const timer = setInterval(() => {
      setCounters((prev) => ({
        users: Math.min(prev.users + Math.ceil(mockStats.totalUsers / steps), mockStats.totalUsers),
        orders: Math.min(prev.orders + Math.ceil(mockStats.ordersCompleted / steps), mockStats.ordersCompleted),
        services: Math.min(prev.services + Math.ceil(mockStats.servicesAvailable / steps), mockStats.servicesAvailable),
        satisfaction: Math.min(prev.satisfaction + mockStats.satisfactionRate / steps, mockStats.satisfactionRate),
      }))
    }, interval)

    setTimeout(() => clearInterval(timer), duration)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      icon: Users,
      label: "Active Users",
      value: counters.users.toLocaleString(),
      suffix: "+",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      icon: ShoppingCart,
      label: "Orders Completed",
      value: counters.orders.toLocaleString(),
      suffix: "+",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      icon: Star,
      label: "Services Available",
      value: counters.services.toString(),
      suffix: "+",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      icon: TrendingUp,
      label: "Satisfaction Rate",
      value: counters.satisfaction.toFixed(1),
      suffix: "%",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join our growing community of satisfied customers who have transformed their social media presence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary/30 hover:-translate-y-2"
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${stat.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                  <span className={stat.color}>{stat.suffix}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-green-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-primary/10 rounded-full text-primary font-medium">
            <TrendingUp className="w-5 h-5 mr-2" />
            Growing every day with new satisfied customers
          </div>
        </div>
      </div>
    </section>
  )
}
