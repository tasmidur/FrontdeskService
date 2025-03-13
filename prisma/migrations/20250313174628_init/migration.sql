-- CreateTable
CREATE TABLE "User" (
    "Id" UUID NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Role" (
    "Id" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "Id" UUID NOT NULL,
    "UserId" UUID NOT NULL,
    "RoleId" UUID NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "Id" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "Id" UUID NOT NULL,
    "RoleId" UUID NOT NULL,
    "PermissionId" UUID NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "AuditLogs" (
    "Id" UUID NOT NULL,
    "ReferrenceId" TEXT,
    "ReferrenceType" TEXT,
    "Notes" TEXT,
    "CreatedAt" TEXT,
    "ThirdPartySubscriptionId_FK" UUID,

    CONSTRAINT "AuditLogs_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "GuestGroupMembers" (
    "Id" UUID NOT NULL,
    "GuestGroupId_FK" UUID NOT NULL,
    "GuestId_FK" UUID NOT NULL,
    "CreatedAt" TEXT,
    "UpdatedAt" TEXT,
    "IsPrimaryGuest" TEXT,
    "GuestShare" TEXT,

    CONSTRAINT "GuestGroupMembers_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "GuestGroups" (
    "Id" UUID NOT NULL,
    "GuestGroupCode" TEXT NOT NULL,
    "GuestGroupType" TEXT,
    "GuestGroupName" TEXT NOT NULL,
    "CreatedAt" TEXT,
    "UpdatedAt" TEXT,
    "Description" TEXT,
    "PropertyId_FK" UUID NOT NULL,

    CONSTRAINT "GuestGroups_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "GuestMembership" (
    "Id" UUID NOT NULL,
    "Guest_Id" UUID NOT NULL,
    "TierLevel" TEXT,
    "PointsBalance" INTEGER DEFAULT 0,
    "TotalPointsEarned" INTEGER DEFAULT 0,
    "TotalPointsRedeemed" INTEGER DEFAULT 0,
    "EnrollDate" TEXT,
    "EndDate" TEXT,
    "LastActivityDate" TEXT,
    "EligibleRewards" TEXT,
    "Status" TEXT,
    "Notes" TEXT,
    "IsActive" TEXT,

    CONSTRAINT "GuestMembership_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "GuestStayHistory" (
    "Id" UUID NOT NULL,
    "ReservationId_FK" UUID NOT NULL,
    "RoomId_FK" UUID NOT NULL,
    "NumberOfAdults" TEXT NOT NULL,
    "NumberOfChilden" TEXT,
    "ActualCheckedInDate" TEXT,
    "ActualCheckedOutDate" TEXT,
    "Notes" TEXT,
    "UpdatedBy" TEXT,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT,
    "IsShared" TEXT,

    CONSTRAINT "GuestStayHistory_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Guests" (
    "Id" UUID NOT NULL,
    "GuestType" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Gender" TEXT,
    "DOB" TEXT,
    "Photo" BYTEA,
    "Email" TEXT,
    "Phone" TEXT,
    "Address" JSON,
    "Country" TEXT,
    "Language" TEXT,
    "NumberOfVisits" SMALLINT,
    "LastVisitedDate" TEXT,
    "Comments" TEXT,
    "CreatedAt" TEXT,
    "UpdatedAt" TEXT,
    "GuestCode" TEXT,

    CONSTRAINT "Guests_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ReservationDetails" (
    "Id" UUID NOT NULL,
    "ReservationId_FK" UUID NOT NULL,
    "NumberOfRooms" TEXT NOT NULL,
    "Notes" TEXT,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT,
    "RoomTypeId_FK" UUID NOT NULL,

    CONSTRAINT "ReservationDetails_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Reservations" (
    "Id" UUID NOT NULL,
    "PropertyId_FK" UUID NOT NULL,
    "ReservationCode" TEXT NOT NULL,
    "ReservationSource" TEXT NOT NULL,
    "ReservationDate" TEXT NOT NULL,
    "ReservationType" TEXT NOT NULL,
    "PromotionId_FK" UUID,
    "PrimaryGuestID_FK" UUID NOT NULL,
    "GuestGroupMembersId_FK" UUID,
    "PrimaryGuestName" TEXT NOT NULL,
    "UtcTentativeCheckedInDate" TEXT,
    "CheckInDate" TEXT,
    "UtcTentativeCheckedOutDate" TEXT,
    "CheckOutDate" TEXT,
    "ReservationStatus" TEXT NOT NULL,
    "LastReservationStatusChangeDate" TEXT,
    "NumberOfAdults" TEXT NOT NULL,
    "NumberOfChilden" TEXT,
    "Notes" TEXT,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT,
    "UpdatedBy" TEXT,
    "TemporaryLockDate" TEXT,
    "IsAutoSystemReservation" TEXT,
    "UtcReservationDate" TEXT,
    "UtcCheckInDate" TEXT,
    "UtcCheckOutDate" TEXT,

    CONSTRAINT "Reservations_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "RoomType" (
    "Id" UUID NOT NULL,
    "PropertyId_FK" UUID NOT NULL,
    "RoomTypeName" TEXT NOT NULL,
    "IsActive" TEXT NOT NULL,
    "Notes" TEXT,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT,

    CONSTRAINT "RoomType_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Rooms" (
    "Id" UUID NOT NULL,
    "PropertyId_FK" UUID NOT NULL,
    "BuildingNo" TEXT,
    "FloorNo" TEXT,
    "RoomNo" TEXT NOT NULL,
    "RoomStatus" TEXT,
    "NumberOfRooms" TEXT,
    "NumberOfBeds" TEXT,
    "NumberOfBathrooms" TEXT,
    "MaxCapacity" TEXT,
    "IsActive" TEXT NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT,
    "RoomTypeId_FK" UUID NOT NULL,

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "StayingGuestDetails" (
    "Id" UUID NOT NULL,
    "GuestStayHistoryId_FK" UUID NOT NULL,
    "GuestId_FK" UUID NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT,
    "GuestName" TEXT,

    CONSTRAINT "StayingGuestDet_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ThirdPartySubscription" (
    "Id" UUID NOT NULL,
    "Source" TEXT,
    "CreatedAt" TEXT NOT NULL,
    "SubscriptionData" TEXT NOT NULL,
    "ProcessStatus" TEXT,
    "ErrorMessage" TEXT,
    "ProcessDate" TEXT,
    "RetryNo" SMALLINT DEFAULT 0,
    "EventType" TEXT,

    CONSTRAINT "ThirdPartySubscription_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Extensions" (
    "Id" UUID NOT NULL,
    "PropertyId_FK" UUID NOT NULL,
    "ExtensionNumber" TEXT NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "IsActive" TEXT,
    "Notes" TEXT,
    "Category" TEXT,
    "DepartmentNum" TEXT,
    "DivisionNum" TEXT,
    "SubDepartment" TEXT,
    "FirstName" TEXT,
    "LastName" TEXT,
    "UserName" TEXT,
    "LinePort1" TEXT,
    "LinePort2" TEXT,
    "LinePort3" TEXT,
    "BuildingCode" TEXT,
    "VoiceMailPassword" TEXT,
    "VmCapable" TEXT,
    "DndCapable" TEXT,
    "JazzUserId" TEXT,
    "PbxNum" TEXT,
    "AdditionalSpUserId" TEXT,

    CONSTRAINT "Extensions_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "RoomExtensions" (
    "Id" UUID NOT NULL,
    "RoomId_FK" UUID NOT NULL,
    "ExtensionId_FK" UUID NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "IsActive" TEXT,
    "Notes" TEXT,

    CONSTRAINT "RoomExtensions_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Properties" (
    "Id" UUID NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Properties_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Call" (
    "Id" UUID NOT NULL,
    "ExtensionNumber" TEXT NOT NULL,
    "CallType" TEXT NOT NULL,
    "CallStatus" TEXT NOT NULL,
    "CallDuration" DOUBLE PRECISION,
    "VoiceMail" TEXT,
    "NextWakeUpCall" TIMESTAMP(3),
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Call_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE INDEX "User_Email_idx" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_Name_key" ON "Role"("Name");

-- CreateIndex
CREATE INDEX "Role_Name_idx" ON "Role"("Name");

-- CreateIndex
CREATE INDEX "fki_FkeyUser" ON "UserRole"("UserId");

-- CreateIndex
CREATE INDEX "fki_FkeyRole" ON "UserRole"("RoleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_UserId_RoleId_key" ON "UserRole"("UserId", "RoleId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_Name_key" ON "Permission"("Name");

-- CreateIndex
CREATE INDEX "Permission_Name_idx" ON "Permission"("Name");

-- CreateIndex
CREATE INDEX "fki_FkeyRolePermissionToRole" ON "RolePermission"("RoleId");

-- CreateIndex
CREATE INDEX "fki_FkeyRolePermissionToPermission" ON "RolePermission"("PermissionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_RoleId_PermissionId_key" ON "RolePermission"("RoleId", "PermissionId");

-- CreateIndex
CREATE INDEX "fki_FkeySubscription" ON "AuditLogs"("ThirdPartySubscriptionId_FK");

-- CreateIndex
CREATE INDEX "fki_FKeyGroup" ON "GuestGroupMembers"("GuestGroupId_FK");

-- CreateIndex
CREATE INDEX "fki_FKeyGuestKey" ON "GuestGroupMembers"("GuestId_FK");

-- CreateIndex
CREATE INDEX "fki_FKeyReservation_GSH" ON "GuestStayHistory"("ReservationId_FK");

-- CreateIndex
CREATE INDEX "fki_FKeyRoomID" ON "GuestStayHistory"("RoomId_FK");

-- CreateIndex
CREATE INDEX "fki_FKeyReservation" ON "ReservationDetails"("ReservationId_FK");

-- CreateIndex
CREATE INDEX "fki_FKeyRoomType_RD" ON "ReservationDetails"("RoomTypeId_FK");

-- CreateIndex
CREATE INDEX "fki_FkeyGuest" ON "Reservations"("PrimaryGuestID_FK");

-- CreateIndex
CREATE INDEX "fki_FkeyGuestGroupMember" ON "Reservations"("GuestGroupMembersId_FK");

-- CreateIndex
CREATE INDEX "fki_FkeyRoomType_Rooms" ON "Rooms"("RoomTypeId_FK");

-- CreateIndex
CREATE INDEX "fki_FKeyGSH" ON "StayingGuestDetails"("GuestStayHistoryId_FK");

-- CreateIndex
CREATE INDEX "fki_FKeyGuest_StayDet" ON "StayingGuestDetails"("GuestId_FK");

-- CreateIndex
CREATE UNIQUE INDEX "Property_Extension" ON "Extensions"("PropertyId_FK", "ExtensionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Room_Extension" ON "RoomExtensions"("RoomId_FK", "ExtensionId_FK");

-- CreateIndex
CREATE INDEX "Call_ExtensionNumber_idx" ON "Call"("ExtensionNumber");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES "Role"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES "Role"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_PermissionId_fkey" FOREIGN KEY ("PermissionId") REFERENCES "Permission"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "FkeySubscription" FOREIGN KEY ("ThirdPartySubscriptionId_FK") REFERENCES "ThirdPartySubscription"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GuestGroupMembers" ADD CONSTRAINT "FKeyGroup" FOREIGN KEY ("GuestGroupId_FK") REFERENCES "GuestGroups"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GuestGroupMembers" ADD CONSTRAINT "FKeyGuestKey" FOREIGN KEY ("GuestId_FK") REFERENCES "Guests"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GuestGroups" ADD CONSTRAINT "GuestGroups_PropertyId_FK_fkey" FOREIGN KEY ("PropertyId_FK") REFERENCES "Properties"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GuestMembership" ADD CONSTRAINT "FKey_Guest_Membership" FOREIGN KEY ("Guest_Id") REFERENCES "Guests"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GuestStayHistory" ADD CONSTRAINT "FKeyReservation_GSH" FOREIGN KEY ("ReservationId_FK") REFERENCES "Reservations"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GuestStayHistory" ADD CONSTRAINT "FKeyRoomID" FOREIGN KEY ("RoomId_FK") REFERENCES "Rooms"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ReservationDetails" ADD CONSTRAINT "FKeyReservation" FOREIGN KEY ("ReservationId_FK") REFERENCES "Reservations"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ReservationDetails" ADD CONSTRAINT "FKeyRoomType_RD" FOREIGN KEY ("RoomTypeId_FK") REFERENCES "RoomType"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reservations" ADD CONSTRAINT "Reservations_PropertyId_FK_fkey" FOREIGN KEY ("PropertyId_FK") REFERENCES "Properties"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reservations" ADD CONSTRAINT "FkeyGuest" FOREIGN KEY ("PrimaryGuestID_FK") REFERENCES "Guests"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RoomType" ADD CONSTRAINT "RoomType_PropertyId_FK_fkey" FOREIGN KEY ("PropertyId_FK") REFERENCES "Properties"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_PropertyId_FK_fkey" FOREIGN KEY ("PropertyId_FK") REFERENCES "Properties"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "FkeyRoomType_Rooms" FOREIGN KEY ("RoomTypeId_FK") REFERENCES "RoomType"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StayingGuestDetails" ADD CONSTRAINT "FKeyGSH" FOREIGN KEY ("GuestStayHistoryId_FK") REFERENCES "GuestStayHistory"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StayingGuestDetails" ADD CONSTRAINT "FKeyGuest_StayDet" FOREIGN KEY ("GuestId_FK") REFERENCES "Guests"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Extensions" ADD CONSTRAINT "Extensions_PropertyId_FK_fkey" FOREIGN KEY ("PropertyId_FK") REFERENCES "Properties"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RoomExtensions" ADD CONSTRAINT "RoomExtensions_RoomId_FK_fkey" FOREIGN KEY ("RoomId_FK") REFERENCES "Rooms"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RoomExtensions" ADD CONSTRAINT "RoomExtensions_ExtensionId_FK_fkey" FOREIGN KEY ("ExtensionId_FK") REFERENCES "Extensions"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;
