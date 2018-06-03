import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { SocketService } from '../chat/shared/services/socket.service';
import { UserDataResolver } from '../shared/resolvers/user-data-resolver';

@Component({
	selector: 'tcc-login',
	templateUrl: './login.template.html'
})
export class LoginComponent implements OnInit {

	constructor(
		public dialog: MatDialog,
		private socketService: SocketService,
		public snackBar: MatSnackBar,
		private router: Router,
		private userDataResolver: UserDataResolver) {
	}

	ngOnInit() {
		this.socketService.localStream = null;
		this.userDataResolver.clear();
	}
}