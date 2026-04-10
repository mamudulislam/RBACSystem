import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;

    const userPermissions = await this.getEffectivePermissions(user.id, user.role);
    return requiredPermissions.every((permission) => userPermissions.includes(permission));
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
}
