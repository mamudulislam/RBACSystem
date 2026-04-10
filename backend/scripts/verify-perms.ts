import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const rolePerms = await prisma.rolePermission.findMany({
    where: { role: 'ADMIN' },
    include: { permission: true }
  });
  console.log('Admin role permissions:', rolePerms.map(p => p.permission.atom));
  
  await prisma.$disconnect();
}

main().catch(console.error);