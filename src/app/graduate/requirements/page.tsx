// src/app/graduate/requirements/page.tsx
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
  ArrowRight,
  CheckCircle,
  XCircle,
  FileText,
  UserCheck,
  BookOpen,
  Globe,
  Clock,
  Heart,
  Shield,
  Briefcase,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const eligibilityRequirements = [
  {
    title: "BLW Campus Fellowship Member",
    description:
      "You must be a graduate who was an active member of a Believers' LoveWorld Campus Fellowship during your university education.",
    icon: Heart,
    required: true,
  },
  {
    title: "Completed University Education",
    description:
      "You must have completed your degree program at an accredited university. Final-year students awaiting results may also be considered.",
    icon: GraduationCap,
    required: true,
  },
  {
    title: "Zone Upload Verification",
    description:
      "Your BLW Zone must have uploaded your graduate details to the VGSS platform. Contact your Zone coordinator to confirm this has been done.",
    icon: Shield,
    required: true,
  },
  {
    title: "Foundation School Attendance",
    description:
      "You should have attended and completed Foundation School. Having your Foundation School certificate is an advantage.",
    icon: BookOpen,
    required: true,
  },
  {
    title: "One-Year Commitment",
    description:
      "You must be willing and able to commit your first working year after graduation to full-time volunteer service in a LoveWorld ministry department.",
    icon: Clock,
    required: true,
  },
  {
    title: "Parental Awareness",
    description:
      "Your parents or guardians should be aware of and supportive of your decision to participate in the VGSS program.",
    icon: UserCheck,
    required: true,
  },
];

const documentRequirements = [
  {
    title: "Valid Identification",
    description:
      "A government-issued ID such as a National ID card, International Passport, or Driver's License. The ID must be current and not expired.",
    required: true,
  },
  {
    title: "Proof of Graduation",
    description:
      "An official graduation certificate, statement of result, or completion letter from your university confirming you have finished your degree program.",
    required: true,
  },
  {
    title: "Passport Photograph",
    description:
      "A recent, clear passport-sized photograph with a plain background. The photo should be taken within the last 6 months.",
    required: true,
  },
  {
    title: "Foundation School Certificate",
    description:
      "Your Foundation School certificate if available. If you do not have the physical certificate, indicate this during registration.",
    required: false,
  },
  {
    title: "NYSC Certificate or Status Proof",
    description:
      "Your NYSC discharge or exemption certificate, or a letter confirming your current NYSC status if still in progress.",
    required: false,
  },
];

const serviceCommitments = [
  {
    title: "Full-Time Availability",
    description:
      "VGSS is a full-time volunteer commitment. You are expected to be available during standard working hours (Monday to Friday) and for special events as required by your department.",
  },
  {
    title: "Professional Conduct",
    description:
      "Maintain a high standard of professionalism, integrity, and excellence in all your duties. You represent LoveWorld ministries in your service role.",
  },
  {
    title: "Training Participation",
    description:
      "Actively participate in all orientation sessions, leadership training workshops, mentorship programs, and department-specific training provided.",
  },
  {
    title: "Department Assignment",
    description:
      "Accept and serve diligently in your assigned service department. While preferences are considered, final placements are based on organizational needs and your skills.",
  },
  {
    title: "Fellowship & Spiritual Growth",
    description:
      "Maintain an active spiritual life, attend fellowship meetings, and continue to grow in your relationship with God throughout your service year.",
  },
  {
    title: "Reporting & Accountability",
    description:
      "Submit required reports, maintain attendance records, and be accountable to your department supervisor and the VGSS administration.",
  },
];

