CREATE TYPE "public"."account_status" AS ENUM('pending_activation', 'active');--> statement-breakpoint
CREATE TABLE "zone_graduates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"graduate_firstname" varchar(255) NOT NULL,
	"graduate_lastname" varchar(255) NOT NULL,
	"graduate_gender" "gender" NOT NULL,
	"name_of_fellowship" varchar(255) NOT NULL,
	"name_of_zonal_pastor" varchar(255) NOT NULL,
	"name_of_chapter_pastor" varchar(255) NOT NULL,
	"phone_number_of_chapter_pastor" varchar(20) NOT NULL,
	"email_of_chapter_pastor" varchar(255) NOT NULL,
	"kingschat_id_of_chapter_pastor" varchar(100),
	"is_registered" boolean DEFAULT false,
	"registered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "is_active" TO "is_deactivated";--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "zone_graduate_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "is_registered" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD COLUMN "registered_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "account_status" "account_status" DEFAULT 'pending_activation' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "zone_graduates" ADD CONSTRAINT "zone_graduates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "graduate_data" ADD CONSTRAINT "graduate_data_zone_graduate_id_zone_graduates_id_fk" FOREIGN KEY ("zone_graduate_id") REFERENCES "public"."zone_graduates"("id") ON DELETE cascade ON UPDATE no action;