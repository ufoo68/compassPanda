'use strict';

const functions = require('firebase-functions');
const express = require('express');
const line = require('@line/bot-sdk');

var arr = [ "魔材ンゴwwww", "やめたらこの仕事？", "歪みねえな", "24歳です" ];

const config = {
    channelSecret: '075845b961dd3f445ea608978bfb88bc',
    channelAccessToken: 'HIrkVy4OssFQG5zxw503B8/HQ5HO3P4XJr3XUxt5bJ3HcYXn/VRO/deHl1x1Wprm0Qg7yKaH+vi22PCtwRLFVUO+0SyFszllXqCIa3LQbEbSWSZI8OUXbYyF7YWFGuSVAooqL46+dc7hW72Wbotp4gdB04t89/1O/w1cDnyilFU='
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

async function handleEvent(event) {
  if (event.message.type == 'location') {
    return client.replyMessage(event.replyToken, {
      type: 'sticker',
      packageId: 11538,
      stickerId: 51626496
    });
  }

  if (event.message.type == 'text') {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: arr[ Math.floor( Math.random() * arr.length ) ]
    });
  }

  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

}

exports.app = functions.https.onRequest(app);