const skillsLookedFor = [
  { name: "Leadership & Team Management", category: "Leadership" },
  { name: "Communication (Written & Oral)", category: "Soft Skills" },
  { name: "Administration & Office Management", category: "Administration" },
  { name: "Media Production & Content Creation", category: "Media" },
  { name: "Graphic Design & Visual Arts", category: "Creative" },
  { name: "Video & Audio Production", category: "Media" },
  { name: "Teaching & Training", category: "Education" },
  { name: "IT & Technical Support", category: "Technology" },
  { name: "Social Media Management", category: "Media" },
  { name: "Event Planning & Coordination", category: "Administration" },
  { name: "Writing & Journalism", category: "Creative" },
  { name: "Finance & Accounting", category: "Administration" },
];

export default function RequirementsPage() {
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
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Requirements
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            VGSS{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              Requirements
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Everything you need to know about eligibility criteria, required
            documents, and service commitments for the VGSS program.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-black">6</div>
              <div className="text-white/70 text-sm">Eligibility Criteria</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black">5</div>
              <div className="text-white/70 text-sm">Documents Needed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black">1 Year</div>
              <div className="text-white/70 text-sm">Service Commitment</div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Requirements */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-green-50 text-green-700 border-green-200 mb-4 px-4 py-2">
                <UserCheck className="w-4 h-4 mr-2" />
                Eligibility
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Who Can Apply?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                To participate in VGSS, you must meet all of the following
                eligibility criteria.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {eligibilityRequirements.map((req) => {
                const Icon = req.icon;
                return (
                  <Card
                    key={req.title}
                    className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs text-green-600 border-green-200 bg-green-50"
                        >
                          Required
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-3">{req.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {req.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Document Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 mb-4 px-4 py-2">
                <FileText className="w-4 h-4 mr-2" />
                Documents
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Required Documents
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Prepare these documents before starting your registration. Items
                marked as required must be provided; others are recommended.
              </p>
            </div>

            <div className="space-y-4">
              {documentRequirements.map((doc, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          doc.required
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {doc.required ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {doc.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              doc.required
                                ? "text-green-600 border-green-200 bg-green-50"
                                : "text-gray-500 border-gray-200 bg-gray-50"
                            }`}
                          >
                            {doc.required ? "Required" : "Recommended"}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{doc.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Commitments */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-purple-50 text-purple-700 border-purple-200 mb-4 px-4 py-2">
                <Briefcase className="w-4 h-4 mr-2" />
                Commitments
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Service Commitments
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                As a VGSS volunteer, you are expected to uphold the following
                commitments throughout your year of service.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {serviceCommitments.map((commitment, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {commitment.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {commitment.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Qualities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 mb-4 px-4 py-2">
                <Globe className="w-4 h-4 mr-2" />
                Skills in Demand
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Skills We Look For
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                While all graduates are welcome, having any of these skills can
                help match you to the right service department. {`Don't`} worry
                if you {`don't`} have all of them — training is provided.
              </p>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-3">
                  {skillsLookedFor.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-4 py-2 text-sm font-medium"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
                <p className="text-gray-500 text-sm mt-6 text-center">
                  This is not an exhaustive list. All skills and talents are
                  valuable in ministry service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Eligibility Checklist */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-4 py-2">
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Quick Check
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Am I Eligible?
              </h2>
              <p className="text-gray-600">
                Use this quick checklist to determine if you meet the basic
                requirements.
              </p>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 space-y-4">
                {[
                  "I am a graduate of a Believers' LoveWorld Campus Fellowship",
                  "I have completed (or am completing) my university degree",
                  "My BLW Zone has uploaded my details to the VGSS platform",
                  "I have attended Foundation School",
                  "I am willing to commit one full year to volunteer service",
                  "My parents/guardians are aware of my intention",
                  "I have valid identification documents",
                  "I can provide proof of graduation",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-transparent" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
                <div className="pt-4 border-t mt-6">
                  <p className="text-sm text-gray-500 text-center">
                    If you checked all items, you are likely eligible for VGSS.
                    Proceed to search for your record and begin registration.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet the Requirements?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            If you meet the eligibility criteria and have your documents ready,
            {`it's`} time to take the next step. Search for your record and
            begin your VGSS journey.
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
            <Link href="/graduate/guide">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Registration Guide
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
