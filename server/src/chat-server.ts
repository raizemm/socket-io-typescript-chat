import { createServer, Server } from 'http';
import * as express from 'express';
import * as path from 'path';
import * as socketIo from 'socket.io';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as _ from 'lodash';

import { Message, User, ChangeUsername } from './model';
import { UsersSocket } from './sockets';

export class ChatServer {
	public static readonly PORT: number = 8080;
	private app: express.Application;
	private server: Server;
	private io: SocketIO.Server;
	private port: string | number;
	private usernames: string[] = [];
	private roomName: string;
	private roomsCache: { [id: string]: any} = {};

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

			socket.on('newUser', (user: User) => {
				let roomsSocket = this.roomsCache[user.roomName];
				if (!roomsSocket) {
					roomsSocket = new UsersSocket(this.io, user.roomName);
					this.roomsCache[user.roomName] = roomsSocket;
				}

				socket.username = user.name;
				roomsSocket.addSocket(socket)

			});

			socket.on('message', (m: Message) => {
				console.log('[server](message): %s', JSON.stringify(m));
				this.io.to(m.from.roomName).emit('message', m);
			});
		});
	}

	public getApp(): express.Application {
		return this.app;
	}
}
