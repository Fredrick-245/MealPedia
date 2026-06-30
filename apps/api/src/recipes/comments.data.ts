import { Comment } from './comment.entity';

const avatar = (n: number) => `https://i.pravatar.cc/100?img=${n}`;

export const SEED_COMMENTS: Partial<Comment>[] = [
  {
    recipeId: null,
    authorName: 'Lauralee Quintero',
    authorAvatarUrl: avatar(32),
    text: 'Loving this recipe! So many delicious recipes to choose from \u{1F60D}',
    likes: 158,
    timeLabel: '1 month ago',
    sortOrder: 1,
  },
  {
    recipeId: null,
    authorName: 'Benny Spanbauer',
    authorAvatarUrl: avatar(12),
    text: 'Makes salad planning a breeze. I can easily find recipes based on ingredients I have on hand \u{1F44F}',
    likes: 230,
    timeLabel: '1 month ago',
    sortOrder: 2,
  },
  {
    recipeId: null,
    authorName: 'Janetta Rotolo',
    authorAvatarUrl: avatar(9),
    text: 'Step-by-step instructions and photos make it easy to follow along and cook amazing salad \u{1F64C}\u{1F525}',
    likes: 96,
    timeLabel: '2 weeks ago',
    sortOrder: 3,
  },
  {
    recipeId: null,
    authorName: 'Tanner Stafford',
    authorAvatarUrl: avatar(15),
    text: 'Tried it last night and the balsamic dressing was perfect. Will definitely make again!',
    likes: 64,
    timeLabel: '2 weeks ago',
    sortOrder: 4,
  },
  {
    recipeId: null,
    authorName: 'Kylee Danford',
    authorAvatarUrl: avatar(5),
    text: 'Such a fresh and healthy meal. My whole family enjoyed it \u{1F957}',
    likes: 41,
    timeLabel: '1 week ago',
    sortOrder: 5,
  },
  {
    recipeId: null,
    authorName: 'Chantal Shelburne',
    authorAvatarUrl: avatar(20),
    text: 'Adding this to my weekly rotation. Quick, simple and tasty.',
    likes: 27,
    timeLabel: '3 days ago',
    sortOrder: 6,
  },
];
