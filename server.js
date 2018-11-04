// ----------------------------------------------------------------------
// サーバー設定.
// ----------------------------------------------------------------------
var Util = require('./js/util.js');
var WebSocketServer = require('ws').Server
	, http = require('http')
	, express = require('express')
	, app = express();
app.use(express.static(__dirname + '/'));
var server = http.createServer(app);
var wss = new WebSocketServer({server:server});
var CON_LIST = [];
// ----------------------------------------------------------------------
// ゲーム参加.
// ----------------------------------------------------------------------
function addGame(data) {
	var uuid = Util.generateUuid();
	console.log(uuid);
	console.log(data.userName);
}
//----------------------------------------------------------------------
// 切断.
//----------------------------------------------------------------------
function removeConnection(connection) {
	for (var i = CON_LIST.length - 1; i >= 0; i--) {
		var tmp = CON_LIST[i];
		if (tmp === connection) {
			CON_LIST = CON_LIST.splice(i, 1);
		}
	}
}

//----------------------------------------------------------------------
// コネクション設定.
//----------------------------------------------------------------------
wss.on('connection', function(connection) {
	CON_LIST.push(connection);
	console.log('connected!');
	// ----------------------------------------------------------------------
	// メッセージ受信.
	// ----------------------------------------------------------------------
	connection.on('message', function(message) {
		console.log("message");
		var data = JSON.parse(message.toString());
		var eventName = data.eventName;
		if (eventName === "addGame") {
			addGame(data);
		}
	});
	// ----------------------------------------------------------------------
	// 切断.
	// ----------------------------------------------------------------------
	connection.on('close', function() {
		console.log('disconnected...');
		removeConnection(connection);
	});
});
server.listen(8005);
