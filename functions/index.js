'use strict';

const functions = require('firebase-functions');
const express = require('express');
const line = require('@line/bot-sdk');
const phrase = require('./strings.json')
const message = require('line-message-builder')

const config = {
    channelSecret: functions.config().channel.secret,
    channelAccessToken: functions.config().channel.accesstoken
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

async function handleEvent(event) {

  // switch of follow
  switch (event.type) {
    case 'follow':
        return client.replyMessage(event.replyToken, message.buildReplyText(phrase.begin));
  }

  // switch of messages
  switch (event.message.type) {
    case 'text':
      if (event.message.text.includes('歳') || event.message.text.includes('才')) {
        return client.replyMessage(event.replyToken, message.buildReplyText(phrase.age));
      }
      else if (event.message.text.includes('好きなもの')) {
        return client.replyMessage(event.replyToken, message.buildReplyText(phrase.like));
      }
      else if (event.message.text.includes('使い方')) {
        return client.replyMessage(event.replyToken, message.buildReplyText(phrase.howToUse));
      }
      else {
        return client.replyMessage(event.replyToken, message.buildReplyRandomText(phrase.default));
      }
    default:
      return Promise.resolve(null);
  }

}

exports.app = functions.https.onRequest(app);