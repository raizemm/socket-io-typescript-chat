"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var express = require("express");
var http_1 = require("http");
var logger = require("morgan");
var socketIo = require("socket.io");
var session = require("express-session");
var sharedSession = require("express-socket.io-session");
var sockets_1 = require("./sockets");
var ChatServer = /** @class */ (function () {
    function ChatServer() {
        this.roomsCache = {};
        this.expressSession = session({
            secret: 'secret',
            resave: true,
            saveUninitialized: true,
        });
        this.sockets = {};
        this.channels = {};
        this.createApp();
        this.config();
        this.initMiddlewares();
        this.createServer();
        this.initSocket();
        this.listen();
    }
    ChatServer.prototype.createApp = function () {
        this.app = express();
    };
    ChatServer.prototype.createServer = function () {
        this.server = http_1.createServer(this.app);
    };
    ChatServer.prototype.initMiddlewares = function () {
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(this.expressSession);
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header("Access-Control-Allow-Headers", "Content-Type");
            res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
            next();
        });
    };
    ChatServer.prototype.config = function () {
        this.port = process.env.PORT || ChatServer.PORT;
    };
    ChatServer.prototype.initSocket = function () {
        this.io = socketIo(this.server, { origins: '*:*' });
        this.io.use(sharedSession(this.expressSession));
    };
    ChatServer.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log('Running server on port %s', _this.port);
        });
        this.io.on('connect', function (socket) {
            socket.channels = {};
            _this.sockets[socket.id] = socket;
            console.log('Connected client on port %s.', _this.port);
            socket.on('join', function (peer) {
                var roomsSocket = _this.roomsCache[peer.channel];
                if (!roomsSocket) {
                    roomsSocket = new sockets_1.UsersSocket(_this.io, peer.channel);
                    _this.roomsCache[peer.channel] = roomsSocket;
                }
                socket.handshake.session.userData = peer;
                socket.handshake.session.save();
                socket.emit('join', socket.handshake.session.userData);
                roomsSocket.addSocket(socket);
            });
            socket.on('message', function (m) {
                console.log('[server](message): %s', JSON.stringify(m));
                _this.io.to(m.from.channel).emit('message', m);
            });
        });
    };
    ChatServer.prototype.getApp = function () {
        return this.app;
    };
    ChatServer.PORT = 8080;
    return ChatServer;
}());
exports.ChatServer = ChatServer;
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
