'use strict';

const functions = require('firebase-functions');
const express = require('express');
const line = require('@line/bot-sdk');

const phraseBegin = ['友達登録ありがとう。', '私は今あなたがいる場所に呟きを残すことができるよ。', 'むふふ、すごいでしょ～。'];
const phraseDef = [ 'んー、お姉さん難しいことわかんないなー', '君は面白いことを言うね', 'いいんだよ？たまには褒めてくれても',
              'いやー、君も飽きないね', 'どうやら楽しんでくれてるようで、お姉さんも嬉しいな', '安心してくれたまえよ君、明日は晴れだよ。たぶん'];
const phraseOld = 'いいかい？私はかわいい。ならそれだけでいいじゃないか、ね？';
const phraseLike = 'ん？好きなもの？それはもちろんキミニキマッテルジャナイカー';
const phraseHotouse = ['どうすればいいか説明するよ。', 'つぶやきたいときは「つぶやきを残す」をタップしてフォームから記入してね。', '地図が見たいときは下のメニューから「地図を見る」をタップすると見れるよ。'];

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
          buildReplyText(phraseBegin[0]),
          buildReplyText(phraseBegin[1]),
          buildReplyText(phraseBegin[2])
        ]);
  }

  // switch of messages
  switch (event.message.type) {
    case 'text':
      if (event.message.text.includes('歳') || event.message.text.includes('才')) {
        return client.replyMessage(event.replyToken, buildReplyText(phraseOld));
      }
      else if (event.message.text.includes('好きなもの')) {
        return client.replyMessage(event.replyToken, buildReplyText(phraseLike));
      }
      else if (event.message.text.includes('使い方')) {
        return client.replyMessage(event.replyToken, [
          buildReplyText(phraseHotouse[0]),
          buildReplyText(phraseHotouse[1]),
          buildReplyText(phraseHotouse[2])
        ]);
      }
      else {
        return client.replyMessage(event.replyToken, buildReplyText(phraseDef[ Math.floor( Math.random() * phraseDef.length )]));
      }
    default:
      return Promise.resolve(null);
  }

}

exports.app = functions.https.onRequest(app);