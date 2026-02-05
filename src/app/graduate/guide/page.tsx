// src/app/graduate/guide/page.tsx
"use client";

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
  Search,
  GraduationCap,
  User,
  MapPin,
  BookOpen,
  Users,
  MessageSquare,
  Shield,
  ArrowRight,
  CheckCircle,
  FileText,
  AlertTriangle,
  ClipboardList,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const registrationSteps = [
  {
    step: 1,
    title: "Search Your Record",
    description:
      "Your BLW Zone must have uploaded your graduate details to the VGSS platform. Visit the search page and enter your surname to find your record.",
    icon: Search,
    color: "from-blue-500 to-cyan-500",
    tips: [
      "Use your official surname as registered with your BLW Zone",
      "If your record is not found, contact your Zone coordinator",
      "Ensure your details have been uploaded before attempting registration",
    ],
  },
  {
    step: 2,
    title: "Personal Information",
    description:
      "Provide your personal details including place of birth, date of birth, state of origin, home address, phone number, email, and marital status.",
    icon: User,
    color: "from-purple-500 to-pink-500",
    tips: [
      "Use a valid email address you have access to — it will be your login",
      "Ensure your phone number is active and reachable",
      "Provide your complete home address",
    ],
  },
  {
    step: 3,
    title: "Posting Preferences",
    description:
      "Indicate your preferred city for service posting and accommodation details. Let us know if you have accommodation arranged in your preferred city.",
    icon: MapPin,
    color: "from-emerald-500 to-teal-500",
    tips: [
      "Choose a city where you can realistically serve for one year",
      "If you have accommodation, provide the full address",
      "Include contact details of the person you will be living with, if applicable",
    ],
  },
  {
    step: 4,
    title: "Spiritual Journey",
    description:
      "Share details about your spiritual milestones — when and where you received Christ, the Holy Ghost, water baptism, and Foundation School attendance.",
    icon: BookOpen,
    color: "from-orange-500 to-amber-500",
    tips: [
      "Provide specific dates and locations for each milestone",
      "Indicate if you have your Foundation School certificate",
      "Include your current local assembly after graduation",
    ],
  },
  {
    step: 5,
    title: "Family Information",
    description:
      "Provide information about your parents (names, phone numbers, email, occupation, church) and family details including size and residence.",
    icon: Users,
    color: "from-red-500 to-rose-500",
    tips: [
      "Both parents' information is required where available",
      "Indicate whether your parents are aware of your VGSS intention",
      "Provide accurate family residence details",
    ],
  },
  {
    step: 6,
    title: "Education Information",
    description:
      "Your university, course, and graduation year are pre-filled from your uploaded record. You will need to select your grade/class of degree and NYSC status.",
    icon: GraduationCap,
    color: "from-indigo-500 to-violet-500",
    tips: [
      "University, course, and graduation year are read-only from your zone's upload",
      "Select your correct class of degree (First Class, Second Class Upper, etc.)",
      "Indicate your current NYSC status accurately",
    ],
  },
  {
    step: 7,
    title: "Skills & Experience",
    description:
      "List your skills, leadership roles held in ministry and fellowship, and ministry programs you have attended in the last year.",
    icon: ClipboardList,
    color: "from-cyan-500 to-blue-500",
    tips: [
      "Be thorough — list all relevant skills and talents",
      "Include both ministry and professional leadership experience",
      "Mention specific programs, conferences, and training attended",
    ],
  },
  {
    step: 8,
    title: "Test Questions",
    description:
      "Answer 11 detailed questions covering your knowledge of LoveWorld's vision, work ethics, partnership arms, ministry departments, and your personal motivations.",
    icon: MessageSquare,
    color: "from-pink-500 to-rose-500",
    tips: [
      "All questions are required — incomplete answers may lead to rejection",
      "Provide thoughtful, detailed responses",
      "Be honest and authentic in your answers",
      "Your responses will be reviewed by the VGSS Office",
    ],
  },
  {
    step: 9,
    title: "Create Account",
    description:
      "Set up your login credentials by choosing a strong password. This will be used to access your VGSS graduate dashboard after registration.",
    icon: Shield,
    color: "from-gray-600 to-gray-800",
    tips: [
      "Password must be at least 6 characters long",
      "Use a strong, memorable password",
      "You will use your email and this password to log in after registration",
    ],
  },
];

