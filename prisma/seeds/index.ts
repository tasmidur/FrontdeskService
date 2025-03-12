// prisma/seeds/index.ts
import { PrismaClient } from '@prisma/client';
import { seedProperty } from './property.seed';
const prisma = new PrismaClient();

const run = async () => {
  try {
    //await seedUserRolePermission();
    await seedProperty();
    console.log('All seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
};
run();
