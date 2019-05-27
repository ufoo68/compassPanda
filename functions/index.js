'use strict';

const functions = require('firebase-functions');
const express = require('express');
const line = require('@line/bot-sdk');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

const arr = [ '僕はコンパスパンダだよ', '好きな場所で呟いてね', 'みんなの呟きも見れるよ', '呟くときは「:」を使わないでね。' ];

const form = functions.config().liff.form;
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
  let replyText = {
    type: 'text',
    text: ''
  };
  switch (event.message.type) {
    case 'location':
      const locateData = {
        latitude: event.message.latitude,
        longitude:  event.message.longitude
      };
      replyText.text = `${event.timestamp}:`;
      db.collection('locateTweet').doc(`${event.timestamp}`).set(locateData);
      return client.replyMessage(event.replyToken, [replyText, {type: "text", text: '↑のメッセージを使って呟いてね'}]);
    
    case 'text':
      replyText.text = arr[ Math.floor( Math.random() * arr.length )];
      const tweet = event.message.text.split(':');
      if (tweet.length === 2) {
        const tweetData = {
          tweet: tweet[1]
        };
        db.collection('locateTweet').doc(tweet[0]).set(tweetData, { merge: true });
        replyText.text = `タイムスタンプ「${tweet[0]}」で呟いたよ`;
      }
      if (event.message.text == 'liff') { replyText.text = form; }
      return client.replyMessage(event.replyToken, replyText);
      
    default:
      return Promise.resolve(null);
  }

}

exports.app = functions.https.onRequest(app);