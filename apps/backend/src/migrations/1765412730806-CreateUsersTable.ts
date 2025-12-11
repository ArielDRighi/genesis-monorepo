import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1765412730806 implements MigrationInterface {
  name = 'CreateUsersTable1765412730806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_plan_enum" AS ENUM('FREE', 'BASIC', 'PRO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "plan" "public"."users_plan_enum" NOT NULL DEFAULT 'FREE', "projects_count" integer NOT NULL DEFAULT '0', "free_project_used" boolean NOT NULL DEFAULT false, "tasks_count" integer NOT NULL DEFAULT '0', "quota_reset_date" TIMESTAMP, "has_completed_onboarding" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_plan_enum"`);
  }
}
