# はじめに
このレポジトリはLINE Bot「コンパスパンダ」のソースコードが保管されています。

# コンパスパンダについて
コンパスパンダは**その時・その場所**で思ったみんなの**呟き**を残すためのLINE Botサービスです。  

![img](./assets/イメージ図.png "イメージ図")

このようにしてみんなの呟きが地図の上に現れることで、一つの地図アプリになっていきます。そして、後からその地域にやってくる人を案内するための**コンパス**が完成されていきます。

# LINE Botについて
絵が完成したらのせる

# 技術的なお話
LINE Botの開発にはLINE株式会社が提供する[Messaging API](https://developers.line.biz/ja/services/messaging-api/)と[line-bot-sdk-nodejs](https://github.com/line/line-bot-sdk-nodejs)を使いました。また、LINEのトーク画面上に現れる**フォーム画面**と**地図**は[LIFF](https://developers.line.biz/ja/docs/liff/overview/)という仕組みが用いられています。フォーム画面のソースコードは[ここ](https://github.com/ufoo68/compassPandaForm)に、地図表示のソースコードは[ここ](https://github.com/ufoo68/compass-panda-leaflet)に保管されています。  