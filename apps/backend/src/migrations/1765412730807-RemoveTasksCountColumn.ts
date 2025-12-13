import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveTasksCountColumn1765412730807 implements MigrationInterface {
  name = 'RemoveTasksCountColumn1765412730807';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tasks_count"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "tasks_count" integer NOT NULL DEFAULT 0`);
  }
}
