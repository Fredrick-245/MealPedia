import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Recipe } from './recipe.entity';
import { RecipesService } from './recipes.service';
import { CreateRecipeInput } from './dto/create-recipe.input';

@Resolver(() => Recipe)
export class RecipesResolver {
  constructor(private readonly recipesService: RecipesService) {}

  @Query(() => [Recipe], { name: 'recipes' })
  recipes() {
    return this.recipesService.findAll();
  }

  @Query(() => Recipe, { name: 'recipe' })
  recipe(@Args('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Mutation(() => Recipe)
  createRecipe(@Args('input') input: CreateRecipeInput) {
    return this.recipesService.create(input);
  }
}
