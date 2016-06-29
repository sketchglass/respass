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
exports.bootup = () => {
    let wss = new ws_1.Server({ port: 8080 });
    let broadcast = (message) => {
        wss.clients.forEach((client) => {
            client.send(message);
        });
    };
    wss.on('connection', (ws) => {
        ws.send("starting connection");
        // send latest 10 messages
        findLatestMessage(10).then((messages) => {
            messages.forEach((obj) => {
                ws.send(obj["text"]);
            });
        });
        ws.on('message', (message) => {
            models_1.Message.create({ text: message });
            broadcast(message);
        });
    });
};
