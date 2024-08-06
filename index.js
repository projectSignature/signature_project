const express = require('express');
const app = express();
const bodyParser = require('body-parser');  
const cors = require('cors'); 
const path = require('path');
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



server.listen(port, () => { // Listen on port 3000
    console.log(`Listening! in port: ${port}`); // Log when listen success
});


