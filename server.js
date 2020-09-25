// server.js
// where your node app starts
// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongouri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.MONGOHOST;
const app = express();
app.use(bodyParser.urlencoded({extended: true}));


app.post('/save', function(req, res){
  let received = '';
  req.setEncoding('utf8');
  // 読み込まれたデータを'data'イベント発生ごとに格納して連結する
  req.on('data', function(chunk) {
    received += chunk;
  });
  req.on('end', function() {
    MongoClient.connect(mongouri, function(error, client) {
      const db = client.db(process.env.DB); // 対象 DB
      const colUser = db.collection('users'); // 対象コレクション
      const user = JSON.parse(received); // 保存対象
      colUser.insertOne(user, function(err, result) {
        res.sendStatus(200); // HTTP ステータスコード返却
        client.close(); // DB を閉じる
      });
    });
  });
});


app.get('/save', function(req, res){
  MongoClient.connect(mongouri, function(error, client) {
    const db = client.db(process.env.DB); // 対象 DB
    const colUser = db.collection('users'); // 対象コレクション
    const user = {name: '花田', age:23}; // 保存対象
    colUser.insertOne(user, function(err, result) {
      res.sendStatus(200); // HTTP ステータスコード返却
      client.close(); // DB を閉じる
    });
  });
});


app.get('/find', function(req, res){
  MongoClient.connect(mongouri, function(error, client) {
    const db = client.db(process.env.DB); // 対象 DB
    const colUser = db.collection('users'); // 対象コレクション
    const condition = {}; // 検索条件（全件取得） ここに{name:{$eq:'山田'}}みたいにいれる
    colUser.find(condition).toArray(function(err, users) {
      res.json(users); // JSON 形式で画面に返す
      client.close(); // DB を閉じる
    });
  });
});


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// 第 1 引数のパスに POST リクエストがあれば第 2 引数の関数を実行する
app.post('/post1', function(request, response) {
  response.send('受け取った値は：' + request.body.param1);
});


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
