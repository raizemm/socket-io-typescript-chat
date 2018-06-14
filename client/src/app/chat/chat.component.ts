import { animate, style, transition, trigger } from '@angular/animations';
import {
	AfterViewInit,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	QueryList,
	Renderer2,
	ViewChild,
	ViewChildren
} from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { DialogNewUserComponent, DialogParams } from '../shared/dialog/new-user/dialog-new-user.component';
import { DialogUserType } from '../shared/dialog/new-user/dialog-user-type';
import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Message } from './shared/model/message';
import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';

export const ICE_SERVERS = [
	{urls:"stun:stun.l.google.com:19302"}
];

@Component({
	selector: 'tcc-chat',
	templateUrl: './chat.component.html',
	animations: [
		trigger('slideInOut', [
			transition(':enter', [
				style({margin: '0 0 0 -1500px'}),
				animate('700ms ease-in', style({margin: '0 0 0 0px'}))
			]),
			transition(':leave', [
				animate('700ms ease-in', style({margin: '0 0 0 -1500px'}))
			])
		]),
		trigger('appear', [
			transition(':enter', [
				style({margin: '0 0 0 -1000px'}),
				animate('0.5s', style({margin: 0}))
			])
		])
	]
})

export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
	action = Action;
	user: User;
	channel: string;
	usernames: string[];
	messages: Message[] = [];
	peers: { [peerId: string]: RTCPeerConnection} = {};
	messageContent: string;
	showChat: boolean = false;
	ioConnection: Subscription = Subscription.EMPTY;
	dialogRef: MatDialogRef<DialogNewUserComponent> | null;

	stream: MediaStream = null;
	// getting a reference to the overall list, which is the parent container of the list items
	@ViewChild(MatList, {read: ElementRef})
	matList: ElementRef;
	// getting a reference to the items/messages within the list
	@ViewChildren(MatListItem, {read: ElementRef})
	matListItems: QueryList<MatListItem>;

	@ViewChild('streamContainer')
	streamContainer: ElementRef;

	constructor(
		private socketService: SocketService,
		public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private renderer: Renderer2,
		private router: Router) {
	}

	ngOnInit(): void {
		// this.initModel();
		this.initIoConnection();
		if (!this.socketService.localStream) {
			this.router.navigateByUrl('/user')
		}

	}

	ngAfterViewInit(): void {

		// subscribing to any changes in the list of items / messages
		this.matListItems.changes.subscribe(elements => {
			this.scrollToBottom();
		});
	}

	toggleChat(): void {
		this.showChat = !this.showChat;
	}

	// auto-scroll fix: inspired by this stack overflow post
	// https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
	private scrollToBottom(): void {
		try {
			this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
		} catch (err) {
		}
	}

	// private initModel(): void {
	// 	const randomId = this.getRandomId();
	// 	this.user = {
	// 		id: randomId,
	// 	};
	// }

	private initIoConnection(): void {
		this.socketService.getLocalStream().subscribe(stream => {
			console.log(stream)
			this.stream = stream;
			this.createStreamElement(this.streamContainer.nativeElement, stream);
		});

		this.socketService.onJoinChannel()
			.subscribe(user => {
				console.log(user)
				this.user = user;
			})

		this.ioConnection = this.socketService.onMessage()
			.subscribe((message: Message) => {
				if (message.channel === this.channel) {
					this.messages.push(message);
				}
			});

		this.socketService.onNewPeer()
			.subscribe((peer: any) => {
				console.log(peer)
				if (peer.id in this.peers) {
					return;
				}
				const peerConnection = new RTCPeerConnection({iceServers: ICE_SERVERS});
				this.peers[peer.peerId] = peerConnection;

				peerConnection.onicecandidate = (event) => {
					if (event.candidate) {
						this.socketService.emitRelayICECandidate({
							peerId: peer.peerId,
							iceCandidate: {
								sdpMLineIndex: event.candidate.sdpMLineIndex,
								candidate: event.candidate.candidate,
							}
						})
					}
				};

				peerConnection.onaddstream = event => {
					this.createStreamElement(this.streamContainer.nativeElement, event.stream);
				};

				/* Add our local stream */
				peerConnection.addStream(this.stream);

				if (peer.shouldCreateOffer) {
					console.log("Creating RTC offer to ", peer.peerId);
					peerConnection.createOffer(localDescription => {
							console.log("Local offer description is: ", localDescription);
							peerConnection.setLocalDescription(localDescription, () => {
									this.socketService.emitRelaySessionDescription({
										peerId: peer.peerId,
										sessionDescription: localDescription
									});
									console.log("Offer setLocalDescription succeeded");
								},
								() => {console.log('Offer setLocalDescriptionFailed')}
							);
						},
						error => {
							console.log("Error sending offer: ", error);
						});
				}
		});

		this.socketService.onSessionDescription().subscribe((config: any) => {
			console.log('Remote description received: ', config);
			const peerId = config.peerId;
			const peer = this.peers[peerId];
			const remoteDescription = config.sessionDescription;
			console.log(this.peers)
			console.log(peer)
			const desc = new RTCSessionDescription(remoteDescription);
			const stuff = peer.setRemoteDescription(desc, () => {
					console.log("setRemoteDescription succeeded");
					if (remoteDescription.type == "offer") {
						console.log("Creating answer");
						peer.createAnswer(localDescription => {
								console.log("Answer description is: ", localDescription);
								peer.setLocalDescription(localDescription, () => {
										this.socketService.emitRelaySessionDescription({
											peerId: peerId,
											sessionDescription: localDescription
										});
										console.log("Answer setLocalDescription succeeded");
									},
									() => { console.log("Answer setLocalDescription failed!"); }
								);
							},
							error => {
								console.log("Error creating answer: ", error);
								console.log(peer);
							});
					}
				},
				error => {
					console.log("setRemoteDescription error: ", error);
				}
			);
			console.log("Description Object: ", desc);
		});

		this.socketService.onIceCandidate().subscribe((config: any) => {
				const peer = this.peers[config.peerId];
				const iceCandidate = config.iceCandidate;
				peer.addIceCandidate(new RTCIceCandidate(iceCandidate));
		});

		this.socketService.onUsernames()
			.subscribe((usernames: string[]) => {
				this.usernames = usernames;
		});
		this.socketService.onEvent(Event.CONNECT)
			.subscribe((event) => {
				console.log(event, 'connected');
			});
		this.socketService.onEvent(Event.DISCONNECT)
			.subscribe(() => {
				console.log('disconnected');
			});
		this.socketService.onReconnect()
			.subscribe(() => {
				// this.socketService.newPeer(this.user);
			})
	}

	private getRandomId(): number {
		return Math.floor(Math.random() * (1000000)) + 1;
	}

	public onClickUserInfo() {
		this.openUserPopup({
			data: {
				username: this.user.username,
				channel: this.user.channel,
				title: 'Edit Details',
				dialogType: DialogUserType.EDIT
			}
		});
	}

	private openUserPopup(params: DialogParams): void {
		this.dialogRef = this.dialog.open(DialogNewUserComponent, params);
		this.dialogRef.afterClosed().subscribe(paramsDialog => {
			if (!paramsDialog) {
				return;
			}

			if (paramsDialog.dialogType === DialogUserType.NEW) {
				this.initIoConnection();
				this.sendJoinNotification(paramsDialog, Action.JOINED);
			} else if (paramsDialog.dialogType === DialogUserType.EDIT) {
				this.sendRenameNotification(paramsDialog, Action.RENAME);
			}
		});
	}

	public sendMessage(message: string): void {
		if (!message) {
			return;
		}
		this.socketService.send({
			from: this.user,
			content: message
		});
		this.messageContent = null;
	}

	public sendJoinNotification(params: any, action: Action): void {
		const message: Message = {
			from: this.user,
			action: action,
		};
		this.socketService.joinChannel(this.user);
		this.socketService.send(message);
	}

	public sendRenameNotification(params: any, action: Action): void {
		const message: Message = {
				from: this.user,
				action: action,
				content: {
					previousUsername: params.previousUsername
				}
			};
		this.socketService.changeUsername(message);
	}

	private createStreamElement(element, stream): void {
		const videoElement = this.renderer.createElement('video');
		this.renderer.setProperty(videoElement, 'type', 'video/mp4');
		this.renderer.setProperty(videoElement, 'autoplay', 'true');
		videoElement.srcObject = stream;
		// videoElement.play();
		this.renderer.appendChild(element, videoElement);
		// return element;
	}

	ngOnDestroy(): void {
		this.ioConnection.unsubscribe();
	}
}
