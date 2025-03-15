import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
export async function seedProperty() {
  const users = await prisma.user.findMany();
  const propertyName = 'Hotel Jazz';
  await prisma.property.deleteMany();
  await prisma.property.create({
    data: {
      Id: uuidv4(),
      Name: propertyName,
      UserProperties: {
        create: users.map(user => ({
          Id: uuidv4(),
          UserId_FK: user.Id,
        })),
      },
    },
  });
  console.log('Seed the property');
}
