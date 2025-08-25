// src/app/api/admin/users/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        type: users.type,
        accountStatus: users.accountStatus,
        isDeactivated: users.isDeactivated,
        createdBy: users.createdBy,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, params.userId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: user[0],
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, ...updateData } = await req.json();

    // Handle different actions
    switch (action) {
      case "toggle_activation":
        await db
          .update(users)
          .set({
            isDeactivated: updateData.isDeactivated,
            updatedAt: new Date(),
          })
          .where(eq(users.id, params.userId));
        break;

      case "reset_password":
        const hashedPassword = await hashPassword("VgssTemp123");
        await db
          .update(users)
          .set({
            password: hashedPassword,
            accountStatus: "pending_activation",
            updatedAt: new Date(),
          })
          .where(eq(users.id, params.userId));
        break;

      case "update_details":
        await db
          .update(users)
          .set({
            name: updateData.name,
            email: updateData.email,
            updatedAt: new Date(),
          })
          .where(eq(users.id, params.userId));
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Fetch updated user data
    const updatedUser = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        type: users.type,
        accountStatus: users.accountStatus,
        isDeactivated: users.isDeactivated,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, params.userId))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.type !== "VGSS_OFFICE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Prevent deletion of VGSS_OFFICE users and self-deletion
    if (params.userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const userToDelete = await db
      .select()
      .from(users)
      .where(eq(users.id, params.userId))
      .limit(1);

    if (!userToDelete.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userToDelete[0].type === "VGSS_OFFICE") {
      return NextResponse.json(
        { error: "Cannot delete VGSS Office accounts" },
        { status: 400 }
      );
    }

    // Instead of hard delete, we'll deactivate permanently
    await db
      .update(users)
      .set({
        isDeactivated: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, params.userId));

    return NextResponse.json({
      success: true,
      message: "User account permanently deactivated",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
