"use strict";
const ws_1 = require("ws");
const models_1 = require("./models");
let findLatestMessage = (num) => {
    return models_1.Message.findAll({
        limit: num,
        order: "id DESC",
        raw: true
    }).then((messages) => {
        return messages.reverse();
    });
};
var ReceiveEventType;
(function (ReceiveEventType) {
    ReceiveEventType[ReceiveEventType["CREATE_MESSAGE"] = 0] = "CREATE_MESSAGE";
    ReceiveEventType[ReceiveEventType["PONG"] = 1] = "PONG";
})(ReceiveEventType || (ReceiveEventType = {}));
var SendEventType;
(function (SendEventType) {
    SendEventType[SendEventType["NEW_MESSAGE"] = 0] = "NEW_MESSAGE";
    SendEventType[SendEventType["PING"] = 1] = "PING";
})(SendEventType || (SendEventType = {}));
class BaseReceiveEvent {
    constructor(ev, value) {
        this.ev = ev;
        this.value = value;
    }
    response() {
    }
}
class CreateMessageEvent extends BaseReceiveEvent {
    response() {
        models_1.Message.create({ text: this.value });
        return newMessage(SendEventType.NEW_MESSAGE, this.value);
    }
}
let newMessage = (ev, value) => {
    return JSON.stringify({
        ev: SendEventType[ev],
        value: value,
    });
};
exports.bootup = () => {
    let wss = new ws_1.Server({ port: 8080 });
    let broadcast = (message) => {
        wss.clients.forEach((client) => {
            client.send(message);
        });
    };
    wss.on('connection', (ws) => {
        // send latest 10 messages
        findLatestMessage(10).then((messages) => {
            messages.forEach((obj) => {
                ws.send(newMessage(SendEventType.NEW_MESSAGE, obj["text"]));
            });
        });
        // wip
        // setInterval(() => {
        // ws.send(newMessage(SendEventType.PING, ""))
        // }, 2000)
        /*
         * expected json shceme:
         * {
         *   "ev": "CREATE_MESSAGE",
         *   "value": value,
         * }
         *
         * result json scheme:
         * {
         *   "ev":"NEW_MESSAGE",
         *   "value":""
         * }
         */
        ws.on('message', (undecoded_json) => {
            try {
                let json = JSON.parse(undecoded_json);
                // switching
                let { ev, value } = json;
                if (ev === ReceiveEventType[ReceiveEventType.CREATE_MESSAGE]) {
                    let response = new CreateMessageEvent(ev, value).response();
                    broadcast(response);
                }
            }
            catch (e) {
            }
        });
    });
};
