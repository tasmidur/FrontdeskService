// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function seedDivisionDepartment() {
  const propertyId = '72a144cc-3dcd-4a7e-aa07-e31a47b3f3b5'; // Represents a specific hotel property

  // Seed Divisions (Hotel Divisions)
  const divisions = await Promise.all([
    prisma.division.create({
      data: {
        Id: uuidv4(),
        Name: 'Operations',
        PropertyId_FK: propertyId,
        CreatedAt: new Date().toISOString(),
      },
    }),
    prisma.division.create({
      data: {
        Id: uuidv4(),
        Name: 'Guest Services',
        PropertyId_FK: propertyId,
        CreatedAt: new Date().toISOString(),
      },
    }),
    prisma.division.create({
      data: {
        Id: uuidv4(),
        Name: 'Food & Beverage',
        PropertyId_FK: propertyId,
        CreatedAt: new Date().toISOString(),
      },
    }),
  ]);

  // Seed Departments (Hotel Departments)
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        Id: uuidv4(),
        Name: 'Housekeeping',
        PropertyId_FK: propertyId,
        DivisionId_FK: divisions[0].Id, // Operations division
        CreatedAt: new Date().toISOString(),
      },
    }),
    prisma.department.create({
      data: {
        Id: uuidv4(),
        Name: 'Front Desk',
        PropertyId_FK: propertyId,
        DivisionId_FK: divisions[1].Id, // Guest Services division
        CreatedAt: new Date().toISOString(),
      },
    }),
    prisma.department.create({
      data: {
        Id: uuidv4(),
        Name: 'Restaurant',
        PropertyId_FK: propertyId,
        DivisionId_FK: divisions[2].Id, // Food & Beverage division
        CreatedAt: new Date().toISOString(),
      },
    }),
  ]);

  // Seed SubDepartments (Hotel SubDepartments)
  await Promise.all([
    prisma.subDepartment.create({
      data: {
        Id: uuidv4(),
        Name: 'Room Cleaning',
        PropertyId_FK: propertyId,
        DivisionId_FK: divisions[0].Id, // Operations division
        DepartmentId_FK: departments[0].Id, // Housekeeping department
        CreatedAt: new Date().toISOString(),
      },
    }),
    prisma.subDepartment.create({
      data: {
        Id: uuidv4(),
        Name: 'Maintenance',
        PropertyId_FK: propertyId,
        DivisionId_FK: divisions[0].Id, // Operations division
        DepartmentId_FK: departments[0].Id, // Housekeeping department
        CreatedAt: new Date().toISOString(),
      },
    }),
    prisma.subDepartment.create({
      data: {
        Id: uuidv4(),
        Name: 'Concierge',
        PropertyId_FK: propertyId,
        DivisionId_FK: divisions[1].Id, // Guest Services division
        DepartmentId_FK: departments[1].Id, // Front Desk department
        CreatedAt: new Date().toISOString(),
      },
    }),
    prisma.subDepartment.create({
      data: {
        Id: uuidv4(),
        Name: 'Kitchen Staff',
        PropertyId_FK: propertyId,
        DivisionId_FK: divisions[2].Id, // Food & Beverage division
        DepartmentId_FK: departments[2].Id, // Restaurant department
        CreatedAt: new Date().toISOString(),
      },
    }),
    prisma.subDepartment.create({
      data: {
        Id: uuidv4(),
        Name: 'Wait Staff',
        PropertyId_FK: propertyId,
        DivisionId_FK: divisions[2].Id, // Food & Beverage division
        DepartmentId_FK: departments[2].Id, // Restaurant department
        CreatedAt: new Date().toISOString(),
      },
    }),
  ]);

  console.log('Hotel structure seeding completed successfully!');
}
