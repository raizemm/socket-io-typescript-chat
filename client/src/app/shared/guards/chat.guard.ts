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

@Injectable()
export class ChatGuard implements CanActivate, Resolve<MediaStream>, CanLoad {


	constructor(private socketService: SocketService, private router: Router) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		console.log('guard')
		if (!this.socketService.localStream) {
			this.router.navigateByUrl('/main/user');
			console.log('bar')

			return false;
		}
		return true;
	}

	canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
		if (this.socketService.localStream) {
			return true;
		}

		// this.router.navigateByUrl('/main');

		return false;
	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MediaStream | Observable<MediaStream> | Promise<MediaStream> {
		try {
			if (!this.socketService.localStream) {

				return Observable.throw('error');
			}
		} catch(e) {
			console.log('bar')

			this.router.navigate(['/user']);
		}

	}

}