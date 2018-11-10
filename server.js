// ----------------------------------------------------------------------
// サーバー設定.
// ----------------------------------------------------------------------
var Util = require('./js/util.js');
var M_JOB_LIST = require('./js/constants/m_job_list.js');
var M_ITEM_LIST = require('./js/constants/m_item_list.js');
var M_BUILDING_LIST = require('./js/constants/m_building_list.js');
//console.log(M_JOB_LIST);
var WebSocketServer = require('ws').Server
	, http = require('http')
	, express = require('express')
	, app = express();
app.use(express.static(__dirname + '/'));
var server = http.createServer(app);
var wss = new WebSocketServer({server:server});
var CON_LIST = [];
var PLAYER_LIST = [];
// ----------------------------------------------------------------------
// ゲーム参加.
// ----------------------------------------------------------------------
function addGame(con, data) {
	console.log("addGame");
	var uuid = data.uuid;
	if (uuid === null) uuid = Util.generateUuid();
	console.log(uuid);
	console.log(data.userName);
	var isAdded = false;
	for (var i = 0; i < PLAYER_LIST.length; i++) {
		var tmp = PLAYER_LIST[i];
		if (tmp.uuid === uuid) {
			isAdded = true;
			tmp.name = data.userName;
			break;
		}
	}
	if (!isAdded) {
		var player = {
			uuid: uuid,
			name: data.userName,
			map: "", // TODO: 初期位置
			money: 100, // TODO: 初期資金
			itemList: []
		};
		PLAYER_LIST.push(player);
		console.log("player: " + player.name);
		send(con, "addGameCallback", {uuid: player.uuid});
	}
}
//----------------------------------------------------------------------
// 切断.
//----------------------------------------------------------------------
function removeConnection(connection) {
	for (var i = CON_LIST.length - 1; i >= 0; i--) {
		var tmp = CON_LIST[i];
		if (tmp === connection) {
			CON_LIST.splice(i, 1);
		}
	}
}
//----------------------------------------------------------------------
//特定のクライアントに送信.
//----------------------------------------------------------------------
function send(connection, eventName, sendData) {
	if (!connection) return;
	//console.log("send: " + eventName);
	sendData.eventName = eventName;
	try {
		var json = JSON.stringify(sendData);
		//console.log(json);
		connection.send(json);
	} catch (e) {
		console.log("send error");
		removeConnection(connection);
	}
}
//----------------------------------------------------------------------
// サーバー定期処理.
//----------------------------------------------------------------------
setInterval(function() {
	//console.log(CON_LIST.length);
	for (var i = 0; i < CON_LIST.length; i++) {
		var con = CON_LIST[i];
		var data = {
			playerList: PLAYER_LIST,
			mapList: M_JOB_LIST,
			itemList: M_ITEM_LIST,
			buildingList: M_BUILDING_LIST
		};
		send(con, "showGameInfo", data);
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
			addGame(connection, data);
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
