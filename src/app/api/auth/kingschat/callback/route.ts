import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
    const dotIndex = state.lastIndexOf(".");
    if (dotIndex === -1) return null;
    const data = state.slice(0, dotIndex);
    const sig = state.slice(dotIndex + 1);
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

/** Extract all likely KingsChat identifiers from a payload of unknown shape */
function extractKingsPayload(payload: Record<string, any>) {
  // Flatten one level of nesting (e.g. payload.data.user_id)
  const flat: Record<string, any> = { ...payload };
  for (const key of Object.keys(payload)) {
    if (payload[key] && typeof payload[key] === "object" && !Array.isArray(payload[key])) {
      Object.assign(flat, payload[key]);
    }
  }

  const kingsId: string =
    flat.user_id || flat.userId || flat.id || flat.kingschat_id || flat.kingshatId || "";
  const name: string =
    flat.name || flat.display_name || flat.displayName || flat.full_name || flat.fullName || "";
  const email: string = flat.email || flat.email_address || flat.emailAddress || "";
  const phone: string =
    flat.phone_number || flat.phoneNumber || flat.phone || flat.mobile || "";
  const accessToken: string =
    flat.access_token || flat.accessToken || flat.token || "";

  return { kingsId, name, email, phone, accessToken };
}

export async function POST(req: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || new URL(req.url).origin;

  try {
    const urlObj = new URL(req.url);
    const action = urlObj.searchParams.get("action");
    const linkState = urlObj.searchParams.get("state");

    // ── Parse payload ────────────────────────────────────────────────────────
    let rawBody = "";
    let payload: Record<string, any> = {};
    const contentType = req.headers.get("content-type") || "";

    try {
      rawBody = await req.text();
      if (contentType.includes("application/json")) {
        payload = JSON.parse(rawBody);
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const params = new URLSearchParams(rawBody);
        params.forEach((v, k) => { payload[k] = v; });
      } else if (contentType.includes("multipart/form-data")) {
        // Re-parse as formData using a fresh Request since we already consumed body
        const formReq = new Request(req.url, { method: "POST", body: rawBody, headers: req.headers });
        const formData = await formReq.formData();
        formData.forEach((v, k) => { payload[k] = v.toString(); });
      } else {
        // Try JSON as fallback
        try { payload = JSON.parse(rawBody); } catch { /* keep empty */ }
      }
    } catch (e) {
      console.error("[KINGSCHAT] Body parse error:", e);
    }

    // ── Full diagnostic log — helps identify field names ─────────────────────
    console.log("[KINGSCHAT] ─── Incoming callback ───");
    console.log("[KINGSCHAT] URL:", req.url);
    console.log("[KINGSCHAT] Content-Type:", contentType);
    console.log("[KINGSCHAT] Raw body:", rawBody.slice(0, 500));
    console.log("[KINGSCHAT] Payload:", JSON.stringify(payload, null, 2));
    console.log("[KINGSCHAT] action:", action, "| has state:", !!linkState);

    let { kingsId, name, email, phone } = extractKingsPayload(payload);
    const { accessToken } = extractKingsPayload(payload);
    let kingshatUsername = "";
    let avatarUrl = "";

    // ── Fetch KingsChat profile via access token ──────────────────────────────
    // Shape: { profile: { user: { user_id, name, username, avatar_url }, email: { address }, phone_number } }
    if (accessToken) {
      try {
        const profileRes = await fetch("https://connect.kingsch.at/api/profile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (profileRes.ok) {
          const body = await profileRes.json();
          console.log("[KINGSCHAT] Profile API response:", JSON.stringify(body, null, 2));
          const p = body?.profile ?? body;
          const profileKingsId: string = p?.user?.user_id ?? "";
          const profileName: string = p?.user?.name ?? "";
          const profileEmail: string = p?.email?.address ?? "";
          const profilePhone: string = p?.phone_number ?? "";
          kingshatUsername = p?.user?.username ?? "";
          avatarUrl = p?.user?.avatar_url ?? "";
          if (profileKingsId) kingsId = profileKingsId;
          if (profileName) name = profileName;
          if (profileEmail) email = profileEmail;
          if (profilePhone) phone = profilePhone;
        } else {
          console.warn("[KINGSCHAT] Profile API returned", profileRes.status, await profileRes.text().catch(() => ""));
        }
      } catch (profileErr) {
        console.error("[KINGSCHAT] Profile API fetch failed:", profileErr);
      }
    }

    // Profile snapshot saved to DB for display purposes
    const kingshatProfile = (kingsId || kingshatUsername || name)
      ? { name, username: kingshatUsername, avatarUrl }
      : null;

    // Use the best available identifier. KingsChat userId is preferred.
    // Fall back to email, then phone.
    const bestId = kingsId || email || phone || "";

    console.log("[KINGSCHAT] Resolved — kingsId:", kingsId, "| email:", email, "| phone:", phone, "| bestId:", bestId);

    // ── LINK FLOW ─────────────────────────────────────────────────────────────
    if (action === "link" && linkState) {
      const linkUserId = verifyLinkState(linkState);
      if (!linkUserId) {
        console.error("[KINGSCHAT] Link state verification failed");
        return NextResponse.redirect(
          new URL("/auth/login?error=kingschat_link_expired", baseUrl)
        );
      }

      if (!bestId) {
        console.error("[KINGSCHAT] Link flow: could not extract any identifier from payload");
        const [user] = await db.select({ type: users.type }).from(users).where(eq(users.id, linkUserId)).limit(1);
        return NextResponse.redirect(
          new URL(`${dashboardFor(user?.type)}/settings?error=kingschat_no_user`, baseUrl)
        );
      }

      // Ensure this KingsChat ID isn't already linked to another account
      const existing = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.kingshatId, bestId))
        .limit(1);

      if (existing.length > 0 && existing[0].id !== linkUserId) {
        const [user] = await db.select({ type: users.type }).from(users).where(eq(users.id, linkUserId)).limit(1);
        return NextResponse.redirect(
          new URL(`${dashboardFor(user?.type)}/settings?error=kingschat_already_linked`, baseUrl)
        );
      }

      await db
        .update(users)
        .set({
          kingshatId: bestId,
          updatedAt: new Date(),
          ...(kingshatProfile ? { kingshatProfile } : {}),
        })
        .where(eq(users.id, linkUserId));

      console.log("[KINGSCHAT] Linked kingshatId:", bestId, "to user:", linkUserId);

      const [user] = await db.select({ type: users.type }).from(users).where(eq(users.id, linkUserId)).limit(1);
      return NextResponse.redirect(
        new URL(`${dashboardFor(user?.type)}/settings?success=kingschat_linked`, baseUrl)
      );
    }

    // ── LOGIN FLOW ────────────────────────────────────────────────────────────
    if (!bestId) {
      console.error("[KINGSCHAT] Login flow: no identifier in payload. Full payload:", JSON.stringify(payload));
      return NextResponse.redirect(
        new URL("/auth/login?error=kingschat_no_user", baseUrl)
      );
    }

    // Only allow sign-in if this KingsChat ID is explicitly linked to an account
    const [foundUser] = await db
      .select()
      .from(users)
      .where(eq(users.kingshatId, bestId))
      .limit(1);

    if (!foundUser) {
      console.log("[KINGSCHAT] No account linked to kingshatId:", bestId);
      return NextResponse.redirect(
        new URL("/auth/kingschat-not-linked", baseUrl)
      );
    }

    if (foundUser.isDeactivated) {
      return NextResponse.redirect(
        new URL("/auth/login?error=account_deactivated", baseUrl)
      );
    }

    // Always update lastLoginAt. Only overwrite kingshatProfile if the profile
    // API returned fresh data — avoids erasing stored profile on API failures.
    await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
        ...(kingshatProfile ? { kingshatProfile } : {}),
      })
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
