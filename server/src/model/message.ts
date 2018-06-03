import { Peer } from './peer';

export class Message {
    constructor(public from: Peer, public roomName: string, private content: string, public action: number) {}
}