// ----------------------------------------------------------------------
// サーバー設定.
// ----------------------------------------------------------------------
var Util = require('./js/util.js');
var M_JOB_LIST = require('./js/constants/m_job_list.js');
var M_ITEM_LIST = require('./js/constants/m_item_list.js');
var M_BUILDING_LIST = require('./js/constants/m_building_list.js');
var M_AREA_LIST = require('./js/constants/m_area_list.js');
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
//----------------------------------------------------------------------
//サーバー定期処理.
//----------------------------------------------------------------------
setInterval(function() {
	//console.log(CON_LIST.length);
	for (var i = 0; i < CON_LIST.length; i++) {
		var con = CON_LIST[i];
		var data = {
			playerList: PLAYER_LIST,
			jobList: M_JOB_LIST,
			itemList: M_ITEM_LIST,
			buildingList: M_BUILDING_LIST
		};
		send(con, "showGameInfo", data);
	}
}, 500);
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
// 特定のクライアントに送信.
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
		} else if (eventName === "turnProgress") {
			turnProgress();
		} else if (eventName === "moveArea") {
			moveArea(data);
		} else if (eventName === "changeJob") {
			changeJob(data);
		} else if (eventName === "buyItem") {
			buyItem(data);
		} else if (eventName === "useItem") {
			useItem(data);
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

// ----------------------------------------------------------------------
// ゲーム参加.
// ----------------------------------------------------------------------
function addGame(con, data) {
	console.log("addGame");
	var uuid = data.uuid;
	if (uuid === null) uuid = Util.generateUuid();
	console.log(uuid);
	console.log(data.userName);
	var player = getObjByList(PLAYER_LIST, "uuid", uuid);
	if (!player) {
		var player = {
			uuid: uuid,
			name: data.userName,
			map: "", // TODO: 初期位置
			money: 100, // TODO: 初期資金
			job: "JR000", // TODO: 初期職業
			itemList: [],
			params: {
				hp: 100,
				intel: 0,
				charm: 0,
				power: 0,
				sense: 0
			}
		};
		PLAYER_LIST.push(player);
		console.log("player: " + player.name);
		send(con, "addGameCallback", {uuid: player.uuid});
	} else {
		player.name = data.userName;
	}
}
//----------------------------------------------------------------------
// ターン経過.
//----------------------------------------------------------------------
function turnProgress() {
	console.log("next turn.");

	// 各プレイヤーに収益処理
	for (var i = 0; i < PLAYER_LIST.length; i++) {
		var player = PLAYER_LIST[i];
		// 給与
		var jobMaster = getObjByList(M_JOB_LIST, "rankId", player.job);
		income(player.uuid, jobMaster.money);
		// 物件収入
	}
}
//----------------------------------------------------------------------
// マップ移動.
//----------------------------------------------------------------------
function moveArea(data) {
	console.log("move area.");
	console.log(data);
	var player = getObjByList(PLAYER_LIST, "uuid", data.uuid);

	// 移動処理
	var mapObject = getObjByList(M_AREA_LIST, "areaId", data.areaId);
	player.map = mapObject.areaId;
}
//----------------------------------------------------------------------
// 転職.
//----------------------------------------------------------------------
function changeJob(data) {
	console.log("change Job.");
	console.log(data);
	var player = getObjByList(PLAYER_LIST, "uuid", data.uuid);

	// 転職処理
	var jobObject = getObjByList(M_JOB_LIST, "rankId", data.rankId);
	player.job = jobObject.rankId;
}
//----------------------------------------------------------------------
// アイテム購入.
//----------------------------------------------------------------------
function buyItem(data) {
	console.log("buyItem");
	console.log(data);
	var player = getObjByList(PLAYER_LIST, "uuid", data.uuid);

	// 支払い処理
	var itemMaster = getObjByList(M_ITEM_LIST, "itemId", data.itemId);
	payment(player, itemMaster.price * data.count);

	// 所持数変更処理
	var isExist = false;
	for (var i = 0; i < player.itemList.length; i++) {
		var item = player.itemList[i];
		if (item.itemId === data.itemId) {
			item.count += data.count;
			isExist = true;
			break;
		}
	}
	// 持っていないアイテムの場合、新規追加
	if (!isExist) {
		var item = {
			itemId: data.itemId,
			count: data.count
		};
		player.itemList.push(item);
	}
}
//----------------------------------------------------------------------
// アイテム使用.
//----------------------------------------------------------------------
function useItem(data) {
	console.log("useItem");
	console.log(data);
	var player = getObjByList(PLAYER_LIST, "uuid", data.uuid);

	// 所持数変更処理
	var isExist = false;
	for (var i = 0; i < player.itemList.length; i++) {
		var item = player.itemList[i];
		if (item.itemId === data.itemId) {
			item.count -= 1;
			isExist = true;
			break;
		}
	}
	if (isExist) {
		var itemMaster = getObjByList(M_ITEM_LIST, "itemId", data.itemId);
		var efficacyKeys = Object.keys(itemMaster.efficacy);
		for (var i = 0; i < efficacyKeys.length; i++) {
			var key = efficacyKeys[i];
			player.params[key] += itemMaster.efficacy[key];
		}
	}
}
//----------------------------------------------------------------------
// リスト内のオブジェクト取得.
//----------------------------------------------------------------------
function getObjByList(list, keyName, key) {
	for (var i = 0; i < list.length; i++) {
		var tmp = list[i];
		if (tmp[keyName] === key) {
			return tmp;
		}
	}
	return null;
}
//----------------------------------------------------------------------
// 支払処理.
//----------------------------------------------------------------------
function payment(player, price) {
	console.log("payment: " + String(price));
	player.money -= price;
}
//----------------------------------------------------------------------
// 収入処理.
//----------------------------------------------------------------------
function income(player, price) {
	console.log("income: " + String(price));
	player.money += price;
}


server.listen(8005);
