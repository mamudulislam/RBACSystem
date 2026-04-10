import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminRolePerms = await prisma.rolePermission.findMany({
    where: { role: 'ADMIN' },
    include: { permission: true }
  });
  console.log('Admin role permissions:', adminRolePerms.map(p => p.permission.atom));
  
  const userPerms = await prisma.userPermission.findMany({
    where: { user: { email: 'admin@obliq.com' } },
    include: { permission: true }
  });
  console.log('Admin user permissions:', userPerms.map(p => p.permission.atom));
  
  await prisma.$disconnect();
}

main().catch(console.error);