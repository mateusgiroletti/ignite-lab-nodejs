import { Body, Controller, Get, Post, Patch } from '@nestjs/common';
import { SendNotification } from '@application/use-cases/send-notification';
import { CreateNotificationBody } from '../dtos/create-notification-body';
import { NotificationViewModel } from '../view-models/notification-view-model';
import { Param } from '@nestjs/common/decorators';
import { CancelNotification } from '@application/use-cases/cancel-notification';
import { CountRecipientNotification } from '@application/use-cases/count-recipient-notifications';
import { GetRecipientNotification } from '@application/use-cases/get-recipient-notifications';
import { ReadNotification } from '@application/use-cases/read-notification';
import { UnreadNotification } from '@application/use-cases/unread-notification';

@Controller('notifications')
export class NotificationsController {
    constructor(
        private sendNotification: SendNotification,
        private cancelNotification: CancelNotification,
        private countRecipientNotification: CountRecipientNotification,
        private getRecipientNotification: GetRecipientNotification,
        private readNotification: ReadNotification,
        private unreadNotification: UnreadNotification
    ) { }

    @Patch(':id/cancel')
    async cancel(@Param('id') id: string) {
        await this.cancelNotification.execute({
            notificationId: id
        });
    }

    @Get('count/from/:recipientId')
    async countFromRecipient(@Param('recipientId') recipientId: string) {
        const { count } = await this.countRecipientNotification.execute({
            recipientId
        });

        return {
            count
        }
    }

    @Get('from/:recipientId')
    async getFromRecipient(@Param('recipientId') recipientId: string) {
        const { notifications } = await this.getRecipientNotification.execute({
            recipientId
        });

        return {
            notifications: notifications.map(NotificationViewModel.toHTTP)
        }
    }

    @Patch(':id/read')
    async read(@Param('id') id: string) {
        await this.readNotification.execute({
            notificationId: id
        });
    }

    @Patch(':id/unread')
    async unread(@Param('id') id: string) {
        await this.unreadNotification.execute({
            notificationId: id
        });
    }

    @Post()
    async create(@Body() body: CreateNotificationBody) {
        const { recipientId, content, category } = body;

        const { notification } = await this.sendNotification.execute({
            recipientId,
            content,
            category,
        });

        return {
            notification: NotificationViewModel.toHTTP(notification)
        };

    }
}
