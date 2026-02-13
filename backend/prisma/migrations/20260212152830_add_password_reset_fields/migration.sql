/*
  Warnings:

  - A unique constraint covering the columns `[resetToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "appointments_providerId_startTime_endTime_idx";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "appointments_providerId_startTime_endTime_status_idx" ON "appointments"("providerId", "startTime", "endTime", "status");

-- CreateIndex
CREATE INDEX "appointments_userId_startTime_idx" ON "appointments"("userId", "startTime");

-- CreateIndex
CREATE INDEX "appointments_providerId_status_startTime_idx" ON "appointments"("providerId", "status", "startTime");

-- CreateIndex
CREATE INDEX "breaks_providerId_startTime_endTime_idx" ON "breaks"("providerId", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "holidays_providerId_date_idx" ON "holidays"("providerId", "date");

-- CreateIndex
CREATE INDEX "providers_userId_idx" ON "providers"("userId");

-- CreateIndex
CREATE INDEX "services_providerId_isActive_idx" ON "services"("providerId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "users_resetToken_key" ON "users"("resetToken");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "working_hours_providerId_dayOfWeek_isActive_idx" ON "working_hours"("providerId", "dayOfWeek", "isActive");
