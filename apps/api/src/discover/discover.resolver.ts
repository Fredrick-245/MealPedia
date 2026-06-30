import { Args, Query, Resolver } from '@nestjs/graphql';
import { Chef } from './chef.entity';
import { Category } from './category.entity';
import { Person } from './person.entity';
import { DiscoverService } from './discover.service';

@Resolver()
export class DiscoverResolver {
  constructor(private readonly discoverService: DiscoverService) {}

  @Query(() => [Chef])
  chefs(): Promise<Chef[]> {
    return this.discoverService.findChefs();
  }

  @Query(() => [Category], { name: 'recipeCategories' })
  recipeCategories(): Promise<Category[]> {
    return this.discoverService.findCategories();
  }

  @Query(() => [Person], { name: 'people' })
  people(
    @Args('query', { nullable: true }) query?: string,
  ): Promise<Person[]> {
    return this.discoverService.findPeople(query);
  }
}
