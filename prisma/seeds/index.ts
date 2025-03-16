// prisma/seeds/index.ts
import { PrismaClient } from '@prisma/client';
import { seedExtension } from './extension.seed';
import { seedProperty } from './property.seed';
import { seedUserRolePermission } from './user-role-permission.seed';
const prisma = new PrismaClient();

const run = async () => {
  try {
    await seedUserRolePermission();
    await seedProperty();
    await seedExtension();
    console.log('All seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
};
run();
