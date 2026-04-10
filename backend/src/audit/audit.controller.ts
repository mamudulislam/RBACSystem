import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard, RequirePermissions } from '../auth/guards/permissions.guard';

@Controller('audit')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export default class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  @RequirePermissions('view:audit')
  async findAll() {
    return this.auditService.findAll();
  }
}
