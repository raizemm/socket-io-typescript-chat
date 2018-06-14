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
export class UserDataModelResolver<ModelType> implements Resolve<ModelType>, CanActivate, CanLoad {
	model: ModelType;

	constructor(private router: Router, private socketService: SocketService) {}

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

	canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
		if (this.socketService.localStream) {
			return true;
		}

		this.router.navigateByUrl('/main/user');
		return false;
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