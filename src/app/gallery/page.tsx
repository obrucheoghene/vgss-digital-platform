// src/app/gallery/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  ArrowRight,
  Globe,
  Calendar,
  MapPin,
  Sparkles,
  Mail,
  Phone,
  Building,
  Heart,
  Camera,
  Image as ImageIcon,
  Users,
  Award,
  BookOpen,
  Mic,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid3X3,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Gallery categories
const categories = [
  { id: "all", name: "All", count: 24 },
  { id: "orientation", name: "Orientation", count: 6 },
  { id: "training", name: "Training", count: 5 },
  { id: "service", name: "Service Activities", count: 4 },
  { id: "events", name: "Events", count: 5 },
  { id: "graduation", name: "Graduation", count: 4 },
];

// Gallery items with placeholder images
const galleryItems = [
  {
    id: 1,
    title: "VGSS 2025 Orientation Ceremony",
    description:
      "Over 500 graduates gathered for the official launch of the 2025 VGSS program, receiving their service assignments and orientation packages.",
    category: "orientation",
    date: "January 2025",
    location: "Lagos, Nigeria",
    color: "from-purple-500 to-blue-600",
    icon: Users,
    featured: true,
  },
  {
    id: 2,
    title: "Leadership Training Workshop",
    description:
      "Intensive leadership development session equipping graduates with essential skills for ministry and professional excellence.",
    category: "training",
    date: "December 2024",
    location: "Abuja, Nigeria",
    color: "from-emerald-500 to-teal-600",
    icon: BookOpen,
    featured: true,
  },
  {
    id: 3,
    title: "Media Department in Action",
    description:
      "VGSS volunteers working behind the scenes in the media department, producing content that reaches millions worldwide.",
    category: "service",
    date: "November 2024",
    location: "Lagos, Nigeria",
    color: "from-pink-500 to-rose-600",
    icon: Camera,
    featured: true,
  },
  {
    id: 4,
    title: "Community Outreach Program",
    description:
      "Graduates organizing community impact programs, spreading love and hope to underserved communities.",
    category: "events",
    date: "October 2024",
    location: "Port Harcourt, Nigeria",
    color: "from-orange-500 to-amber-600",
    icon: Heart,
    featured: false,
  },
  {
    id: 5,
    title: "VGSS Graduation Ceremony 2024",
    description:
      "Celebrating the successful completion of service by the 2024 cohort, with certificates and special recognition awards.",
    category: "graduation",
    date: "September 2024",
    location: "Lagos, Nigeria",
    color: "from-blue-500 to-indigo-600",
    icon: Award,
    featured: true,
  },
  {
    id: 6,
    title: "Praise & Worship Session",
    description:
      "Spirit-filled worship session during the monthly VGSS fellowship, creating an atmosphere of God's presence.",
    category: "events",
    date: "August 2024",
    location: "Multiple Locations",
    color: "from-violet-500 to-purple-600",
    icon: Mic,
    featured: false,
  },
  {
    id: 7,
    title: "Administrative Excellence Training",
    description:
      "Professional development workshop teaching administrative best practices and office management skills.",
    category: "training",
    date: "July 2024",
    location: "Abuja, Nigeria",
    color: "from-cyan-500 to-blue-600",
    icon: Building,
    featured: false,
  },
  {
    id: 8,
    title: "New Graduate Welcome Ceremony",
    description:
      "Warm welcome ceremony for incoming VGSS volunteers, introducing them to the culture of excellence in service.",
    category: "orientation",
    date: "June 2024",
    location: "Lagos, Nigeria",
    color: "from-green-500 to-emerald-600",
    icon: GraduationCap,
    featured: false,
  },
  {
    id: 9,
    title: "Global Outreach Conference",
    description:
      "VGSS representatives participating in the global LoveWorld outreach conference, sharing testimonials and experiences.",
    category: "events",
    date: "May 2024",
    location: "International",
    color: "from-red-500 to-pink-600",
    icon: Globe,
    featured: false,
  },
  {
    id: 10,
    title: "Tech Department Innovation Day",
    description:
      "Showcasing innovative solutions developed by VGSS volunteers in the technology department.",
    category: "service",
    date: "April 2024",
    location: "Lagos, Nigeria",
    color: "from-indigo-500 to-violet-600",
    icon: Sparkles,
    featured: false,
  },
  {
    id: 11,
    title: "Mentorship Program Launch",
    description:
      "Senior staff and alumni engaging with new VGSS volunteers through structured mentorship sessions.",
    category: "training",
    date: "March 2024",
    location: "Multiple Locations",
    color: "from-teal-500 to-cyan-600",
    icon: Users,
    featured: false,
  },
  {
    id: 12,
    title: "Certificate Award Ceremony",
    description:
      "Recognition ceremony honoring outstanding VGSS volunteers for their exceptional contributions during service.",
    category: "graduation",
    date: "February 2024",
    location: "Lagos, Nigeria",
    color: "from-amber-500 to-orange-600",
    icon: Award,
    featured: false,
  },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");

  const filteredItems =
    selectedCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  const featuredItems = galleryItems.filter((item) => item.featured);

  const handlePrevious = () => {
    if (selectedImage === null) return;
    const currentIndex = filteredItems.findIndex(
      (item) => item.id === selectedImage
    );
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    setSelectedImage(filteredItems[prevIndex].id);
  };

  const handleNext = () => {
    if (selectedImage === null) return;
    const currentIndex = filteredItems.findIndex(
      (item) => item.id === selectedImage
    );
    const nextIndex =
      currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(filteredItems[nextIndex].id);
  };

  const selectedItem = galleryItems.find((item) => item.id === selectedImage);

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
            <Camera className="w-4 h-4 mr-2" />
            VGSS Gallery
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Moments of{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              Service & Impact
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Explore the inspiring moments captured during VGSS activities,
            training sessions, and impactful events across various ministry
            departments.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-black">500+</div>
              <div className="text-white/70 text-sm">Photos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black">50+</div>
              <div className="text-white/70 text-sm">Events</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black">25+</div>
              <div className="text-white/70 text-sm">Locations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 mb-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Highlights
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Moments
              </h2>
            </div>
            <Button variant="outline" className="hidden md:flex">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 bg-white overflow-hidden hover:scale-[1.02]"
                  onClick={() => setSelectedImage(item.id)}
                >
                  <div
                    className={`h-48 bg-gradient-to-br ${item.color} flex items-center justify-center relative overflow-hidden`}
                  >
                    <Icon className="w-16 h-16 text-white/30" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-white/20 text-white border-0 backdrop-blur-sm">
                      Featured
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 mb-3">
                      {item.description}
                    </CardDescription>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {item.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.location.split(",")[0]}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex-shrink-0"
                >
                  {category.name}
                  <Badge
                    variant="secondary"
                    className={`ml-2 ${
                      selectedCategory === category.id
                        ? "bg-white/20 text-white"
                        : ""
                    }`}
                  >
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">View:</span>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "masonry" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("masonry")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isLarge = viewMode === "masonry" && index % 5 === 0;
              return (
                <Card
                  key={item.id}
                  className={`group cursor-pointer hover:shadow-xl transition-all duration-500 border-0 bg-white overflow-hidden hover:scale-[1.02] ${
                    isLarge ? "sm:col-span-2 sm:row-span-2" : ""
                  }`}
                  onClick={() => setSelectedImage(item.id)}
                >
                  <div
                    className={`${
                      isLarge ? "h-80" : "h-48"
                    } bg-gradient-to-br ${
                      item.color
                    } flex items-center justify-center relative overflow-hidden`}
                  >
                    <Icon
                      className={`${
                        isLarge ? "w-24 h-24" : "w-12 h-12"
                      } text-white/30`}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <ImageIcon className="w-7 h-7 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {item.category}
                      </Badge>
                    </div>
                    <CardTitle
                      className={`${
                        isLarge ? "text-xl" : "text-base"
                      } line-clamp-1 group-hover:text-primary transition-colors`}
                    >
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription
                      className={`${isLarge ? "line-clamp-3" : "line-clamp-2"}`}
                    >
                      {item.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {item.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.location.split(",")[0]}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="px-8 hover:bg-primary hover:text-white transition-all duration-300"
            >
              Load More Photos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={handlePrevious}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          <div className="max-w-4xl w-full">
            <div
              className={`h-96 md:h-[500px] bg-gradient-to-br ${selectedItem.color} rounded-2xl flex items-center justify-center mb-6`}
            >
              {(() => {
                const Icon = selectedItem.icon;
                return <Icon className="w-32 h-32 text-white/30" />;
              })()}
            </div>
            <div className="text-center text-white">
              <Badge className="bg-white/20 text-white border-white/30 mb-4 capitalize">
                {selectedItem.category}
              </Badge>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {selectedItem.title}
              </h3>
              <p className="text-white/80 max-w-2xl mx-auto mb-4">
                {selectedItem.description}
              </p>
              <div className="flex items-center justify-center gap-6 text-white/60 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {selectedItem.date}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {selectedItem.location}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to Be Part of the Story?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Join VGSS and create your own memorable moments while serving in
            LoveWorld ministries. Your journey of impact starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/graduate/search">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Search Graduate Records
              </Button>
            </Link>
            <Link href="/blog">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Read Success Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
