import { createServer, Server } from 'http';
import * as express from 'express';
import * as path from 'path';
import * as socketIo from 'socket.io';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import { Message } from './model';
import { ChangeUsername } from './model/user';

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
			socket.on('message', (m: Message, cb) => {
				console.log('[server](message): %s', JSON.stringify(m));
				const roomName = m.roomName;

				if (m.action === 0) {
					if (this.usernames.indexOf(m.from.name) !== -1) {
						cb(false);
					} else {
						this.usernames.push(m.from.name);
						socket.username = m.from.name;
					}

					socket.join(roomName);
					this.io.sockets.in(roomName).emit('usernames', this.usernames);
				}

				this.io.sockets.in(roomName).emit('message', m);
				cb(true);
			});
			socket.on('changeUsername', (data: ChangeUsername) => {
				this.usernames[data.username] = data.previousUsername;
				socket.username = data.username;
				// this.io.emit('message', data);
			})
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
