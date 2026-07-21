import { prisma } from './prisma.seed.client';

export const seedRolePermissions = async () => {
  const rolePermissionsMap: Record<string, string[]> = {
    SUPER_ADMIN: ['*'], // special case

    FLEET_MANAGER: [
      'fleet:create',
      'fleet:read',
      'fleet:update',
      'fleet:delete',

      'vehicle:create',
      'vehicle:read',
      'vehicle:update',
      'vehicle:delete',
      'vehicle:track',
      'vehicle:view_history',
      'vehicle:parking_mode',
      'vehicle:driving_mode',
      'vehicle:engine_lock',
      'vehicle:engine_unlock',

      'driver:create',
      'driver:read',
      'driver:update',
      'driver:assign',
      'driver:remove',

      'caretaker:create',
      'caretaker:read',
      'caretaker:assign',
      'caretaker:remove',

      'alert:read',
      'alert:configure',
    ],

    DRIVER: [
      'vehicle:read',
      'vehicle:track',
      'vehicle:view_history',
      'vehicle:parking_mode',
      'vehicle:driving_mode',

      'alert:read',
      'alert:receive',
    ],

    CARETAKER: [
      'vehicle:read',
      'vehicle:track',
      'alert:receive',
    ],
  };

  for (const roleName in rolePermissionsMap) {
    const role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) continue;

    const permissions = rolePermissionsMap[roleName];

    // SUPER_ADMIN gets everything
    if (permissions.includes('*')) {
      const allPermissions = await prisma.permission.findMany();

      for (const perm of allPermissions) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: perm.id,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: perm.id,
          },
        });
      }

      continue;
    }

    for (const action of permissions) {
      const permission = await prisma.permission.findUnique({
        where: { action },
      });

      if (!permission) {
        throw new Error(`Permission '${action}' not found.`);
      }
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  console.log('✅ Role-Permissions seeded');
};