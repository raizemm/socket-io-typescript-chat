import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatModule } from './chat/chat.module';
import { LoginComponent } from './login/login.component';
import { RoomComponent } from './login/room/room.component';
import { UserComponent } from './login/user/user.component';
import { ChatGuard } from './shared/guards/chat.guard';
import { UserDataResolver } from './shared/resolvers/user-data-resolver';
import { SharedModule } from './shared/shared.module';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RoomComponent,
		UserComponent,
		// SpinnerComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		ChatModule,
		SharedModule
	],
	providers: [UserDataResolver],
	entryComponents: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
