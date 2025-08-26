/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, ilike, or, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated and is VGSS_OFFICE
    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];

    // Search filter
    if (search) {
      conditions.push(
        or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`))
      );
    }

    // Type filter
    if (type && type !== "all") {
      conditions.push(eq(users.type, type as any));
    }

    // Status filter
    if (status && status !== "all") {
      if (status === "active") {
        conditions.push(
          and(eq(users.accountStatus, "active"), eq(users.isDeactivated, false))
        );
      } else if (status === "pending") {
        conditions.push(eq(users.accountStatus, "pending_activation"));
      } else if (status === "deactivated") {
        conditions.push(eq(users.isDeactivated, true));
      }
    }

    // Execute query
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [userList, totalCount] = await Promise.all([
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          type: users.type,
          accountStatus: users.accountStatus,
          isDeactivated: users.isDeactivated,
          lastLoginAt: users.lastLoginAt,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(whereClause)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: users.id })
        .from(users)
        .where(whereClause)
        .then((result) => result.length),
    ]);

    // Get user statistics
    const stats = await db
      .select({
        type: users.type,
        accountStatus: users.accountStatus,
        isDeactivated: users.isDeactivated,
      })
      .from(users);

    const userStats = {
      total: stats.length,
      active: stats.filter(
        (u) => u.accountStatus === "active" && !u.isDeactivated
      ).length,
      pending: stats.filter((u) => u.accountStatus === "pending_activation")
        .length,
      deactivated: stats.filter((u) => u.isDeactivated).length,
      byType: {
        VGSS_OFFICE: stats.filter((u) => u.type === "VGSS_OFFICE").length,
        BLW_ZONE: stats.filter((u) => u.type === "BLW_ZONE").length,
        MINISTRY_OFFICE: stats.filter((u) => u.type === "MINISTRY_OFFICE")
          .length,
        GRADUATE: stats.filter((u) => u.type === "GRADUATE").length,
      },
    };

    return NextResponse.json({
      success: true,
      users: userList,
      stats: userStats,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
