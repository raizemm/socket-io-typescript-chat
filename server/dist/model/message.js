"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Message = /** @class */ (function () {
    function Message(from, roomName, content, action) {
        this.from = from;
        this.roomName = roomName;
        this.content = content;
        this.action = action;
    }
    return Message;
}());
exports.Message = Message;
