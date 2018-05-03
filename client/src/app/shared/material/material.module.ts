import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatButtonModule,
	MatCardModule,
	MatDialog,
	MatDialogModule,
	MatIconModule,
	MatFormFieldModule,
	MatInputModule,
	MatListModule,
	MatSidenavModule,
	MatToolbarModule, MatProgressSpinnerModule,
} from '@angular/material';

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatCardModule,
		MatDialogModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatListModule,
		MatSidenavModule,
		MatToolbarModule,
		MatProgressSpinnerModule
	],
	exports: [
		MatButtonModule,
		MatCardModule,
		MatDialogModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		MatListModule,
		MatSidenavModule,
		MatToolbarModule,
		MatProgressSpinnerModule,
	],
	declarations: [],
	providers: [
		MatDialog
	]
})
export class MaterialModule {
}
