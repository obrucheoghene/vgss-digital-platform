import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chapters } from "@/lib/db/schema";
import { NextRequest } from "next/server";
import z from "zod";
import { and, eq } from "drizzle-orm";

const chapterSchema = z.object({
  name: z.string().min(1, "Chapter name is required"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.type !== "BLW_ZONE") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Here you can handle the POST request logic, e.g., creating a new chapter
    const body = await req.json();
    const parsedBody = chapterSchema.parse(body);
    console.log("Creating chapter with data:", parsedBody);

    const findDuplicate = await db
      .select()
      .from(chapters)
      .where(
        and(
          eq(chapters.name, parsedBody.name),
          eq(chapters.userId, session.user.id)
        )
      )
      .limit(1);

    if (findDuplicate.length > 0) throw new Error("Duplicate chapter name");
    await db.insert(chapters).values({
      name: parsedBody.name,
      userId: session.user.id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Chapter created successfully",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Chapters error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
