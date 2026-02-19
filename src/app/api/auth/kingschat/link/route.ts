import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Create a signed state token embedding userId + action + expiry
function createLinkState(userId: string): string {
  const exp = Date.now() + 10 * 60 * 1000; // 10 min
  const data = Buffer.from(`${userId}|${exp}|link`).toString("base64url");
  const sig = crypto
    .createHmac("sha256", process.env.AUTH_SECRET!)
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

// GET — initiate KingsChat link flow
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const state = createLinkState(session.user.id);
  const baseUrl = process.env.NEXTAUTH_URL || new URL(req.url).origin;
  const callbackUrl = `${baseUrl}/api/auth/kingschat/callback?action=link&state=${state}`;

  const kingsUrl =
    `https://accounts.kingsch.at/?client_id=com.kingschat` +
    `&post_redirect=true` +
    `&scopes=${encodeURIComponent('["kingschat"]')}` +
    `&redirect_uri=${encodeURIComponent(callbackUrl)}`;

  return NextResponse.redirect(kingsUrl);
}

// DELETE — unlink KingsChat from current account
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db
    .update(users)
    .set({ kingshatId: null, kingshatProfile: null, updatedAt: new Date() })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ success: true });
}

// GET /api/auth/kingschat/status — check link status for current user
// (accessed via a separate route below to keep link/unlink on same path)
