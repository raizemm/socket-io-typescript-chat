import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as socketIo from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { config } from '../config';
import { Event } from '../model/event';
import { Message } from '../model/message';
import { User } from '../model/user';

const SERVER_URL = environment.socketUrl;

@Injectable()
export class SocketService {
	private socket: any;
	localStream: any;

	public initSocket(): void {
		this.socket = socketIo(SERVER_URL);
	}

	public send(message: Message): void {
		this.socket.emit('message', message);
	}

	public changeUsername(data: any): void {
		this.socket.emit('changeUsername', data);
	}

	public joinChannel(user: User): void {
		this.socket.emit('join', user);
	}

	public onJoinChannel(): Observable<any> {
		return new Observable<any>(observer => {
			this.socket.on('join', (user: User) => observer.next(user));
		})
	}

	public newPeer(user: User):  void {
		this.socket.emit('newPeer', user);
	}

	public onNewPeer(): Observable<any> {
		return new Observable<any>(observer => {
			this.socket.on('newPeer', (peer: any) => observer.next(peer));
		})
	}

	public emitRelayICECandidate(data: any): void {
		this.socket.emit('relayICECandidate', {
			peerId: data.peerId,
			iceCandidate: data.iceCandidate,
		})
	}

	public emitRelaySessionDescription(data: any): void {
		this.socket.emit('relaySessionDescription', {
			peerId: data.peerId,
			sessionDescription: data.sessionDescription,
		})
	}

	public onSessionDescription(): Observable<any> {
		return new Observable<any>(observer => {
			this.socket.on('sessionDescription', (config: any) => observer.next(config));
		})
	}

	public onIceCandidate(): Observable<any> {
		return new Observable<any>(observer => {
			this.socket.on('iceCandidate', (config: any) => observer.next(config));
		})
	}

	public onReconnect(): Observable<void> {
		return new Observable<void>(observer => {
			this.socket.on('reconnect', () => observer.next());
		})
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

	public setup(): Promise<boolean> {
		console.log("Requesting access to local audio / video inputs");
		let browserNavigator = <any>navigator;
		browserNavigator.getUserMedia = ( browserNavigator.getUserMedia ||
			browserNavigator.webkitGetUserMedia ||
			browserNavigator.mozGetUserMedia ||
			browserNavigator.msGetUserMedia);

		return new Promise((resolve, reject) => {
			browserNavigator.getUserMedia({
				audio: config.useAudio,
				video: config.useVideo,
			}, stream => {
				this.localStream = stream;
				resolve(true)
			}, () => {
				reject(false);
			});
		})
	}

	public getLocalStream(): Observable<MediaStream> {
		return Observable.of(this.localStream);
	}
}
