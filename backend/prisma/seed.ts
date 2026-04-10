import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const permissions = [
  { atom: 'view:dashboard',  description: 'Access the main dashboard overview' },
  { atom: 'view:leads',      description: 'View and search leads' },
  { atom: 'view:tasks',      description: 'View project tasks and Kanban board' },
  { atom: 'view:reports',    description: 'Access analytics and reports' },
  { atom: 'view:audit',      description: 'View system audit logs' },
  { atom: 'view:portal',     description: 'Access the customer self-service portal' },
  { atom: 'view:opportunities', description: 'View sales opportunities' },
  { atom: 'view:messages',   description: 'View internal messages' },
  { atom: 'view:invoices',   description: 'View invoices' },
  { atom: 'manage:users',    description: 'Create, edit, suspend and ban users' },
  { atom: 'manage:settings', description: 'Access system configuration & settings' },
];

// Role → permissions mapping (grant ceiling hierarchy)
const rolePermissions: Record<string, string[]> = {
  ADMIN: permissions.map(p => p.atom), // all
  MANAGER: [
    'view:dashboard', 'view:leads', 'view:tasks', 'view:reports',
    'view:opportunities', 'view:messages', 'manage:users', 'view:portal',
  ],
  AGENT: [
    'view:dashboard', 'view:leads', 'view:tasks',
  ],
  CUSTOMER: [
    'view:dashboard', 'view:portal',
  ],
};

async function main() {
  console.log('🌱 Seeding permissions...');

  // Upsert permissions
  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { atom: p.atom },
      update: { description: p.description },
      create: { atom: p.atom, description: p.description },
    });
  }

  // Seed role permissions
  const allPerms = await prisma.permission.findMany();
  const permMap = Object.fromEntries(allPerms.map(p => [p.atom, p.id]));

  for (const [role, atoms] of Object.entries(rolePermissions)) {
    for (const atom of atoms) {
      const permId = permMap[atom];
      if (!permId) continue;
      await prisma.rolePermission.upsert({
        where: { role_permissionId: { role, permissionId: permId } },
        update: {},
        create: { role, permissionId: permId },
      });
    }
  }

  // Ensure admin user exists
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@obliq.com' } });
  if (!existingAdmin) {
    const hashedPassword = await argon2.hash('Admin@1234');
    await prisma.user.create({
      data: {
        email: 'admin@obliq.com',
        password: hashedPassword,
        fullName: 'System Admin',
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log('✅ Admin user created: admin@obliq.com / Admin@1234');
  } else {
    console.log('✅ Admin user already exists');
  }

  console.log('✅ Done. Permissions and roles seeded successfully!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
