import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { Comment } from './comment.entity';
import { CreateRecipeInput } from './dto/create-recipe.input';
import { UpdateRecipeInput } from './dto/update-recipe.input';
import { AddCommentInput } from './dto/add-comment.input';
import { CHEFS } from '../discover/chefs.data';
import { SEED_COMMENTS } from './comments.data';
import { MY_RECIPES_SEED } from './my-recipes.data';

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=70`;
const avatar = (n: number) => `https://i.pravatar.cc/100?img=${n}`;
const stepImg = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=200&q=60`;

const STEP_IMAGE_IDS = [
  'photo-1546069901-ba9599a7e63c',
  'photo-1512621776951-a57141f2eefd',
  'photo-1505253716362-afaea1d3d1af',
  'photo-1540420773420-3366772f4999',
  'photo-1564093497595-593b96d80180',
  'photo-1551248429-40975aa4de74',
];

const stepImages = (start: number) =>
  [0, 1, 2].map((i) => stepImg(STEP_IMAGE_IDS[(start + i) % STEP_IMAGE_IDS.length]));

const handleFromName = (name: string) =>
  '@' + name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

const DEFAULT_INGREDIENTS = [
  { text: '2 cups of fresh main ingredients', emoji: '\u{1F957}' },
  { text: '1 tbsp of olive oil', emoji: '\u{1FAD2}' },
  { text: '1 clove of garlic, minced', emoji: '\u{1F9C4}' },
  { text: 'Salt and pepper to taste', emoji: '\u{1F9C2}' },
  { text: '1 squeeze of fresh lemon', emoji: '\u{1F34B}' },
];

const DEFAULT_INSTRUCTIONS = [
  { text: 'Prepare and wash all of the fresh ingredients.', images: stepImages(0) },
  { text: 'Combine the ingredients together in a large bowl.', images: stepImages(2) },
  { text: 'Season to taste and mix everything together well.', images: stepImages(4) },
  { text: 'Plate, garnish and serve.', images: stepImages(1) },
];

const SALAD_INGREDIENTS = [
  { text: '1 head of lettuce, chopped', emoji: '\u{1F96C}' },
  { text: '1 large carrot, grated', emoji: '\u{1F955}' },
  { text: '1 large cucumber, sliced', emoji: '\u{1F952}' },
  { text: '1 large apple, chopped', emoji: '\u{1F34E}' },
  { text: '1 cup of cherry tomatoes, halved', emoji: '\u{1F345}' },
  { text: '1/2 cup of crumbled feta cheese', emoji: '\u{1F9C0}' },
  { text: '1/4 cup of balsamic vinaigrette', emoji: '\u{1FAD9}' },
];

const SALAD_INSTRUCTIONS = [
  {
    text: 'In a large salad bowl, combine the chopped lettuce, grated carrot, sliced cucumber, chopped apple, cherry tomatoes, and raisins.',
    images: stepImages(0),
  },
  { text: 'Sprinkle the feta cheese over the top of the salad.', images: stepImages(2) },
  {
    text: 'Drizzle the balsamic vinaigrette over the salad and toss to combine.',
    images: stepImages(4),
  },
  { text: 'Serve and enjoy!', images: stepImages(1) },
];

const CALORIE_POOL = [103, 120, 215, 320, 450, 180, 260];

const CHEF_RECIPE_TEMPLATES = [
  {
    title: 'Fresh Tuna Japanese Sushi Roll',
    image: 'photo-1553621042-f6e147245754',
    prep: 35,
    food: 'Sushi',
  },
  {
    title: 'Cheeseburger and Smoked Beef Recipe',
    image: 'photo-1568901346375-23c9450c58cd',
    prep: 30,
    food: 'Burger',
  },
  {
    title: 'Delicious Italian Pizza Recipes',
    image: 'photo-1513104890138-7c749659a591',
    prep: 45,
    food: 'Pizza',
  },
  {
    title: 'Beef Sweet and Sour Spices',
    image: 'photo-1558030006-450675393462',
    prep: 40,
    food: 'Beef',
  },
];

const CHEF_RECIPES: Partial<Recipe>[] = CHEFS.flatMap((chef) =>
  CHEF_RECIPE_TEMPLATES.map((t) => ({
    title: t.title,
    description: `A signature dish by ${chef.fullName}.`,
    prepTimeMinutes: t.prep,
    imageUrl: img(t.image),
    authorName: chef.fullName as string,
    authorAvatarUrl: chef.avatarUrl as string,
    category: 'chef' as const,
    foodCategory: t.food,
    bookmarked: false,
  })),
);

const SEED_RECIPES: Partial<Recipe>[] = [
  {
    title: 'Original Italian Pizza Recipe for Beginners',
    description:
      'A classic Neapolitan-style pizza with San Marzano tomatoes, fresh mozzarella, and basil.',
    prepTimeMinutes: 45,
    imageUrl: img('photo-1513104890138-7c749659a591'),
    authorName: 'Jane Cooper',
    authorAvatarUrl: avatar(5),
    category: 'recent',
    bookmarked: false,
  },
  {
    title: 'Special Blueberry & Banana Sandwich',
    description:
      'French toast style sandwich stuffed with banana, blueberries, and a hint of cinnamon.',
    prepTimeMinutes: 20,
    imageUrl: img('photo-1484723091739-30a097e8f929'),
    authorName: 'Rayford Chenail',
    authorAvatarUrl: avatar(12),
    category: 'recent',
    bookmarked: false,
  },
  {
    title: 'Vegetable & Fruit Vegetarian Recipe',
    description:
      'A fresh, colorful bowl packed with seasonal vegetables, fruit, and a citrus dressing.',
    prepTimeMinutes: 25,
    imageUrl: img('photo-1512621776951-a57141f2eefd'),
    authorName: 'Tanner Stafford',
    authorAvatarUrl: avatar(15),
    category: 'yours',
    bookmarked: false,
  },
  {
    title: 'Delicious & Easy Mexican Taco Recipe',
    description:
      'Soft tacos loaded with seasoned protein, fresh salsa, and a squeeze of lime.',
    prepTimeMinutes: 30,
    imageUrl: img('photo-1565299624946-b28f40a0ae38'),
    authorName: 'Lauralee Quintero',
    authorAvatarUrl: avatar(32),
    category: 'yours',
    bookmarked: false,
  },
  {
    title: 'Meat, Noodle and Seafood Recipes',
    description:
      'A hearty noodle bowl with tender meat, fresh seafood, and a savory broth.',
    prepTimeMinutes: 40,
    imageUrl: img('photo-1569718212165-3a8278d5f624'),
    authorName: 'Clinton Mcclure',
    authorAvatarUrl: avatar(60),
    category: 'bookmark',
    bookmarked: true,
  },
  {
    title: 'Scrambled Eggs & French Bread Toast',
    description:
      'Creamy scrambled eggs served with crisp, buttery French bread toast.',
    prepTimeMinutes: 15,
    imageUrl: img('photo-1525351484163-7529414344d8'),
    authorName: 'Charolette Hanlin',
    authorAvatarUrl: avatar(45),
    category: 'bookmark',
    bookmarked: true,
  },

  // --- Discover: Most Popular ---
  {
    title: 'Vegetable & Fruit Salad with Balsamic',
    description: 'A refreshing salad of crisp vegetables and sweet seasonal fruit.',
    prepTimeMinutes: 15,
    imageUrl: img('photo-1540420773420-3366772f4999'),
    authorName: 'Jane Cooper',
    authorAvatarUrl: avatar(5),
    category: 'popular',
    foodCategory: 'Salad',
    bookmarked: true,
  },
  {
    title: 'Italian Burger with Cheese & Vegetables',
    description: 'A juicy Italian-style burger stacked with melted cheese and veggies.',
    prepTimeMinutes: 35,
    imageUrl: img('photo-1568901346375-23c9450c58cd'),
    authorName: 'Florencia Dorrance',
    authorAvatarUrl: avatar(8),
    category: 'popular',
    foodCategory: 'Burger',
    bookmarked: true,
  },
  {
    title: 'Mixed Noodles with Vegetables Recipe',
    description: 'Stir-fried noodles tossed with crunchy vegetables and a savory sauce.',
    prepTimeMinutes: 30,
    imageUrl: img('photo-1569718212165-3a8278d5f624'),
    authorName: 'Augustina Midgett',
    authorAvatarUrl: avatar(36),
    category: 'popular',
    foodCategory: 'Noodles',
    bookmarked: true,
  },
  {
    title: 'Simple Beef with Original Flavor',
    description: 'Tender seared beef seasoned simply to let the natural flavor shine.',
    prepTimeMinutes: 40,
    imageUrl: img('photo-1558030006-450675393462'),
    authorName: 'Maria York',
    authorAvatarUrl: avatar(41),
    category: 'popular',
    foodCategory: 'Beef',
    bookmarked: true,
  },
  {
    title: "Making a Child's Birthday Cake",
    description: 'A fun, colorful birthday cake that kids will love to celebrate with.',
    prepTimeMinutes: 90,
    imageUrl: img('photo-1558636508-e0db3814bd1d'),
    authorName: 'Sanjuanita Ordonez',
    authorAvatarUrl: avatar(31),
    category: 'popular',
    foodCategory: 'Cake',
    bookmarked: true,
  },
  {
    title: 'Spiced Meat and Vegetable Soup',
    description: 'A warming, lightly spiced soup loaded with meat and vegetables.',
    prepTimeMinutes: 55,
    imageUrl: img('photo-1604152135912-04a022e23696'),
    authorName: 'Barry Sparrow',
    authorAvatarUrl: avatar(53),
    category: 'popular',
    foodCategory: 'Soup',
    bookmarked: true,
  },

  // --- Discover: Our Recommendations ---
  {
    title: 'Sweet Sour Seasoned Grilled Chicken',
    description: 'Grilled chicken glazed in a tangy sweet-and-sour seasoning.',
    prepTimeMinutes: 40,
    imageUrl: img('photo-1532550907401-a500c9a57435'),
    authorName: 'Trevor Linthird',
    authorAvatarUrl: avatar(11),
    category: 'recommendations',
    bookmarked: false,
  },
  {
    title: 'Sweet Soy Sauce Chicken Soup',
    description: 'A comforting chicken soup simmered in a sweet soy broth.',
    prepTimeMinutes: 50,
    imageUrl: img('photo-1547592180-85f173990554'),
    authorName: 'Cyndy Lillibridge',
    authorAvatarUrl: avatar(20),
    category: 'recommendations',
    bookmarked: false,
  },

  // --- Discover: Most Searches ---
  {
    title: 'Sweet Cake Menu for School Children',
    description: 'Fun, lightly sweet cakes that are perfect for kids lunchboxes.',
    prepTimeMinutes: 60,
    imageUrl: img('photo-1578985545062-69928b1d9587'),
    authorName: 'Tisol Mongng',
    authorAvatarUrl: avatar(25),
    category: 'searches',
    bookmarked: false,
  },
  {
    title: 'Easy Home Japanese Recipes',
    description: 'Simple, authentic Japanese dishes you can make in your own kitchen.',
    prepTimeMinutes: 45,
    imageUrl: img('photo-1579871494447-9811cf80d66c'),
    authorName: 'Annabel Rohan',
    authorAvatarUrl: avatar(30),
    category: 'searches',
    bookmarked: false,
  },

  // --- Discover: New Recipes ---
  {
    title: 'Pan-Seared Salmon with Herbs',
    description: 'Tender salmon fillet seared and finished with fresh herbs.',
    prepTimeMinutes: 25,
    imageUrl: img('photo-1467003909585-2f8a72700288'),
    authorName: 'Marvin McKinney',
    authorAvatarUrl: avatar(52),
    category: 'new',
    bookmarked: false,
  },
  {
    title: 'Fresh Buddha Bowl Power Plate',
    description: 'A nourishing bowl of grains, greens, and roasted vegetables.',
    prepTimeMinutes: 30,
    imageUrl: img('photo-1490645935967-10de6ba17061'),
    authorName: 'Kristin Watson',
    authorAvatarUrl: avatar(48),
    category: 'new',
    bookmarked: false,
  },

  // --- My Bookmark grid (bookmarked) ---
  {
    title: 'Vegetable & Fruit Salad with Balsamic',
    description: 'Crisp greens and fruit tossed in a sweet balsamic glaze.',
    prepTimeMinutes: 15,
    imageUrl: img('photo-1512621776951-a57141f2eefd'),
    authorName: 'Jane Cooper',
    authorAvatarUrl: avatar(5),
    category: 'saved',
    bookmarked: true,
  },
  {
    title: 'Original Mixed Fruit & Vegetable Salad',
    description: 'A vibrant mix of fresh fruit and vegetables with citrus dressing.',
    prepTimeMinutes: 20,
    imageUrl: img('photo-1564093497595-593b96d80180'),
    authorName: 'Francene Vandyne',
    authorAvatarUrl: avatar(9),
    category: 'saved',
    bookmarked: true,
  },
  {
    title: 'Nastar Recipe and Grated Sugar Cane',
    description: 'Buttery pineapple tart cookies finished with grated sugar.',
    prepTimeMinutes: 60,
    imageUrl: img('photo-1499636136210-6f4ee915583e'),
    authorName: 'Lavern Laboy',
    authorAvatarUrl: avatar(14),
    category: 'saved',
    bookmarked: true,
  },
  {
    title: 'Beef Broth Soup with Ginger & Basil',
    description: 'A warming beef broth infused with fresh ginger and basil.',
    prepTimeMinutes: 55,
    imageUrl: img('photo-1604152135912-04a022e23696'),
    authorName: 'Sanjuanita Ordonez',
    authorAvatarUrl: avatar(31),
    category: 'saved',
    bookmarked: true,
  },
  {
    title: 'Vegetable, Potato and Meat Salad',
    description: 'A hearty salad of roasted potato, tender meat, and crunchy veg.',
    prepTimeMinutes: 35,
    imageUrl: img('photo-1551248429-40975aa4de74'),
    authorName: 'Geoffrey Mott',
    authorAvatarUrl: avatar(50),
    category: 'saved',
    bookmarked: true,
  },
  {
    title: 'Curcuma Ginger Beef Soup Recipe',
    description: 'A golden turmeric and ginger beef soup, rich and aromatic.',
    prepTimeMinutes: 50,
    imageUrl: img('photo-1569058242253-92a9c755a0ec'),
    authorName: 'Tanner Stafford',
    authorAvatarUrl: avatar(15),
    category: 'saved',
    bookmarked: true,
  },

  // --- Category detail: Salad ---
  {
    title: 'Vegetable and Fruit Green Salad',
    description: 'A crisp green salad brightened with fresh fruit and herbs.',
    prepTimeMinutes: 15,
    imageUrl: img('photo-1505253716362-afaea1d3d1af'),
    authorName: 'Wilard Purnel',
    authorAvatarUrl: avatar(18),
    category: 'saved',
    foodCategory: 'Salad',
    bookmarked: false,
  },
  {
    title: 'Fresh Seasoned Vegetable Salad',
    description: 'Garden vegetables tossed with a light, perfectly seasoned dressing.',
    prepTimeMinutes: 18,
    imageUrl: img('photo-1512621776951-a57141f2eefd'),
    authorName: 'Phyllis Godley',
    authorAvatarUrl: avatar(27),
    category: 'saved',
    foodCategory: 'Salad',
    bookmarked: false,
  },
  {
    title: 'Vegetable Lettuce Salad with Simple Dressing',
    description: 'Tender lettuce and vegetables finished with a simple house dressing.',
    prepTimeMinutes: 12,
    imageUrl: img('photo-1546069901-ba9599a7e63c'),
    authorName: 'Clinton Mcclure',
    authorAvatarUrl: avatar(60),
    category: 'saved',
    foodCategory: 'Salad',
    bookmarked: false,
  },

  ...CHEF_RECIPES,
];

function applyDetails(recipe: Partial<Recipe>, index: number): Partial<Recipe> {
  const isSalad = /salad/i.test(recipe.title ?? '');
  return {
    ...recipe,
    authorHandle: handleFromName(recipe.authorName ?? ''),
    cookTime: `${recipe.prepTimeMinutes ?? 30} mins`,
    origin: 'United States of America',
    galleryUrls: [recipe.imageUrl as string],
    isOwn: false,
    isSeed: true,
    published: true,
    servings: 1,
    calories: CALORIE_POOL[index % CALORIE_POOL.length],
    commentCount: 125,
    ingredients: isSalad ? SALAD_INGREDIENTS : DEFAULT_INGREDIENTS,
    instructions: isSalad ? SALAD_INSTRUCTIONS : DEFAULT_INSTRUCTIONS,
  };
}

const SEED_RECIPES_DETAILED = SEED_RECIPES.map(applyDetails);

const MY_RECIPES_DETAILED: Partial<Recipe>[] = MY_RECIPES_SEED.map((recipe) => ({
  ...recipe,
  ingredients: DEFAULT_INGREDIENTS,
  instructions: DEFAULT_INSTRUCTIONS,
}));

const ALL_SEED_RECIPES = [...SEED_RECIPES_DETAILED, ...MY_RECIPES_DETAILED];

@Injectable()
export class RecipesService implements OnModuleInit {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
  ) {}

  async onModuleInit() {
    const existing = await this.recipesRepository.find();
    const seeded = existing.filter((recipe) => recipe.isSeed);
    const needsSeed =
      seeded.length !== ALL_SEED_RECIPES.length ||
      seeded.some(
        (recipe) =>
          !recipe.imageUrl ||
          !recipe.ingredients ||
          recipe.ingredients.length === 0 ||
          !recipe.cookTime ||
          !recipe.galleryUrls ||
          recipe.galleryUrls.length === 0,
      );
    if (needsSeed) {
      await this.recipesRepository.delete({ isSeed: true });
      await this.recipesRepository.save(ALL_SEED_RECIPES);
    }

    if ((await this.commentsRepository.count()) !== SEED_COMMENTS.length) {
      await this.commentsRepository.clear();
      await this.commentsRepository.save(SEED_COMMENTS);
    }
  }

  findComments(recipeId?: string): Promise<Comment[]> {
    const where = recipeId
      ? [{ recipeId: IsNull() }, { recipeId }]
      : [{ recipeId: IsNull() }];
    return this.commentsRepository.find({
      where,
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  addComment(input: AddCommentInput): Promise<Comment> {
    const comment = this.commentsRepository.create({
      recipeId: input.recipeId ?? null,
      authorName: 'You',
      authorAvatarUrl: avatar(68),
      text: input.text.trim(),
      likes: 0,
      timeLabel: 'Just now',
      sortOrder: 0,
    });
    return this.commentsRepository.save(comment);
  }

  findAll(): Promise<Recipe[]> {
    return this.recipesRepository.find({ order: { createdAt: 'DESC' } });
  }

  findBookmarked(): Promise<Recipe[]> {
    return this.recipesRepository.find({
      where: { bookmarked: true },
      order: { createdAt: 'DESC' },
    });
  }

  findMine(): Promise<Recipe[]> {
    return this.recipesRepository.find({
      where: { isOwn: true },
      order: { createdAt: 'DESC' },
    });
  }

  findByCategory(category: string): Promise<Recipe[]> {
    return this.recipesRepository.find({
      where: { foodCategory: category },
      order: { createdAt: 'DESC' },
    });
  }

  findByAuthor(name: string): Promise<Recipe[]> {
    return this.recipesRepository.find({
      where: { authorName: name },
      order: { createdAt: 'DESC' },
    });
  }

  search(query: string): Promise<Recipe[]> {
    const term = query.trim();
    if (!term) return Promise.resolve([]);
    return this.recipesRepository.find({
      where: { title: ILike(`%${term}%`) },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Recipe> {
    const recipe = await this.recipesRepository.findOne({ where: { id } });
    if (!recipe) {
      throw new NotFoundException(`Recipe with id "${id}" not found`);
    }
    return recipe;
  }

  create(input: CreateRecipeInput): Promise<Recipe> {
    const gallery =
      input.galleryUrls && input.galleryUrls.length
        ? input.galleryUrls.slice(0, 6)
        : input.imageUrl
          ? [input.imageUrl]
          : [];
    const recipe = this.recipesRepository.create({
      ...input,
      imageUrl: input.imageUrl || gallery[0] || '',
      galleryUrls: gallery,
      ingredients: input.ingredients?.length ? input.ingredients : DEFAULT_INGREDIENTS,
      instructions: input.instructions?.length
        ? input.instructions
        : DEFAULT_INSTRUCTIONS,
      authorName: 'You',
      authorHandle: '@you',
      authorAvatarUrl: 'https://i.pravatar.cc/100?img=68',
      category: 'yours',
      commentCount: 0,
      isOwn: true,
      isSeed: false,
      published: input.published ?? false,
    });
    return this.recipesRepository.save(recipe);
  }

  async update(input: UpdateRecipeInput): Promise<Recipe> {
    const { id, ...rest } = input;
    const recipe = await this.findOne(id);
    const patch: Partial<Recipe> = { ...rest };
    if (rest.galleryUrls) {
      const gallery = rest.galleryUrls.slice(0, 6);
      patch.galleryUrls = gallery;
      patch.imageUrl = rest.imageUrl || gallery[0] || recipe.imageUrl;
    }
    Object.assign(recipe, patch);
    return this.recipesRepository.save(recipe);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.recipesRepository.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
