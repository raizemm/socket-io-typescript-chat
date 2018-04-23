import { Message, User } from './';

export class ChatMessage extends Message{
    constructor(from: User, roomName: string, content: string) {
        super(from, roomName, content);
    }
}