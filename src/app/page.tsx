// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Shield,
  Building,
  ArrowRight,
  Search,
  Heart,
  Globe,
  BookOpen,
  Award,
  Target,
  Star,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  TrendingUp,
  Clock,
  UserCheck,
  Zap,
  Lightbulb,
  Crown,
  Flame,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hero carousel slides
  const heroSlides = [
    {
      title: "Give Your First Year to God",
      subtitle: "Join the Volunteer Graduate Service Scheme",
      description:
        "Transform your career while serving in LoveWorld ministries worldwide",
      gradient: "from-purple-600 via-blue-600 to-teal-500",
      icon: Crown,
    },
    {
      title: "Serve with Excellence",
      subtitle: "Make an Eternal Impact",
      description:
        "Develop leadership skills while building God's kingdom through service",
      gradient: "from-pink-500 via-red-500 to-orange-500",
      icon: Flame,
    },
    {
      title: "Build Your Future",
      subtitle: "Professional Growth in Ministry",
      description:
        "Gain valuable work experience in various ministry departments globally",
      gradient: "from-emerald-500 via-cyan-500 to-blue-600",
      icon: Zap,
    },
  ];

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const programHighlights = [
    {
      icon: Heart,
      title: "First Fruit Service",
      description:
        "Dedicate your first working year to God as a first fruit offering",
      color: "text-red-500 bg-red-50",
    },
    {
      icon: BookOpen,
      title: "Ministry Training",
      description:
        "Comprehensive training in leadership and ministry excellence",
      color: "text-blue-500 bg-blue-50",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description:
        "Serve in various departments across LoveWorld ministries worldwide",
      color: "text-green-500 bg-green-50",
    },
    {
      icon: Award,
      title: "Professional Growth",
      description: "Gain valuable work experience while serving in ministry",
      color: "text-purple-500 bg-purple-50",
    },
  ];

  const serviceAreas = [
    {
      title: "Administration",
      description:
        "Office management, coordination, and administrative support",
      icon: Building,
      positions: "25+ positions",
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      title: "Media & Communications",
      description:
        "Content creation, broadcasting, and digital media production",
      icon: Globe,
      positions: "40+ positions",
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    {
      title: "Education & Training",
      description: "Teaching, curriculum development, and educational support",
      icon: BookOpen,
      positions: "30+ positions",
      color: "bg-gradient-to-br from-emerald-500 to-teal-500",
    },
    {
      title: "Ministry Operations",
      description:
        "Church operations, pastoral support, and ministry coordination",
      icon: Heart,
      positions: "50+ positions",
      color: "bg-gradient-to-br from-orange-500 to-red-500",
    },
  ];

  const testimonials = [
    {
      name: "John Adeyemi",
      role: "VGSS Graduate 2023",
      location: "Lagos, Nigeria",
      quote:
        "VGSS transformed my life! I gained incredible ministry experience while serving God with my skills.",
      rating: 5,
      image: "JA",
    },
    {
      name: "Sarah Okafor",
      role: "VGSS Graduate 2023",
      location: "Abuja, Nigeria",
      quote:
        "The training and mentorship I received prepared me for leadership in both ministry and my career.",
      rating: 5,
      image: "SO",
    },
    {
      name: "Michael Eze",
      role: "VGSS Graduate 2022",
      location: "Port Harcourt, Nigeria",
      quote:
        "Best decision I ever made! VGSS gave me purpose and direction for my professional life.",
      rating: 5,
      image: "ME",
    },
  ];

  const stats = [
    {
      label: "Graduates Served",
      value: "1,200+",
      icon: GraduationCap,
      change: "+15%",
    },
    {
      label: "Service Departments",
      value: "45+",
      icon: Building,
      change: "+8%",
    },
    { label: "Countries", value: "25+", icon: Globe, change: "+12%" },
    { label: "Success Rate", value: "98%", icon: Target, change: "+2%" },
  ];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      window.location.href = `/graduate/search?q=${encodeURIComponent(
        searchTerm
      )}`;
    }
  };

  const currentHeroSlide = heroSlides[currentSlide];
  const HeroIcon = currentHeroSlide.icon;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Enhanced Header */}
      <header className="relative z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  VGSS
                </h1>
                <p className="text-xs text-muted-foreground font-medium">
                  LoveWorld Inc.
                </p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Blog
              </Link>
              <Link
                href="/gallery"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Gallery
              </Link>
              <Link
                href="/graduate/search"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Search Records
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="hover:bg-primary/10 transition-all duration-300"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Staff Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Revolutionary Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentHeroSlide.gradient} transition-all duration-1000 ease-in-out`}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div
            className={`transition-all duration-700 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {/* Hero Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
                  <HeroIcon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-3 h-3 text-yellow-800" />
                </div>
              </div>
            </div>

            {/* Hero Text */}
            <div className="max-w-5xl mx-auto mb-12">
              <div className="mb-4">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-sm px-4 py-2 mb-6">
                  <Flame className="w-4 h-4 mr-2" />
                  {currentHeroSlide.subtitle}
                </Badge>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-none">
                <span className="block">
                  {currentHeroSlide.title.split(" ").slice(0, 2).join(" ")}
                </span>
                <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                  {currentHeroSlide.title.split(" ").slice(2).join(" ")}
                </span>
              </h1>

              <p className="text-xl md:text-2xl font-light text-white/90 max-w-3xl mx-auto leading-relaxed">
                {currentHeroSlide.description}
              </p>
            </div>

            {/* Enhanced Search Component */}
            <div className="max-w-2xl mx-auto mb-12">
              <Card className="bg-white/10 backdrop-blur-2xl border-white/20 shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-center text-white text-xl">
                    <Search className="w-6 h-6 mr-3" />
                    Find Your Record & Start Your Journey
                  </CardTitle>
                  <CardDescription className="text-white/80 text-base">
                    Search for your uploaded graduate record to begin
                    registration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-3">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Enter your surname to search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        className="h-14 bg-white/90 border-0 text-lg placeholder:text-gray-500 shadow-lg rounded-xl"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                          <Search className="w-3 h-3 text-primary" />
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleSearch}
                      disabled={!searchTerm.trim()}
                      size="lg"
                      className="h-14 px-8 bg-white text-primary hover:bg-white/90 shadow-lg rounded-xl font-semibold"
                    >
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </Button>
                  </div>
                  <p className="text-xs text-white/70 mt-3 text-center">
                    Your BLW Zone must have uploaded your details first
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto mb-16">
              <Link href="/graduate/search" className="flex-1">
                <Button
                  size="lg"
                  className="w-full h-14 bg-white text-primary hover:bg-white/90 shadow-xl rounded-xl font-bold text-lg"
                >
                  <Search className="w-5 h-5 mr-3" />
                  Search Graduate Records
                </Button>
              </Link>
              <Link href="#about" className="flex-1">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-14 bg-white/30 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm shadow-xl rounded-xl font-bold text-lg"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              Growing Impact
            </Badge>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Making a Difference Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See the incredible impact graduates are making across the globe
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-gray-800 mb-2 group-hover:text-primary transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About VGSS - Enhanced */}
      <section id="about" className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 mb-6 px-4 py-2">
              <Lightbulb className="w-4 h-4 mr-2" />
              About VGSS
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">
              What is{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                VGSS
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              The Volunteer Graduate Service Scheme (VGSS) is a unique program
              designed by
              <span className="font-semibold text-primary">
                {" "}
                Rev Dr. Chris Oyakhilome PhD
              </span>
              , giving young graduates from {`Believers'`} LoveWorld Campus
              Fellowships the opportunity to give their first working year to
              God as first fruit through service in Service Departments,
              departments, or churches.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {programHighlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <Card
                  key={highlight.title}
                  className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white hover:scale-105"
                >
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 ${highlight.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {highlight.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Service Areas */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <Badge className="bg-white/10 text-white border-white/20 mb-6 px-4 py-2 backdrop-blur-sm">
              <Target className="w-4 h-4 mr-2" />
              Service Opportunities
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Impact Area
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              Discover the various departments and ministries where you can
              serve and make a meaningful impact while gaining valuable
              experience.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {serviceAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <Card
                  key={area.title}
                  className="group hover:scale-105 transition-all duration-500 bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-14 h-14 ${area.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-xl group-hover:text-yellow-300 transition-colors duration-300">
                            {area.title}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-white/20 text-white/80 mt-1"
                          >
                            {area.positions}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80 leading-relaxed">
                      {area.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced How It Works */}
      <section className="py-24 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-6 px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">
              How It{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Simple steps to join the VGSS program and begin your service
              journey
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Search Your Record",
                description:
                  "Find your graduate information uploaded by your BLW Zone using our advanced search system.",
                icon: Search,
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "2",
                title: "Complete Registration",
                description:
                  "Fill in your complete profile, answer interview questions, and submit required documents.",
                icon: UserCheck,
                color: "from-purple-500 to-pink-500",
              },
              {
                step: "3",
                title: "Begin Service",
                description:
                  "Get assigned to a Service Department and start your year of dedicated service to God.",
                icon: Award,
                color: "from-emerald-500 to-teal-500",
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="text-center group">
                  <div className="relative mb-8">
                    <div
                      className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500`}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-gray-50">
                      <span className="text-xl font-black text-gray-800">
                        {step.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 mb-6 px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Success Stories
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">
              Graduate{" "}
              <span className="bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">
                Testimonials
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Hear from graduates who have completed their VGSS journey
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="group hover:scale-105 hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="p-8">
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-8 italic text-lg leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">
                        {testimonial.image}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{testimonial.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Revolutionary Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-blue-600">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Animated Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-bounce"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          ))}
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm mb-8 px-6 py-3 text-lg">
              <Target className="w-5 h-5 mr-2" />
              Start Your Journey
            </Badge>

            {/* Main Heading */}
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-none">
              Ready to Start Your{" "}
              <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                VGSS Journey?
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Take the first step towards a meaningful year of service. Join
              thousands of graduates who have transformed their lives while
              serving God with excellence. Your journey to purpose and impact
              starts here.
            </p>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto mb-16">
              <Link href="/graduate/search" className="flex-1">
                <Button
                  size="lg"
                  className="w-full h-16 bg-white text-primary hover:bg-white/95 shadow-2xl rounded-2xl font-bold text-lg border-0 group transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Search className="w-5 h-5 text-primary" />
                    </div>
                    <span>Search Graduate Records</span>
                  </div>
                </Button>
              </Link>
              <Link href="/auth/login" className="flex-1">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-16 border-2 border-white/40 text-white bg-white/10 hover:bg-white/10 backdrop-blur-sm shadow-2xl rounded-2xl font-bold text-lg group transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span>Staff Login</span>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative">
          {/* Main Footer Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                      VGSS
                    </h3>
                    <p className="text-sm text-gray-400 font-medium">
                      LoveWorld Inc.
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed mb-6 max-w-xs">
                  Volunteer Graduate Service Scheme - Transforming lives through
                  dedicated service in our first working year with excellence
                  and purpose.
                </p>
                <div className="flex space-x-4">
                  {/* Social Media Icons (placeholder) */}
                  <div className="w-10 h-10 bg-gray-800 hover:bg-primary/20 rounded-xl flex items-center justify-center cursor-pointer transition-colors duration-300">
                    <Globe className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="w-10 h-10 bg-gray-800 hover:bg-primary/20 rounded-xl flex items-center justify-center cursor-pointer transition-colors duration-300">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="w-10 h-10 bg-gray-800 hover:bg-primary/20 rounded-xl flex items-center justify-center cursor-pointer transition-colors duration-300">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* For Graduates */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-primary" />
                  For Graduates
                </h4>
                <ul className="space-y-4">
                  {[
                    { label: "Search Records", href: "/graduate/search" },
                    { label: "Registration Guide", href: "/graduate/guide" },
                    { label: "Requirements", href: "/graduate/requirements" },
                    { label: "FAQ", href: "/graduate/faq" },
                    { label: "Blog", href: "/blog" },
                    { label: "Gallery", href: "/gallery" },
                  ].map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* For Organizations */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white flex items-center">
                  <Building className="w-5 h-5 mr-2 text-primary" />
                  For Organizations
                </h4>
                <ul className="space-y-4">
                  {[
                    { label: "Staff Login", href: "/auth/login" },
                    { label: "Zone Management", href: "/zones" },
                    { label: "Service Departments", href: "/departments" },
                    { label: "Admin Portal", href: "/admin" },
                    { label: "Reports & Analytics", href: "/reports" },
                    { label: "Support Center", href: "/support" },
                  ].map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact & Support */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-primary" />
                  Contact & Support
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a
                        href="mailto:vgss@loveworld.org"
                        className="text-gray-300 hover:text-primary transition-colors"
                      >
                        vgss@loveworld.org
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a
                        href="tel:+2341234567890"
                        className="text-gray-300 hover:text-primary transition-colors"
                      >
                        +234 1 234 567 890
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-300">
                        LoveWorld Headquarters
                        <br />
                        Lagos, Nigeria
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Support Hours</p>
                      <p className="text-gray-300">
                        Mon - Fri: 8:00 AM - 6:00 PM WAT
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                {/* Copyright */}
                <div className="text-center md:text-left">
                  <p className="text-gray-400 text-sm">
                    © 2024 LoveWorld Inc. All rights reserved.
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Volunteer Graduate Service Scheme Platform
                  </p>
                </div>

                {/* Quick Stats */}
                {/* <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-primary font-bold">1,200+</div>
                    <div className="text-xs text-gray-500">Graduates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary font-bold">25+</div>
                    <div className="text-xs text-gray-500">Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary font-bold">98%</div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                </div> */}

                {/* Legal Links */}
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <Link
                    href="/privacy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/cookies"
                    className="hover:text-primary transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
