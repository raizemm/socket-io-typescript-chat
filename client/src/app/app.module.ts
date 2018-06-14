import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RoomComponent } from './login/room/room.component';
import { UserComponent } from './login/user/user.component';
import { DialogNewRoomComponent } from './shared/dialog/new-room/dialog-new-room.component';
import { DialogNewUserComponent } from './shared/dialog/new-user/dialog-new-user.component';
import { UserDataModelResolver } from './shared/resolvers/user-data-model-resolver';
import { SharedModule } from './shared/shared.module';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RoomComponent,
		UserComponent,
		DialogNewUserComponent,
		DialogNewRoomComponent
	],
	imports: [
		SharedModule,
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		AppRoutingModule,
	],
	providers: [UserDataModelResolver],
	entryComponents: [DialogNewUserComponent, DialogNewRoomComponent],
	bootstrap: [AppComponent]
})
export class AppModule {
}
