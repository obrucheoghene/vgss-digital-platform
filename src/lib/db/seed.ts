// src/lib/db/seed.ts
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

import { db } from "./index";
import { users } from "./schema";
import { hashPassword } from "../auth";

async function seed() {
  try {
    // Create a default VGSS_OFFICE admin user
    const hashedPassword = await hashPassword("admin123"); // Change this to a secure password

    const adminUser = await db
      .insert(users)
      .values({
        name: "VGSS Administrator",
        email: "admin@vgss.online", // Change this to your preferred admin email
        type: "VGSS_OFFICE",
        password: hashedPassword,
        accountStatus: "active", // Admin is immediately active
        isDeactivated: false,
      })
      .returning();

    console.log("✅ Admin user created successfully:");
    console.log("Email:", adminUser[0].email);
    console.log("Password: admin123"); // Remember to change this
    console.log("Type:", adminUser[0].type);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

seed();
