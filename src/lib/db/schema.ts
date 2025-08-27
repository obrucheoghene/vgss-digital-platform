// src/lib/db/schema.ts - UPDATED SCHEMA
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
export const accountStatusEnum = pgEnum("account_status", [
  "pending_activation",
  "active",
]);
export const graduateStatusEnum = pgEnum("graduate_status", [
  "Under Review",
  "Invited For Interview",
  "Interviewed",
  "Sighting",
  "Serving",
  "Not Accepted",
]);

// Zone Graduates table - Data uploaded by BLW Zones before graduate registration
export const zoneGraduates = pgTable("zone_graduates", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(), // BLW Zone who uploaded

  // Basic graduate information uploaded by zones
  graduateFirstname: varchar("graduate_firstname", { length: 255 }).notNull(),
  graduateSurname: varchar("graduate_surname", { length: 255 }).notNull(),
  graduateGender: genderEnum("graduate_gender").notNull(),
  graduatePhoneNumber: varchar("graduate_phone_number").notNull(),
  nameOfUniversity: varchar("name_of_university", { length: 255 }).notNull(),
  courseOfStudy: varchar("course_of_study", { length: 255 }).notNull(),
  graduationYear: integer("graduation_year").notNull(),
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
  kingschatIDOfChapterPastor: varchar("kingschat_id_of_chapter_pastor", {
    length: 100,
  }).notNull(),

  // Status tracking
  isRegistered: boolean("is_registered").default(false), // Has graduate found and registered with this record
  registeredAt: timestamp("registered_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Users table - Main authentication and user management
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: userTypeEnum("type").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  isDeactivated: boolean("is_deactivated").default(false).notNull(),
  accountStatus: accountStatusEnum("account_status")
    .default("pending_activation")
    .notNull(),
  createdBy: uuid("created_by"),
  lastLoginAt: timestamp("last_login_at"), // NEW FIELD
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Graduate/VGSS staff comprehensive data table (UPDATED)
export const graduateData = pgTable("graduate_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  zoneGraduateId: uuid("zone_graduate_id")
    .references(() => zoneGraduates.id, { onDelete: "cascade" })
    .notNull(), // Link to uploaded data
  blwZoneId: uuid("blw_zone_id")
    .references(() => users.id)
    .notNull(), // BLW Zone who uploaded - REQUIRED
  ministryOfficeId: uuid("ministry_office_id").references(() => users.id),

  // Personal Information (split name from zone data)
  graduateFirstname: varchar("graduate_firstname", { length: 255 }).notNull(),
  graduateSurname: varchar("graduate_surname", { length: 255 }).notNull(),
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

  // TEST QUESTIONS (formerly interview questions) - REQUIRED FIELDS
  visionMissionPurpose: text("vision_mission_purpose").notNull(),
  explainWithExamples: text("explain_with_examples").notNull(),
  partnershipArms: text("partnership_arms").notNull(),
  fullMeaning: text("full_meaning").notNull(),
  variousTasksResponsibleFor: text("various_tasks_responsible_for").notNull(),
  projectProudOfAndRolePlayed: text(
    "project_proud_of_and_role_played"
  ).notNull(),
  exampleDifficultSituation: text("example_difficult_situation").notNull(),
  recentConflict: text("recent_conflict").notNull(),
  convictions: text("convictions").notNull(),
  whyVgss: text("why_vgss").notNull(),
  plansAfterVgss: text("plans_after_vgss").notNull(),

  // Status tracking and management (UPDATED)
  status: graduateStatusEnum("status").default("Under Review").notNull(),
  comments: text("comments"), // VGSS Office comments
  isApproved: boolean("is_approved").default(false),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),

  // Service tracking (NEW)
  serviceStartedDate: timestamp("service_started_date"),
  serviceCompletedDate: timestamp("service_completed_date"),

  // REMOVED: isRegistered and registeredAt (registration is implied by record existence)

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// REMOVED: graduateInterviewQuestions table - now part of graduateData

// Relations - Updated to remove interview questions relationships
export const usersRelations = relations(users, ({ one, many }) => ({
  // User as graduate
  ownGraduateData: many(graduateData, { relationName: "userGraduate" }),
  // User as BLW Zone
  zoneManagedGraduates: many(graduateData, { relationName: "blwZoneManager" }),
  // User as Service Department
  officeAssignedGraduates: many(graduateData, {
    relationName: "ministryOfficeManager",
  }),
  // User as approver
  approvedGraduates: many(graduateData, { relationName: "approver" }),
  // User as account creator
  createdAccounts: many(users, { relationName: "accountCreator" }),
  // User created by - Fixed self-reference
  createdByUser: one(users, {
    fields: [users.createdBy],
    references: [users.id],
    relationName: "accountCreator",
  }),
  // Zone uploaded graduates
  uploadedGraduates: many(zoneGraduates, { relationName: "zoneUploader" }),
}));

export const zoneGraduatesRelations = relations(
  zoneGraduates,
  ({ one, many }) => ({
    uploadedByZone: one(users, {
      fields: [zoneGraduates.userId],
      references: [users.id],
      relationName: "zoneUploader",
    }),
    graduateData: many(graduateData, { relationName: "linkedZoneGraduate" }),
  })
);

export const graduateDataRelations = relations(graduateData, ({ one }) => ({
  user: one(users, {
    fields: [graduateData.userId],
    references: [users.id],
    relationName: "userGraduate",
  }),
  zoneGraduate: one(zoneGraduates, {
    fields: [graduateData.zoneGraduateId],
    references: [zoneGraduates.id],
    relationName: "linkedZoneGraduate",
  }),
  blwZone: one(users, {
    fields: [graduateData.blwZoneId],
    references: [users.id],
    relationName: "blwZoneManager",
  }),
  ministryOffice: one(users, {
    fields: [graduateData.ministryOfficeId],
    references: [users.id],
    relationName: "ministryOfficeManager",
  }),
  approvedByUser: one(users, {
    fields: [graduateData.approvedBy],
    references: [users.id],
    relationName: "approver",
  }),
}));

// Type exports for better TypeScript support
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type GraduateData = typeof graduateData.$inferSelect;
export type NewGraduateData = typeof graduateData.$inferInsert;

export type ZoneGraduates = typeof zoneGraduates.$inferSelect;
export type NewZoneGraduates = typeof zoneGraduates.$inferInsert;

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
export type AccountStatus = "pending_activation" | "active";
export type GraduateStatus =
  | "Under Review"
  | "Invited For Interview"
  | "Interviewed"
  | "Sighting"
  | "Serving"
  | "Not Accepted";
