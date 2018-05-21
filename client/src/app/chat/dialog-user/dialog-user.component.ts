import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogUserType } from './dialog-user-type';

@Component({
	selector: 'tcc-dialog-user',
	templateUrl: './dialog-user.component.html',
})
export class DialogUserComponent implements OnInit {
	form = new FormGroup({
		username: new FormControl('', Validators.required),
		channel: new FormControl('', Validators.required),
	});
	previousUsername: string;

	constructor(
		public dialogRef: MatDialogRef<DialogUserComponent>,
		@Inject(MAT_DIALOG_DATA) public params: DialogData) {
		this.previousUsername = params.username ? params.username : undefined;
	}

	ngOnInit() {
	}

	public onSave(): void {
		if (this.params.channel && this.params.username) {
			this.dialogRef.close({
				username: this.params.username,
				channel: this.params.channel,
				dialogType: this.params.dialogType,
				previousUsername: this.previousUsername
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
	dialogType: DialogUserType;
	channel?: string;
	previousUsername?: string;
}
