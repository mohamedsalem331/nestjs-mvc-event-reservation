import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { NOTIFICATION_EVENT } from '@app/common';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @UsePipes(new ValidationPipe())
  @EventPattern(NOTIFICATION_EVENT)
  async notifyEmail(@Payload() data: NotifyEmailDto, @Ctx() ctx: RmqContext) {
    return this.notificationsService.notifyEmail(data);
  }
}
