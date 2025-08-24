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
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";

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
    // Redirect if user is not logged in or account is already activated
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    if (session.user.accountStatus === "active") {
      // Redirect to appropriate dashboard
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate passwords
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

      // Account activated successfully - redirect to dashboard
      switch (session?.user.type) {
        case "VGSS_OFFICE":
          router.push("/dashboard/vgss-office");
          break;
        case "BLW_ZONE":
          router.push("/dashboard/blw-zone");
          break;
        case "MINISTRY_OFFICE":
          router.push("/dashboard/ministry-office");
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session || session.user.accountStatus === "active") {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-vgss px-4">
      <Card className="w-full max-w-md glass-effect">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Activate Your Account
          </CardTitle>
          <CardDescription className="text-gray-200">
            Welcome, {session.user.name}! Please set a new password to activate
            your account.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-blue-100 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Account Type:</strong>{" "}
                {session.user.type.replace("_", " ")}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Email:</strong> {session.user.email}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-white">
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
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
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
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-300">
              Password Requirements:
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Minimum 6 characters long</li>
                <li>Must match confirmation</li>
              </ul>
            </div>
          </CardContent>

          <div className="px-6 pb-6">
            <Button
              type="submit"
              className="w-full bg-white text-blue-600 hover:bg-gray-100"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Activate Account
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
