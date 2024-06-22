import { MigrationInterface, QueryRunner } from "typeorm";

export class Backup1718873157718 implements MigrationInterface {
    name = 'Backup1718873157718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "start_time" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "end_time" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "end_time"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "end_time" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "start_time"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "start_time" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "phone" SET NOT NULL`);
    }

}
