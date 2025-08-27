// src/app/auth/activate-account/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  Key,
  Shield,
  User,
  Mail,
} from "lucide-react";

export default function ActivateAccountPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    if (session.user.accountStatus === "active") {
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
        default:
          router.push("/dashboard");
      }
    }
  }, [session, status, router]);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    return errors;
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6)
      return { strength: 25, label: "Weak", color: "bg-red-500" };
    if (password.length < 8)
      return { strength: 50, label: "Fair", color: "bg-orange-500" };
    if (password.length < 12)
      return { strength: 75, label: "Good", color: "bg-blue-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const passwordErrors = validatePassword(newPassword);

    if (passwordErrors.length > 0) {
      setError(passwordErrors[0]);
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/activate-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to activate account");
      }

      switch (session?.user.type) {
        case "VGSS_OFFICE":
          router.push("/dashboard/vgss-office");
          break;
        case "BLW_ZONE":
          router.push("/dashboard/blw-zone");
          break;
        case "SERVICE_DEPARTMENT":
          router.push("/dashboard/service-department");
          break;
        default:
          router.push("/dashboard");
      }
    } catch (error) {
      console.error("Account activation error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to activate account"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
          <p className="text-primary-foreground/80">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.accountStatus === "active") {
    return null;
  }

  const passwordStrength = getPasswordStrength(newPassword);
  const userTypeColors = {
    VGSS_OFFICE: "bg-purple-100 text-purple-800 border-purple-200",
    BLW_ZONE: "bg-blue-100 text-blue-800 border-blue-200",
    SERVICE_DEPARTMENT: "bg-green-100 text-green-800 border-green-200",
    GRADUATE: "bg-orange-100 text-orange-800 border-orange-200",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-foreground/5 rounded-full animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-primary-foreground/3 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-48 h-48 bg-primary-foreground/7 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-primary-foreground/4 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative">
        <Card className="backdrop-blur-sm bg-card/95 border-border/20 shadow-2xl">
          <CardHeader className="space-y-4 pb-6">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-3 text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Activate Your Account
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Welcome! Please set a new password to activate your account and
                get started.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* User Info Card */}
            <div className="bg-background/50 rounded-lg p-4 space-y-3 border border-border/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{session.user.name}</p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      <span>{session.user.email}</span>
                    </div>
                  </div>
                </div>
                <Badge
                  className={
                    userTypeColors[
                      session.user.type as keyof typeof userTypeColors
                    ] || "bg-gray-100 text-gray-800"
                  }
                >
                  {session.user.type.replace("_", " ")}
                </Badge>
              </div>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-top-1 duration-300"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-sm font-medium flex items-center"
                >
                  <Key className="w-4 h-4 mr-1" />
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password (min. 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 px-4 pr-12 bg-background/50 border-border/60 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Password Strength
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength.strength >= 75
                            ? "text-green-600"
                            : passwordStrength.strength >= 50
                            ? "text-blue-600"
                            : "text-red-600"
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium flex items-center"
                >
                  <Shield className="w-4 h-4 mr-1" />
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 px-4 pr-12 bg-background/50 border-border/60 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div className="flex items-center space-x-2 text-xs">
                    {newPassword === confirmPassword ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span className="text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-red-600">
                          Passwords do not match
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-muted/50 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  Password Requirements:
                </h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        newPassword.length >= 6 ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    <span>Minimum 6 characters long</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        newPassword === confirmPassword && confirmPassword
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <span>Must match confirmation</span>
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                disabled={
                  isLoading ||
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword
                }
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Activating Account..." : "Activate Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
