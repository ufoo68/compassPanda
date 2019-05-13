'use strict';

const functions = require('firebase-functions');
const express = require('express');
const line = require('@line/bot-sdk');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

var arr = [ "魔材ンゴwwww", "やめたらこの仕事？", "歪みねえな", "24歳です" ];

const liff = functions.config().liff.url;
const map = functions.config().liff.map;

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
  switch (event.message.type) {
    case 'location':
      let replySticker = {
        type: 'sticker',
        packageId: 11538,
        stickerId: 51626496
      };
      const locateData = {
        latitude: event.message.latitude,
        longitude:  event.message.longitude
      };
      db.collection('locateTweet').doc(event.source.userId).set(locateData);
      return client.replyMessage(event.replyToken, replySticker);
    
    case 'text':
      let replyText = {
        type: 'text',
        text:  arr[ Math.floor( Math.random() * arr.length ) ]
      }
      const tweetData = {
        tweet:  event.message.text
      };
      db.collection('locateTweet').doc(event.source.userId).set(tweetData);
      if (event.message.text == 'liff') { reply.text = liff; }
      return client.replyMessage(event.replyToken, replyText);
      
    default:
      return Promise.resolve(null);
  }

}

exports.app = functions.https.onRequest(app);