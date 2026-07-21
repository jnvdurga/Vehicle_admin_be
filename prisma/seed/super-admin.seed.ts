import { prisma } from './prisma.seed.client';
import * as bcrypt from 'bcrypt';

export const seedSuperAdmin = async () => {
  const email = process.env.SUPER_ADMIN_EMAIL!;
  const password = process.env.SUPER_ADMIN_PASSWORD!;

  // Try to find existing user and role
  let user = await prisma.user.findUnique({
    where: { email },
    include: { userRoles: { include: { role: true } } },
  });

  // Ensure role exists (create if missing)
  let role = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
  if (!role) {
    role = await prisma.role.create({ data: { name: 'SUPER_ADMIN', description: 'SUPER_ADMIN role' } });
    console.log('Created role SUPER_ADMIN');
  }

  if (user) {
    // If user already has the role, nothing to do
    const hasRole = (user.userRoles || []).some((ur) => ur.roleId === role!.id);
    if (hasRole) {
      console.log('⚠️ Super Admin already exists with role');
      return;
    }

    // Assign role to existing user
    await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } });
    console.log('👑 Assigned SUPER_ADMIN role to existing user');
    return;
  }

  // Create user and assign role
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = await prisma.user.create({ data: { name: 'Super Admin', email, password: hashedPassword } });

  await prisma.userRole.create({ data: { userId: newUser.id, roleId: role.id } });
  console.log('👑 Super Admin created and role assigned');
};