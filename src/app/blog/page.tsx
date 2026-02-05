// src/app/blog/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Search,
  Calendar,
  Clock,
  User,
  Tag,
  ChevronRight,
  Mail,
  Heart,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: "How VGSS Transformed My Career Path",
    excerpt:
      "Discover how one graduate's decision to give their first year to God opened doors they never imagined possible. A story of faith, service, and professional growth.",
    author: "John Adeyemi",
    date: "January 8, 2026",
    readTime: "5 min read",
    category: "Success Stories",
    image: "JA",
    featured: true,
    tags: ["Testimonials", "Career Growth"],
  },
  {
    id: 2,
    title: "A Day in the Life of a VGSS Volunteer",
    excerpt:
      "Ever wondered what it's like to serve in a LoveWorld ministry department? Follow Sarah as she shares her daily experiences and the joy of purposeful service.",
    author: "Sarah Okafor",
    date: "January 5, 2026",
    readTime: "4 min read",
    category: "Experience",
    image: "SO",
    featured: true,
    tags: ["Daily Life", "Ministry"],
  },
  {
    id: 3,
    title: "Top 10 Skills You'll Gain Through VGSS",
    excerpt:
      "From leadership to communication, discover the valuable professional skills that VGSS volunteers develop during their year of service.",
    author: "VGSS Team",
    date: "January 2, 2026",
    readTime: "6 min read",
    category: "Career Development",
    image: "VT",
    featured: false,
    tags: ["Skills", "Professional Development"],
  },
  {
    id: 4,
    title: "The Spiritual Benefits of First Fruit Service",
    excerpt:
      "Learn about the biblical foundation of giving your first working year to God and the spiritual blessings that come with this act of dedication.",
    author: "Pastor Grace Eze",
    date: "December 28, 2025",
    readTime: "7 min read",
    category: "Spirituality",
    image: "GE",
    featured: false,
    tags: ["Faith", "First Fruit"],
  },
  {
    id: 5,
    title: "VGSS 2025 Orientation Highlights",
    excerpt:
      "Relive the powerful moments from this year's VGSS orientation program featuring inspiring messages and practical training sessions.",
    author: "Media Team",
    date: "December 20, 2025",
    readTime: "3 min read",
    category: "Events",
    image: "MT",
    featured: false,
    tags: ["Events", "Training"],
  },
  {
    id: 6,
    title: "From Graduate to Leader: The VGSS Journey",
    excerpt:
      "How the VGSS program prepares young graduates for leadership roles in both ministry and the marketplace.",
    author: "Michael Eze",
    date: "December 15, 2025",
    readTime: "5 min read",
    category: "Leadership",
    image: "ME",
    featured: false,
    tags: ["Leadership", "Growth"],
  },
];

const categories = [
  { name: "All Posts", count: 15 },
  { name: "Success Stories", count: 5 },
  { name: "Career Development", count: 4 },
  { name: "Events", count: 3 },
  { name: "Spirituality", count: 2 },
  { name: "Leadership", count: 1 },
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Posts");

  const featuredPosts = blogPosts.filter((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-purple-600 to-blue-600 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm mb-6 px-4 py-2">
            <FileText className="w-4 h-4 mr-2" />
            VGSS Blog
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Stories of{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              Service & Impact
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Discover inspiring stories, practical insights, and the latest news
            from the VGSS community. Learn from graduates who are making a
            difference.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 bg-white/90 border-0 text-lg placeholder:text-gray-500 shadow-lg rounded-xl pl-12"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 mb-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                Featured
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Stories
              </h2>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {featuredPosts.map((post) => (
              <Card
                key={post.id}
                className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-48 md:h-auto bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <span className="text-5xl font-bold text-white/30">
                      {post.image}
                    </span>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {post.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mb-4 line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                        <span>•</span>
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group-hover:text-primary"
                      >
                        Read More
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Categories */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-primary" />
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                          selectedCategory === category.name
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <span className="font-medium">{category.name}</span>
                        <Badge
                          variant={
                            selectedCategory === category.name
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {category.count}
                        </Badge>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-primary to-purple-600 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Subscribe
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      Get the latest updates delivered to your inbox
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="Enter your email"
                      className="bg-white/90 border-0 mb-3"
                    />
                    <Button className="w-full bg-white text-primary hover:bg-white/90">
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Blog Posts Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Latest Articles
                </h2>
                <Badge variant="outline" className="text-sm">
                  {blogPosts.length} articles
                </Badge>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {regularPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="group hover:shadow-xl transition-all duration-500 border-0 bg-white hover:scale-[1.02]"
                  >
                    <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center">
                        <span className="text-xl font-bold text-white">
                          {post.image}
                        </span>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {post.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between pt-0">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <span className="text-xs text-gray-400">{post.date}</span>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Load More Articles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Have a Story to Share?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            {`We'd`} love to hear about your VGSS experience. Share your journey
            and inspire others to take the leap of faith.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Heart className="w-4 h-4 mr-2" />
            Submit Your Story
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
