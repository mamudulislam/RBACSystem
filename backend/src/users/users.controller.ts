import { Controller, Get, Post, Body, Param, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../auth/guards/permissions.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @RequirePermissions('manage:users')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('permissions')
  @RequirePermissions('manage:users')
  getAllPermissions() {
    return this.usersService.getAllPermissions();
  }

  @Get(':id')
  @RequirePermissions('manage:users')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post(':id/permissions')
  @RequirePermissions('manage:users')
  async updatePermissions(@Param('id') id: string, @Body('atoms') atoms: string[], @Req() req) {
    return this.usersService.updateUserPermissions(id, req.user.id, atoms);
  }

  @Post(':id/status')
  @RequirePermissions('manage:users')
  async toggleStatus(@Param('id') id: string, @Body('field') field: 'isActive' | 'isSuspended' | 'isBanned', @Req() req) {
    return this.usersService.toggleStatus(id, req.user.id, field);
  }

  @Post()
  @RequirePermissions('manage:users')
  async createUser(@Body() body: { email: string; password: string; fullName: string; role: string }, @Req() req) {
    return this.usersService.createUser(body, req.user.id);
  }
}
