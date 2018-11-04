// ----------------------------------------------------------------------
// サーバー設定.
// ----------------------------------------------------------------------
var Util = require('./js/util.js');
var M_JOB_LIST = require('./js/constants/m_job_list.js');
console.log(M_JOB_LIST);
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
//特定のクライアントに送信.
//----------------------------------------------------------------------
function send(connection, eventName, sendData) {
	if (!connection) return;
	sendData.eventName = eventName;
	try {
		var json = JSON.stringify(sendData);
		//console.log(json);
		connection.send(json);
	} catch (e) {
		removeConnection(connection);
	}
}
//----------------------------------------------------------------------
// サーバー定期処理.
//----------------------------------------------------------------------
setInterval(function() {
	for (var i = 0; i < CON_LIST.length; i++) {
		var con = CON_LIST[i];
		send(con, "", );
	}
}, 1000);
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
