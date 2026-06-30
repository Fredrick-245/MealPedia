import { Query, Resolver } from '@nestjs/graphql';
import { Notification } from './notification.entity';
import { NotificationsService } from './notifications.service';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Query(() => [Notification], { name: 'notifications' })
  notifications() {
    return this.notificationsService.findAll();
  }
}
