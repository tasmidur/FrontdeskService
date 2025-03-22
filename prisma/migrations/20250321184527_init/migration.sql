-- DropIndex
DROP INDEX "Call_ExtensionId_FK_CreatedAt_idx";

-- AlterTable
ALTER TABLE "Call" ADD COLUMN     "GuestId_FK" UUID;

-- CreateIndex
CREATE INDEX "Call_ExtensionId_FK_CreatedAt_GuestId_FK_idx" ON "Call"("ExtensionId_FK", "CreatedAt", "GuestId_FK");

-- CreateIndex
CREATE INDEX "Guests_Email_Phone_idx" ON "Guests"("Email", "Phone");

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_GuestId_FK_fkey" FOREIGN KEY ("GuestId_FK") REFERENCES "Guests"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;
