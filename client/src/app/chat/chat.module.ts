import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatGuard } from '../shared/guards/chat.guard';
import { MaterialModule } from '../shared/material/material.module';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { InheritFormDirective } from './shared/directives/inherit-form.directive';
import { TestComponent } from './test.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		ChatRoutingModule,
	],
	declarations: [ChatComponent, InheritFormDirective, TestComponent],
	exports: [],
	providers: [ChatGuard],
	entryComponents: []
})
export class ChatModule {
}
