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
})(ReceiveEventType || (ReceiveEventType = {}));
var SendEventType;
(function (SendEventType) {
    SendEventType[SendEventType["NEW_MESSAGE"] = 0] = "NEW_MESSAGE";
})(SendEventType || (SendEventType = {}));
let newMessage = (message) => {
    return JSON.stringify({
        ev: SendEventType[SendEventType.NEW_MESSAGE],
        value: message,
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
                ws.send(newMessage(obj["text"]));
            });
        });
        /*
         * expected json shceme:
         * {
         *   "ev": "CREATE_MESSAGE",
         *   "value": value,
         * }
         *
         */
        ws.on('message', (undecoded_json) => {
            try {
                let json = JSON.parse(undecoded_json);
                // switching
                let { ev, value } = json;
                if (ev === ReceiveEventType[ReceiveEventType.CREATE_MESSAGE]) {
                    models_1.Message.create({ text: value });
                    broadcast(newMessage(value));
                }
            }
            catch (e) {
            }
        });
    });
};
