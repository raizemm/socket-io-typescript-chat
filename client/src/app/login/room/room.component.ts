import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Action } from '../../chat/shared/model/action';
import { Message } from '../../chat/shared/model/message';
import { User } from '../../chat/shared/model/user';
import { SocketService } from '../../chat/shared/services/socket.service';
import { DialogNewRoomComponent } from '../../shared/dialog/new-room/dialog-new-room.component';
import { DialogParams } from '../../shared/dialog/new-user/dialog-new-user.component';
import { DialogUserType } from '../../shared/dialog/new-user/dialog-user-type';
import { UserData, UserDataModelResolver } from '../../shared/resolvers/user-data-model-resolver';


@Component({
	selector: 'tcc-room',
	templateUrl: 'room.template.html'
})
export class RoomComponent implements OnInit, AfterViewInit {
	readonly model: UserData;
	defaultDialogUserParams: DialogParams = {
		disableClose: true,
		data: {
			title: 'Please enter your room name',
			dialogType: DialogUserType.NEW,
			channel: '',
		}
	};
	dialogRef: MatDialogRef<DialogNewRoomComponent> | null;

	constructor(
		public dialog: MatDialog,
		private socketService: SocketService,
		public snackBar: MatSnackBar,
		private router: Router,
		private userDataResolver: UserDataModelResolver<UserData>,
		route: ActivatedRoute) {

		this.model = route.snapshot.data['model'];
		this.defaultDialogUserParams.data.channel = this.model.channel;
		console.log(this.defaultDialogUserParams.data.channel)
	}

	ngOnInit() {

	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.dialogRef = this.dialog.open(DialogNewRoomComponent, this.defaultDialogUserParams);
			this.dialogRef.afterClosed().subscribe(paramsDialog => {
				if (!paramsDialog) {
					return;
				}

				this.socketService.setup().then(() => {
					this.userDataResolver.model.channel = paramsDialog.channel;
					const message: Message = {
						from: this.userDataResolver.model,
						action: Action.JOINED,
					};
					this.socketService.initSocket();
					this.socketService.joinChannel(this.userDataResolver.model);
					this.socketService.send(message);
					console.log('foo')
					this.router.navigateByUrl(`${paramsDialog.channel}`);
				}, () => {
					this.router.navigateByUrl('main/user');
					this.snackBar.open('Please grant access to your camera', null, {duration: 5000});
				});
			});
		})
	}
}