const documentsNeeded = [
  "Valid means of identification (National ID, Passport, or Driver's License)",
  "Proof of graduation or completion letter from your university",
  "Recent passport photograph",
  "Foundation School certificate (if available)",
  "NYSC certificate or proof of status",
];

export default function RegistrationGuidePage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-purple-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm mb-6 px-4 py-2">
            <FileText className="w-4 h-4 mr-2" />
            Registration Guide
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            How to{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              Register for VGSS
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            A complete step-by-step guide to help you navigate the VGSS
            registration process. Prepare everything you need before you begin.
          </p>

          <Link href="/graduate/search">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Start Registration
            </Button>
          </Link>
        </div>
      </section>

      {/* Before You Begin */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 mb-4 px-4 py-2">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Before You Begin
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Prerequisites & Documents
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Make sure you have the following ready before starting your
                registration to ensure a smooth process.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Prerequisites */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Prerequisites
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">
                      You must be a graduate from a {`Believers'`} LoveWorld
                      Campus Fellowship
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">
                      Your BLW Zone must have uploaded your graduate details to
                      the platform
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">
                      You must have completed or be in the process of completing
                      your university education
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">
                      You should have attended Foundation School
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Documents to Prepare
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {documentsNeeded.map((doc, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{doc}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-4 py-2">
                <ClipboardList className="w-4 h-4 mr-2" />
                Step-by-Step Guide
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Registration Steps
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Follow these steps to complete your VGSS registration. The form
                is divided into sections that you can navigate using the tabs.
              </p>
            </div>

            <div className="space-y-6">
              {registrationSteps.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.step}
                    className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Step Number & Icon */}
                      <div
                        className={`md:w-48 p-6 bg-gradient-to-br ${item.color} flex items-center justify-center`}
                      >
                        <div className="text-center text-white">
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-2">
                            <Icon className="w-7 h-7" />
                          </div>
                          <span className="text-sm font-bold opacity-80">
                            Step {item.step}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <CardTitle className="text-xl mb-3">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-base mb-4">
                          {item.description}
                        </CardDescription>

                        {/* Tips */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                            Tips
                          </h4>
                          <ul className="space-y-1.5">
                            {item.tips.map((tip, tipIndex) => (
                              <li
                                key={tipIndex}
                                className="text-sm text-gray-600 flex items-start"
                              >
                                <span className="text-primary mr-2 mt-0.5">
                                  &bull;
                                </span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-red-50 text-red-700 border-red-200 mb-4 px-4 py-2">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Important Notes
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Things to Remember
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-0 shadow-lg border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Save Your Progress
                  </h3>
                  <p className="text-gray-600 text-sm">
                    The registration form has multiple tabs. You can navigate
                    between tabs, but make sure to fill in all required fields
                    (marked with *) before submitting.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg border-l-4 border-l-yellow-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Test Questions
                  </h3>
                  <p className="text-gray-600 text-sm">
                    The test questions section is critical. Take your time to
                    provide thoughtful, detailed answers. Incomplete or
                    low-effort responses may result in your registration being
                    rejected.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Account Access
                  </h3>
                  <p className="text-gray-600 text-sm">
                    After successful registration, you will be redirected to the
                    login page. Use the email and password you provided during
                    registration to access your graduate dashboard.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Need Help?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    If you encounter any issues during registration, contact the
                    VGSS support team at{" "}
                    <a
                      href="mailto:vgss@loveworld.org"
                      className="text-primary hover:underline"
                    >
                      vgss@loveworld.org
                    </a>{" "}
                    or check the{" "}
                    <Link
                      href="/graduate/faq"
                      className="text-primary hover:underline"
                    >
                      FAQ page
                    </Link>{" "}
                    for common questions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Register?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Now that you know what to expect, start by searching for your
            graduate record. Make sure your BLW Zone has uploaded your details
            first.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/graduate/search">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Graduate Records
              </Button>
            </Link>
            <Link href="/graduate/faq">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                View FAQ
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
