import { ChangeUsername } from '../model';
import * as _ from 'lodash';

export class UsersSocket {
	io: any;
	username: string;
	usernames: string[] = [];
	roomName: string;
	sockets: any[] = [];

	constructor(io: any, roomName: string) {
		this.io = io;
		this.roomName = roomName;
	}


	addSocket(socket: any) {
		this.sockets.push(socket);
		if (this.usernames.indexOf(socket.username) !== -1) {
			return;
		} else {
			this.usernames.push(socket.username);
			socket.join(this.roomName);
			console.log(this.usernames)
			this.io.to(this.roomName).emit('usernames', this.usernames);
		}

		socket.on('reconnect', () => {
			// console.log('foo')
		});

		socket.on('disconnect', () => {
			const socketIndex = _.findIndex(this.sockets, {
				'socket.id': socket.id,
			});

			if (socket < 0) {
				return;

			}

			const userIndex = this.usernames.indexOf(socket.username);
			this.usernames.splice(userIndex, 1);
			this.io.emit('usernames', this.usernames);

			socket.leave(this.roomName);
			this.sockets.splice(socketIndex, 1);
			console.log('Client disconnected');
		});

		socket.on('changeUsername', (data: ChangeUsername) => {
			if (data.content.previousUsername === data.from.name) {
				return;
			}

			const index = this.usernames.indexOf(data.content.previousUsername);
			this.usernames.splice(index, 1, data.from.name);
			socket.username = data.from.name;
			this.io.to(data.from.roomName).emit('usernames', this.usernames);
			this.io.to(data.from.roomName).emit('message', data);
		});
	}
}