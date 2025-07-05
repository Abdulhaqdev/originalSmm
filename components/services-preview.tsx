"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, Star } from "lucide-react"
import Link from "next/link"
import { mockServices, mockPlatforms } from "@/lib/mock-data"

export default function ServicesPreview() {
  const [selectedPlatform, setSelectedPlatform] = useState("all")

  const filteredServices =
    selectedPlatform === "all"
      ? mockServices.slice(0, 6)
      : mockServices.filter((service) => service.platform === selectedPlatform).slice(0, 6)

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our <span className="gradient-text">Premium Services</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose from our wide range of high-quality social media marketing services across all major platforms.
          </p>
        </div>

        {/* Platform Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            variant={selectedPlatform === "all" ? "default" : "outline"}
            onClick={() => setSelectedPlatform("all")}
            className={selectedPlatform === "all" ? "bg-primary hover:bg-primary/90" : ""}
          >
            All Platforms
          </Button>
          {mockPlatforms.slice(0, 4).map((platform) => (
            <Button
              key={platform.name}
              variant={selectedPlatform === platform.name.toLowerCase() ? "default" : "outline"}
              onClick={() => setSelectedPlatform(platform.name.toLowerCase())}
              className={selectedPlatform === platform.name.toLowerCase() ? "bg-primary hover:bg-primary/90" : ""}
            >
              {platform.name}
            </Button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredServices.map((service, index) => (
            <Card
              key={service.id}
              className="hover-lift group transition-all duration-300 border-0 shadow-lg hover:shadow-2xl"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {service.name}
                    </h3>
                    <Badge variant="secondary" className="capitalize">
                      {service.platform}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">${service.price}</div>
                    <div className="text-sm text-gray-500">per 1000</div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{service.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Min Order:</span>
                    <span className="font-medium">{service.minOrder.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Max Order:</span>
                    <span className="font-medium">{service.maxOrder.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Delivery:
                    </span>
                    <span className="font-medium">{service.deliveryTime}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{service.quality}</span>
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                    Order Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Services Button */}
        <div className="text-center">
          <Link href="/services">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white group">
              View All Services
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
