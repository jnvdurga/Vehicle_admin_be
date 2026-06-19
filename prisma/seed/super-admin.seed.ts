import { prisma } from './prisma.seed.client';
import * as bcrypt from 'bcrypt';

export const seedSuperAdmin = async () => {
  const email = process.env.SUPER_ADMIN_EMAIL!;
  const password = process.env.SUPER_ADMIN_PASSWORD!;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('⚠️ Super Admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email,
      password: hashedPassword,
    },
  });

  const role = await prisma.role.findUnique({
    where: { name: 'SUPER_ADMIN' },
  });

  if (!role) return;

  await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId: role.id,
    },
  });

  console.log('👑 Super Admin created');
};