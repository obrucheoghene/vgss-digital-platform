import { db } from "@/lib/db";
import { users, type NewUser, type UserType } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

// Create a new user account (used by VGSS_OFFICE)
export async function createUserAccount({
  name,
  email,
  type,
  password = "VgssTemp123", // Default password
  createdBy,
}: {
  name: string;
  email: string;
  type: UserType;
  password?: string;
  createdBy: string;
}): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "User with this email already exists" };
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const newUser: NewUser = {
      name,
      email,
      type,
      password: hashedPassword,
      accountStatus: type === "GRADUATE" ? "active" : "pending_activation", // Graduates are immediately active
      isDeactivated: false,
      createdBy,
    };

    const [createdUser] = await db.insert(users).values(newUser).returning();

    return {
      success: true,
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        type: createdUser.type,
        accountStatus: createdUser.accountStatus,
      },
    };
  } catch (error) {
    console.error("Error creating user account:", error);
    return { success: false, error: "Failed to create user account" };
  }
}

// Update user password
export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (newPassword.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters long",
      };
    }

    const hashedPassword = await hashPassword(newPassword);

    await db
      .update(users)
      .set({
        password: hashedPassword,
        accountStatus: "active", // Activate account when password is changed
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Error updating user password:", error);
    return { success: false, error: "Failed to update password" };
  }
}

// Deactivate/activate user account
export async function toggleUserActivation(
  userId: string,
  isDeactivated: boolean,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if admin has permission (should be VGSS_OFFICE)
    const admin = await db
      .select()
      .from(users)
      .where(eq(users.id, adminId))
      .limit(1);

    if (!admin.length || admin[0].type !== "VGSS_OFFICE") {
      return { success: false, error: "Unauthorized to perform this action" };
    }

    await db
      .update(users)
      .set({
        isDeactivated,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Error toggling user activation:", error);
    return { success: false, error: "Failed to update user activation status" };
  }
}

// Get users by type
export async function getUsersByType(userType: UserType) {
  try {
    const userList = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        type: users.type,
        accountStatus: users.accountStatus,
        isDeactivated: users.isDeactivated,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.type, userType));

    return userList;
  } catch (error) {
    console.error("Error fetching users by type:", error);
    return [];
  }
}

// Get user by ID with full details
export async function getUserById(userId: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user.length > 0 ? user[0] : null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}

// Check if email exists
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user.length > 0;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
}

// Reset user password to default
export async function resetUserPassword(
  userId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if admin has permission
    const admin = await db
      .select()
      .from(users)
      .where(eq(users.id, adminId))
      .limit(1);

    if (!admin.length || admin[0].type !== "VGSS_OFFICE") {
      return { success: false, error: "Unauthorized to perform this action" };
    }

    const hashedPassword = await hashPassword("VgssTemp123");

    await db
      .update(users)
      .set({
        password: hashedPassword,
        accountStatus: "pending_activation", // Force user to change password
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Error resetting user password:", error);
    return { success: false, error: "Failed to reset password" };
  }
}
