-- CreateTable
CREATE TABLE "User" (
    "Id" UUID NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "UserProperty" (
    "Id" UUID NOT NULL,
    "UserId_FK" UUID,
    "PropertyId_FK" UUID NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),
    "IsActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserProperty_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Role" (
    "Id" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "Id" UUID NOT NULL,
    "UserId_FK" UUID NOT NULL,
    "RoleId_FK" UUID NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "Id" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "Id" UUID NOT NULL,
    "RoleId_FK" UUID NOT NULL,
    "PermissionId_FK" UUID NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "AuditLogs" (
    "Id" UUID NOT NULL,
    "ReferrenceId" TEXT,
    "ReferrenceType" TEXT,
    "Notes" TEXT,
    "ThirdPartySubscriptionId_FK" UUID,
    "CreatedAt" TIMESTAMP(3),

    CONSTRAINT "AuditLogs_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "GuestGroupMembers" (
    "Id" UUID NOT NULL,
    "GuestGroupId_FK" UUID NOT NULL,
    "GuestId_FK" UUID NOT NULL,
    "IsPrimaryGuest" TEXT,
    "GuestShare" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "GuestGroupMembers_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "GuestGroups" (
    "Id" UUID NOT NULL,
    "GuestGroupCode" TEXT NOT NULL,
    "GuestGroupType" TEXT,
    "GuestGroupName" TEXT NOT NULL,
    "Description" TEXT,
    "PropertyId_FK" UUID NOT NULL,
    "CreatedAt" TIMESTAMP(3),
    "UpdatedAt" TIMESTAMP(3),

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
    "GuestId_FK" UUID NOT NULL,
    "NumberOfAdults" INTEGER NOT NULL,
    "NumberOfChilden" INTEGER,
    "ActualCheckedInDate" TEXT,
    "ActualCheckedOutDate" TEXT,
    "Notes" TEXT,
    "IsShared" TEXT,
    "UpdatedBy" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

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
    "GuestCode" TEXT,
    "CreatedAt" TIMESTAMP(3),
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Guests_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ReservationDetails" (
    "Id" UUID NOT NULL,
    "ReservationId_FK" UUID NOT NULL,
    "NumberOfRooms" TEXT NOT NULL,
    "Notes" TEXT,
    "RoomTypeId_FK" UUID NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

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
    "TemporaryLockDate" TEXT,
    "IsAutoSystemReservation" TEXT,
    "UtcReservationDate" TEXT,
    "UtcCheckInDate" TEXT,
    "UtcCheckOutDate" TEXT,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TIMESTAMP(3),
    "UpdatedBy" TIMESTAMP(3),

    CONSTRAINT "Reservations_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "RoomType" (
    "Id" UUID NOT NULL,
    "PropertyId_FK" UUID NOT NULL,
    "RoomTypeName" TEXT NOT NULL,
    "IsActive" TEXT NOT NULL,
    "Notes" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "RoomType_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Rooms" (
    "Id" UUID NOT NULL,
    "PropertyId_FK" UUID NOT NULL,
    "RoomTypeId_FK" UUID NOT NULL,
    "BuildingNo" TEXT,
    "FloorNo" TEXT,
    "RoomNo" TEXT NOT NULL,
    "RoomStatus" TEXT,
    "NumberOfRooms" TEXT,
    "NumberOfBeds" TEXT,
    "NumberOfBathrooms" TEXT,
    "MaxCapacity" TEXT,
    "IsActive" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Rooms_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "ThirdPartySubscription" (
    "Id" UUID NOT NULL,
    "Source" TEXT,
    "SubscriptionData" TEXT NOT NULL,
    "ProcessStatus" TEXT,
    "ErrorMessage" TEXT,
    "ProcessDate" TEXT,
    "RetryNo" SMALLINT DEFAULT 0,
    "EventType" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThirdPartySubscription_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Extensions" (
    "Id" UUID NOT NULL,
    "PropertyId_FK" UUID NOT NULL,
    "ExtensionNumber" TEXT NOT NULL,
    "Notes" TEXT,
    "Category" TEXT,
    "DivisionId_FK" UUID,
    "DepartmentId_FK" UUID,
    "SubDepartmentId_FK" UUID,
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
    "IsActive" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Extensions_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "RoomExtensions" (
    "Id" UUID NOT NULL,
    "RoomId_FK" UUID NOT NULL,
    "ExtensionId_FK" UUID NOT NULL,
    "IsActive" TEXT,
    "Notes" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "RoomExtensions_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Call" (
    "Id" UUID NOT NULL,
    "ExtensionId_FK" UUID,
    "GuestId_FK" UUID,
    "CallType" TEXT NOT NULL,
    "CallStatus" TEXT NOT NULL,
    "CallDuration" DOUBLE PRECISION,
    "VoiceMail" TEXT,
    "NextWakeUpCall" TIMESTAMP(3),
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Call_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Property" (
    "Id" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "Address" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Property_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Division" (
    "Id" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "PropertyId_FK" UUID NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Division_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Department" (
    "Id" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "PropertyId_FK" UUID NOT NULL,
    "DivisionId_FK" UUID,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "Department_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "SubDepartment" (
    "Id" UUID NOT NULL,
    "Name" TEXT NOT NULL,
    "PropertyId_FK" UUID NOT NULL,
    "DivisionId_FK" UUID,
    "DepartmentId_FK" UUID,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "SubDepartment_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "SpeedDialExtension" (
    "Id" UUID NOT NULL,
    "ExtensionId_FK" UUID NOT NULL,
    "ServiceType" TEXT NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "UpdatedAt" TIMESTAMP(3),

    CONSTRAINT "SpeedDialExtension_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE INDEX "User_Email_idx" ON "User"("Email");

-- CreateIndex
CREATE INDEX "fki_FKeyUserPropertyToUser" ON "UserProperty"("UserId_FK");

-- CreateIndex
CREATE INDEX "fki_FKeyUserPropertyToProperty" ON "UserProperty"("PropertyId_FK");

-- CreateIndex
CREATE UNIQUE INDEX "UserProperty_UserId_FK_PropertyId_FK_key" ON "UserProperty"("UserId_FK", "PropertyId_FK");

-- CreateIndex
CREATE UNIQUE INDEX "Role_Name_key" ON "Role"("Name");

-- CreateIndex
CREATE INDEX "Role_Name_IsActive_CreatedAt_idx" ON "Role"("Name", "IsActive", "CreatedAt");

-- CreateIndex
CREATE INDEX "fki_FkeyUser" ON "UserRole"("UserId_FK");

-- CreateIndex
CREATE INDEX "fki_FkeyRole" ON "UserRole"("RoleId_FK");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_UserId_FK_RoleId_FK_key" ON "UserRole"("UserId_FK", "RoleId_FK");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_Name_key" ON "Permission"("Name");

-- CreateIndex
CREATE INDEX "Permission_Name_IsActive_CreatedAt_idx" ON "Permission"("Name", "IsActive", "CreatedAt");

-- CreateIndex
CREATE INDEX "fki_FkeyRolePermissionToRole" ON "RolePermission"("RoleId_FK");

-- CreateIndex
CREATE INDEX "fki_FkeyRolePermissionToPermission" ON "RolePermission"("PermissionId_FK");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_RoleId_FK_PermissionId_FK_key" ON "RolePermission"("RoleId_FK", "PermissionId_FK");

-- CreateIndex
CREATE INDEX "fki_FkeySubscription" ON "AuditLogs"("ThirdPartySubscriptionId_FK", "CreatedAt");

-- CreateIndex
CREATE INDEX "fki_FKeyGroup" ON "GuestGroupMembers"("GuestGroupId_FK");

-- CreateIndex
CREATE INDEX "fki_FKeyGuestKey" ON "GuestGroupMembers"("GuestId_FK");

-- CreateIndex
CREATE INDEX "GuestGroupMembers_CreatedAt_idx" ON "GuestGroupMembers"("CreatedAt");

-- CreateIndex
CREATE INDEX "GuestGroups_GuestGroupCode_PropertyId_FK_CreatedAt_idx" ON "GuestGroups"("GuestGroupCode", "PropertyId_FK", "CreatedAt");

-- CreateIndex
CREATE INDEX "GuestMembership_Guest_Id_idx" ON "GuestMembership"("Guest_Id");

-- CreateIndex
CREATE INDEX "fki_FKeyReservation_GSH" ON "GuestStayHistory"("ReservationId_FK");

-- CreateIndex
CREATE INDEX "fki_FKeyRoomID" ON "GuestStayHistory"("RoomId_FK");

-- CreateIndex
CREATE INDEX "GuestStayHistory_GuestId_FK_CreatedAt_idx" ON "GuestStayHistory"("GuestId_FK", "CreatedAt");

-- CreateIndex
CREATE INDEX "Guests_GuestType_Email_Phone_GuestCode_idx" ON "Guests"("GuestType", "Email", "Phone", "GuestCode");

-- CreateIndex
CREATE INDEX "fki_FKeyReservation" ON "ReservationDetails"("ReservationId_FK");

-- CreateIndex
CREATE INDEX "fki_FKeyRoomType_RD" ON "ReservationDetails"("RoomTypeId_FK");

-- CreateIndex
CREATE INDEX "ReservationDetails_CreatedAt_idx" ON "ReservationDetails"("CreatedAt");

-- CreateIndex
CREATE INDEX "fki_FkeyGuest" ON "Reservations"("PrimaryGuestID_FK");

-- CreateIndex
CREATE INDEX "fki_FkeyGuestGroupMember" ON "Reservations"("GuestGroupMembersId_FK");

-- CreateIndex
CREATE INDEX "Reservations_CreatedAt_idx" ON "Reservations"("CreatedAt");

-- CreateIndex
CREATE INDEX "RoomType_CreatedAt_idx" ON "RoomType"("CreatedAt");

-- CreateIndex
CREATE INDEX "fki_FkeyRoomType_Rooms" ON "Rooms"("RoomTypeId_FK");

-- CreateIndex
CREATE INDEX "Rooms_CreatedAt_idx" ON "Rooms"("CreatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Property_Extension" ON "Extensions"("PropertyId_FK", "ExtensionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Room_Extension" ON "RoomExtensions"("RoomId_FK", "ExtensionId_FK");

-- CreateIndex
CREATE INDEX "Call_ExtensionId_FK_CreatedAt_idx" ON "Call"("ExtensionId_FK", "CreatedAt");

-- CreateIndex
CREATE INDEX "Property_CreatedAt_idx" ON "Property"("CreatedAt");

-- CreateIndex
CREATE INDEX "Division_CreatedAt_PropertyId_FK_idx" ON "Division"("CreatedAt", "PropertyId_FK");

-- CreateIndex
CREATE UNIQUE INDEX "Division_Name_PropertyId_FK_key" ON "Division"("Name", "PropertyId_FK");

-- CreateIndex
CREATE INDEX "Department_CreatedAt_PropertyId_FK_DivisionId_FK_idx" ON "Department"("CreatedAt", "PropertyId_FK", "DivisionId_FK");

-- CreateIndex
CREATE UNIQUE INDEX "Department_Name_PropertyId_FK_DivisionId_FK_key" ON "Department"("Name", "PropertyId_FK", "DivisionId_FK");

-- CreateIndex
CREATE INDEX "SubDepartment_CreatedAt_PropertyId_FK_DivisionId_FK_Departm_idx" ON "SubDepartment"("CreatedAt", "PropertyId_FK", "DivisionId_FK", "DepartmentId_FK");

-- CreateIndex
CREATE UNIQUE INDEX "SubDepartment_Name_PropertyId_FK_DivisionId_FK_DepartmentId_key" ON "SubDepartment"("Name", "PropertyId_FK", "DivisionId_FK", "DepartmentId_FK");

-- CreateIndex
CREATE UNIQUE INDEX "SpeedDialExtension_ServiceType_ExtensionId_FK_key" ON "SpeedDialExtension"("ServiceType", "ExtensionId_FK");

-- AddForeignKey
ALTER TABLE "UserProperty" ADD CONSTRAINT "UserProperty_UserId_FK_fkey" FOREIGN KEY ("UserId_FK") REFERENCES "User"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserProperty" ADD CONSTRAINT "UserProperty_PropertyId_FK_fkey" FOREIGN KEY ("PropertyId_FK") REFERENCES "Property"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_UserId_FK_fkey" FOREIGN KEY ("UserId_FK") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_RoleId_FK_fkey" FOREIGN KEY ("RoleId_FK") REFERENCES "Role"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_RoleId_FK_fkey" FOREIGN KEY ("RoleId_FK") REFERENCES "Role"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_PermissionId_FK_fkey" FOREIGN KEY ("PermissionId_FK") REFERENCES "Permission"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "FkeySubscription" FOREIGN KEY ("ThirdPartySubscriptionId_FK") REFERENCES "ThirdPartySubscription"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GuestGroupMembers" ADD CONSTRAINT "FKeyGroup" FOREIGN KEY ("GuestGroupId_FK") REFERENCES "GuestGroups"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GuestGroupMembers" ADD CONSTRAINT "FKeyGuestKey" FOREIGN KEY ("GuestId_FK") REFERENCES "Guests"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GuestGroups" ADD CONSTRAINT "GuestGroups_PropertyId_FK_fkey" FOREIGN KEY ("PropertyId_FK") REFERENCES "Property"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GuestMembership" ADD CONSTRAINT "FKey_Guest_Membership" FOREIGN KEY ("Guest_Id") REFERENCES "Guests"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GuestStayHistory" ADD CONSTRAINT "FKeyGuest_StayDet" FOREIGN KEY ("GuestId_FK") REFERENCES "Guests"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GuestStayHistory" ADD CONSTRAINT "FKeyReservation_GSH" FOREIGN KEY ("ReservationId_FK") REFERENCES "Reservations"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GuestStayHistory" ADD CONSTRAINT "FKeyRoomID" FOREIGN KEY ("RoomId_FK") REFERENCES "Rooms"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ReservationDetails" ADD CONSTRAINT "FKeyReservation" FOREIGN KEY ("ReservationId_FK") REFERENCES "Reservations"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ReservationDetails" ADD CONSTRAINT "FKeyRoomType_RD" FOREIGN KEY ("RoomTypeId_FK") REFERENCES "RoomType"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reservations" ADD CONSTRAINT "Reservations_PropertyId_FK_fkey" FOREIGN KEY ("PropertyId_FK") REFERENCES "Property"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reservations" ADD CONSTRAINT "FkeyGuest" FOREIGN KEY ("PrimaryGuestID_FK") REFERENCES "Guests"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RoomType" ADD CONSTRAINT "RoomType_PropertyId_FK_fkey" FOREIGN KEY ("PropertyId_FK") REFERENCES "Property"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_PropertyId_FK_fkey" FOREIGN KEY ("PropertyId_FK") REFERENCES "Property"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "FkeyRoomType_Rooms" FOREIGN KEY ("RoomTypeId_FK") REFERENCES "RoomType"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Extensions" ADD CONSTRAINT "Extensions_PropertyId_FK_fkey" FOREIGN KEY ("PropertyId_FK") REFERENCES "Property"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Extensions" ADD CONSTRAINT "Extensions_DivisionId_FK_fkey" FOREIGN KEY ("DivisionId_FK") REFERENCES "Division"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Extensions" ADD CONSTRAINT "Extensions_DepartmentId_FK_fkey" FOREIGN KEY ("DepartmentId_FK") REFERENCES "Department"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Extensions" ADD CONSTRAINT "Extensions_SubDepartmentId_FK_fkey" FOREIGN KEY ("SubDepartmentId_FK") REFERENCES "SubDepartment"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RoomExtensions" ADD CONSTRAINT "RoomExtensions_RoomId_FK_fkey" FOREIGN KEY ("RoomId_FK") REFERENCES "Rooms"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RoomExtensions" ADD CONSTRAINT "RoomExtensions_ExtensionId_FK_fkey" FOREIGN KEY ("ExtensionId_FK") REFERENCES "Extensions"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_ExtensionId_FK_fkey" FOREIGN KEY ("ExtensionId_FK") REFERENCES "Extensions"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_GuestId_FK_fkey" FOREIGN KEY ("GuestId_FK") REFERENCES "Guests"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Division" ADD CONSTRAINT "Division_PropertyId_FK_fkey" FOREIGN KEY ("PropertyId_FK") REFERENCES "Property"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_PropertyId_FK_fkey" FOREIGN KEY ("PropertyId_FK") REFERENCES "Property"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_DivisionId_FK_fkey" FOREIGN KEY ("DivisionId_FK") REFERENCES "Division"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SubDepartment" ADD CONSTRAINT "SubDepartment_PropertyId_FK_fkey" FOREIGN KEY ("PropertyId_FK") REFERENCES "Property"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SubDepartment" ADD CONSTRAINT "SubDepartment_DivisionId_FK_fkey" FOREIGN KEY ("DivisionId_FK") REFERENCES "Division"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SubDepartment" ADD CONSTRAINT "SubDepartment_DepartmentId_FK_fkey" FOREIGN KEY ("DepartmentId_FK") REFERENCES "Department"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SpeedDialExtension" ADD CONSTRAINT "SpeedDialExtension_ExtensionId_FK_fkey" FOREIGN KEY ("ExtensionId_FK") REFERENCES "Extensions"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
