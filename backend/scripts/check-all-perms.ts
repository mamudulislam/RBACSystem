import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get all permissions
  const allPerms = await prisma.permission.findMany();
  console.log('All permissions in DB:', allPerms.map(p => p.atom));
  
  // Get all role permissions
  const rolePerms = await prisma.rolePermission.findMany();
  console.log('\nAll role permissions:', rolePerms);
  
  await prisma.$disconnect();
}

main().catch(console.error);