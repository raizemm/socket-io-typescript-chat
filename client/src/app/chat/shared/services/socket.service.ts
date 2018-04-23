import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as socketIo from 'socket.io-client';
import { Event } from '../model/event';
import { Message } from '../model/message';

const SERVER_URL = 'http://localhost:8080';

@Injectable()
export class SocketService {
	private socket;

	public initSocket(): void {
		this.socket = socketIo(SERVER_URL);
	}

	public send(message: Message): void {
		this.socket.emit('message', message, (data) => {
			console.log(data)
		});
	}

	public changeUsername(data: any): void {
		this.socket.emit('changeUsername', data);
	}

	public onMessage(): Observable<Message> {
		return new Observable<Message>(observer => {
			this.socket.on('message', (data: Message) => observer.next(data));
		});
	}

	public onEvent(event: Event): Observable<any> {
		return new Observable<Event>(observer => {
			this.socket.on(event, () => observer.next(event));
		});
	}

	public onUsernames(): Observable<string[]> {
		return new Observable<string[]>(observer => {
			this.socket.on('usernames', (usernames) => observer.next(usernames))
		})
	}
}
