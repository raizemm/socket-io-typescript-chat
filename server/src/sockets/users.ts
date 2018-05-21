import { ChangeUsername } from '../model';
import * as _ from 'lodash';

export class UsersSocket {
	io: any;
	username: string;
	usernames: string[] = [];
	channel: string;
	sockets: any = {};
	channels: any = {};
	socket: any;

	constructor(io: any, channel: string) {
		this.io = io;
		this.channel = channel;
	}

	addSocket(socket: any) {
		const userData = socket.handshake.session.userData;

		if (!(userData.channel in this.channels)) {
			this.channels[userData.channel] = {};
		}

		for (let id in this.channels[userData.channel]) {
			this.channels[userData.channel][id].emit('newPeer', {
				peerId: socket.id,
				shouldCreateOffer: false,
			});
			socket.emit('newPeer', {
				peerId: id,
				shouldCreateOffer: true,
			});
		}

		this.channels[userData.channel][socket.id] = socket;
		this.sockets[socket.id] = socket;


		if (this.usernames.indexOf(userData.name) !== -1) {
			return;
		} else {
			this.usernames.push(userData.name);
			socket.join(this.channel);
			this.io.to(this.channel).emit('usernames', this.usernames);
		}

		this.registerHandlers(socket, userData);

		socket.on('relayICECandidate', config => {
			const peerId = config.peerId;
			const iceCandidate = config.iceCandidate;
			console.log("["+ socket.id + "] relaying ICE candidate to [" + peerId + "] ", iceCandidate);
			// this.io.to(this.channel).emit('iceCandidate', {peerId: socket.id, iceCandidate: iceCandidate});
			if (peerId in this.sockets) {
				this.sockets[peerId].emit('iceCandidate', {peerId: socket.id, iceCandidate: iceCandidate});
			}
		});

		socket.on('relaySessionDescription', config => {
			const peerId = config.peerId;
			const sessionDescription = config.sessionDescription;
			console.log("["+ socket.id + "] relaying session description to [" + peerId + "] ", sessionDescription);
			// this.io.to(this.channel).emit('sessionDescription', {peerId: socket.id, sessionDescription: sessionDescription});
			if (peerId in this.sockets) {
				this.sockets[peerId].emit('sessionDescription', {peerId: socket.id, sessionDescription});
			}
		});

	}

	registerHandlers(socket, userData) {
		socket.on('reconnect', this.reconnectHandler());
		socket.on('disconnect', this.disconnectHandler(socket));
		socket.on('changeUsername', data => this.changeUsernameHandler(data));
	}

	private changeUsernameHandler(data: ChangeUsername) {
		if (data.content.previousUsername === data.from.name) {
			return;
		}

		const index = this.usernames.indexOf(data.content.previousUsername);
		this.usernames.splice(index, 1, data.from.name);
		// socket.username = data.from.name;
		this.io.to(data.from.channel).emit('usernames', this.usernames);
		this.io.to(data.from.channel).emit('message', data);
	}

	private disconnectHandler(socket) {
		return () => {
			const userData = socket.handshake.session.userData;

			for (const channel of this.channels) {
				this.leaveChannel(channel, socket);
			}
			delete this.sockets[socket.id];

			const socketIndex = _.findIndex(this.sockets, {
				[socket.id]: socket.id,
			});

			if (socket < 0) {
				return;
			}

			const userIndex = this.usernames.indexOf(userData.name);
			this.usernames.splice(userIndex, 1);
			this.io.emit('usernames', this.usernames);
			this.io.to(userData.channel).emit('message', {
				from: {
					id: userData.id,
					name: userData.name,
				},
				action: 1,
			});
			// socket.leave(this.channel);
			// this.sockets.splice(socketIndex, 1);
			console.log('Client disconnected');
		}
	}

	private reconnectHandler() {
		return () => {};
	}

	private leaveChannel(channel: string, socket: any) {

		if (!(channel in socket.rooms)) {
			console.error(`${socket.id} ERROR: not in,`, channel);
			return;
		}

		socket.leave(channel);
		// delete socket.rooms[channel];
		delete this.channels[channel][socket.id];
	}
}