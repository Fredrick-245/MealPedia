import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Recipe } from './recipe.entity';
import { Comment } from './comment.entity';
import { RecipesService } from './recipes.service';
import { CreateRecipeInput } from './dto/create-recipe.input';
import { UpdateRecipeInput } from './dto/update-recipe.input';
import { AddCommentInput } from './dto/add-comment.input';

@Resolver(() => Recipe)
export class RecipesResolver {
  constructor(private readonly recipesService: RecipesService) {}

  @Query(() => [Recipe], { name: 'recipes' })
  recipes() {
    return this.recipesService.findAll();
  }

  @Query(() => [Recipe], { name: 'bookmarkedRecipes' })
  bookmarkedRecipes() {
    return this.recipesService.findBookmarked();
  }

  @Query(() => [Recipe], { name: 'myRecipes' })
  myRecipes() {
    return this.recipesService.findMine();
  }

  @Query(() => [Recipe], { name: 'recipesByCategory' })
  recipesByCategory(@Args('category') category: string) {
    return this.recipesService.findByCategory(category);
  }

  @Query(() => [Recipe], { name: 'recipesByAuthor' })
  recipesByAuthor(@Args('author') author: string) {
    return this.recipesService.findByAuthor(author);
  }

  @Query(() => [Recipe], { name: 'searchRecipes' })
  searchRecipes(@Args('query') query: string) {
    return this.recipesService.search(query);
  }

  @Query(() => Recipe, { name: 'recipe' })
  recipe(@Args('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Query(() => [Comment], { name: 'recipeComments' })
  recipeComments(@Args('recipeId', { nullable: true }) recipeId?: string) {
    return this.recipesService.findComments(recipeId);
  }

  @Mutation(() => Recipe)
  createRecipe(@Args('input') input: CreateRecipeInput) {
    return this.recipesService.create(input);
  }

  @Mutation(() => Recipe)
  updateRecipe(@Args('input') input: UpdateRecipeInput) {
    return this.recipesService.update(input);
  }

  @Mutation(() => Boolean)
  deleteRecipe(@Args('id') id: string) {
    return this.recipesService.remove(id);
  }

  @Mutation(() => Comment)
  addComment(@Args('input') input: AddCommentInput) {
    return this.recipesService.addComment(input);
  }
}
