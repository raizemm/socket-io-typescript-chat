export class User {
	constructor(public name: string) {
	}
}

export class ChangeUsername {
	constructor(public username: string, public previousUsername: string) {
	}
}