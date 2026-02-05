// src/app/graduate/faq/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Search,
  GraduationCap,
  FileText,
  UserCheck,
  Globe,
  Clock,
  Shield,
  BookOpen,
  ArrowRight,
  MessageCircle,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const faqCategories = [
  { id: "all", name: "All Questions", icon: HelpCircle },
  { id: "general", name: "General", icon: BookOpen },
  { id: "eligibility", name: "Eligibility", icon: UserCheck },
  { id: "registration", name: "Registration", icon: FileText },
  { id: "service", name: "Service Year", icon: Clock },
  { id: "support", name: "Support", icon: Shield },
];

const faqs = [
  {
    id: "1",
    category: "general",
    question: "What is the Volunteer Graduate Service Scheme (VGSS)?",
    answer:
      "The Volunteer Graduate Service Scheme (VGSS) is a unique program designed by Rev Dr. Chris Oyakhilome PhD, giving young graduates from Believers' LoveWorld Campus Fellowships the opportunity to give their first working year to God as first fruit through service in Service Departments, departments, or churches across LoveWorld ministries worldwide.",
  },
  {
    id: "2",
    category: "general",
    question: "What is the purpose of VGSS?",
    answer:
      "VGSS is designed to help graduates dedicate their first working year to God as a first fruit offering. During this time, volunteers gain ministry training, develop leadership skills, and gain professional experience while serving in various LoveWorld ministry departments.",
  },
  {
    id: "3",
    category: "general",
    question: "How long does the VGSS program last?",
    answer:
      "The VGSS program runs for one full year. Volunteers commit their first working year after graduation to serving in their assigned ministry department or church.",
  },
  {
    id: "4",
    category: "general",
    question: "Is VGSS available internationally?",
    answer:
      "Yes, VGSS operates across multiple countries worldwide wherever LoveWorld ministries have a presence. Graduates can serve in various locations depending on available positions and organizational needs.",
  },
  {
    id: "5",
    category: "eligibility",
    question: "Who is eligible to participate in VGSS?",
    answer:
      "VGSS is open to fresh graduates from Believers' LoveWorld (BLW) Campus Fellowships who have completed their university education and are ready to dedicate their first working year to God through service.",
  },
  {
    id: "6",
    category: "eligibility",
    question: "Do I need to be a member of a BLW Campus Fellowship?",
    answer:
      "Yes, VGSS is specifically designed for graduates who have been members of Believers' LoveWorld Campus Fellowships during their university education. Your BLW Zone must upload your graduate details for you to be eligible.",
  },
  {
    id: "7",
    category: "eligibility",
    question: "Can postgraduate students apply for VGSS?",
    answer:
      "VGSS primarily targets fresh graduates giving their first working year to God. If you are a postgraduate student and have not previously participated in VGSS, you may be eligible. Contact your BLW Zone coordinator for specific guidance on your situation.",
  },
  {
    id: "8",
    category: "eligibility",
    question: "Is there an age limit for VGSS participants?",
    answer:
      "There is no strict age limit for VGSS participation. The program is open to all qualifying graduates from BLW Campus Fellowships regardless of age, as long as they meet the other eligibility criteria.",
  },
  {
    id: "9",
    category: "registration",
    question: "How do I register for VGSS?",
    answer:
      "Registration involves three simple steps: First, search for your graduate record on the VGSS platform using your surname (your BLW Zone must have uploaded your details). Second, complete the registration form with your full profile, answer interview questions, and submit required documents. Third, await your service department assignment.",
  },
  {
    id: "10",
    category: "registration",
    question: "What documents do I need for registration?",
    answer:
      "You will need to provide valid identification, proof of graduation or completion of your university program, a recent passport photograph, and any other documents specified during the registration process. Ensure all documents are clear and up to date.",
  },
  {
    id: "11",
    category: "registration",
    question: "My record is not showing up in the search. What should I do?",
    answer:
      "If your record does not appear in the search results, it means your BLW Zone has not yet uploaded your graduate details. Please contact your BLW Zone coordinator or campus fellowship pastor to ensure your information is uploaded to the VGSS platform.",
  },
  {
    id: "12",
    category: "registration",
    question: "Can I edit my registration details after submission?",
    answer:
      "Some details can be updated after initial submission through your graduate dashboard. However, certain critical information may require administrative approval to change. Log in to your dashboard to view which fields can be edited, or contact support for assistance.",
  },
  {
    id: "13",
    category: "registration",
    question: "When is the registration deadline?",
    answer:
      "Registration timelines vary by intake period and location. Check with your BLW Zone coordinator for specific deadlines, and ensure your registration is completed well in advance to secure your preferred service department placement.",
  },
  {
    id: "14",
    category: "service",
    question: "What service departments are available?",
    answer:
      "VGSS offers a wide range of service areas including Administration, Media & Communications, Education & Training, Ministry Operations, Technology, Finance, and more. Each department provides unique opportunities for professional growth and ministry impact.",
  },
  {
    id: "15",
    category: "service",
    question: "Can I choose which department I serve in?",
    answer:
      "During registration, you can indicate your preferred service areas and skills. While every effort is made to match volunteers with their preferences, final assignments are based on organizational needs, available positions, and the skills and qualifications of each volunteer.",
  },
  {
    id: "16",
    category: "service",
    question: "What kind of training will I receive?",
    answer:
      "VGSS provides comprehensive training including orientation sessions, leadership development workshops, ministry training, and professional skills development. You will also receive on-the-job mentorship from experienced staff in your assigned department.",
  },
  {
    id: "17",
    category: "service",
    question: "Will I receive a certificate after completing VGSS?",
    answer:
      "Yes, volunteers who successfully complete their year of service receive a certificate of completion. Outstanding volunteers may also receive special recognition awards during the graduation ceremony.",
  },
  {
    id: "18",
    category: "service",
    question: "What are the expected working hours during VGSS?",
    answer:
      "Working hours follow the standard schedule of your assigned service department, typically Monday through Friday. Some departments may have additional requirements during special events or programs. Specific schedules are communicated during orientation.",
  },
  {
    id: "19",
    category: "support",
    question: "Who do I contact if I have issues during my service year?",
    answer:
      "You can reach out to your department supervisor, your BLW Zone coordinator, or the VGSS support team via email at vgss@loveworld.org or by calling +234 1 234 567 890. Support is available Monday through Friday, 8:00 AM to 6:00 PM WAT.",
  },
  {
    id: "20",
    category: "support",
    question: "Is there accommodation provided for VGSS volunteers?",
    answer:
      "Accommodation arrangements vary by location and service department. Some placements may include accommodation support, while others may not. Check with your assigned department or BLW Zone coordinator for details specific to your placement.",
  },
  {
    id: "21",
    category: "support",
    question: "Can I defer my VGSS participation?",
    answer:
      "Deferral requests are handled on a case-by-case basis. If you have a valid reason for deferring, contact your BLW Zone coordinator as soon as possible to discuss your options. Early communication is essential for deferral consideration.",
  },
  {
    id: "22",
    category: "support",
    question: "How can I give feedback about the VGSS program?",
    answer:
      "We value your feedback! You can share your experience and suggestions through the VGSS support email (vgss@loveworld.org), through your department supervisor, or during the periodic feedback sessions organized throughout the service year.",
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return faqs.length;
    return faqs.filter((faq) => faq.category === categoryId).length;
  };

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
            <HelpCircle className="w-4 h-4 mr-2" />
            FAQ
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Find answers to common questions about the VGSS program,
            eligibility, registration process, and your service year.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-14 bg-white/90 border-0 text-lg placeholder:text-gray-500 shadow-lg rounded-xl pl-12"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar - Categories */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {faqCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                            selectedCategory === category.id
                              ? "bg-primary text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <span className="font-medium flex items-center">
                            <Icon className="w-4 h-4 mr-2" />
                            {category.name}
                          </span>
                          <Badge
                            variant={
                              selectedCategory === category.id
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {getCategoryCount(category.id)}
                          </Badge>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-primary to-purple-600 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Still Have Questions?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80 text-sm">
                      {`Can't`} find what {`you're`} looking for? Reach out to
                      our support team.
                    </p>
                    <a href="mailto:vgss@loveworld.org">
                      <Button className="w-full bg-white text-primary hover:bg-white/90">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Support
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* FAQ List */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "all"
                    ? "All Questions"
                    : faqCategories.find((c) => c.id === selectedCategory)
                        ?.name}
                </h2>
                <Badge variant="outline" className="text-sm">
                  {filteredFaqs.length}{" "}
                  {filteredFaqs.length === 1 ? "question" : "questions"}
                </Badge>
              </div>

              {filteredFaqs.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="py-16 text-center">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No questions found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Try adjusting your search term or selecting a different
                      category.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-primary">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600 leading-relaxed text-base">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Begin Your VGSS Journey?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Now that you have the answers, take the next step. Search for your
            graduate record and start the registration process today.
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
