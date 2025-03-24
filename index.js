const express = require('express');
const app = express();
const bodyParser = require('body-parser');  
const cors = require('cors'); 
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const port = process.env.PORT || 3000;;
var rout = require('./routs/Routes');
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));

// WebSocket関連のモジュールを追加
const WebSocket = require('ws');
const http = require('http');
const server = http.createServer(app); // Expressアプリを使ってHTTPサーバーを作成

// WebSocketサーバーの設定
const wss = new WebSocket.Server({ server });
const Message = require('./schema/chat/Message');
const { Op } = require('sequelize');

// WebSocketのイベントハンドリング
wss.on('connection', ws => {
    ws.on('message', async message => {
        try {
            const parsedMessage = JSON.parse(message);
            console.log(parsedMessage.content);

            // メッセージをデータベースに保存するロジック
            const newMessage = await Message.create({
                sender_id: parsedMessage.sender_id,  // 1（自分）か2（友達）
                receiver_id: parsedMessage.receiver_id,
                content: parsedMessage.content,
                timestamp: new Date()
            });

            // メッセージを他のクライアントにブロードキャスト
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(newMessage));
                }
            });
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
});

app.get('/chat/history/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender_id: userId },
                    { receiver_id: userId }
                ]
            },
            order: [['timestamp', 'ASC']]
        });

        res.json(messages);
    } catch (err) {
        console.error('Error fetching chat history:', err);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});


app.use(cors()); 

 app.use(bodyParser.json()); 
 // Express modules / packages 

 app.use(bodyParser.urlencoded({ extended: true })); 
 // Express modules / packages 

 app.use('/', rout);
app.use('/ejs', rout);
 app.use('/member', rout);
 app.use('/mailer', rout);
 app.use('/img', rout);
 app.use('/pdf', rout);
app.use('/list', rout);
app.use('/listUpdate', rout);
app.use('/listDelete', rout);
app.use('/calender', rout);
app.use('/calenderteste', rout);
app.use('/calender/entrance', rout);
app.use('/registerEntrance', rout);
app.use('/pass', rout);
app.use('/planget', rout);
app.use('/lesson_after/:id', rout);

//const signupRouter = require('./routs/noauth/signup.router.js');
const signinRouter = require('./routs/noauth/signin.router.js');
app.use('/noauth', signinRouter)
//, signinRouter

// //kengo system////////////////////////
app.post('/processar', async (req, res) => {
  const termos = req.body.termos;
  if (!termos || !Array.isArray(termos)) {
    return res.status(400).json({ error: 'termosが必要です' });
  }

  // 件数制限チェック（最大10件まで）
  if (termos.length > 10) {
    return res.status(400).json({ error: '最大10件までしか処理できません' });
  }

  const results = {};

  for (let termo of termos) {
    const encodedTerm = encodeURIComponent(termo);

    // sold検索URL
    const urlSold = `https://www.ebay.com/sch/31387/i.html?_nkw=${encodedTerm}&LH_Complete=1&LH_Sold=1&LH_ItemCondition=3000&LH_PrefLoc=2`;
    console.log(urlSold);

    // all（出品中）検索URL
    const urlAll = `https://www.ebay.com/sch/31387/i.html?_nkw=${encodedTerm}&LH_ItemCondition=3000&LH_PrefLoc=2&_sop=10&_blrs=category_constraint&_blrs=spell_auto_correct`;
    console.log(urlAll);

    try {
      const headers = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      };

      // sold数取得
      const soldRes = await axios.get(urlSold, headers);
      const $sold = cheerio.load(soldRes.data);
      const soldText = $sold('h1.srp-controls__count-heading span.BOLD').eq(1).text();
      const sold = parseInt(soldText.replace(/,/g, ''), 10) || 0;

      // all数取得
      const allRes = await axios.get(urlAll, headers);
      const $all = cheerio.load(allRes.data);
      const allText = $all('h1.srp-controls__count-heading span.BOLD').eq(1).text();
      const all = parseInt(allText.replace(/,/g, ''), 10) || 0;

      results[termo] = { sold, all };
    } catch (err) {
      results[termo] = { error: err.message };
    }
  }

  res.json(results);
});




server.listen(port, () => { // Listen on port 3000
    console.log(`Listening! in port: ${port}`); // Log when listen success
});


