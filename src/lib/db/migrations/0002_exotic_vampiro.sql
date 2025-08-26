CREATE TYPE "public"."graduate_status" AS ENUM('Under Review', 'Invited For Interview', 'Interviewed', 'Sighting', 'Serving', 'Not Accepted');--> statement-breakpoint
ALTER TABLE "graduate_interview_questions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "graduate_interview_questions" CASCADE;--> statement-breakpoint
ALTER TABLE "graduate_data" ALTER COLUMN "blw_zone_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "graduate_firstname" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "graduate_lastname" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "vision_mission_purpose" text NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "explain_with_examples" text NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "partnership_arms" text NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "full_meaning" text NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "various_tasks_responsible_for" text NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "project_proud_of_and_role_played" text NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "example_difficult_situation" text NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "recent_conflict" text NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "convictions" text NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "why_vgss" text NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "plans_after_vgss" text NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "status" "graduate_status" DEFAULT 'Under Review' NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "comments" text;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "service_started_date" timestamp;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "service_completed_date" timestamp;--> statement-breakpoint
ALTER TABLE "graduate_data" DROP COLUMN "is_registered";--> statement-breakpoint
ALTER TABLE "graduate_data" DROP COLUMN "registered_at";