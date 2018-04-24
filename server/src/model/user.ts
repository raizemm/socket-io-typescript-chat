export class User {
	constructor(public name: string, public roomName: string) {
	}
}

export class ChangeUsername {
	constructor(public from: User, public content: any, public action: number) {
	}
}