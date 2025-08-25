// src/app/api/graduate/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, graduateData, zoneGraduates } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recordId, password, confirmPassword, ...formData } = body;

    // Validate required fields
    if (!recordId) {
      return NextResponse.json(
        { error: "Graduate record ID is required" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Validate required form fields
    const requiredFields = [
      "placeOfBirth",
      "dateOfBirth",
      "stateOfOrigin",
      "homeAddress",
      "graduatePhoneNumber",
      "email",
      "maritalStatus",
      "preferredCityOfPosting",
      "whereWhenChrist",
      "whereWhenHolyGhost",
      "whereWhenBaptism",
      "whereWhenFoundationSchool",
      "fatherName",
      "fatherPhoneNumber",
      "fatherOccupation",
      "motherName",
      "motherPhoneNumber",
      "motherOccupation",
      "howManyInFamily",
      "whatPositionInFamily",
      "familyResidence",
      "nameOfUniversity",
      "courseOfStudy",
      "graduationYear",
      "grade",
      "nyscStatus",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email is already in use
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, formData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email address is already registered" },
        { status: 400 }
      );
    }

    // Get and validate the graduate record
    const zoneGraduateRecord = await db
      .select({
        id: zoneGraduates.id,
        userId: zoneGraduates.userId, // BLW Zone who uploaded
        graduateFirstname: zoneGraduates.graduateFirstname,
        graduateLastname: zoneGraduates.graduateLastname,
        graduateGender: zoneGraduates.graduateGender,
        nameOfFellowship: zoneGraduates.nameOfFellowship,
        nameOfZonalPastor: zoneGraduates.nameOfZonalPastor,
        nameOfChapterPastor: zoneGraduates.nameOfChapterPastor,
        phoneNumberOfChapterPastor: zoneGraduates.phoneNumberOfChapterPastor,
        emailOfChapterPastor: zoneGraduates.emailOfChapterPastor,
        kingschatIDOfChapterPastor: zoneGraduates.kingschatIDOfChapterPastor,
        isRegistered: zoneGraduates.isRegistered,
      })
      .from(zoneGraduates)
      .where(eq(zoneGraduates.id, recordId))
      .limit(1);

    if (!zoneGraduateRecord.length) {
      return NextResponse.json(
        { error: "Graduate record not found" },
        { status: 404 }
      );
    }

    const record = zoneGraduateRecord[0];

    if (record.isRegistered) {
      return NextResponse.json(
        { error: "This graduate record has already been registered" },
        { status: 400 }
      );
    }

    // Start database transaction
    const result = await db.transaction(async (tx) => {
      try {
        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create user account
        const newUser = await tx
          .insert(users)
          .values({
            type: "GRADUATE",
            name: `${record.graduateFirstname} ${record.graduateLastname}`,
            email: formData.email,
            password: hashedPassword,
            accountStatus: "active", // Graduates are immediately active
            isDeactivated: false,
            createdBy: record.userId, // BLW Zone who uploaded the record
          })
          .returning();

        const userId = newUser[0].id;

        // Create comprehensive graduate data record
        await tx.insert(graduateData).values({
          userId: userId,
          zoneGraduateId: recordId,
          blwZoneId: record.userId, // Link to the BLW Zone who uploaded
          ministryOfficeId: null, // Will be assigned later

          // Personal Information
          graduateName: `${record.graduateFirstname} ${record.graduateLastname}`,
          graduateGender: record.graduateGender,
          maritalStatus: formData.maritalStatus,
          placeOfBirth: formData.placeOfBirth,
          dateOfBirth: new Date(formData.dateOfBirth),
          stateOfOrigin: formData.stateOfOrigin,
          homeAddress: formData.homeAddress,
          graduatePhoneNumber: formData.graduatePhoneNumber,
          email: formData.email,

          // Posting Preferences
          preferredCityOfPosting: formData.preferredCityOfPosting,
          accommodation: formData.accommodation || null,
          whereAccommodation: formData.whereAccommodation || null,
          kindAccommodation: formData.kindAccommodation || null,
          contactOfPersonLivingWith: formData.contactOfPersonLivingWith || null,

          // Ministry Information (from zone upload)
          nameOfZone: "Unknown Zone", // Could be improved by joining with users table
          nameOfFellowship: record.nameOfFellowship,
          nameOfZonalPastor: record.nameOfZonalPastor,
          nameOfChapterPastor: record.nameOfChapterPastor,
          phoneNumberOfChapterPastor: record.phoneNumberOfChapterPastor,
          emailOfChapterPastor: record.emailOfChapterPastor,

          // Spiritual Journey
          whereWhenChrist: formData.whereWhenChrist,
          whereWhenHolyGhost: formData.whereWhenHolyGhost,
          whereWhenBaptism: formData.whereWhenBaptism,
          whereWhenFoundationSchool: formData.whereWhenFoundationSchool,
          hasCertificate: formData.hasCertificate || false,
          localAssemblyAfterGraduation:
            formData.localAssemblyAfterGraduation || null,

          // Family Information
          fatherName: formData.fatherName,
          fatherPhoneNumber: formData.fatherPhoneNumber,
          fatherEmailAddress: formData.fatherEmailAddress || null,
          fatherOccupation: formData.fatherOccupation,
          nameOfFatherChurch: formData.nameOfFatherChurch || null,
          motherName: formData.motherName,
          motherPhoneNumber: formData.motherPhoneNumber,
          motherEmailAddress: formData.motherEmailAddress || null,
          motherOccupation: formData.motherOccupation,
          nameOfMotherChurch: formData.nameOfMotherChurch || null,
          howManyInFamily: parseInt(formData.howManyInFamily),
          whatPositionInFamily: parseInt(formData.whatPositionInFamily),
          familyResidence: formData.familyResidence,
          parentsTogether: formData.parentsTogether || false,
          parentsAwareOfVgssIntention:
            formData.parentsAwareOfVgssIntention || false,

          // Education Information
          nameOfUniversity: formData.nameOfUniversity,
          courseOfStudy: formData.courseOfStudy,
          graduationYear: parseInt(formData.graduationYear),
          grade: formData.grade,
          nyscStatus: formData.nyscStatus,

          // Skills and Experience
          skillsPossessed: formData.skillsPossessed || null,
          leadershipRolesInMinistryAndFellowship:
            formData.leadershipRolesInMinistryAndFellowship || null,
          ministryProgramsAttended: formData.ministryProgramsAttended || null,
          photo: null, // Will be uploaded separately

          // Status tracking
          isApproved: false, // Needs VGSS Office approval
          approvedBy: null,
          approvedAt: null,
          isRegistered: true,
          registeredAt: new Date(),
        });

        // Update the zone graduate record to mark as registered
        await tx
          .update(zoneGraduates)
          .set({
            isRegistered: true,
            registeredAt: new Date(),
          })
          .where(eq(zoneGraduates.id, recordId));

        return { userId, success: true };
      } catch (error) {
        console.error("Transaction error:", error);
        throw error;
      }
    });

    return NextResponse.json({
      success: true,
      message: "Registration completed successfully",
      userId: result.userId,
      nextSteps: [
        "Log in with your email and password",
        "Complete interview questions",
        "Await approval from VGSS Office",
        "Receive ministry assignment",
      ],
    });
  } catch (error) {
    console.error("Graduate registration error:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (
        error.message.includes("duplicate key") ||
        error.message.includes("unique constraint")
      ) {
        return NextResponse.json(
          { error: "Email address is already registered" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}

// Get registration status for a record
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const recordId = searchParams.get("recordId");

    if (!recordId) {
      return NextResponse.json(
        { error: "Record ID is required" },
        { status: 400 }
      );
    }

    // Get registration status
    const record = await db
      .select({
        id: zoneGraduates.id,
        isRegistered: zoneGraduates.isRegistered,
        registeredAt: zoneGraduates.registeredAt,
        graduateFirstname: zoneGraduates.graduateFirstname,
        graduateLastname: zoneGraduates.graduateLastname,
      })
      .from(zoneGraduates)
      .where(eq(zoneGraduates.id, recordId))
      .limit(1);

    if (!record.length) {
      return NextResponse.json(
        { error: "Graduate record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      record: record[0],
    });
  } catch (error) {
    console.error("Registration status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
