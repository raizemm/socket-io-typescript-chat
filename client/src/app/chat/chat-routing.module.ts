import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatGuard } from '../shared/guards/chat.guard';
import { ChatComponent } from './chat.component';

const routes: Routes = [
	{
		path: '',
		component: ChatComponent,
		canActivate: [ChatGuard]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ChatRoutingModule {
}
