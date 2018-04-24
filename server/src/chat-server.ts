import { createServer, Server } from 'http';
import * as express from 'express';
import * as path from 'path';
import * as socketIo from 'socket.io';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import { Message, User, ChangeUsername } from './model';
import { Users } from './sockets';

export class ChatServer {
	public static readonly PORT: number = 8080;
	private app: express.Application;
	private server: Server;
	private io: SocketIO.Server;
	private port: string | number;
	private usernames: string[] = [];
	private roomName: string;

	constructor() {
		this.createApp();
		this.config();
		this.initMiddlewares();
		this.createServer();
		this.sockets();
		this.listen();
	}

	private createApp(): void {
		this.app = express();
	}

	private createServer(): void {
		this.server = createServer(this.app);
	}

	private initMiddlewares(): void {
		this.app.use(logger('dev'));
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({extended: false}));
		this.app.use(cookieParser());
	}

	private config(): void {
		this.port = process.env.PORT || ChatServer.PORT;
	}

	private sockets(): void {
		this.io = socketIo(this.server);
	}

	private listen(): void {
		this.server.listen(this.port, () => {
			console.log('Running server on port %s', this.port);
		});
		this.io.on('connect', (socket: any) => {
			console.log('Connected client on port %s.', this.port);
			console.log(socket.request._query)
			socket.on('newUser', (user: User) => {
				if (this.usernames.indexOf(user.name) !== -1) {
					return;
				} else {
					this.usernames.push(user.name);
					socket.username = user.name;
					socket.join(user.roomName);
					this.io.to(user.roomName).emit('usernames', this.usernames);
				}
				// const users = new Users(socket, this.io, user.name, user.roomName);
				// users.addSocket(socket)
			});

			socket.on('message', (m: Message) => {
				console.log('[server](message): %s', JSON.stringify(m));

				this.io.to(m.from.roomName).emit('message', m);
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
			socket.on('disconnect', () => {
				const index = this.usernames.indexOf(socket.username);
				this.usernames.splice(index, 1);
				this.io.emit('usernames', this.usernames);
				console.log('Client disconnected');
			});
		});
	}

	public getApp(): express.Application {
		return this.app;
	}
}
