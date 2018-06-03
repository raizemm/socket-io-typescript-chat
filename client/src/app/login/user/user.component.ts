import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { NavigationCancel, Router } from '@angular/router';
import { Action } from '../../chat/shared/model/action';
import { Message } from '../../chat/shared/model/message';
import { User } from '../../chat/shared/model/user';
import { SocketService } from '../../chat/shared/services/socket.service';
import { DialogNewUserComponent, DialogParams } from '../../shared/dialog/new-user/dialog-new-user.component';
import { DialogUserType } from '../../shared/dialog/new-user/dialog-user-type';
import { UserDataResolver } from '../../shared/resolvers/user-data-resolver';


@Component({
	selector: 'tcc-login',
	templateUrl: 'user.template.html'
})
export class UserComponent implements OnInit, AfterViewInit {

	defaultDialogUserParams: DialogParams = {
		disableClose: true,
		data: {
			title: 'Welcome',
			dialogType: DialogUserType.NEW
		}
	};
	dialogRef: MatDialogRef<DialogNewUserComponent> | null;

	constructor(
		public dialog: MatDialog,
		private socketService: SocketService,
		public snackBar: MatSnackBar,
		private router: Router,
		private userDataResolver: UserDataResolver) {
	}

	ngOnInit() {
		this.socketService.localStream = null;
		// this.socketService.initSocket();
	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.dialogRef = this.dialog.open(DialogNewUserComponent, this.defaultDialogUserParams);
			this.dialogRef.afterClosed().subscribe(paramsDialog => {
					if (!paramsDialog) {
						return;
					}

					const user: User = {
						id: Math.floor(Math.random() * (1000000)) + 1,
						name: paramsDialog.username,
						// channel: paramsDialog.channel,
					};
					const message: Message = {
						from: user,
						action: Action.JOINED,
					};
					// this.socketService.joinChannel(user);
					// this.socketService.send(message);
					this.userDataResolver.create(() => ({
						id: user.id,
						username: user.name,
					}));
					this.router.navigate(['main', 'room']);
				}
			);
		})
	}
}