import { Message } from './message';
import { Peer } from './peer';

export class ChatMessage extends Message{
    constructor(from: Peer, roomName: string, content: string, action: number) {
        super(from, roomName, content, action);
    }
}