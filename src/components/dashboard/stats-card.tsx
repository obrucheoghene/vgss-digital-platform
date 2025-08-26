// src/components/dashboard/stats-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  description?: string;
  loading?: boolean;
}

export function StatsCard({
  title,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  color,
  bgColor,
  description,
  loading = false,
}: StatsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-600" />;
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-600" />;
      default:
        return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
          </CardTitle>
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center animate-pulse",
              bgColor
            )}
          >
            <div className="w-4 h-4 bg-gray-300 rounded" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-2" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            bgColor
          )}
        >
          <Icon className={cn("w-4 h-4", color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {change && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {getTrendIcon()}
            <span className={cn("ml-1", getTrendColor())}>{change}</span>
            <span className="ml-1">from last month</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
