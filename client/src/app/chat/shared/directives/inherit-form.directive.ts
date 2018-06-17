import { AfterViewInit, Directive, Host, Input, OnDestroy, OnInit, Optional, SkipSelf } from '@angular/core';
import { NgForm } from '@angular/forms';

@Directive({selector: '[tccInheritForm]'})
export class InheritFormDirective implements OnInit, OnDestroy {

	@Input('tccInheritForm')
	name: string;

	constructor(
		@Host() private selfContainer: NgForm,
		@SkipSelf() @Optional() private parentContainer: NgForm) {
		console.log('foo')
	}

	ngOnInit(): void {
		console.log(this.name)
		console.log(this.selfContainer)
		console.log(this.parentContainer)
		// if (this.parentContainer) {
		// 	// this.selfContainer.controls.forEach(control => {
				this.parentContainer.controls[this.name] = this.selfContainer.control;
		// 	// })
		// }
	}

	ngOnDestroy(): void {
		// this.parentContainer.removeControl()
	}
}