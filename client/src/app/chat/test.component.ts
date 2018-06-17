import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'tcc-test',
	templateUrl: 'test.template.html'
})
export class TestComponent implements OnInit {
	nested: string;

	constructor() {
	}

	ngOnInit() {
	}
}