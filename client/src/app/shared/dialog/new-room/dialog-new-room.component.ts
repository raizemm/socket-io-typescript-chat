import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogUserType } from '../new-user/dialog-user-type';

@Component({
	selector: 'tcc-dialog-new-room',
	templateUrl: './dialog-new-room.template.html',
})
export class DialogNewRoomComponent implements OnInit {
	form = new FormGroup({
		channel: new FormControl('', Validators.required),
	});
	previousUsername: string;

	constructor(
		public dialogRef: MatDialogRef<DialogNewRoomComponent>,
		@Inject(MAT_DIALOG_DATA) public params: DialogData) {
		console.log(this.params)
		// this.previousUsername = params.username ? params.username : undefined;
	}

	ngOnInit() {
	}

	public onSave(): void {
		if (this.params.channel) {
			this.dialogRef.close({
				channel: this.params.channel,
			});
		}
	}
}

export interface DialogParams {
	disableClose?: boolean;
	data: DialogData;
}

export interface DialogData {
	title: string;
	username?: string;
	dialogType?: DialogUserType;
	channel?: string;
	previousUsername?: string;
}
