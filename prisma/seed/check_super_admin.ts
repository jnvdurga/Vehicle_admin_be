import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({
    where: {
      email: process.env.SUPER_ADMIN_EMAIL,
    },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    console.log('User not found:', process.env.SUPER_ADMIN_EMAIL);
    return;
  }

  console.dir(user, { depth: null });

  const hasSuperAdmin = (user.userRoles || []).some((ur) => {
    const rn = (ur.role?.name || '').toLowerCase();
    return rn === 'super admin' || rn === 'super_admin' || rn === 'super-admin' || rn === 'superadmin' || rn.includes('super');
  });

  if (hasSuperAdmin) {
    console.log('\nResult: User HAS a Super Admin role');
  } else {
    console.log('\nResult: User DOES NOT have a Super Admin role');
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => prisma.$disconnect());
