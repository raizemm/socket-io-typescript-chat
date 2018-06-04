import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanLoad,
	Resolve,
	Route,
	Router,
	RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SocketService } from '../../chat/shared/services/socket.service';
import { UserDataResolver } from '../resolvers/user-data-resolver';

@Injectable()
export class RoomGuard implements CanActivate {


	constructor(private socketService: SocketService, private router: Router, private userDataResolver: UserDataResolver) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (this.userDataResolver.model) {
			return true;
		}

		this.router.navigateByUrl('main/user');
		return false;
	}
}