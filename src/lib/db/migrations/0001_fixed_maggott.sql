ALTER TABLE "graduate_data" RENAME COLUMN "SERVICE_DEPARTMENT_id" TO "service_department_id";--> statement-breakpoint
ALTER TABLE "graduate_data" DROP CONSTRAINT "graduate_data_SERVICE_DEPARTMENT_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "graduate_data" ADD CONSTRAINT "graduate_data_service_department_id_users_id_fk" FOREIGN KEY ("service_department_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;