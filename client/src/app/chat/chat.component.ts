import {
	Component,
	OnInit,
	ViewChildren,
	ViewChild,
	AfterViewInit,
	QueryList,
	ElementRef,
	OnDestroy
} from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Message } from './shared/model/message';
import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';
import { DialogParams, DialogUserComponent } from './dialog-user/dialog-user.component';
import { DialogUserType } from './dialog-user/dialog-user-type';

const AVATAR_URL = 'https://api.adorable.io/avatars/285';

@Component({
	selector: 'tcc-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
	action = Action;
	user: User;
	roomName: string;
	usernames: string[];
	messages: Message[] = [];
	messageContent: string;
	ioConnection: Subscription = Subscription.EMPTY;
	dialogRef: MatDialogRef<DialogUserComponent> | null;
	defaultDialogUserParams: DialogParams = {
		disableClose: true,
		data: {
			title: 'Welcome',
			dialogType: DialogUserType.NEW
		}
	};
	// getting a reference to the overall list, which is the parent container of the list items
	@ViewChild(MatList, {read: ElementRef}) matList: ElementRef;
	// getting a reference to the items/messages within the list
	@ViewChildren(MatListItem, {read: ElementRef}) matListItems: QueryList<MatListItem>;

	constructor(private socketService: SocketService, public dialog: MatDialog) {
	}

	ngOnInit(): void {
		this.initModel();
		// Using timeout due to https://github.com/angular/angular/issues/14748
		setTimeout(() => {
			this.openUserPopup(this.defaultDialogUserParams);
		}, 0);
	}

	ngAfterViewInit(): void {
		// subscribing to any changes in the list of items / messages
		this.matListItems.changes.subscribe(elements => {
			this.scrollToBottom();
		});
	}

	// auto-scroll fix: inspired by this stack overflow post
	// https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
	private scrollToBottom(): void {
		// console.log(this.matList.nativeElement.scrollTop)
		// console.log(this.matList.nativeElement.scrollHeight)
		try {
			this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
		} catch (err) {
		}
	}

	private initModel(): void {
		const randomId = this.getRandomId();
		this.user = {
			id: randomId,
			avatar: `${AVATAR_URL}/${randomId}.png`
		};
	}

	private initIoConnection(): void {
		this.socketService.initSocket();
		this.ioConnection = this.socketService.onMessage()
			.subscribe((message: Message) => {
				if (message.roomName === this.roomName) {
					this.messages.push(message);
				}
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
	}

	private getRandomId(): number {
		return Math.floor(Math.random() * (1000000)) + 1;
	}

	public onClickUserInfo() {
		this.openUserPopup({
			data: {
				username: this.user.name,
				room: this.user.roomName,
				title: 'Edit Details',
				dialogType: DialogUserType.EDIT
			}
		});
	}

	private openUserPopup(params: DialogParams): void {
		this.dialogRef = this.dialog.open(DialogUserComponent, params);
		this.dialogRef.afterClosed().subscribe(paramsDialog => {
			if (!paramsDialog) {
				return;
			}
			this.user.name = paramsDialog.username;
			this.user.roomName = paramsDialog.roomName;
			if (paramsDialog.dialogType === DialogUserType.NEW) {
				this.initIoConnection();
				this.sendNotification(paramsDialog, Action.JOINED);
			} else if (paramsDialog.dialogType === DialogUserType.EDIT) {
				this.sendNotification(paramsDialog, Action.RENAME);
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

	public sendNotification(params: any, action: Action): void {
		let message: Message;
		if (action === Action.JOINED) {
			message = {
				from: this.user,
				action: action
			};
			this.socketService.newUser(this.user)
			this.socketService.send(message);
		} else if (action === Action.RENAME) {
			message = {
				from: this.user,
				action: action,
				content: {
					previousUsername: params.previousUsername
				}
			};
			this.socketService.changeUsername(message);
		}
	}

	ngOnDestroy(): void {
		this.ioConnection.unsubscribe();
	}
}
