import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chef } from './chef.entity';
import { Category } from './category.entity';
import { Person } from './person.entity';
import { DiscoverService } from './discover.service';
import { DiscoverResolver } from './discover.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Chef, Category, Person])],
  providers: [DiscoverService, DiscoverResolver],
})
export class DiscoverModule {}
