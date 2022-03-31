import { Module } from '@nestjs/common';
import { PullService } from './pull.service';
import { PullController } from './pull.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pull } from './entities/pull.entity';
import { DefaultAdminModule, DefaultAdminSite } from 'nestjs-admin';

@Module({
  imports: [TypeOrmModule.forFeature([Pull]), DefaultAdminModule],
  controllers: [PullController],
  providers: [PullService],
  exports: [TypeOrmModule, PullService],
})
export class PullModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('Pull', Pull);
  }
}
