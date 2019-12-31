# 安琪兒

一個娛樂眾人的聊天機器人

<img src="https://user-images.githubusercontent.com/18013815/71482307-ccf55380-283c-11ea-8f90-44c91be6063a.png" alt="demo image" height="400" border="0">

## 使用方法

加 **Line** 好友，然後可以加進群組和朋友一起玩

<a href="https://lin.ee/5Pn8ddF"><img src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png" alt="add line" height="36" border="0"></a>

加 **Telegram** 好友，然後可以加進群組和朋友一起玩

<a href="https://t.me/angel_tw_bot"><img src="https://raw.githubusercontent.com/tigercosmos/vocabulary-titan/master/img/start-telegram.png" alt="add telegram" height="36" border="0"></a>

## 展演

點擊圖片來播放 Youtube 展示

<a href="http://www.youtube.com/watch?feature=player_embedded&v=u4mPiIEad1g
" target="_blank"><img src="https://user-images.githubusercontent.com/18013815/71347265-f1cf9980-25a4-11ea-937b-2351cf8f48f6.png" 
alt="Youtube Preview" width="500" border="1" /></a>

## 說明

對機器人，或是在有機器人的群組，輸入「help」取得說明。

說明同下：

```text
輸入以下指令（括弧為縮寫指令）：
- 五子棋(/a)
- 猜數字(/g)：1A2B
- 猜數字2(/g2)：1A2B 強化版
- 劃圈圈(/c)：
  輪流劃掉圈圈
  每次劃掉連續直線的 1~3 個圈圈
  最後劃的人輸
  輸入方法為 "del xy xy xy"
  其中 xy 為座標，中間格一個空格。
  例如輸入 "del 33 44"、"del 11 12 13"。
- 比大小：2 個人輪流輸入「骰」來取得點數
- 比大小 N：
  N 為數字，N 個人輪流輸入「骰」來取得點數
- 抽：隨機出現圖片
- 抽正妹：隨機正妹
- 抽星座：隨機星運圖
- 抽美食：隨機美食
- BTS：隨機取得 BTS 照片
- /info：取得更多資訊
```

更多功能持續開發中，歡迎提交 issue 許願。

## 開發

```sh
git clone https://github.com/tigercosmos/angel.git
cd angel
npm install

npm start # run chatbot server
npm run console # run chatbot server in console mode

npm run image-server # run the image service for chatbot
```

## 授權

MIT
