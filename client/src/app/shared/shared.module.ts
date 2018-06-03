import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SocketService } from '../chat/shared/services/socket.service';
import { MaterialModule } from './material/material.module';

@NgModule({
	imports: [
		CommonModule,
		MaterialModule
	],
	exports: [
		MaterialModule
	],
	declarations: [
	],
	providers: [SocketService]
})
export class SharedModule {
}
