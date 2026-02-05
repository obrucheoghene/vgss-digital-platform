import {
  GraduationCap,
  ArrowRight,
  Globe,
  Building,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
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
              <Link href="/" className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <GraduationCap className="w-7 h-7 text-white" />
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
              </Link>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-xs">
                Volunteer Graduate Service Scheme - Transforming lives through
                dedicated service in our first working year with excellence and
                purpose.
              </p>
              <div className="flex space-x-4">
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
                  © {new Date().getFullYear()} LoveWorld Inc. All rights
                  reserved.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Volunteer Graduate Service Scheme Platform
                </p>
              </div>

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
  );
}
