import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1717410633941 implements MigrationInterface {
  name = ' $npmConfigName1717410633941';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_field" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_field" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_field" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(7) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_field_image" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::timestamp(7) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_field_image" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(7) with time zone`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sport_field_image" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_field_image" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_field" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_field" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sport_field" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`,
    );
  }
}
