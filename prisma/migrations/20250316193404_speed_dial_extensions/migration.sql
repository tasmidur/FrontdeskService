-- AlterTable
ALTER TABLE "Call" ALTER COLUMN "CreatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "SpeedDialExtension" (
    "Id" UUID NOT NULL,
    "ExtensionId_FK" UUID NOT NULL,
    "ServiceType" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),
    "IsActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SpeedDialExtension_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpeedDialExtension_ServiceType_ExtensionId_FK_key" ON "SpeedDialExtension"("ServiceType", "ExtensionId_FK");

-- AddForeignKey
ALTER TABLE "SpeedDialExtension" ADD CONSTRAINT "SpeedDialExtension_ExtensionId_FK_fkey" FOREIGN KEY ("ExtensionId_FK") REFERENCES "Extensions"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
