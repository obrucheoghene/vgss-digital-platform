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

    // 1. VALIDATE REQUIRED PARAMETERS
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

    // 2. VALIDATE ALL REQUIRED FORM FIELDS
    const requiredFields = [
      // Personal Information
      "placeOfBirth",
      "dateOfBirth",
      "stateOfOrigin",
      "homeAddress",
      "graduatePhoneNumber",
      "email",
      "maritalStatus",

      // Posting Preferences
      "preferredCityOfPosting",

      // Spiritual Journey
      "whereWhenChrist",
      "whereWhenHolyGhost",
      "whereWhenBaptism",
      "whereWhenFoundationSchool",

      // Family Information
      "fatherName",
      "fatherPhoneNumber",
      "fatherOccupation",
      "motherName",
      "motherPhoneNumber",
      "motherOccupation",
      "howManyInFamily",
      "whatPositionInFamily",
      "familyResidence",

      // Education Information
      "nameOfUniversity",
      "courseOfStudy",
      "graduationYear",
      "grade",
      "nyscStatus",

      // Test Questions (ALL REQUIRED)
      "visionMissionPurpose",
      "explainWithExamples",
      "partnershipArms",
      "fullMeaning",
      "variousTasksResponsibleFor",
      "projectProudOfAndRolePlayed",
      "exampleDifficultSituation",
      "recentConflict",
      "convictions",
      "whyVgss",
      "plansAfterVgss",
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = formData[field];
      return !value || (typeof value === "string" && value.trim() === "");
    });

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields: missingFields as string[],
          details: `Please provide: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // 3. VALIDATE EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // 4. VALIDATE ENUM VALUES
    if (!["SINGLE", "MARRIED"].includes(formData.maritalStatus)) {
      return NextResponse.json(
        { error: "Invalid marital status. Must be SINGLE or MARRIED" },
        { status: 400 }
      );
    }

    if (
      !["COMPLETED", "IN_PROGRESS", "NOT_STARTED", "EXEMPTED"].includes(
        formData.nyscStatus
      )
    ) {
      return NextResponse.json(
        { error: "Invalid NYSC status" },
        { status: 400 }
      );
    }

    // 5. VALIDATE NUMERIC FIELDS
    const graduationYear = parseInt(formData.graduationYear);
    const howManyInFamily = parseInt(formData.howManyInFamily);
    const whatPositionInFamily = parseInt(formData.whatPositionInFamily);

    if (
      isNaN(graduationYear) ||
      graduationYear < 1990 ||
      graduationYear > 2030
    ) {
      return NextResponse.json(
        { error: "Invalid graduation year" },
        { status: 400 }
      );
    }

    if (isNaN(howManyInFamily) || howManyInFamily < 1) {
      return NextResponse.json(
        { error: "Invalid family size" },
        { status: 400 }
      );
    }

    if (
      isNaN(whatPositionInFamily) ||
      whatPositionInFamily < 1 ||
      whatPositionInFamily > howManyInFamily
    ) {
      return NextResponse.json(
        { error: "Invalid family position" },
        { status: 400 }
      );
    }

    // 6. VALIDATE DATE FORMAT
    const dateOfBirth = new Date(formData.dateOfBirth);
    if (isNaN(dateOfBirth.getTime())) {
      return NextResponse.json(
        { error: "Invalid date of birth format" },
        { status: 400 }
      );
    }

    // Check age (must be at least 18)
    const age = new Date().getFullYear() - dateOfBirth.getFullYear();
    if (age < 18) {
      return NextResponse.json(
        { error: "Graduate must be at least 18 years old" },
        { status: 400 }
      );
    }

    // 7. CHECK IF EMAIL IS ALREADY IN USE
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

    // 8. GET AND VALIDATE THE GRADUATE RECORD
    const zoneGraduateRecord = await db
      .select({
        id: zoneGraduates.id,
        userId: zoneGraduates.userId,
        graduateFirstname: zoneGraduates.graduateFirstname,
        graduateLastname: zoneGraduates.graduateSurname,
        graduateGender: zoneGraduates.graduateGender,
        nameOfFellowship: zoneGraduates.nameOfFellowship,
        nameOfZonalPastor: zoneGraduates.nameOfZonalPastor,
        nameOfChapterPastor: zoneGraduates.nameOfChapterPastor,
        phoneNumberOfChapterPastor: zoneGraduates.phoneNumberOfChapterPastor,
        emailOfChapterPastor: zoneGraduates.emailOfChapterPastor,
        kingschatIDOfChapterPastor: zoneGraduates.kingschatIDOfChapterPastor,
        isRegistered: zoneGraduates.isRegistered,
        createdAt: zoneGraduates.createdAt,
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

    // 9. GET ZONE INFORMATION
    const zoneInfo = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, record.userId))
      .limit(1);

    const zoneName = zoneInfo.length > 0 ? zoneInfo[0].name : "Unknown Zone";

    // 10. START DATABASE TRANSACTION
    const result = await db.transaction(async (tx) => {
      try {
        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create user account
        const [newUser] = await tx
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
          .returning({ id: users.id });

        if (!newUser?.id) {
          throw new Error("Failed to create user account");
        }

        // Create comprehensive graduate data record
        const [graduateRecord] = await tx
          .insert(graduateData)
          .values({
            userId: newUser.id,
            zoneGraduateId: recordId,
            blwZoneId: record.userId, // Required - BLW Zone who uploaded
            ministryOfficeId: null, // Will be assigned later

            // Personal Information (from zone data + form)
            graduateFirstname: record.graduateFirstname,
            graduateLastname: record.graduateLastname,
            graduateName: `${record.graduateFirstname} ${record.graduateLastname}`,
            graduateGender: record.graduateGender,
            maritalStatus: formData.maritalStatus,
            placeOfBirth: formData.placeOfBirth,
            dateOfBirth: dateOfBirth,
            stateOfOrigin: formData.stateOfOrigin,
            homeAddress: formData.homeAddress,
            graduatePhoneNumber: formData.graduatePhoneNumber,
            email: formData.email,

            // Posting Preferences
            preferredCityOfPosting: formData.preferredCityOfPosting,
            accommodation: formData.accommodation || null,
            whereAccommodation: formData.whereAccommodation || null,
            kindAccommodation: formData.kindAccommodation || null,
            contactOfPersonLivingWith:
              formData.contactOfPersonLivingWith || null,

            // Ministry Information (from zone upload)
            nameOfZone: zoneName,
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
            howManyInFamily: howManyInFamily,
            whatPositionInFamily: whatPositionInFamily,
            familyResidence: formData.familyResidence,
            parentsTogether: formData.parentsTogether || false,
            parentsAwareOfVgssIntention:
              formData.parentsAwareOfVgssIntention || false,

            // Education Information
            nameOfUniversity: formData.nameOfUniversity,
            courseOfStudy: formData.courseOfStudy,
            graduationYear: graduationYear,
            grade: formData.grade,
            nyscStatus: formData.nyscStatus,

            // Skills and Experience
            skillsPossessed: formData.skillsPossessed || null,
            leadershipRolesInMinistryAndFellowship:
              formData.leadershipRolesInMinistryAndFellowship || null,
            ministryProgramsAttended: formData.ministryProgramsAttended || null,
            photo: null, // Will be uploaded separately

            // Test Questions (ALL REQUIRED)
            visionMissionPurpose: formData.visionMissionPurpose,
            explainWithExamples: formData.explainWithExamples,
            partnershipArms: formData.partnershipArms,
            fullMeaning: formData.fullMeaning,
            variousTasksResponsibleFor: formData.variousTasksResponsibleFor,
            projectProudOfAndRolePlayed: formData.projectProudOfAndRolePlayed,
            exampleDifficultSituation: formData.exampleDifficultSituation,
            recentConflict: formData.recentConflict,
            convictions: formData.convictions,
            whyVgss: formData.whyVgss,
            plansAfterVgss: formData.plansAfterVgss,

            // Status tracking
            status: "Under Review", // Default status
            comments: null, // No initial comments
            isApproved: false, // Needs VGSS Office approval
            approvedBy: null,
            approvedAt: null,

            // Service tracking
            serviceStartedDate: null,
            serviceCompletedDate: null,
          })
          .returning({ id: graduateData.id });

        if (!graduateRecord?.id) {
          throw new Error("Failed to create graduate data record");
        }

        // Update the zone graduate record to mark as registered
        await tx
          .update(zoneGraduates)
          .set({
            isRegistered: true,
            registeredAt: new Date(),
          })
          .where(eq(zoneGraduates.id, recordId));

        return {
          userId: newUser.id,
          graduateDataId: graduateRecord.id,
          success: true,
        };
      } catch (error) {
        console.error("Transaction error:", error);
        throw new Error(
          error instanceof Error ? error.message : "Database transaction failed"
        );
      }
    });

    // 11. RETURN SUCCESS RESPONSE
    return NextResponse.json({
      success: true,
      message: "Registration completed successfully",
      userId: result.userId,
      graduateDataId: result.graduateDataId,
      graduate: {
        name: `${record.graduateFirstname} ${record.graduateLastname}`,
        email: formData.email,
        fellowship: record.nameOfFellowship,
        zone: zoneName,
        status: "Under Review",
      },
      nextSteps: [
        "Log in with your email and password",
        "Access your graduate dashboard",
        "Complete any additional profile requirements",
        "Await review and approval from VGSS Office",
        "Receive ministry assignment upon approval",
      ],
    });
  } catch (error) {
    console.error("Graduate registration error:", error);

    // Handle specific error types
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

      if (error.message.includes("foreign key")) {
        return NextResponse.json(
          { error: "Invalid graduate record or zone reference" },
          { status: 400 }
        );
      }

      if (error.message.includes("not-null")) {
        return NextResponse.json(
          {
            error:
              "Missing required information. Please check all required fields.",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Registration failed. Please try again.",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : "Unknown error"
            : undefined,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check registration status for a record
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

    // Get registration status with graduate data if available
    const recordData = await db
      .select({
        // Zone graduate info
        id: zoneGraduates.id,
        isRegistered: zoneGraduates.isRegistered,
        registeredAt: zoneGraduates.registeredAt,
        graduateFirstname: zoneGraduates.graduateFirstname,
        graduateLastname: zoneGraduates.graduateSurname,
        graduateGender: zoneGraduates.graduateGender,
        nameOfFellowship: zoneGraduates.nameOfFellowship,
        // Graduate data info (if registered)
        graduateDataId: graduateData.id,
        userId: graduateData.userId,
        status: graduateData.status,
        email: graduateData.email,
      })
      .from(zoneGraduates)
      .leftJoin(graduateData, eq(zoneGraduates.id, graduateData.zoneGraduateId))
      .where(eq(zoneGraduates.id, recordId))
      .limit(1);

    if (!recordData.length) {
      return NextResponse.json(
        { error: "Graduate record not found" },
        { status: 404 }
      );
    }

    const record = recordData[0];

    return NextResponse.json({
      success: true,
      record: {
        id: record.id,
        graduateFirstname: record.graduateFirstname,
        graduateLastname: record.graduateLastname,
        graduateGender: record.graduateGender,
        nameOfFellowship: record.nameOfFellowship,
        isRegistered: record.isRegistered,
        registeredAt: record.registeredAt,
        status: record.status || null,
        email: record.email || null,
        hasGraduateProfile: !!record.graduateDataId,
      },
    });
  } catch (error) {
    console.error("Registration status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
