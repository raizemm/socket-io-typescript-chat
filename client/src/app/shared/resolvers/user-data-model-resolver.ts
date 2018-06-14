import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class UserDataModelResolver<ModelType> implements Resolve<ModelType>, CanActivate {
	model: ModelType;

	constructor(private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		this.model = null;

		return true;
	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ModelType {
		if (this.model) {
			return this.model;
		} else {
			this.router.navigateByUrl('/main/user');
			return null;
		}
	}

	create(modelFunction: () => ModelType): ModelType {
		if (!this.model) {
			this.model = modelFunction();
		}

		return this.model;
	}

	clear(): void {
		this.model = null;
	}
}

export interface UserData {
	id: number;
	username: string;
	channel?: string;
}