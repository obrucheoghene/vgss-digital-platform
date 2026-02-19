import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Short-lived signed exchange token (5 min TTL) — used to hand off to credentials flow
function createExchangeToken(userId: string): string {
  const exp = Date.now() + 5 * 60 * 1000;
  const data = Buffer.from(`${userId}|${exp}`).toString("base64url");
  const sig = crypto
    .createHmac("sha256", process.env.AUTH_SECRET!)
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

// Signed link-state token — verifies the user who initiated the link flow
function verifyLinkState(state: string): string | null {
  try {
    const [data, sig] = state.split(".");
    if (!data || !sig) return null;
    const expected = crypto
      .createHmac("sha256", process.env.AUTH_SECRET!)
      .update(data)
      .digest("base64url");
    if (sig !== expected) return null;
    const [userId, expStr, action] = Buffer.from(data, "base64url")
      .toString()
      .split("|");
    if (!userId || !expStr || action !== "link") return null;
    if (Date.now() > parseInt(expStr)) return null;
    return userId;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || new URL(req.url).origin;

  try {
    // Determine action from query param (default: login)
    const action = new URL(req.url).searchParams.get("action");
    const linkState = new URL(req.url).searchParams.get("state");

    // Parse KingsChat POST payload
    let payload: Record<string, any> = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        payload[key] = value;
      });
    } else {
      try {
        payload = await req.json();
      } catch {
        const text = await req.text();
        console.error("[KINGSCHAT] Unknown content-type payload:", text);
      }
    }

    console.log("[KINGSCHAT] Received payload keys:", Object.keys(payload));

    // Extract KingsChat identity
    const kingsId: string =
      payload.user_id || payload.id || payload.userId || "";
    const name: string =
      payload.name ||
      payload.display_name ||
      payload.displayName ||
      payload.full_name ||
      "";
    const email: string = payload.email || payload.email_address || "";

    if (!kingsId && !email) {
      console.error("[KINGSCHAT] No user identifier in payload:", payload);
      return NextResponse.redirect(
        new URL("/auth/login?error=kingschat_no_user", baseUrl)
      );
    }

    // ── LINK FLOW ─────────────────────────────────────────────────────────────
    if (action === "link" && linkState) {
      const linkUserId = verifyLinkState(linkState);
      if (!linkUserId) {
        // State is expired or tampered — redirect to login since we don't know the user
        return NextResponse.redirect(
          new URL("/auth/login?error=kingschat_link_expired", baseUrl)
        );
      }

      // Ensure this KingsChat ID isn't already linked to another account
      if (kingsId) {
        const existing = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.kingshatId, kingsId))
          .limit(1);
        if (existing.length > 0 && existing[0].id !== linkUserId) {
          // Find the dashboard for the user so we redirect back properly
          const [user] = await db.select({ type: users.type }).from(users).where(eq(users.id, linkUserId)).limit(1);
          const dashboard = dashboardFor(user?.type);
          return NextResponse.redirect(
            new URL(`${dashboard}/settings?error=kingschat_already_linked`, baseUrl)
          );
        }
      }

      await db
        .update(users)
        .set({ kingshatId: kingsId || email, updatedAt: new Date() })
        .where(eq(users.id, linkUserId));

      const [user] = await db.select({ type: users.type }).from(users).where(eq(users.id, linkUserId)).limit(1);
      return NextResponse.redirect(
        new URL(`${dashboardFor(user?.type)}/settings?success=kingschat_linked`, baseUrl)
      );
    }

    // ── LOGIN FLOW ────────────────────────────────────────────────────────────
    let foundUser = null;

    // Find by KingsChat ID first
    if (kingsId) {
      const byKingsId = await db
        .select()
        .from(users)
        .where(eq(users.kingshatId, kingsId))
        .limit(1);
      if (byKingsId.length > 0) foundUser = byKingsId[0];
    }

    // Fallback: match by email stored as username
    if (!foundUser && email) {
      const byEmail = await db
        .select()
        .from(users)
        .where(eq(users.username, email))
        .limit(1);
      if (byEmail.length > 0) {
        foundUser = byEmail[0];
        // Auto-save the KingsChat ID to this account for future logins
        if (kingsId) {
          await db
            .update(users)
            .set({ kingshatId: kingsId, updatedAt: new Date() })
            .where(eq(users.id, foundUser.id));
        }
      }
    }

    // Auto-create GRADUATE account if no match found
    if (!foundUser) {
      const username = email || `kingschat:${kingsId}`;
      const tempPassword = await bcrypt.hash(
        crypto.randomBytes(32).toString("hex"),
        12
      );
      const [created] = await db
        .insert(users)
        .values({
          name: name || "KingsChat User",
          username,
          kingshatId: kingsId || null,
          type: "GRADUATE",
          password: tempPassword,
          accountStatus: "active",
          isDeactivated: false,
        })
        .returning();
      foundUser = created;
    }

    if (foundUser.isDeactivated) {
      return NextResponse.redirect(
        new URL("/auth/login?error=account_deactivated", baseUrl)
      );
    }

    await db
      .update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, foundUser.id));

    const token = createExchangeToken(foundUser.id);
    return NextResponse.redirect(
      new URL(`/auth/kingschat-complete?kc_token=${token}`, baseUrl)
    );
  } catch (error) {
    console.error("[KINGSCHAT] Callback error:", error);
    return NextResponse.redirect(
      new URL("/auth/login?error=kingschat_error", baseUrl)
    );
  }
}

function dashboardFor(type?: string): string {
  switch (type) {
    case "VGSS_OFFICE": return "/dashboard/vgss-office";
    case "BLW_ZONE": return "/dashboard/blw-zone";
    case "SERVICE_DEPARTMENT": return "/dashboard/service-department";
    default: return "/dashboard/graduate";
  }
}
