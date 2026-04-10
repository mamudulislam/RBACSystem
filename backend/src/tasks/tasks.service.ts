import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: string) {
    return this.prisma.task.findMany({
      where: userId ? { userId } : undefined,
      include: { user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { user: { select: { id: true, fullName: true, email: true } } },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(data: { title: string; description?: string; status?: string; priority?: string; userId?: string }) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || 'TODO',
        priority: data.priority || 'MEDIUM',
        userId: data.userId,
      },
      include: { user: { select: { id: true, fullName: true, email: true } } },
    });
  }

  async update(id: string, data: { title?: string; description?: string; status?: string; priority?: string; userId?: string }) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        userId: data.userId,
      },
      include: { user: { select: { id: true, fullName: true, email: true } } },
    });
  }

  async delete(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    
    return this.prisma.task.delete({ where: { id } });
  }
}
