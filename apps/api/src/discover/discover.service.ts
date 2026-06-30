import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Chef } from './chef.entity';
import { Category } from './category.entity';
import { Person } from './person.entity';
import { CHEFS } from './chefs.data';
import { PEOPLE } from './people.data';

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=70`;

const SEED_CATEGORIES: Partial<Category>[] = [
  { name: 'Salad', recipeCount: 16279, imageUrl: img('photo-1546069901-ba9599a7e63c') },
  { name: 'Burger', recipeCount: 15142, imageUrl: img('photo-1568901346375-23c9450c58cd') },
  { name: 'Pizza', recipeCount: 14385, imageUrl: img('photo-1513104890138-7c749659a591') },
  { name: 'Noodles', recipeCount: 15292, imageUrl: img('photo-1569718212165-3a8278d5f624') },
  { name: 'Beef', recipeCount: 12891, imageUrl: img('photo-1558030006-450675393462') },
  { name: 'Chicken', recipeCount: 10227, imageUrl: img('photo-1532550907401-a500c9a57435') },
  { name: 'Sushi', recipeCount: 13663, imageUrl: img('photo-1553621042-f6e147245754') },
  { name: 'Rice', recipeCount: 16841, imageUrl: img('photo-1516684732162-798a0062be99') },
  { name: 'Seafood', recipeCount: 11580, imageUrl: img('photo-1467003909585-2f8a72700288') },
  { name: 'Cake', recipeCount: 17688, imageUrl: img('photo-1578985545062-69928b1d9587') },
  { name: 'Soup', recipeCount: 11394, imageUrl: img('photo-1547592180-85f173990554') },
  { name: 'Bread', recipeCount: 15992, imageUrl: img('photo-1509440159596-0249088772ff') },
];

@Injectable()
export class DiscoverService implements OnModuleInit {
  constructor(
    @InjectRepository(Chef)
    private readonly chefsRepository: Repository<Chef>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Person)
    private readonly peopleRepository: Repository<Person>,
  ) {}

  async onModuleInit() {
    const chefs = await this.chefsRepository.find();
    if (chefs.length !== CHEFS.length || chefs.some((c) => !c.fullName)) {
      await this.chefsRepository.clear();
      await this.chefsRepository.save(CHEFS);
    }
    if ((await this.categoriesRepository.count()) !== SEED_CATEGORIES.length) {
      await this.categoriesRepository.clear();
      await this.categoriesRepository.save(SEED_CATEGORIES);
    }
    if ((await this.peopleRepository.count()) !== PEOPLE.length) {
      await this.peopleRepository.clear();
      await this.peopleRepository.save(PEOPLE);
    }
  }

  findChefs(): Promise<Chef[]> {
    return this.chefsRepository.find({ order: { sortOrder: 'ASC' } });
  }

  findCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({ order: { recipeCount: 'DESC' } });
  }

  findPeople(query?: string): Promise<Person[]> {
    if (query && query.trim()) {
      return this.peopleRepository.find({
        where: { name: ILike(`%${query.trim()}%`) },
        order: { name: 'ASC' },
      });
    }
    return this.peopleRepository.find({ order: { name: 'ASC' } });
  }
}
