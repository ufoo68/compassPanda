'use strict';

const functions = require('firebase-functions');
const express = require('express');
const line = require('@line/bot-sdk');
const phrase = require('./strings.json')

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

function buildReplyText(text) {
  return {
    type: 'text',
    text: text
  }
}

async function handleEvent(event) {

  // switch of follow
  switch (event.type) {
    case 'follow':
        return client.replyMessage(event.replyToken, [
          buildReplyText(phrase.begin[0]),
          buildReplyText(phrase.begin[1]),
          buildReplyText(phrase.begin[2])
        ]);
  }

  // switch of messages
  switch (event.message.type) {
    case 'text':
      if (event.message.text.includes('歳') || event.message.text.includes('才')) {
        return client.replyMessage(event.replyToken, buildReplyText(phrase.age));
      }
      else if (event.message.text.includes('好きなもの')) {
        return client.replyMessage(event.replyToken, buildReplyText(phrase.like));
      }
      else if (event.message.text.includes('使い方')) {
        return client.replyMessage(event.replyToken, [
          buildReplyText(phrase.howToUse[0]),
          buildReplyText(phrase.howToUse[1]),
          buildReplyText(phrase.howToUse[2])
        ]);
      }
      else {
        return client.replyMessage(event.replyToken, buildReplyText(phrase.default[ Math.floor( Math.random() * phrase.default.length )]));
      }
    default:
      return Promise.resolve(null);
  }

}

exports.app = functions.https.onRequest(app);