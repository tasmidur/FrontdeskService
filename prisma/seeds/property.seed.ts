import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
export async function seedProperty() {
  return await prisma.properties.create({
    data: {
      Id: uuidv4(),
      Name: 'Testing Property',
    },
  });
}
