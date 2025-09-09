import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, graduateData, zoneGraduates } from "@/lib/db/schema";
import { eq, desc, or, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    // Get recent graduate registrations
    const recentRegistrations = await db
      .select({
        id: graduateData.id,
        graduateFirstname: graduateData.graduateFirstname,
        graduateSurname: graduateData.graduateSurname,
        email: graduateData.email,
        status: graduateData.status,
        createdAt: graduateData.createdAt,
        zoneName: users.name,
      })
      .from(graduateData)
      .leftJoin(users, eq(graduateData.blwZoneId, users.id))
      .orderBy(desc(graduateData.createdAt))
      .limit(Math.floor(limit * 0.4)); // 40% of activities

    // Get recent zone graduate uploads
    const recentUploads = await db
      .select({
        id: zoneGraduates.id,
        zoneName: users.name,
        zoneEmail: users.email,
        createdAt: zoneGraduates.createdAt,
        isRegistered: zoneGraduates.isRegistered,
        graduateFirstname: zoneGraduates.graduateFirstname,
        graduateSurname: zoneGraduates.graduateSurname,
      })
      .from(zoneGraduates)
      .leftJoin(users, eq(zoneGraduates.userId, users.id))
      .orderBy(desc(zoneGraduates.createdAt))
      .limit(Math.floor(limit * 0.3)); // 30% of activities

    // Get recent status changes (approximated by recent updates)
    const recentStatusChanges = await db
      .select({
        id: graduateData.id,
        graduateFirstname: graduateData.graduateFirstname,
        graduateSurname: graduateData.graduateSurname,
        status: graduateData.status,
        updatedAt: graduateData.updatedAt,
        createdAt: graduateData.createdAt,
      })
      .from(graduateData)
      .where(
        // Only records that have been updated
        or(
          eq(graduateData.status, "Interviewed"),
          eq(graduateData.status, "Invited For Interview"),
          eq(graduateData.status, "Serving"),
          eq(graduateData.status, "Sighting")
        )
      )
      .orderBy(desc(graduateData.updatedAt))
      .limit(Math.floor(limit * 0.3)); // 30% of activities

    // Combine and format activities
    const activities: Array<{
      id: string;
      type: "registration" | "upload" | "status_change" | "interview";
      title: string;
      description: string;
      user: string;
      timestamp: Date;
      status?: string;
      metadata?: any;
    }> = [];

    // Add registration activities
    recentRegistrations.forEach((reg) => {
      activities.push({
        id: `reg-${reg.id}`,
        type: "registration",
        title: "New Graduate Registration",
        description: `${reg.graduateFirstname} ${reg.graduateSurname} completed registration`,
        user: `${reg.graduateFirstname} ${reg.graduateSurname}`,
        timestamp: reg.createdAt,
        status: reg.status.toLowerCase().replace(/\s+/g, "_"),
        metadata: {
          email: reg.email,
          zone: reg.zoneName,
        },
      });
    });

    // Add upload activities
    recentUploads.forEach((upload) => {
      activities.push({
        id: `upload-${upload.id}`,
        type: "upload",
        title: "Graduate Record Uploaded",
        description: `${upload.zoneName} uploaded graduate record for ${upload.graduateFirstname} ${upload.graduateSurname}`,
        user: upload.zoneName || "Unknown Zone",
        timestamp: upload.createdAt,
        status: upload.isRegistered ? "registered" : "pending_registration",
        metadata: {
          zoneEmail: upload.zoneEmail,
          graduateName: `${upload.graduateFirstname} ${upload.graduateSurname}`,
        },
      });
    });

    // Add status change activities
    recentStatusChanges.forEach((change) => {
      const statusDescriptions = {
        "Invited For Interview": "was invited for interview",
        Interviewed: "completed interview",
        Serving: "started service",
        Sighting: "is in sighting phase",
      };

      activities.push({
        id: `status-${change.id}`,
        type: "status_change",
        title: "Status Updated",
        description: `${change.graduateFirstname} ${change.graduateSurname} ${
          statusDescriptions[
            change.status as keyof typeof statusDescriptions
          ] || "status was updated"
        }`,
        user: `${change.graduateFirstname} ${change.graduateSurname}`,
        timestamp: change.updatedAt,
        status: change.status.toLowerCase().replace(/\s+/g, "_"),
        metadata: {
          previousStatus: "Under Review", // Would need audit log for actual previous status
          currentStatus: change.status,
        },
      });
    });

    // Sort all activities by timestamp (most recent first)
    activities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Take the most recent activities up to the limit
    const limitedActivities = activities.slice(0, limit);

    // Format timestamps for display
    const formattedActivities = limitedActivities.map((activity) => ({
      ...activity,
      timeAgo: getTimeAgo(activity.timestamp),
      formattedTime: activity.timestamp.toLocaleString(),
    }));

    return NextResponse.json({
      success: true,
      activities: formattedActivities,
      total: formattedActivities.length,
    });
  } catch (error) {
    console.error("Recent activity error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks !== 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString();
}
