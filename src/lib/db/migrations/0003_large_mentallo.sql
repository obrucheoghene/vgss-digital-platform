CREATE TYPE "public"."upload_status" AS ENUM('processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "upload_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"filename" varchar(255) NOT NULL,
	"total_records" integer DEFAULT 0 NOT NULL,
	"successful_records" integer DEFAULT 0 NOT NULL,
	"failed_records" integer DEFAULT 0 NOT NULL,
	"duplicate_records" integer DEFAULT 0 NOT NULL,
	"status" "upload_status" DEFAULT 'processing' NOT NULL,
	"errors" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "upload_history" ADD CONSTRAINT "upload_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;