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
export class UserDataResolver implements Resolve<UserData>, CanActivateChild {
	model: UserData;

	constructor(private router: Router) {
	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): UserData {
		if (this.model) {
			this.model = null;

			return null;
		}

		return this.model;
	}

	create(modelFunction: () => UserData): void {
		// console.log(this.model)
		this.model = modelFunction();
	}

	clear(): void {
		this.model = null;
	}

	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		if (this.model) {
			this.model = null;
			console.log('canact')

			return true;
		}
console.log('canact')
		this.router.navigateByUrl('/main/user');
		return false;
	}
}

export interface UserData {
	id: number;
	username: string;
	channel?: string;
}