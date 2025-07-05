import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Clock, Shield, Target, Zap, TrendingUp, Globe } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const achievements = [
    {
      icon: Users,
      title: "50,000+ Customers",
      description: "Trusted by thousands of businesses and individuals worldwide",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      icon: Award,
      title: "99.8% Success Rate",
      description: "Industry-leading completion rate for all orders",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer service and technical support",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      icon: Shield,
      title: "100% Safe",
      description: "All services comply with platform guidelines and policies",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ]

  const values = [
    {
      icon: Target,
      title: "Quality First",
      description:
        "We never compromise on quality. Every service is delivered with the highest standards to ensure real, lasting results for your social media growth.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Time is money. Our optimized systems ensure rapid order processing and delivery, getting you results when you need them most.",
    },
    {
      icon: TrendingUp,
      title: "Real Growth",
      description:
        "We focus on authentic engagement that drives real business results, not just vanity metrics that disappear over time.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Serving customers worldwide with localized support and understanding of different markets and social media landscapes.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">About OriginalSMM</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The Future of <span className="gradient-text">Social Media Marketing</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Since our founding, OriginalSMM has been at the forefront of social media marketing innovation. We've
              helped thousands of businesses and individuals achieve their social media goals through premium services,
              cutting-edge technology, and unmatched customer support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Explore Our Services
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <Card key={index} className="text-center hover-lift">
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 ${achievement.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className={`w-8 h-8 ${achievement.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{achievement.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our <span className="gradient-text">Story</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">From humble beginnings to industry leadership</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Built by Social Media Experts</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  OriginalSMM was founded by a team of social media marketing professionals who understood the
                  challenges businesses face in building authentic online presence. We saw the need for a reliable,
                  high-quality service that could deliver real results without compromising account safety.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  What started as a small operation has grown into one of the world's most trusted SMM panels, serving
                  customers across the globe with premium services and unmatched reliability.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">2019</div>
                    <div className="text-sm text-gray-500">Founded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">50K+</div>
                    <div className="text-sm text-gray-500">Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">125K+</div>
                    <div className="text-sm text-gray-500">Orders</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Card className="glass">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Customer Satisfaction</span>
                        <span className="text-2xl font-bold text-primary">99.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "99.8%" }}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Order Success Rate</span>
                        <span className="text-2xl font-bold text-primary">99.9%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "99.9%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="gradient-text">Values</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              These core principles guide everything we do and shape how we serve our customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="hover-lift group">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Grow Your Social Media Presence?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust OriginalSMM for their social media marketing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Browse Services
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
