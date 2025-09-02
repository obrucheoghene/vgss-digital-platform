// src/components/graduate/registration-success.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Clock,
  User,
  Mail,
  MapPin,
  Calendar,
  ArrowRight,
  Download,
  FileText,
  Users,
  Building,
} from "lucide-react";
import Link from "next/link";

interface RegistrationSuccessProps {
  graduateData: {
    name: string;
    email: string;
    fellowship: string;
    zone: string;
    status: string;
  };
  nextSteps: string[];
}

export function RegistrationSuccess({
  graduateData,
  nextSteps,
}: RegistrationSuccessProps) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/auth/login";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Success Header */}
        <Card className="text-center border-green-200 bg-green-50/50">
          <CardContent className="pt-8 pb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              Registration Successful! 🎉
            </h1>
            <p className="text-green-700 text-lg">
              Welcome to the Volunteer Graduate Service Scheme
            </p>
            <div className="mt-4">
              <Badge className="bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1">
                Application Status: {graduateData.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Graduate Information Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Your Registration Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{graduateData.name}</p>
                  <p className="text-sm text-muted-foreground">Graduate Name</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">{graduateData.email}</p>
                  <p className="text-sm text-muted-foreground">Login Email</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">{graduateData.fellowship}</p>
                  <p className="text-sm text-muted-foreground">Fellowship</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Building className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">{graduateData.zone}</p>
                  <p className="text-sm text-muted-foreground">BLW Zone</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              What Happens Next?
            </CardTitle>
            <CardDescription>
              Follow these steps to complete your VGSS journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nextSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-1">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Save your login credentials safely. You
            will need your email address and password to access your graduate
            dashboard. Check your email for any updates from the VGSS Office
            regarding your application status.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/auth/login" className="flex-1">
            <Button
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Continue to Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.print()}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Print Confirmation
          </Button>
        </div>

        {/* Auto-redirect Notice */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            You will be automatically redirected to login in{" "}
            <span className="font-bold text-primary">{countdown}</span> seconds
          </p>
          <Button
            variant="link"
            size="sm"
            onClick={() => (window.location.href = "/auth/login")}
            className="text-xs"
          >
            Go to Login Now
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center border-t pt-6">
          <p className="text-xs text-muted-foreground">
            © 2024 LoveWorld Inc. - Volunteer Graduate Service Scheme
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            For support, contact: vgss@loveworld.org
          </p>
        </div>
      </div>
    </div>
  );
}
