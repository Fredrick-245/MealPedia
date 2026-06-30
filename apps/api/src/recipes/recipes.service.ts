import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { CreateRecipeInput } from './dto/create-recipe.input';

@Injectable()
export class RecipesService implements OnModuleInit {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
  ) {}

  async onModuleInit() {
    const count = await this.recipesRepository.count();
    if (count === 0) {
      await this.recipesRepository.save([
        {
          title: 'Classic Margherita Pizza',
          description:
            'A simple Neapolitan pizza with tomato, mozzarella, and fresh basil.',
          prepTimeMinutes: 45,
        },
        {
          title: 'Avocado Toast',
          description:
            'Crispy sourdough topped with smashed avocado, lemon, and chili flakes.',
          prepTimeMinutes: 10,
        },
      ]);
    }
  }

  findAll(): Promise<Recipe[]> {
    return this.recipesRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Recipe> {
    const recipe = await this.recipesRepository.findOne({ where: { id } });
    if (!recipe) {
      throw new NotFoundException(`Recipe with id "${id}" not found`);
    }
    return recipe;
  }

  create(input: CreateRecipeInput): Promise<Recipe> {
    const recipe = this.recipesRepository.create(input);
    return this.recipesRepository.save(recipe);
  }
}
