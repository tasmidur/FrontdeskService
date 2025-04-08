import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const speedDialServices = [
  'Security',
  'Concierge',
  'Maintenance',
  'Spa & Wellness Center',
];
const extensions = ['9001', '6011', '6012', '6013'];
const PROPERTY_ID = '72a144cc-3dcd-4a7e-aa07-e31a47b3f3b5'; // From your previous code

export async function seedExtension() {
  const subDepartment = await prisma.subDepartment.findMany();
  const dataSet = subDepartment?.map((_item, index) => {
    return {
      Id: uuidv4(),
      DivisionId_FK: _item?.DivisionId_FK,
      DepartmentId_FK: _item?.DepartmentId_FK,
      SubDepartmentId_FK: _item?.Id,
      PropertyId_FK: PROPERTY_ID,
      IsActive: 'true',
      CreatedAt: new Date().toISOString(),
    };
  });
  for (const [index, element] of dataSet.entries()) {
    const service =
      speedDialServices[Math.floor(Math.random() * speedDialServices.length)];
    const extension =
      extensions[index] || Math.floor(1000 + Math.random() * 9000).toString();

    const extensionConfig = {
      SipServerUrl: '192.168.1.150',
      WsServer: 'ws://192.168.1.150:7443',
      WssEnabled: false,
      ExtensionPassword: 9001,
      AgentName: 'JazzWare/1.0.0',
    };

    await prisma.extensions.upsert({
      where: {
        PropertyId_FK_ExtensionNumber: {
          PropertyId_FK: element.PropertyId_FK,
          ExtensionNumber: extension,
        },
      },
      update: {
        DivisionId_FK: element.DivisionId_FK,
        DepartmentId_FK: element.DepartmentId_FK,
        SubDepartmentId_FK: element.SubDepartmentId_FK,
        IsActive: element.IsActive,
        Category: 'Admin',
        UpdatedAt: new Date(),
        Config: extension == '9001' ? { ...extensionConfig } : null,
        SpeedDialExtensions: {
          upsert: [
            {
              where: {
                ServiceType_ExtensionId_FK: {
                  ServiceType: service,
                  ExtensionId_FK: element.Id, // Note: This assumes we have the Id already
                },
              },
              update: {
                ServiceType: service,
                IsActive: true,
                UpdatedAt: new Date(),
              },
              create: {
                Id: uuidv4(),
                ServiceType: service,
                IsActive: true,
                CreatedAt: new Date(),
              },
            },
          ],
        },
      },
      create: {
        Id: element.Id || uuidv4(), // Use existing Id or generate new
        PropertyId_FK: element.PropertyId_FK || PROPERTY_ID,
        ExtensionNumber: extension,
        DivisionId_FK: element.DivisionId_FK,
        DepartmentId_FK: element.DepartmentId_FK,
        SubDepartmentId_FK: element.SubDepartmentId_FK,
        Category: 'Admin',
        IsActive: element.IsActive || 'true',
        CreatedAt: element.CreatedAt || new Date(),
        Config: extension == '9001' ? { ...extensionConfig } : null,
        SpeedDialExtensions: {
          create: [
            {
              Id: uuidv4(),
              ServiceType: service,
              IsActive: true,
              CreatedAt: new Date(),
            },
          ],
        },
      },
    });

    console.log(
      `Processed extension ${index + 1} of ${dataSet.length} with number ${extension}`,
    );
  }
  console.log('Seed the speed dial extenion');
}
