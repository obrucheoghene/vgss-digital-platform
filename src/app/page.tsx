// src/app/page.tsx
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
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Shield,
  Users,
  Building,
  ArrowRight,
  Search,
  Heart,
  Globe,
  BookOpen,
  Award,
  Target,
  CheckCircle,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const programHighlights = [
    {
      icon: Heart,
      title: "First Fruit Service",
      description:
        "Dedicate your first working year to God as a first fruit offering",
    },
    {
      icon: BookOpen,
      title: "Ministry Training",
      description:
        "Comprehensive training in leadership and ministry excellence",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description:
        "Serve in various departments across LoveWorld ministries worldwide",
    },
    {
      icon: Award,
      title: "Professional Growth",
      description: "Gain valuable work experience while serving in ministry",
    },
  ];

  const serviceAreas = [
    {
      title: "Administration",
      description:
        "Office management, coordination, and administrative support",
      icon: Building,
      positions: "25+ positions",
    },
    {
      title: "Media & Communications",
      description:
        "Content creation, broadcasting, and digital media production",
      icon: Globe,
      positions: "40+ positions",
    },
    {
      title: "Education & Training",
      description: "Teaching, curriculum development, and educational support",
      icon: BookOpen,
      positions: "30+ positions",
    },
    {
      title: "Ministry Operations",
      description:
        "Church operations, pastoral support, and ministry coordination",
      icon: Heart,
      positions: "50+ positions",
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
    },
    {
      name: "Sarah Okafor",
      role: "VGSS Graduate 2023",
      location: "Abuja, Nigeria",
      quote:
        "The training and mentorship I received prepared me for leadership in both ministry and my career.",
      rating: 5,
    },
    {
      name: "Michael Eze",
      role: "VGSS Graduate 2022",
      location: "Port Harcourt, Nigeria",
      quote:
        "Best decision I ever made! VGSS gave me purpose and direction for my professional life.",
      rating: 5,
    },
  ];

  const stats = [
    { label: "Graduates Served", value: "1,200+", icon: GraduationCap },
    { label: "Service Deparments", value: "45+", icon: Building },
    { label: "Countries", value: "25+", icon: Globe },
    { label: "Success Rate", value: "98%", icon: Target },
  ];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Navigate to search page with query
      window.location.href = `/graduate/search?q=${encodeURIComponent(
        searchTerm
      )}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">VGSS</h1>
                <p className="text-xs text-muted-foreground">LoveWorld Inc.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Staff Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background"></div>
        {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div> */}

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Volunteer Graduate{" "}
              <span className="text-primary">Service Scheme</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Give your first working year to God as a first fruit. Join
              thousands of graduates serving in LoveWorld ministries worldwide
              and make an eternal impact.
            </p>

            {/* Graduate Search */}
            <Card className="max-w-lg mx-auto mb-8 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  Find Your Record
                </CardTitle>
                <CardDescription>
                  Search for your uploaded graduate record to begin registration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter your full name or fellowship name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} disabled={!searchTerm.trim()}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Your BLW Zone must have uploaded your details first
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/graduate/search">
                <Button size="lg" className="w-full sm:w-auto">
                  <Search className="w-4 h-4 mr-2" />
                  Search Graduate Records
                </Button>
              </Link>
              <Link href="#about">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About VGSS */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              What is VGSS?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Volunteer Graduate Service Scheme (VGSS) is a unique program
              designed by Rev Dr. Chris Oyakhilome PhD, giving young graduates
              from {`Believers'`} LoveWorld Campus Fellowships the opportunity
              to give their first working year to God as first fruit through
              service in Service Deparments, departments, or churches.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {programHighlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <Card
                  key={highlight.title}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {highlight.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {highlight.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Service Areas
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover the various departments and ministries where you can
              serve and make a meaningful impact while gaining valuable
              experience.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {serviceAreas.map((area) => {
              const Icon = area.icon;
              return (
                <Card
                  key={area.title}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{area.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {area.positions}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{area.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple steps to join the VGSS program and begin your service
              journey
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">
                  1
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Search Your Record</h3>
              <p className="text-muted-foreground">
                Find your graduate information uploaded by your BLW Zone using
                our search system.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">
                  2
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Complete Registration
              </h3>
              <p className="text-muted-foreground">
                Fill in your complete profile, answer interview questions, and
                submit required documents.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Begin Service</h3>
              <p className="text-muted-foreground">
                Get assigned to a Service Deparment and start your year of
                dedicated service to God.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Graduate Testimonials
            </h2>
            <p className="text-lg text-muted-foreground">
              Hear from graduates who have completed their VGSS journey
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.name}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    {`"${testimonial.quote}"`}
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
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

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your VGSS Journey?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Take the first step towards a meaningful year of service. Search for
            your record and begin your registration today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/graduate/search">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Graduate Records
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Shield className="w-4 h-4 mr-2" />
                Staff Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold">VGSS</h3>
                  <p className="text-xs text-muted-foreground">
                    LoveWorld Inc.
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Volunteer Graduate Service Scheme - Serving God with excellence
                in our first working year.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Graduates</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/graduate/search"
                    className="hover:text-foreground"
                  >
                    Search Records
                  </Link>
                </li>
                <li>
                  <Link
                    href="/graduate/register"
                    className="hover:text-foreground"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    href="/graduate/requirements"
                    className="hover:text-foreground"
                  >
                    Requirements
                  </Link>
                </li>
                <li>
                  <Link href="/graduate/faq" className="hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Staff</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/login" className="hover:text-foreground">
                    Staff Login
                  </Link>
                </li>
                <li>
                  <Link href="/admin/zones" className="hover:text-foreground">
                    Zone Management
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/ministries"
                    className="hover:text-foreground"
                  >
                    Service Deparments
                  </Link>
                </li>
                <li>
                  <Link href="/admin/support" className="hover:text-foreground">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>vgss@loveworld.org</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+234 1 234 5678</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Lagos, Nigeria</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 LoveWorld Inc. All rights reserved. |
              <span className="ml-1">Volunteer Graduate Service Scheme</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
