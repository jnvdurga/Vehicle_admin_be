import 'dotenv/config';
import { prisma } from './prisma.seed.client';

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL!;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('User not found:', email);
    return;
  }

  const role = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
  if (!role) {
    console.log('Role SUPER_ADMIN not found');
    return;
  }

  const existing = await prisma.userRole.findFirst({ where: { userId: user.id, roleId: role.id } });
  if (existing) {
    console.log('User already has SUPER_ADMIN role');
    return;
  }

  await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } });
  console.log('Assigned SUPER_ADMIN role to', email);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
