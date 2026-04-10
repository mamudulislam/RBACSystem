import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../auth/guards/permissions.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @RequirePermissions('view:tasks')
  findAll(@Req() req) {
    return this.tasksService.findAll(req.user.id);
  }

  @Get(':id')
  @RequirePermissions('view:tasks')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @RequirePermissions('view:tasks')
  create(@Body() body: { title: string; description?: string; status?: string; priority?: string; userId?: string }, @Req() req) {
    return this.tasksService.create({ ...body, userId: req.user.id });
  }

  @Put(':id')
  @RequirePermissions('view:tasks')
  update(@Param('id') id: string, @Body() body: { title?: string; description?: string; status?: string; priority?: string }) {
    return this.tasksService.update(id, body);
  }

  @Delete(':id')
  @RequirePermissions('view:tasks')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
