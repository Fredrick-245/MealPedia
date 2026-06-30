import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

const thumb = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=200&q=70`;
const avatar = (n: number) => `https://i.pravatar.cc/100?img=${n}`;

const SEED_NOTIFICATIONS: Partial<Notification>[] = [
  {
    kind: 'general',
    actorName: 'Jane Cooper',
    actorAvatarUrl: avatar(5),
    message: 'Jane Cooper has published a new recipe!',
    timeLabel: 'Today | 09:24 AM',
    thumbnailUrl: thumb('photo-1513104890138-7c749659a591'),
    sortOrder: 1,
  },
  {
    kind: 'general',
    actorName: 'Rachel',
    actorAvatarUrl: avatar(9),
    message: 'Rachel has commented on your recipe',
    timeLabel: 'Today | 10:45 AM',
    thumbnailUrl: thumb('photo-1568901346375-23c9450c58cd'),
    sortOrder: 2,
  },
  {
    kind: 'general',
    actorName: 'Brad Wigington',
    actorAvatarUrl: avatar(12),
    message: 'Brad Wigington liked your comment',
    timeLabel: 'Today | 09:21 AM',
    thumbnailUrl: thumb('photo-1484723091739-30a097e8f929'),
    sortOrder: 3,
  },
  {
    kind: 'general',
    actorName: 'Tyra Ballentine',
    actorAvatarUrl: avatar(16),
    message: 'Tyra Ballentine has published a new recipe!',
    timeLabel: '2 days ago | 10:25 AM',
    thumbnailUrl: thumb('photo-1540420773420-3366772f4999'),
    sortOrder: 4,
  },
  {
    kind: 'general',
    actorName: 'Marci Winkles',
    actorAvatarUrl: avatar(20),
    message: 'Marci Winkles has published a new recipe!',
    timeLabel: '3 days ago | 16:52 PM',
    thumbnailUrl: thumb('photo-1565299624946-b28f40a0ae38'),
    sortOrder: 5,
  },
  {
    kind: 'general',
    actorName: 'Aileen',
    actorAvatarUrl: avatar(25),
    message: 'Aileen has commented on your recipe',
    timeLabel: '4 days ago | 14:27 PM',
    thumbnailUrl: thumb('photo-1547592180-85f173990554'),
    sortOrder: 6,
  },
  {
    kind: 'general',
    actorName: 'George',
    actorAvatarUrl: avatar(13),
    message: 'George has commented on your recipe',
    timeLabel: '5 days ago | 09:20 AM',
    thumbnailUrl: thumb('photo-1569718212165-3a8278d5f624'),
    sortOrder: 7,
  },

  {
    kind: 'system',
    iconKey: 'security',
    tag: 'New',
    message:
      'Now Cookpedia has a Two-Factor Authentication. Try it now to make your account more secure.',
    timeLabel: 'Today | 14:13 PM',
    actorName: 'Security Updates!',
    sortOrder: 1,
  },
  {
    kind: 'system',
    iconKey: 'bookmark',
    tag: 'New',
    message:
      'Now you can add your favorite recipes to bookmark. You can access it through the home page → my bookmark.',
    timeLabel: 'Today | 14:10 PM',
    actorName: 'Bookmark Feature Available!',
    sortOrder: 2,
  },
  {
    kind: 'system',
    iconKey: 'update',
    message:
      'Update Cookpedia now to get access to the latest features for easier recipe discovery.',
    timeLabel: '2 days ago | 10:13 AM',
    actorName: 'New Updates Available!',
    sortOrder: 3,
  },
  {
    kind: 'system',
    iconKey: 'storage',
    message:
      'Your storage is almost full. Delete some items to make more space.',
    timeLabel: '5 days ago | 16:40 PM',
    actorName: 'Your Storage is Almost Full!',
    sortOrder: 4,
  },
  {
    kind: 'system',
    iconKey: 'account',
    message:
      'Your account creation is successful, you can now experience our services.',
    timeLabel: '12 Dec 2020 | 14:27 PM',
    actorName: 'Account Setup Successful!',
    sortOrder: 5,
  },
];

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  async onModuleInit() {
    const count = await this.notificationsRepository.count();
    if (count !== SEED_NOTIFICATIONS.length) {
      await this.notificationsRepository.clear();
      await this.notificationsRepository.save(SEED_NOTIFICATIONS);
    }
  }

  findAll(): Promise<Notification[]> {
    return this.notificationsRepository.find({ order: { sortOrder: 'ASC' } });
  }
}
