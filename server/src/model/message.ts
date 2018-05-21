import {User} from './peer';

export class Message {
    constructor(public from: User, public roomName: string, private content: string, public action: number) {}
}