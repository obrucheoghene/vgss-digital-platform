import { NextRequest, NextResponse } from "next/server";
import { graduateData, users } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { count, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const [departmentsResults, departmentsCurrentStaffCount] =
      await Promise.all([
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
          .where(eq(users.type, "SERVICE_DEPARTMENT")),

        db
          .select({
            serviceDepartmentId: graduateData.serviceDepartmentId,
            count: count(),
          })
          .from(graduateData)
          .groupBy(graduateData.serviceDepartmentId),
      ]);

    const results = departmentsResults.map((dept) => ({
      ...dept,
      staffCounts:
        departmentsCurrentStaffCount.find(
          (value) => value.serviceDepartmentId === dept.id
        )?.count || 0,
    }));

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.log("Service Deparment Request Failed", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
