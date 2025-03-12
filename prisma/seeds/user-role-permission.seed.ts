import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Helper function to upsert a role
async function upsertRole(name: string, description: string) {
  return prisma.role.upsert({
    where: { Name: name }, // Unique field to check existence
    update: { Description: description }, // Update description if exists
    create: {
      Id: uuidv4(),
      Name: name,
      Description: description,
    },
  });
}

// Helper function to upsert a permission
async function upsertPermission(name: string, description: string) {
  return prisma.permission.upsert({
    where: { Name: name }, // Unique field to check existence
    update: { Description: description }, // Update description if exists
    create: {
      Id: uuidv4(),
      Name: name,
      Description: description,
    },
  });
}

// Helper function to upsert a user with roles
async function upsertUser(email: string, password: string, roleIds: string[]) {
  return prisma.user.upsert({
    where: { Email: email }, // Unique field to check existence
    update: {
      Password: password, // Update password if user exists
      UserRoles: {
        deleteMany: {}, // Clear existing roles to avoid duplicates
        create: roleIds.map(roleId => ({
          Id: uuidv4(),
          RoleId: roleId,
        })),
      },
    },
    create: {
      Id: uuidv4(),
      Email: email,
      Password: password,
      UserRoles: {
        create: roleIds.map(roleId => ({
          Id: uuidv4(),
          RoleId: roleId,
        })),
      },
    },
  });
}

// Helper function to upsert role-permission association
async function upsertRolePermission(roleId: string, permissionId: string) {
  return prisma.rolePermission.upsert({
    where: {
      RoleId_PermissionId: { RoleId: roleId, PermissionId: permissionId },
    }, // Composite unique key
    update: {}, // No update needed, just ensure it exists
    create: {
      Id: uuidv4(),
      RoleId: roleId,
      PermissionId: permissionId,
    },
  });
}

// Main seeding function
export async function seedUserRolePermission() {
  const hashedPassword = await bcrypt.hash('12345678', 10);
  // Upsert roles
  const adminRole = await upsertRole('ADMIN', 'Administrator role');
  const userRole = await upsertRole('USER', 'Regular user role');

  // Upsert permissions
  const readUsers = await upsertPermission('Read:Users', 'Can read users');
  const writeUsers = await upsertPermission('Write:Users', 'Can write users');

  // Upsert role-permission associations
  await upsertRolePermission(adminRole.Id, readUsers.Id);
  await upsertRolePermission(adminRole.Id, writeUsers.Id);
  await upsertRolePermission(userRole.Id, readUsers.Id);

  // Upsert users with associated roles
  await upsertUser('admin@example.com', hashedPassword, [adminRole.Id]);
  await upsertUser('user@example.com', hashedPassword, [userRole.Id]);

  console.log('Seed complete for user, role, permission');
}
