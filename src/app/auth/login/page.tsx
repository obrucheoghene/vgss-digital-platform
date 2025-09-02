// src/app/auth/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Eye,
  EyeOff,
  Shield,
  Users,
  Building,
  GraduationCap,
  ArrowLeft,
  Sparkles,
  Lock,
  Mail,
  Crown,
  Zap,
  Target,
  CheckCircle,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      const session = await getSession();

      if (session?.user) {
        if (session.user.accountStatus === "pending_activation") {
          router.push("/auth/activate-account");
          return;
        }

        switch (session.user.type) {
          case "VGSS_OFFICE":
            router.push("/dashboard/vgss-office");
            break;
          case "BLW_ZONE":
            router.push("/dashboard/blw-zone");
            break;
          case "SERVICE_DEPARTMENT":
            router.push("/dashboard/service-department");
            break;
          case "GRADUATE":
            router.push("/dashboard/graduate");
            break;
          default:
            router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const userTypes = [
    {
      icon: Shield,
      label: "VGSS Office",
      description: "Administrative Access",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      label: "BLW Zone",
      description: "Graduate Management",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Building,
      label: "Service Department",
      description: "Ministry Operations",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: GraduationCap,
      label: "Graduate",
      description: "Personal Dashboard",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Revolutionary Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-20 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        ))}
      </div>

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/">
          <Button
            variant="outline"
            className="border-white/30 bg-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-xl  gap-12 items-center">
          {/* Right Side - Login Form */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isLoaded
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            <Card className="bg-white/10 backdrop-blur-2xl border-white/20 shadow-2xl">
              <CardHeader className="space-y-6 pb-8">
                {/* Status Badge */}
                <div className="text-center">
                  <Badge className="bg-green-500/20 text-green-100 border-green-400/30 backdrop-blur-sm px-4 py-2">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Secure Login Portal
                  </Badge>
                </div>

                <div className="text-center space-y-2">
                  <CardTitle className="text-2xl font-bold text-white">
                    Sign in to Continue
                  </CardTitle>
                  <CardDescription className="text-white/70 text-base">
                    Enter your credentials to access your dashboard
                  </CardDescription>
                </div>
              </CardHeader>

              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert
                      variant="destructive"
                      className="bg-red-500/10 border-red-400/30 text-red-100 animate-in slide-in-from-top-1 duration-300"
                    >
                      <AlertDescription className="text-red-200">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-white font-medium flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 px-4 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-white/20 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-white font-medium flex items-center"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-12 px-4 pr-12 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-white/20 backdrop-blur-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 rounded border-white/30 bg-white/10 text-primary focus:ring-white/20"
                      />
                      <label htmlFor="remember" className="text-white/80">
                        Remember me
                      </label>
                    </div>
                    <a
                      href="/auth/forgot-password"
                      className="text-white/80 hover:text-white underline-offset-4 hover:underline transition-colors duration-200"
                    >
                      Forgot password?
                    </a>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-6 pt-6">
                  <Button
                    type="submit"
                    className="w-full h-12 bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    )}
                    {isLoading ? "Signing In..." : "Sign In to Dashboard"}
                  </Button>

                  {/* New Graduate CTA */}
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <GraduationCap className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                    <p className="text-white/90 text-sm mb-3 font-medium">
                      New graduate looking to register?
                    </p>
                    <Link
                      href="/graduate/search"
                      className="inline-flex items-center text-yellow-300 hover:text-yellow-200 transition-colors duration-200 font-semibold"
                    >
                      Search for your record to register
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>

            {/* User Type Indicators */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {userTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <div
                    key={index}
                    className="group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  >
                    <div
                      className={`w-8 h-8 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-white font-medium text-sm">
                      {type.label}
                    </p>
                    <p className="text-white/60 text-xs">{type.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
