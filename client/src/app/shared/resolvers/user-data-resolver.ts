import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild,
	Resolve,
	Router,
	RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from '../../chat/shared/model/user';

@Injectable()
export class UserDataResolver implements Resolve<UserData>, CanActivate {
	model: UserData;

	constructor(private router: Router) {
	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UserData {
		if (this.model) {
			return this.model;
		} else {
			this.router.navigateByUrl('/main/user');
			return null;
		}
	}

	create(modelFunction: () => UserData): UserData {
		if (!this.model) {
			this.model = modelFunction();
		}

		return this.model;
	}

	clear(): void {
		this.model = null;
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		this.model = null;
console.log('activate')
		return true;
	}
}

export interface UserData {
	id: number;
	username: string;
	channel?: string;
}