// src/app/dashboard/vgss-office/create-account/page.tsx
"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  UserPlus,
  Building,
  Users,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function CreateAccountPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    password: "VgssTemp123", // Default password
    customPassword: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const accountTypes = [
    {
      value: "BLW_ZONE",
      label: "BLW Zone",
      description: "Can upload and manage graduate records",
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      value: "MINISTRY_OFFICE",
      label: "Service Deparment",
      description: "Can request and manage VGSS staff",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      value: "VGSS_OFFICE",
      label: "VGSS Office",
      description: "Full administrative access",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          type: formData.type,
          password: formData.customPassword ? formData.password : "VgssTemp123",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      setMessage({
        type: "success",
        text: `Account created successfully! User will need to activate with ${
          formData.customPassword ? "provided" : "default"
        } password.`,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        type: "",
        password: "VgssTemp123",
        customPassword: false,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to create account",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAccountType = accountTypes.find(
    (type) => type.value === formData.type
  );

  return (
    <DashboardLayout title="Create New Account">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">Create New User Account</h2>
          <p className="text-muted-foreground mt-2">
            Create accounts for BLW Zones, Service Deparments, or other VGSS
            Office users
          </p>
        </div>

        {/* Account Types Preview */}
        <div className="grid gap-4 md:grid-cols-3">
          {accountTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = formData.type === type.value;
            return (
              <Card
                key={type.value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "ring-2 ring-primary shadow-md" : ""
                }`}
                onClick={() => setFormData({ ...formData, type: type.value })}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${type.bgColor}`}
                    >
                      <Icon className={`w-5 h-5 ${type.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{type.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Account Details
            </CardTitle>
            {selectedAccountType && (
              <CardDescription>
                Creating a {selectedAccountType.label} account
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
                className="mb-6"
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="type">Account Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Options */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="customPassword"
                    checked={formData.customPassword}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({
                        ...formData,
                        customPassword: checked as boolean,
                        password: checked ? "" : "VgssTemp123",
                      })
                    }
                  />
                  <Label htmlFor="customPassword">
                    Set custom temporary password
                  </Label>
                </div>

                {formData.customPassword ? (
                  <div className="space-y-2">
                    <Label htmlFor="password">Temporary Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter temporary password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Default password:</strong> VgssTemp123
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      User will be required to change this password on first
                      login
                    </p>
                  </div>
                )}
              </div>

              {/* Account Permissions Preview */}
              {selectedAccountType && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">
                    Account Permissions
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    {selectedAccountType.value === "BLW_ZONE" && (
                      <ul className="space-y-1">
                        <li>• Upload graduate records via CSV/Excel</li>
                        <li>• Monitor graduate registration status</li>
                        <li>• View zone-specific reports</li>
                        <li>• Manage fellowship information</li>
                      </ul>
                    )}
                    {selectedAccountType.value === "MINISTRY_OFFICE" && (
                      <ul className="space-y-1">
                        <li>• Request VGSS staff assignments</li>
                        <li>• Manage assigned graduates</li>
                        <li>• Process salary payments via Espees</li>
                        <li>• Submit staff feedback and evaluations</li>
                      </ul>
                    )}
                    {selectedAccountType.value === "VGSS_OFFICE" && (
                      <ul className="space-y-1">
                        <li>• Full administrative access</li>
                        <li>• Create and manage all account types</li>
                        <li>• Review and approve graduates</li>
                        <li>• Manage placements and assignments</li>
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      name: "",
                      email: "",
                      type: "",
                      password: "VgssTemp123",
                      customPassword: false,
                    })
                  }
                  disabled={isLoading}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !formData.name ||
                    !formData.email ||
                    !formData.type
                  }
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
