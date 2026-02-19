ALTER TABLE "users" ADD COLUMN "kingschat_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_kingschat_id_unique" UNIQUE("kingschat_id");