import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogUserType } from './dialog-user-type';

@Component({
	selector: 'tcc-dialog-user',
	templateUrl: './dialog-user.component.html',
	styleUrls: ['./dialog-user.component.css']
})
export class DialogUserComponent implements OnInit {
	form = new FormGroup({
		username: new FormControl('', Validators.required),
		roomName: new FormControl('', Validators.required),
	});
	previousUsername: string;

	constructor(
		public dialogRef: MatDialogRef<DialogUserComponent>,
		@Inject(MAT_DIALOG_DATA) public params: DialogData) {
		console.log(params)
		this.previousUsername = params.username ? params.username : undefined;
	}

	ngOnInit() {
	}

	public onSave(): void {
		this.dialogRef.close({
			username: this.params.username,
			roomName: this.params.room,
			dialogType: this.params.dialogType,
			previousUsername: this.previousUsername
		});
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
	room?: string;
	previousUsername?: string;
}
