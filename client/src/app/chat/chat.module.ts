import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogNewRoomComponent } from '../shared/dialog/new-room/dialog-new-room.component';
import { DialogNewUserComponent } from '../shared/dialog/new-user/dialog-new-user.component';
import { ChatGuard } from '../shared/guards/chat.guard';
import { MaterialModule } from '../shared/material/material.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		ChatRoutingModule,
	],
	declarations: [ChatComponent],
	providers: [ChatGuard],
	entryComponents: []
})
export class ChatModule {
}
