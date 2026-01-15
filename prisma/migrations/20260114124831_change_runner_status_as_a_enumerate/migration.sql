/*
  Warnings:

  - The `status` column on the `runs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "runs" DROP COLUMN "status",
ADD COLUMN     "status" "RunnerStatus" NOT NULL DEFAULT 'PENDING';
