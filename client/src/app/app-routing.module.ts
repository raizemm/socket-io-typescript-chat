import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RoomComponent } from './login/room/room.component';
import { UserComponent } from './login/user/user.component';
import { UserDataModelResolver } from './shared/resolvers/user-data-model-resolver';

const routes: Routes = [
	{
		path: 'main',
		component: LoginComponent,
		canActivate: [UserDataModelResolver],
		children: [
			{
				path: 'user',
				component: UserComponent,
			},
			{
				path: 'room',
				component: RoomComponent,
				resolve: { model: UserDataModelResolver },
			},
		]
	},

	{
		path: ':roomId',
		canLoad: [UserDataModelResolver],
		loadChildren: 'app/chat/chat.module#ChatModule',
	},
	{
		path: '**',
		redirectTo: 'main/user',
		pathMatch: 'full',
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
