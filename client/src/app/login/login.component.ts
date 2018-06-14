import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { SocketService } from '../chat/shared/services/socket.service';
import { UserData, UserDataModelResolver } from '../shared/resolvers/user-data-model-resolver';

@Component({
	selector: 'tcc-login',
	templateUrl: './login.template.html'
})
export class LoginComponent implements OnInit {

	constructor(
		public dialog: MatDialog,
		private socketService: SocketService,
		private router: Router,
		private resolver: UserDataModelResolver<UserData>) {
	}

	ngOnInit() {
		this.socketService.localStream = null;
		this.resolver.clear();
	}
}