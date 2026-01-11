import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chapters } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { and, eq, ne } from "drizzle-orm";

const chapterUpdateSchema = z.object({
  name: z.string().min(1, "Chapter name is required"),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.type !== "BLW_ZONE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chapterId } = await params;

    // Verify chapter belongs to this zone
    const existingChapter = await db
      .select()
      .from(chapters)
      .where(
        and(eq(chapters.id, chapterId), eq(chapters.userId, session.user.id))
      )
      .limit(1);

    if (existingChapter.length === 0) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const parsedBody = chapterUpdateSchema.parse(body);

    // Check for duplicate name (excluding current chapter)
    const duplicateCheck = await db
      .select()
      .from(chapters)
      .where(
        and(
          eq(chapters.name, parsedBody.name),
          eq(chapters.userId, session.user.id),
          ne(chapters.id, chapterId)
        )
      )
      .limit(1);

    if (duplicateCheck.length > 0) {
      return NextResponse.json(
        { error: "A chapter with this name already exists" },
        { status: 400 }
      );
    }

    // Update the chapter
    await db
      .update(chapters)
      .set({
        name: parsedBody.name,
        updatedAt: new Date(),
      })
      .where(eq(chapters.id, chapterId));

    return NextResponse.json({
      success: true,
      message: "Chapter updated successfully",
    });
  } catch (error) {
    console.error("Chapter update error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.type !== "BLW_ZONE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chapterId } = await params;

    // Verify chapter belongs to this zone
    const existingChapter = await db
      .select()
      .from(chapters)
      .where(
        and(eq(chapters.id, chapterId), eq(chapters.userId, session.user.id))
      )
      .limit(1);

    if (existingChapter.length === 0) {
      return NextResponse.json(
        { error: "Chapter not found" },
        { status: 404 }
      );
    }

    // Delete the chapter
    await db.delete(chapters).where(eq(chapters.id, chapterId));

    return NextResponse.json({
      success: true,
      message: "Chapter deleted successfully",
    });
  } catch (error) {
    console.error("Chapter delete error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
