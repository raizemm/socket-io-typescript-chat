export class Peer {
	constructor(public name: string, public channel: string, public id: string, public shouldCreateOffer: boolean) {
	}
}

export class ChangeUsername {
	constructor(public from: Peer, public content: any, public action: number) {
	}
}