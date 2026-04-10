import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(userId: string, action: string, resource: string, payload?: any) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        payload: payload ? JSON.stringify(payload) : null,
      },
    });
  }

  async findAll() {
    return this.prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
      take: 100,
    });
  }
}
