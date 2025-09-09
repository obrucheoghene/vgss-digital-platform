import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import * as XLSX from "xlsx";

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
        // Parse Excel
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0]; // Get first sheet
        const worksheet = workbook.Sheets[sheetName];
        parsedData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1, // Use first row as headers
          defval: "", // Default value for empty cells
        });

        // Convert to array of objects (similar to CSV parsing)
        if (parsedData.length > 0) {
          const headers = parsedData[0] as string[];
          parsedData = parsedData.slice(1).map((row: any[]) => {
            const rowData: { [key: string]: any } = {};
            headers.forEach((header, index) => {
              rowData[header] = row[index];
            });
            return rowData;
          });
        }
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
