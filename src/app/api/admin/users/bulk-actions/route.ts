// src/app/api/admin/users/bulk-actions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, userIds } = await req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "User IDs are required" },
        { status: 400 }
      );
    }

    // Prevent actions on self
    if (userIds.includes(session.user.id)) {
      return NextResponse.json(
        { error: "Cannot perform bulk actions on your own account" },
        { status: 400 }
      );
    }

    let updatedCount = 0;

    switch (action) {
      case "activate":
        const activateResult = await db
          .update(users)
          .set({
            isDeactivated: false,
            updatedAt: new Date(),
          })
          .where(inArray(users.id, userIds))
          .returning({ id: users.id });
        updatedCount = activateResult.length;
        break;

      case "deactivate":
        // Prevent deactivating VGSS_OFFICE users
        const vgssUsers = await db
          .select({ id: users.id })
          .from(users)
          .where(inArray(users.id, userIds));

        const nonVgssIds = vgssUsers
          .filter((user) => user.type !== "VGSS_OFFICE")
          .map((user) => user.id);

        if (nonVgssIds.length > 0) {
          const deactivateResult = await db
            .update(users)
            .set({
              isDeactivated: true,
              updatedAt: new Date(),
            })
            .where(inArray(users.id, nonVgssIds))
            .returning({ id: users.id });
          updatedCount = deactivateResult.length;
        }
        break;

      case "reset_passwords":
        const hashedPassword = await hashPassword("VgssTemp123");
        const resetResult = await db
          .update(users)
          .set({
            password: hashedPassword,
            accountStatus: "pending_activation",
            updatedAt: new Date(),
          })
          .where(inArray(users.id, userIds))
          .returning({ id: users.id });
        updatedCount = resetResult.length;
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Bulk ${action} completed successfully`,
      updatedCount,
    });
  } catch (error) {
    console.error("Error performing bulk action:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
