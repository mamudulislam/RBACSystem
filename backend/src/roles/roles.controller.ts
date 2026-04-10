import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard, RequirePermissions } from '../auth/guards/permissions.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @RequirePermissions('manage:roles')
  async findAll() {
    return this.prisma.rolePermission.findMany({
      include: { permission: true },
    });
  }
}
