import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
export async function seedProperty() {
  const users = await prisma.user.findMany();
  const propertyName = 'Hotel Jazz';
  await prisma.property.deleteMany();
  await prisma.property.create({
    data: {
      Id: '72a144cc-3dcd-4a7e-aa07-e31a47b3f3b5',
      Name: propertyName,
      CreatedAt: new Date().toISOString(),
      UserProperties: {
        create: users.map(user => ({
          Id: uuidv4(),
          UserId_FK: user.Id,
          CreatedAt: new Date().toISOString(),
        })),
      },
    },
  });
  console.log('Seed the property');
}
