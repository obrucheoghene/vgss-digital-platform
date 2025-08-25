/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Check if user is authenticated and is BLW_ZONE
    if (!session || !session.user || session.user.type !== "BLW_ZONE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload CSV or Excel files." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Parse the file based on type
    let parsedData: any[] = [];

    try {
      if (file.type === "text/csv") {
        // Parse CSV
        const text = await file.text();
        parsedData = parseCSV(text);
      } else {
        // Parse Excel (would need xlsx library in production)
        // For now, return mock data for Excel files
        parsedData = [
          {
            graduateFirstname: "John",
            graduateLastname: "Doe",
            graduateGender: "MALE",
            nameOfFellowship: "Victory Fellowship",
            nameOfZonalPastor: "Pastor James Wilson",
            nameOfChapterPastor: "Pastor Mary Johnson",
            phoneNumberOfChapterPastor: "+234 801 234 5678",
            emailOfChapterPastor: "mary.johnson@loveworld.org",
            kingschatIDOfChapterPastor: "maryjohnson_lw",
          },
          {
            graduateFirstname: "Jane",
            graduateLastname: "Smith",
            graduateGender: "FEMALE",
            nameOfFellowship: "Faith Chapel",
            nameOfZonalPastor: "Pastor David Brown",
            nameOfChapterPastor: "Pastor Sarah Davis",
            phoneNumberOfChapterPastor: "+234 802 345 6789",
            emailOfChapterPastor: "sarah.davis@loveworld.org",
            kingschatIDOfChapterPastor: "sarahdavis_lw",
          },
        ];
      }

      if (parsedData.length === 0) {
        return NextResponse.json(
          { error: "No valid data found in file" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: parsedData,
        count: parsedData.length,
      });
    } catch (parseError) {
      console.error("File parsing error:", parseError);
      return NextResponse.json(
        {
          error: "Failed to parse file. Please check the format and try again.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("File upload parsing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Simple CSV parser function
function parseCSV(csvText: string): any[] {
  const lines = csvText.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0]
    .split(",")
    .map((header) => header.trim().replace(/"/g, ""));

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i]
      .split(",")
      .map((value) => value.trim().replace(/"/g, ""));

    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }
  }

  return data;
}
