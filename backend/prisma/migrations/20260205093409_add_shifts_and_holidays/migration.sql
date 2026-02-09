-- CreateEnum
CREATE TYPE "ShiftType" AS ENUM ('MORNING', 'EVENING', 'FULL_DAY');

-- DropIndex
DROP INDEX "working_hours_providerId_dayOfWeek_key";

-- AlterTable
ALTER TABLE "working_hours" ADD COLUMN     "shiftType" "ShiftType" NOT NULL DEFAULT 'FULL_DAY';

-- CreateTable
CREATE TABLE "holidays" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
