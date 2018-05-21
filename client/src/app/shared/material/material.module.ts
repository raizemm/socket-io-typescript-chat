import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatCardModule,
	MatDialog,
	MatDialogModule,
	MatFormFieldModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatProgressSpinnerModule,
	MatSidenavModule,
	MatSnackBarModule,
	MatToolbarModule,
} from '@angular/material';

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatDialogModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatListModule,
		MatSidenavModule,
		MatToolbarModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatGridListModule
	],
	exports: [
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatDialogModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatListModule,
		MatSidenavModule,
		MatToolbarModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatGridListModule
	],
	declarations: [],
	providers: [
		MatDialog
	]
})
export class MaterialModule {
}
