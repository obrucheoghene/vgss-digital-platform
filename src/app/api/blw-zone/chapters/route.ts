import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chapters } from "@/lib/db/schema";
import { NextRequest } from "next/server";
import z from "zod";

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
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
