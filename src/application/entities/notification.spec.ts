import { Content } from "./content";
import { Notification } from "./notification";

describe('Notification', () => {
    it('it should be able to create a notification content', () => {
        const notification = new Notification({
            content: new Content('Nova solicitação de amizada'),
            category: 'social',
            recipientId: 'example-recipient-id',
            createdAt: new Date()
        });

        expect(notification).toBeTruthy();
    });

});