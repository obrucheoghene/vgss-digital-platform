// src/app/auth/login/page.tsx
"use client";

import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Eye,
  EyeOff,
  Shield,
  Users,
  Building,
  GraduationCap,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
          case "MINISTRY_OFFICE":
            router.push("/dashboard/ministry-office");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-foreground/20 rounded-full animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-primary-foreground/12 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-48 h-48 bg-primary-foreground/28 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-primary-foreground/16 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative">
        <Card className="backdrop-blur-sm bg-card/95 border-border/20 shadow-2xl">
          <CardHeader className="space-y-4 pb-8">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                VGSS Platform
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Volunteer Graduate Service Scheme
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <Alert
                  variant="destructive"
                  className="animate-in slide-in-from-top-1 duration-300"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
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
                  className="h-11 px-4 bg-background/50 border-border/60 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
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
                    className="h-11 px-4 pr-12 bg-background/50 border-border/60 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center">
                <a
                  href="/auth/forgot-password"
                  className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-colors duration-200"
                >
                  Forgot your password?
                </a>
              </div>
            </CardFooter>
          </form>
        </Card>

        <Card className="mt-6 backdrop-blur-sm bg-card/80 border-border/20">
          <CardContent className="p-4">
            <div className="text-center">
              <GraduationCap className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground mb-2">
                New graduate looking to register?
              </p>
              <a
                href="/graduate/search"
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
              >
                Search for your record to register
                <svg
                  className="ml-1 w-4 h-4"
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
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-center p-3 rounded-lg bg-card/40 backdrop-blur-sm border border-border/20">
            <Shield className="w-4 h-4 mr-2 text-primary" />
            <span className="text-muted-foreground">VGSS Office</span>
          </div>
          <div className="flex items-center justify-center p-3 rounded-lg bg-card/40 backdrop-blur-sm border border-border/20">
            <Users className="w-4 h-4 mr-2 text-primary" />
            <span className="text-muted-foreground">BLW Zone</span>
          </div>
          <div className="flex items-center justify-center p-3 rounded-lg bg-card/40 backdrop-blur-sm border border-border/20">
            <Building className="w-4 h-4 mr-2 text-primary" />
            <span className="text-muted-foreground">Service Department</span>
          </div>
          <div className="flex items-center justify-center p-3 rounded-lg bg-card/40 backdrop-blur-sm border border-border/20">
            <GraduationCap className="w-4 h-4 mr-2 text-primary" />
            <span className="text-muted-foreground">Graduate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
