import { seedPermissions } from './permissions.seed';
import { seedRoles } from './roles.seed';
import { seedRolePermissions } from './role-permissions.seed';
import { seedSuperAdmin } from './super-admin.seed';
import { prisma } from './prisma.seed.client';

const main = async () => {
  try {
    console.log('🌱 Seeding started...');

    await seedPermissions();
    await seedRoles();
    await seedRolePermissions();
    await seedSuperAdmin();

    console.log('🎉 Seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
};

main();