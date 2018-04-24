import { Message, User } from './';

export class ChatMessage extends Message{
    constructor(from: User, roomName: string, content: string, action: number) {
        super(from, roomName, content, action);
    }
}