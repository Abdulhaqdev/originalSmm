"use client"

import { useState } from "react"
import { mockServices, mockPlatforms } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Instagram, Youtube, Music, Facebook, Twitter, Linkedin, ArrowRight, Star } from "lucide-react"

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  music: Music,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
}

export default function ModernServices() {
  const [selectedPlatform, setSelectedPlatform] = useState("all")

  const filteredServices =
    selectedPlatform === "all" ? mockServices : mockServices.filter((service) => service.platform === selectedPlatform)

  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Premium Services
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Boost Every Platform</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose from our wide range of high-quality social media services across all major platforms
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
          {mockPlatforms.map((platform) => {
            const IconComponent = platformIcons[platform.icon as keyof typeof platformIcons]
            return (
              <Button
                key={platform.name}
                variant={selectedPlatform === platform.name.toLowerCase() ? "default" : "outline"}
                onClick={() => setSelectedPlatform(platform.name.toLowerCase())}
                className={`${selectedPlatform === platform.name.toLowerCase() ? "bg-primary hover:bg-primary/90" : ""} group`}
              >
                <IconComponent className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                {platform.name}
              </Button>
            )
          })}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {filteredServices.map((service) => {
            const IconComponent = platformIcons[service.platform as keyof typeof platformIcons]

            return (
              <Card
                key={service.id}
                className="group hover:shadow-2xl transition-all duration-300 border-gray-200 dark:border-gray-700 hover:border-primary/30 hover:-translate-y-1"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <IconComponent className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {service.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">${service.price}</div>
                      <div className="text-xs text-gray-500">per 1K</div>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{service.name}</CardTitle>
                  <CardDescription className="text-sm">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Min Order:</span>
                      <span className="font-medium">{service.minOrder.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Max Order:</span>
                      <span className="font-medium">{service.maxOrder.toLocaleString()}</span>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white group-hover:shadow-lg transition-all duration-300">
                      Order Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary to-green-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Need a Custom Solution?</h3>
            <p className="text-green-100 mb-8 text-lg max-w-2xl mx-auto">
              Contact our team for personalized packages and bulk discounts tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Contact Sales
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
              >
                View All Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
