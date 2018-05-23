import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { createServer, Server } from 'http';
import * as logger from 'morgan';
import * as socketIo from 'socket.io';
import * as session from 'express-session';
import * as sharedSession from 'express-socket.io-session';
import { Message, Peer } from './model';
import { UsersSocket } from './sockets';

export class ChatServer {
	public static readonly PORT: number = 8080;
	private app: express.Application;
	private server: Server;
	private io: SocketIO.Server;
	private port: string | number;
	private roomsCache: { [id: string]: any} = {};
	private expressSession = session({
		secret: 'secret',
		resave: true,
		saveUninitialized: true,
	});
	private sockets: any = {};
	private channels: any = {};

	constructor() {
		this.createApp();
		this.config();
		this.initMiddlewares();
		this.createServer();
		this.initSocket();
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
		this.app.use(this.expressSession);
	}

	private config(): void {
		this.port = process.env.PORT || ChatServer.PORT;
	}

	private initSocket(): void {
		this.io = socketIo(this.server);
		this.io.use(sharedSession(this.expressSession));
	}

	private listen(): void {
		this.server.listen(this.port, () => {
			console.log('Running server on port %s', this.port);
		});
		this.io.on('connect', (socket: any) => {
			socket.channels = {};
			this.sockets[socket.id] = socket;

			console.log('Connected client on port %s.', this.port);

			socket.on('join', (peer: Peer) => {
				let roomsSocket = this.roomsCache[peer.channel];
				if (!roomsSocket) {
					roomsSocket = new UsersSocket(this.io, peer.channel);
					this.roomsCache[peer.channel] = roomsSocket;
				}
				socket.handshake.session.userData = peer;
				socket.handshake.session.save();

				roomsSocket.addSocket(socket)
			});

			socket.on('message', (m: Message) => {
				console.log('[server](message): %s', JSON.stringify(m));
				this.io.to(m.from.channel).emit('message', m);
			});
		});
	}

	public getApp(): express.Application {
		return this.app;
	}
}

// import * as bodyParser from 'body-parser';
// import * as cookieParser from 'cookie-parser';
// import * as express from 'express';
// import { createServer, Server } from 'http';
// import * as logger from 'morgan';
// import * as socketIo from 'socket.io';
// import * as session from 'express-session';
// import * as sharedSession from 'express-socket.io-session';
// import { Message, Peer } from './model';
// import { UsersSocket } from './sockets';
//
// export class ChatServer {
// 	public static readonly PORT: number = 8080;
// 	private app: express.Application;
// 	private server: Server;
// 	private io: SocketIO.Server;
// 	private port: string | number;
// 	private usernames: string[] = [];
// 	private roomName: string;
// 	private roomsCache: { [id: string]: any} = {};
// 	private expressSession = session({
// 		secret: 'secret',
// 		resave: true,
// 		saveUninitialized: true,
// 	});
// 	private sockets: any = {};
// 	private channels: any = {};
//
// 	constructor() {
// 		this.createApp();
// 		this.config();
// 		this.initMiddlewares();
// 		this.createServer();
// 		this.initSocket();
// 		this.listen();
// 	}
//
// 	private createApp(): void {
// 		this.app = express();
// 	}
//
// 	private createServer(): void {
// 		this.server = createServer(this.app);
// 	}
//
// 	private initMiddlewares(): void {
// 		this.app.use(logger('dev'));
// 		this.app.use(bodyParser.json());
// 		this.app.use(bodyParser.urlencoded({extended: false}));
// 		this.app.use(cookieParser());
// 		this.app.use(this.expressSession)
// 	}
//
// 	private config(): void {
// 		this.port = process.env.PORT || ChatServer.PORT;
// 	}
//
// 	private initSocket(): void {
// 		this.io = socketIo(this.server);
// 		this.io.use(sharedSession(this.expressSession));
// 	}
//
// 	private listen(): void {
// 		this.server.listen(this.port, () => {
// 			console.log('Running server on port %s', this.port);
// 		});
// 		this.io.on('connect', (socket: any) => {
// 			socket.channels = {};
// 			this.sockets[socket.id] = socket;
//
// 			console.log('Connected client on port %s.', this.port);
//
// 			socket.on('join', (peer: Peer) => {
//
// 				if (peer.channel in socket.channels) {
// 					console.error(`ERROR: already joined ${peer.channel}`)
// 				}
//
// 				if (!(peer.channel in this.channels)) {
// 					this.channels[peer.channel] = {};
// 				}
//
// 				for (const id in this.channels[peer.channel]) {
// 					this.channels[peer.channel][id].emit('newPeer', {peerId: socket.id, shouldCreateOffer: false});
// 					socket.emit('newPeer', {peerId: id, shouldCreateOffer: true});
// 				}
//
// 				this.channels[peer.channel][socket.id] = socket;
// 				socket.channels[peer.channel] = peer.channel;
//
// 				// TODO improve later
// 				// let roomsSocket = this.roomsCache[peer.channel];
// 				// if (!roomsSocket) {
// 				// 	roomsSocket = new UsersSocket(this.io, peer.channel);
// 				// 	this.roomsCache[peer.channel] = roomsSocket;
// 				// }
// 				socket.handshake.session.userData = peer;
// 				socket.handshake.session.save();
// 				// socket.emit('newPeer', {
// 				// 	peerId: peer.id,
// 				// 	shouldCreateOffeer: true,
// 				// });
// 				// socket.username = peer.name;
// 				// roomsSocket.addSocket(socket)
//
// 			});
//
// 			socket.on('relayICECandidate', config => {
// 				const peerId = config.peerId;
// 				const iceCandidate = config.iceCandidate;
// 				console.log("["+ socket.id + "] relaying ICE candidate to [" + peerId + "] ", iceCandidate);
// 				// this.io.to(this.channel).emit('iceCandidate', {peerId: userData.id, iceCandidate: iceCandidate});
// 				if (peerId in this.sockets) {
// 					this.sockets[peerId].emit('iceCandidate', {peerId: socket.id, iceCandidate: iceCandidate});
// 				}
// 			});
//
// 			socket.on('relaySessionDescription', config => {
// 				const peerId = config.peerId;
// 				const sessionDescription = config.sessionDescription;
// 				console.log("["+ socket.id + "] relaying session description to [" + peerId + "] ", sessionDescription);
// 				// this.io.to(this.channel).emit('sessionDescription', {peerId: userData.id, sessionDescription: sessionDescription});
// 				if (peerId in this.sockets) {
// 					this.sockets[peerId].emit('sessionDescription', {peerId: socket.id, sessionDescription: sessionDescription});
// 				}
// 			});
//
// 			socket.on('message', (m: Message) => {
// 				console.log('[server](message): %s', JSON.stringify(m));
// 				this.io.to(m.from.channel).emit('message', m);
// 			});
// 		});
// 	}
//
// 	public getApp(): express.Application {
// 		return this.app;
// 	}
// }

