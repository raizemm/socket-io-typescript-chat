"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Peer = /** @class */ (function () {
    function Peer(name, channel, id, shouldCreateOffer) {
        this.name = name;
        this.channel = channel;
        this.id = id;
        this.shouldCreateOffer = shouldCreateOffer;
    }
    return Peer;
}());
exports.Peer = Peer;
var ChangeUsername = /** @class */ (function () {
    function ChangeUsername(from, content, action) {
        this.from = from;
        this.content = content;
        this.action = action;
    }
    return ChangeUsername;
}());
exports.ChangeUsername = ChangeUsername;
