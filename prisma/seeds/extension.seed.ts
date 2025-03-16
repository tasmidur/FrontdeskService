import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const speedDialServices = [
  'Security',
  'Concierge',
  'Maintenance',
  'Spa & Wellness Center',
];

export async function seedExtension() {
  const dataSet = [
    {
      Id: uuidv4(),
      DepartmentNum: 'Security',
      ExtensionNumber: '00610',
      PropertyId_FK: '72a144cc-3dcd-4a7e-aa07-e31a47b3f3b5',
      IsActive: 'true',
      CreatedAt: new Date().toISOString(),
    },
    {
      Id: uuidv4(),
      DepartmentNum: 'Security',
      ExtensionNumber: '00003',
      PropertyId_FK: '72a144cc-3dcd-4a7e-aa07-e31a47b3f3b5',
      IsActive: 'true',
      CreatedAt: new Date().toISOString(),
    },
    {
      Id: uuidv4(),
      DepartmentNum: 'Security',
      ExtensionNumber: '09003',
      PropertyId_FK: '72a144cc-3dcd-4a7e-aa07-e31a47b3f3b5',
      IsActive: 'true',
      CreatedAt: new Date().toISOString(),
    },
  ];
  for (const element of dataSet) {
    const service =
      speedDialServices[Math.floor(Math.random() * speedDialServices.length)];
    await prisma.extensions.create({
      data: {
        ...element,
        SpeedDialExtensions: {
          create: [service].map(_item => ({
            Id: uuidv4(),
            ServiceType: _item,
          })),
        },
      },
    });
  }
  console.log('Seed the speed dial extenion');
}
