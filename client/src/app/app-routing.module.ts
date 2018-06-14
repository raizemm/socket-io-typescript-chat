import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { RoomComponent } from './login/room/room.component';
import { UserComponent } from './login/user/user.component';
import { ChatGuard } from './shared/guards/chat.guard';
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
		component: ChatComponent,
		canLoad: [ChatGuard],
		canActivate: [ChatGuard],
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
