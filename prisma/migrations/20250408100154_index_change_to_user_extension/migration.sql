-- DropIndex
DROP INDEX "fki_FKeyUserExtensionToExtension";

-- DropIndex
DROP INDEX "fki_FKeyUserExtensionToUser";

-- CreateIndex
CREATE INDEX "UserExtension_UserId_FK_ExtensionId_FK_idx" ON "UserExtension"("UserId_FK", "ExtensionId_FK");
