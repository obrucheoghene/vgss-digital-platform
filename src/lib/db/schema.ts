// src/lib/db/schema.ts
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums for type safety
export const userTypeEnum = pgEnum("user_type", [
  "VGSS_OFFICE",
  "GRADUATE",
  "MINISTRY_OFFICE",
  "BLW_ZONE",
]);
export const genderEnum = pgEnum("gender", ["MALE", "FEMALE"]);
export const maritalStatusEnum = pgEnum("marital_status", [
  "SINGLE",
  "MARRIED",
]);
export const nyscStatusEnum = pgEnum("nysc_status", [
  "COMPLETED",
  "IN_PROGRESS",
  "NOT_STARTED",
  "EXEMPTED",
]);

// Users table - Main authentication and user management
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: userTypeEnum("type").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Graduate/VGSS staff comprehensive data table
export const graduateData = pgTable("graduate_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  blwZoneId: uuid("blw_zone_id").references(() => users.id),
  ministryOfficeId: uuid("ministry_office_id").references(() => users.id),

  // Personal Information
  graduateName: varchar("graduate_name", { length: 255 }).notNull(),
  graduateGender: genderEnum("graduate_gender").notNull(),
  maritalStatus: maritalStatusEnum("marital_status").notNull(),
  placeOfBirth: varchar("place_of_birth", { length: 255 }).notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  stateOfOrigin: varchar("state_of_origin", { length: 100 }).notNull(),
  homeAddress: text("home_address").notNull(),
  graduatePhoneNumber: varchar("graduate_phone_number", {
    length: 20,
  }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),

  // Posting Preferences
  preferredCityOfPosting: varchar("preferred_city_of_posting", { length: 255 }),
  accommodation: varchar("accommodation", { length: 100 }),
  whereAccommodation: text("where_accommodation"),
  kindAccommodation: varchar("kind_accommodation", { length: 100 }),
  contactOfPersonLivingWith: varchar("contact_of_person_living_with", {
    length: 20,
  }),

  // Ministry Information
  nameOfZone: varchar("name_of_zone", { length: 255 }).notNull(),
  nameOfFellowship: varchar("name_of_fellowship", { length: 255 }).notNull(),
  nameOfZonalPastor: varchar("name_of_zonal_pastor", { length: 255 }).notNull(),
  nameOfChapterPastor: varchar("name_of_chapter_pastor", {
    length: 255,
  }).notNull(),
  phoneNumberOfChapterPastor: varchar("phone_number_of_chapter_pastor", {
    length: 20,
  }).notNull(),
  emailOfChapterPastor: varchar("email_of_chapter_pastor", {
    length: 255,
  }).notNull(),

  // Spiritual Journey
  whereWhenChrist: text("where_when_christ").notNull(),
  whereWhenHolyGhost: text("where_when_holy_ghost").notNull(),
  whereWhenBaptism: text("where_when_baptism").notNull(),
  whereWhenFoundationSchool: text("where_when_foundation_school").notNull(),
  hasCertificate: boolean("has_certificate").default(false).notNull(),
  localAssemblyAfterGraduation: varchar("local_assembly_after_graduation", {
    length: 255,
  }),

  // Family Information
  fatherName: varchar("father_name", { length: 255 }).notNull(),
  fatherPhoneNumber: varchar("father_phone_number", { length: 20 }).notNull(),
  fatherEmailAddress: varchar("father_email_address", { length: 255 }),
  fatherOccupation: varchar("father_occupation", { length: 255 }).notNull(),
  nameOfFatherChurch: varchar("name_of_father_church", { length: 255 }),
  motherName: varchar("mother_name", { length: 255 }).notNull(),
  motherPhoneNumber: varchar("mother_phone_number", { length: 20 }).notNull(),
  motherEmailAddress: varchar("mother_email_address", { length: 255 }),
  motherOccupation: varchar("mother_occupation", { length: 255 }).notNull(),
  nameOfMotherChurch: varchar("name_of_mother_church", { length: 255 }),
  howManyInFamily: integer("how_many_in_family").notNull(),
  whatPositionInFamily: integer("what_position_in_family").notNull(),
  familyResidence: text("family_residence").notNull(),
  parentsTogether: boolean("parents_together").notNull(),
  parentsAwareOfVgssIntention: boolean(
    "parents_aware_of_vgss_intention"
  ).notNull(),

  // Education Information
  nameOfUniversity: varchar("name_of_university", { length: 255 }).notNull(),
  courseOfStudy: varchar("course_of_study", { length: 255 }).notNull(),
  graduationYear: integer("graduation_year").notNull(),
  grade: varchar("grade", { length: 50 }).notNull(),
  nyscStatus: nyscStatusEnum("nysc_status").notNull(),

  // Skills and Experience
  skillsPossessed: text("skills_possessed"),
  leadershipRolesInMinistryAndFellowship: text(
    "leadership_roles_in_ministry_and_fellowship"
  ),
  ministryProgramsAttended: text("ministry_programs_attended"),
  photo: varchar("photo", { length: 500 }), // URL to photo storage

  // Status tracking
  isApproved: boolean("is_approved").default(false),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Graduate interview/project questions table
export const graduateInterviewQuestions = pgTable(
  "graduate_interview_questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    graduateDataId: uuid("graduate_data_id")
      .references(() => graduateData.id, { onDelete: "cascade" })
      .notNull(),

    // Interview Questions
    visionMissionPurpose: text("vision_mission_purpose"),
    explainWithExamples: text("explain_with_examples"),
    partnershipArms: text("partnership_arms"),
    fullMeaning: text("full_meaning"),
    variousTasksResponsibleFor: text("various_tasks_responsible_for"),
    projectProudOfAndRolePlayed: text("project_proud_of_and_role_played"),
    exampleDifficultSituation: text("example_difficult_situation"),
    recentConflict: text("recent_conflict"),
    convictions: text("convictions"),
    whyVgss: text("why_vgss"),
    plansAfterVgss: text("plans_after_vgss"),

    // Status tracking
    isCompleted: boolean("is_completed").default(false),
    completedAt: timestamp("completed_at"),
    reviewedBy: uuid("reviewed_by").references(() => users.id),
    reviewedAt: timestamp("reviewed_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// Additional table for tracking graduate status through the VGSS process
export const graduateStatus = pgTable("graduate_status", {
  id: uuid("id").defaultRandom().primaryKey(),
  graduateDataId: uuid("graduate_data_id")
    .references(() => graduateData.id, { onDelete: "cascade" })
    .notNull(),

  // Status flags
  recordSubmitted: boolean("record_submitted").default(false),
  recordApproved: boolean("record_approved").default(false),
  registrationCompleted: boolean("registration_completed").default(false),
  interviewScheduled: boolean("interview_scheduled").default(false),
  interviewCompleted: boolean("interview_completed").default(false),
  trainingCompleted: boolean("training_completed").default(false),
  placementAssigned: boolean("placement_assigned").default(false),
  serviceStarted: boolean("service_started").default(false),
  serviceCompleted: boolean("service_completed").default(false),

  // Dates for tracking
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  registeredAt: timestamp("registered_at"),
  interviewScheduledAt: timestamp("interview_scheduled_at"),
  interviewCompletedAt: timestamp("interview_completed_at"),
  trainingCompletedAt: timestamp("training_completed_at"),
  placementAssignedAt: timestamp("placement_assigned_at"),
  serviceStartedAt: timestamp("service_started_at"),
  serviceCompletedAt: timestamp("service_completed_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations definitions for better querying
export const usersRelations = relations(users, ({ many }) => ({
  graduateData: many(graduateData),
  interviewQuestions: many(graduateInterviewQuestions),
  submittedGraduates: many(graduateData, { relationName: "blwZone" }),
  assignedGraduates: many(graduateData, { relationName: "ministryOffice" }),
}));

export const graduateDataRelations = relations(
  graduateData,
  ({ one, many }) => ({
    user: one(users, {
      fields: [graduateData.userId],
      references: [users.id],
    }),
    blwZone: one(users, {
      fields: [graduateData.blwZoneId],
      references: [users.id],
      relationName: "blwZone",
    }),
    ministryOffice: one(users, {
      fields: [graduateData.ministryOfficeId],
      references: [users.id],
      relationName: "ministryOffice",
    }),
    approvedByUser: one(users, {
      fields: [graduateData.approvedBy],
      references: [users.id],
      relationName: "approver",
    }),
    interviewQuestions: many(graduateInterviewQuestions),
    status: one(graduateStatus),
  })
);

export const graduateInterviewQuestionsRelations = relations(
  graduateInterviewQuestions,
  ({ one }) => ({
    user: one(users, {
      fields: [graduateInterviewQuestions.userId],
      references: [users.id],
    }),
    graduateData: one(graduateData, {
      fields: [graduateInterviewQuestions.graduateDataId],
      references: [graduateData.id],
    }),
    reviewedByUser: one(users, {
      fields: [graduateInterviewQuestions.reviewedBy],
      references: [users.id],
      relationName: "reviewer",
    }),
  })
);

export const graduateStatusRelations = relations(graduateStatus, ({ one }) => ({
  graduateData: one(graduateData, {
    fields: [graduateStatus.graduateDataId],
    references: [graduateData.id],
  }),
}));

// Type exports for better TypeScript support
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type GraduateData = typeof graduateData.$inferSelect;
export type NewGraduateData = typeof graduateData.$inferInsert;

export type GraduateInterviewQuestions =
  typeof graduateInterviewQuestions.$inferSelect;
export type NewGraduateInterviewQuestions =
  typeof graduateInterviewQuestions.$inferInsert;

export type GraduateStatus = typeof graduateStatus.$inferSelect;
export type NewGraduateStatus = typeof graduateStatus.$inferInsert;

export type UserType =
  | "VGSS_OFFICE"
  | "GRADUATE"
  | "MINISTRY_OFFICE"
  | "BLW_ZONE";
export type Gender = "MALE" | "FEMALE";
export type MaritalStatus = "SINGLE" | "MARRIED";
export type NyscStatus =
  | "COMPLETED"
  | "IN_PROGRESS"
  | "NOT_STARTED"
  | "EXEMPTED";
