"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var UsersSocket = /** @class */ (function () {
    function UsersSocket(io, channel) {
        this.usernames = [];
        this.sockets = {};
        this.channels = {};
        this.io = io;
        this.channel = channel;
    }
    UsersSocket.prototype.addSocket = function (socket) {
        var _this = this;
        var userData = socket.handshake.session.userData;
        console.log(userData);
        if (!(userData.channel in this.channels)) {
            this.channels[userData.channel] = {};
        }
        for (var id in this.channels[userData.channel]) {
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
        if (this.usernames.indexOf(userData.username) !== -1) {
            return;
        }
        else {
            this.usernames.push(userData.username);
            socket.join(this.channel);
            this.io.to(this.channel).emit('usernames', this.usernames);
        }
        this.registerHandlers(socket, userData);
        socket.on('relayICECandidate', function (config) {
            var peerId = config.peerId;
            var iceCandidate = config.iceCandidate;
            console.log("[" + socket.id + "] relaying ICE candidate to [" + peerId + "] ", iceCandidate);
            // this.io.to(this.channel).emit('iceCandidate', {peerId: socket.id, iceCandidate: iceCandidate});
            if (peerId in _this.sockets) {
                _this.sockets[peerId].emit('iceCandidate', { peerId: socket.id, iceCandidate: iceCandidate });
            }
        });
        socket.on('relaySessionDescription', function (config) {
            var peerId = config.peerId;
            var sessionDescription = config.sessionDescription;
            console.log("[" + socket.id + "] relaying session description to [" + peerId + "] ", sessionDescription);
            // this.io.to(this.channel).emit('sessionDescription', {peerId: socket.id, sessionDescription: sessionDescription});
            if (peerId in _this.sockets) {
                _this.sockets[peerId].emit('sessionDescription', { peerId: socket.id, sessionDescription: sessionDescription });
            }
        });
    };
    UsersSocket.prototype.registerHandlers = function (socket, userData) {
        var _this = this;
        socket.on('reconnect', this.reconnectHandler());
        socket.on('disconnect', this.disconnectHandler(socket));
        socket.on('changeUsername', function (data) { return _this.changeUsernameHandler(data); });
    };
    UsersSocket.prototype.changeUsernameHandler = function (data) {
        if (data.content.previousUsername === data.from.name) {
            return;
        }
        var index = this.usernames.indexOf(data.content.previousUsername);
        this.usernames.splice(index, 1, data.from.name);
        // socket.username = data.from.name;
        this.io.to(data.from.channel).emit('usernames', this.usernames);
        this.io.to(data.from.channel).emit('message', data);
    };
    UsersSocket.prototype.disconnectHandler = function (socket) {
        var _this = this;
        return function () {
            var userData = socket.handshake.session.userData;
            for (var _i = 0, _a = _this.channels; _i < _a.length; _i++) {
                var channel = _a[_i];
                _this.leaveChannel(channel, socket);
            }
            delete _this.sockets[socket.id];
            var socketIndex = _.findIndex(_this.sockets, (_b = {},
                _b[socket.id] = socket.id,
                _b));
            if (socket < 0) {
                return;
            }
            var userIndex = _this.usernames.indexOf(userData.name);
            _this.usernames.splice(userIndex, 1);
            _this.io.emit('usernames', _this.usernames);
            _this.io.to(userData.channel).emit('message', {
                from: {
                    id: userData.id,
                    name: userData.name,
                },
                action: 1,
            });
            // socket.leave(this.channel);
            // this.sockets.splice(socketIndex, 1);
            console.log('Client disconnected');
            var _b;
        };
    };
    UsersSocket.prototype.reconnectHandler = function () {
        return function () { };
    };
    UsersSocket.prototype.leaveChannel = function (channel, socket) {
        if (!(channel in socket.rooms)) {
            console.error(socket.id + " ERROR: not in,", channel);
            return;
        }
        socket.leave(channel);
        // delete socket.rooms[channel];
        delete this.channels[channel][socket.id];
    };
    return UsersSocket;
}());
exports.UsersSocket = UsersSocket;
