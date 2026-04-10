import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import * as argon2 from 'argon2';

type RoleType = 'ADMIN' | 'MANAGER' | 'AGENT' | 'CUSTOMER';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        isSuspended: true,
        isBanned: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUserPermissions(targetUserId: string, granterUserId: string, permissionAtoms: string[]) {
    const granter = await this.prisma.user.findUnique({ where: { id: granterUserId } });
    const target = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!granter || !target) throw new NotFoundException('User not found');

    // Role Hierarchy: Manager cannot edit Admin
    if (granter.role === 'MANAGER' && target.role === 'ADMIN') {
      throw new ForbiddenException('Managers cannot modify Administrator permissions.');
    }

    const granterPerms = await this.getEffectivePermissions(granterUserId, granter.role);

    // 2. Validate that granter has all permissions they are trying to grant
    for (const atom of permissionAtoms) {
      if (!granterPerms.includes(atom)) {
        throw new ForbiddenException(`You cannot grant permission '${atom}' as you do not hold it yourself.`);
      }
    }

    // 3. Clear existing user specific permissions and add new ones
    // Actually, it's better to just sync them.
    const allPermsInDB = await this.prisma.permission.findMany();
    
    await this.prisma.userPermission.deleteMany({
      where: { userId: targetUserId },
    });

    await this.audit.log(granterUserId, 'UPDATE_PERMISSIONS', `User:${targetUserId}`, { atoms: permissionAtoms });

    const createData = permissionAtoms.map(atom => {
      const p = allPermsInDB.find(perm => perm.atom === atom);
      if (!p) throw new NotFoundException(`Permission ${atom} not found`);
      return {
        userId: targetUserId,
        permissionId: p.id,
        granted: true,
      };
    });

    if (createData.length > 0) {
      await this.prisma.userPermission.createMany({
        data: createData,
      });
    }

    return { success: true, count: createData.length };
  }

  private async getEffectivePermissions(userId: string, role: string): Promise<string[]> {
    const rolePerms = await this.prisma.rolePermission.findMany({
      where: { role },
      include: { permission: true },
    });
    let perms = new Set(rolePerms.map(rp => rp.permission.atom));

    const userPerms = await this.prisma.userPermission.findMany({
      where: { userId },
      include: { permission: true },
    });

    for (const up of userPerms) {
      if (up.granted) perms.add(up.permission.atom);
      else perms.delete(up.permission.atom);
    }
    return Array.from(perms) as string[];
  }

  async toggleStatus(targetUserId: string, adminId: string, field: 'isActive' | 'isSuspended' | 'isBanned') {
    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) throw new NotFoundException('User not found');

    const newValue = !user[field];
    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { [field]: newValue },
    });

    await this.audit.log(adminId, `TOGGLE_${field.toUpperCase()}`, `User:${targetUserId}`, { newValue });
    return updated;
  }

  async getAllPermissions() {
    return this.prisma.permission.findMany();
  }

  async createUser(data: { email: string; password: string; fullName: string; role: string }, creatorId: string) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await argon2.hash(data.password);
    
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName,
        role: data.role,
        isActive: true,
      },
    });

    await this.audit.log(creatorId, 'CREATE_USER', `User:${user.id}`, { email: data.email, role: data.role });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
