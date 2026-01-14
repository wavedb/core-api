-- CreateEnum
CREATE TYPE "RunnerStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "RunnerMetricType" AS ENUM ('SCALAR', 'IMAGE', 'AUDIO', 'TEXT');

-- AlterTable
ALTER TABLE "runner_metrics" ADD COLUMN     "type" "RunnerMetricType" NOT NULL DEFAULT 'SCALAR',
ALTER COLUMN "value" SET DATA TYPE TEXT;
