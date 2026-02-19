import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET — return whether the current user has KingsChat linked
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db
    .select({ kingshatId: users.kingshatId, kingshatProfile: users.kingshatProfile })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  return NextResponse.json({
    linked: !!user?.kingshatId,
    kingshatId: user?.kingshatId ?? null,
    profile: user?.kingshatProfile ?? null,
  });
}
