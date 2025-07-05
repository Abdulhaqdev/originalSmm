export const mockStats = {
  totalUsers: 50000,
  ordersCompleted: 125000,
  servicesAvailable: 500,
  satisfactionRate: 99.8,
}

export const mockServices = [
  {
    id: 1,
    name: "Instagram Followers",
    platform: "instagram",
    category: "followers",
    price: 2.5,
    minOrder: 100,
    maxOrder: 10000,
    description: "High-quality Instagram followers from real accounts",
    deliveryTime: "1-24 hours",
    quality: "High Quality",
  },
  {
    id: 2,
    name: "Instagram Likes",
    platform: "instagram",
    category: "likes",
    price: 1.2,
    minOrder: 50,
    maxOrder: 5000,
    description: "Instant Instagram likes for your posts",
    deliveryTime: "0-1 hour",
    quality: "Premium",
  },
  {
    id: 3,
    name: "YouTube Views",
    platform: "youtube",
    category: "views",
    price: 1.8,
    minOrder: 1000,
    maxOrder: 100000,
    description: "Real YouTube views to boost your video engagement",
    deliveryTime: "1-6 hours",
    quality: "High Quality",
  },
  {
    id: 4,
    name: "YouTube Subscribers",
    platform: "youtube",
    category: "subscribers",
    price: 12.0,
    minOrder: 100,
    maxOrder: 5000,
    description: "Real YouTube subscribers for channel growth",
    deliveryTime: "1-7 days",
    quality: "Premium",
  },
  {
    id: 5,
    name: "TikTok Likes",
    platform: "tiktok",
    category: "likes",
    price: 0.8,
    minOrder: 100,
    maxOrder: 50000,
    description: "Genuine TikTok likes for viral content",
    deliveryTime: "0-6 hours",
    quality: "High Quality",
  },
  {
    id: 6,
    name: "TikTok Followers",
    platform: "tiktok",
    category: "followers",
    price: 3.5,
    minOrder: 100,
    maxOrder: 10000,
    description: "Real TikTok followers to grow your audience",
    deliveryTime: "1-24 hours",
    quality: "Premium",
  },
  {
    id: 7,
    name: "Facebook Page Likes",
    platform: "facebook",
    category: "likes",
    price: 3.0,
    minOrder: 50,
    maxOrder: 5000,
    description: "Quality Facebook page likes from active users",
    deliveryTime: "1-12 hours",
    quality: "High Quality",
  },
  {
    id: 8,
    name: "Twitter Followers",
    platform: "twitter",
    category: "followers",
    price: 4.0,
    minOrder: 100,
    maxOrder: 10000,
    description: "Real Twitter followers for organic growth",
    deliveryTime: "1-24 hours",
    quality: "Premium",
  },
]

export const mockTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Content Creator",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    content:
      "OriginalSMM has transformed my social media presence. The quality of followers and engagement is outstanding! I've seen a 300% increase in my reach.",
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Digital Marketer",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    content:
      "Fast delivery, excellent customer support, and real results. I use OriginalSMM for all my clients and they're always impressed with the quality.",
  },
  {
    id: 3,
    name: "Emma Davis",
    role: "Influencer",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    content:
      "The best SMM panel I've used. Reliable, affordable, and the results speak for themselves. Highly recommend!",
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    role: "Business Owner",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    content: "OriginalSMM helped my business reach thousands of new customers. The ROI has been incredible!",
  },
]

export const mockFAQs = [
  {
    id: 1,
    question: "How quickly will I see results?",
    answer:
      "Most orders start processing within 1-6 hours and complete within 24-72 hours depending on the service and quantity. Some services like Instagram likes can start immediately.",
  },
  {
    id: 2,
    question: "Are the followers/likes real?",
    answer:
      "Yes, we provide high-quality engagement from real, active accounts. We never use bots or fake profiles. All our services comply with platform guidelines.",
  },
  {
    id: 3,
    question: "Is it safe for my account?",
    answer:
      "Our services comply with all platform guidelines and we use gradual delivery methods to ensure account safety. We've been in business for years with zero account bans.",
  },
  {
    id: 4,
    question: "What payment methods do you accept?",
    answer:
      "We accept various payment methods including PayPal, credit cards, cryptocurrency, and local payment methods for your convenience.",
  },
  {
    id: 5,
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer refunds for undelivered orders or if you're not satisfied with the quality. Please contact our support team within 30 days of your order.",
  },
  {
    id: 6,
    question: "Can I track my order progress?",
    answer:
      "Yes! You can track all your orders in real-time through your dashboard. You'll also receive email notifications about order status updates.",
  },
]

export const mockFeatures = [
  {
    icon: "Zap",
    title: "Lightning Fast Delivery",
    description: "Get your orders processed and delivered within hours, not days. Most services start immediately.",
  },
  {
    icon: "Shield",
    title: "100% Safe & Secure",
    description:
      "All our services are completely safe and comply with platform guidelines. Zero risk to your accounts.",
  },
  {
    icon: "Users",
    title: "Real Engagement",
    description: "High-quality followers and engagement from real, active accounts. No bots, no fake profiles.",
  },
  {
    icon: "Headphones",
    title: "24/7 Support",
    description: "Our dedicated support team is available around the clock to help you with any questions or issues.",
  },
  {
    icon: "CreditCard",
    title: "Secure Payments",
    description:
      "Multiple payment options with bank-level security for all transactions. Your data is always protected.",
  },
  {
    icon: "TrendingUp",
    title: "Guaranteed Results",
    description: "We guarantee delivery of your orders or provide a full refund. Your satisfaction is our priority.",
  },
]

export const mockPlatforms = [
  { name: "Instagram", icon: "instagram", color: "bg-pink-500", services: 15 },
  { name: "YouTube", icon: "youtube", color: "bg-red-500", services: 12 },
  { name: "TikTok", icon: "music", color: "bg-black", services: 10 },
  { name: "Facebook", icon: "facebook", color: "bg-blue-600", services: 8 },
  { name: "Twitter", icon: "twitter", color: "bg-blue-400", services: 6 },
  { name: "LinkedIn", icon: "linkedin", color: "bg-blue-700", services: 5 },
]

export const mockOrders = [
  {
    id: 1,
    service: "Instagram Followers",
    quantity: 1000,
    price: 25.0,
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    completedAt: "2024-01-15T12:30:00Z",
  },
  {
    id: 2,
    service: "YouTube Views",
    quantity: 5000,
    price: 45.0,
    status: "processing",
    createdAt: "2024-01-16T14:20:00Z",
  },
  {
    id: 3,
    service: "TikTok Likes",
    quantity: 2000,
    price: 16.0,
    status: "pending",
    createdAt: "2024-01-17T09:15:00Z",
  },
]

export const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  balance: 150.75,
  totalOrders: 25,
  joinedAt: "2023-06-15T00:00:00Z",
}
