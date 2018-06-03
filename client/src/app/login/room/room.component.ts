import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Action } from '../../chat/shared/model/action';
import { Message } from '../../chat/shared/model/message';
import { User } from '../../chat/shared/model/user';
import { SocketService } from '../../chat/shared/services/socket.service';
import { DialogNewRoomComponent } from '../../shared/dialog/new-room/dialog-new-room.component';
import { DialogParams } from '../../shared/dialog/new-user/dialog-new-user.component';
import { DialogUserType } from '../../shared/dialog/new-user/dialog-user-type';
import { UserDataResolver } from '../../shared/resolvers/user-data-resolver';


@Component({
	selector: 'tcc-room',
	templateUrl: 'room.template.html'
})
export class RoomComponent implements OnInit, AfterViewInit {
	defaultDialogUserParams: DialogParams = {
		disableClose: true,
		data: {
			title: 'Please enter your room name',
			dialogType: DialogUserType.NEW
		}
	};
	dialogRef: MatDialogRef<DialogNewRoomComponent> | null;

	constructor(
		public dialog: MatDialog,
		private socketService: SocketService,
		public snackBar: MatSnackBar,
		private router: Router,
		private userDataResolver: UserDataResolver) {
	}

	ngOnInit() {
		console.log('foo')
		this.socketService.localStream = null;
		console.log(this.userDataResolver.model)
	}

	ngAfterViewInit(): void {
		console.log('init')
		setTimeout(() => {
			this.dialogRef = this.dialog.open(DialogNewRoomComponent, this.defaultDialogUserParams);
			this.dialogRef.afterClosed().subscribe(paramsDialog => {
				console.log(paramsDialog)
				if (!paramsDialog) {
					return;
				}

				this.socketService.initSocket();
				this.socketService.setup().then(() => {
					this.userDataResolver.model.channel = paramsDialog.channel;
					const message: Message = {
						from: this.userDataResolver.model,
						action: Action.JOINED,
					};
					this.socketService.joinChannel(this.userDataResolver.model);
					this.socketService.send(message);
					this.router.navigateByUrl(`${paramsDialog.channel}`);
				}, () => {
					this.snackBar.open('Please grant access to your camera');
				});
			});
		})
	}
}