CREATE TYPE "public"."staff_request_status" AS ENUM('Pending', 'Approved', 'Rejected', 'Fulfilled', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."staff_request_urgency" AS ENUM('Low', 'Medium', 'High', 'Urgent');--> statement-breakpoint
CREATE TABLE "staff_request_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"staff_request_id" uuid NOT NULL,
	"graduate_data_id" uuid NOT NULL,
	"assigned_by" uuid NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_department_id" uuid NOT NULL,
	"position_title" varchar(255) NOT NULL,
	"position_description" text NOT NULL,
	"number_of_staff" integer DEFAULT 1 NOT NULL,
	"skills_required" text,
	"qualifications_required" text,
	"preferred_gender" "gender",
	"urgency" "staff_request_urgency" DEFAULT 'Medium' NOT NULL,
	"status" "staff_request_status" DEFAULT 'Pending' NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp,
	"rejection_reason" text,
	"fulfilled_count" integer DEFAULT 0 NOT NULL,
	"fulfilled_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "staff_request_assignments" ADD CONSTRAINT "staff_request_assignments_staff_request_id_staff_requests_id_fk" FOREIGN KEY ("staff_request_id") REFERENCES "public"."staff_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_request_assignments" ADD CONSTRAINT "staff_request_assignments_graduate_data_id_graduate_data_id_fk" FOREIGN KEY ("graduate_data_id") REFERENCES "public"."graduate_data"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_request_assignments" ADD CONSTRAINT "staff_request_assignments_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_requests" ADD CONSTRAINT "staff_requests_service_department_id_users_id_fk" FOREIGN KEY ("service_department_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_requests" ADD CONSTRAINT "staff_requests_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;