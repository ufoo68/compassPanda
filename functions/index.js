'use strict';

const functions = require('firebase-functions');
const express = require('express');
const line = require('@line/bot-sdk');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

const phraseDef = [ 'んー、お姉さん難しいことわかんないなー', '君は面白いことを言うね', 'いいんだよ？たまには褒めてくれても',
              'いやー、君も飽きないね', 'どうやら楽しんでくれてるようで、お姉さんも嬉しいな', '安心してくれたまえよ君、明日は晴れだよ。たぶん'];
const phraseOld = 'いいかい？私はかわいい。ならそれだけでいいじゃないか、ね？';
const phraseLike = 'ん？好きなもの？それはもちろんキミニキマッテルジャナイカー';

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
  let replyText1 = {
    type: 'text',
    text: ''
  };
  let replyText2 = {
    type: 'text',
    text: ''
  };
  let replyText3 = {
    type: 'text',
    text: ''
  };

  // switch of follow
  switch (event.type) {
    case 'follow':
        replyText1.text = `友達登録ありがとう。`;
        replyText2.text = `私は今あなたがいる場所に呟きを残すことができるよ。`;
        replyText3.text = `むふふ、すごいでしょ～。`;
        return client.replyMessage(event.replyToken, [replyText1, replyText2, replyText3]);
  }

  // switch of messages
  switch (event.message.type) {
    case 'location':
      const locateData = {
        latitude: event.message.latitude,
        longitude:  event.message.longitude
      };
      replyText1.text = 'その場所ならこれかな？'
      replyText2.text = `${event.timestamp}`;
      replyText3.text = `上の番号といっしょに ${form} で呟いてみて`
      db.collection('locateTweet').doc(`${event.timestamp}`).set(locateData);
      return client.replyMessage(event.replyToken, [replyText1, replyText2, replyText3]);
    
    case 'text':
      if (event.message.text.includes('歳') || event.message.text.includes('才')) replyText1.text = phraseOld;
      else if (event.message.text.includes('好きなもの')) replyText1.text = phraseLike;
      else replyText1.text = phraseDef[ Math.floor( Math.random() * phraseDef.length ) ];
      const tweet = event.message.text.split(':');
      if (tweet.length === 2) {
        const tweetData = {
          tweet: tweet[1]
        };
        db.collection('locateTweet').doc(tweet[0]).set(tweetData, { merge: true });
        replyText1.text = `タイムスタンプ「${tweet[0]}」で呟いたよ`;
      }
      switch (event.message.text) {
        case '地図':
          replyText1.text = `地図が見たいの？はいどうぞ`;
          replyText2.text = map;
          return client.replyMessage(event.replyToken, [replyText1, replyText2]);
        case '使い方':
          replyText1.text = `どうすればいいか説明するよ。`;
          replyText2.text = `まず「map」って言ってくれたら地図を出してあげるから、それで呟きを残したい場所を選んで。`;
          replyText3.text = `そしたらお姉さんが秘密のコードを教えてあげるから、呟きたいことを教えてね。`;
          return client.replyMessage(event.replyToken, [replyText1, replyText2, replyText3]);
      }
      return client.replyMessage(event.replyToken, replyText1);
      
    default:
      return Promise.resolve(null);
  }

}

exports.app = functions.https.onRequest(app);