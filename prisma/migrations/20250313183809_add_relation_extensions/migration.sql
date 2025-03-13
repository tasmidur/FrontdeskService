/*
  Warnings:

  - Added the required column `PropertyId_FK` to the `Call` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Call_ExtensionNumber_idx";

-- AlterTable
ALTER TABLE "Call" ADD COLUMN     "PropertyId_FK" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "Call_ExtensionNumber_CreatedAt_idx" ON "Call"("ExtensionNumber", "CreatedAt");

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_PropertyId_FK_fkey" FOREIGN KEY ("PropertyId_FK") REFERENCES "Properties"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_ExtensionNumber_PropertyId_FK_fkey" FOREIGN KEY ("ExtensionNumber", "PropertyId_FK") REFERENCES "Extensions"("ExtensionNumber", "PropertyId_FK") ON DELETE NO ACTION ON UPDATE NO ACTION;
