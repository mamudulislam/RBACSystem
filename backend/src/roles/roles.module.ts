import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RolesController],
})
export class RolesModule {}
