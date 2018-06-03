import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogUserType } from './dialog-user-type';

@Component({
	selector: 'tcc-dialog-new-user',
	templateUrl: './dialog-new-user.template.html',
})
export class DialogNewUserComponent implements OnInit {
	form = new FormGroup({
		username: new FormControl('', Validators.required),
		// channel: new FormControl('', Validators.required),
	});
	previousUsername: string;

	constructor(
		public dialogRef: MatDialogRef<DialogNewUserComponent>,
		@Inject(MAT_DIALOG_DATA) public params: DialogData) {
		// this.previousUsername = params.username ? params.username : undefined;
	}

	ngOnInit() {
	}

	public onSave(): void {
		if (this.params.username) {
			this.dialogRef.close({
				username: this.params.username,
				dialogType: this.params.dialogType,
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
