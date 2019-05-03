'use strict';

const functions = require('firebase-functions');
const express = require('express');
const line = require('@line/bot-sdk');

var arr = [ "魔材ンゴwwww", "やめたらこの仕事？", "歪みねえな", "24歳です" ];

const liff = functions.config().liff.url;

const config = {
    channelSecret: functions.config().channel.secret,
    channelAccessToken: functions.config().channel.accesstoken
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(config);
    console.log(req.body.events);
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

async function handleEvent(event) {
  if (event.message.type === 'location') {
    return client.replyMessage(event.replyToken, {
      type: 'sticker',
      packageId: 11538,
      stickerId: 51626496
    });
  }

  if (event.message.type === 'text') {
    let reply = {
      type: 'text',
      text:  arr[ Math.floor( Math.random() * arr.length ) ]
    }
    if (event.message.text === 'liff') {
      reply.text = liff;
    }
    return client.replyMessage(event.replyToken, reply);
  }

  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

}

exports.app = functions.https.onRequest(app);