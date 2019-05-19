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
var gameInfo = {
	turn: 1,
	endTurn: 30
};
/**
 * サーバー定期処理. 
 */
setInterval(function() {
	//console.log(CON_LIST.length);
	for (var i = 0; i < CON_LIST.length; i++) {
		var con = CON_LIST[i];
		var data = {
			gameInfo: gameInfo,
			playerList: PLAYER_LIST,
			jobList: M_JOB_LIST,
			itemList: M_ITEM_LIST,
			areaList: M_AREA_LIST,
			buildingList: M_BUILDING_LIST
		};
		send(con, "showGameInfo", data);
	}
}, 500);
/**
 * 切断.
 * @param {*} connection 
 */
function removeConnection(connection) {
	for (var i = CON_LIST.length - 1; i >= 0; i--) {
		var tmp = CON_LIST[i];
		if (tmp === connection) {
			CON_LIST.splice(i, 1);
		}
	}
}
/**
 * 特定のクライアントに送信.
 * @param {*} connection 
 * @param {*} eventName 
 * @param {*} sendData 
 */
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
/**
 * コネクション設定.
 */
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
		switch (eventName)
		{
			case "addGame":
				addGame(connection, data);
			break;
			
			case "turnProgress":
				turnProgress();
			break;

			case "moveArea":
				moveArea(data);
			break;

			case "changeJob":
				changeJob(data);
			break;

			case "buyItem":
				buyItem(data);
			break;

			case "useItem":
				useItem(data);
			break;

			case "buyBuild":
				buyBuild(data);
			break;

			case "restHotel":
				restHotel(data);
			break;
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

/**
 * ゲーム参加.
 * @param {*} con 
 * @param {*} data 
 */
function addGame(con, data) {
	console.log("addGame");
	var playerId = data.playerId;
	if (!playerId) playerId = Util.generateUuid();
	console.log(playerId);
	console.log(data.playerName);
	var player = getObjByList(PLAYER_LIST, "playerId", playerId);
	if (!player) {
		var player = {
			playerId: playerId,
			playerName: data.playerName,
			money: 100, // TODO: 初期資金
			map: "AR014", // TODO: 初期位置
			job: "JR000", // TODO: 初期職業
			team: null,
			itemList: [],
			params: {
				hp: 100,
				power: 0,
				intellect: 0,
				sense: 0,
				charm: 0,
				moral: 0
			}
		};
		PLAYER_LIST.push(player);
		console.log("player: " + player.playerName);
		send(con, "addGameCallback", {playerId: player.playerId});
	} else {
		player.playerName = data.playerName;
	}
}
/**
 * ターン経過.
 */
function turnProgress() {
	console.log("next turn.");

	// 各プレイヤーに収益処理・体力回復
	for (var i = 0; i < PLAYER_LIST.length; i++) {
		var player = PLAYER_LIST[i];
		// 給与
		var jobMaster = getObjByList(M_JOB_LIST, "rankId", player.job);
		// 物件収入
		income(player, jobMaster.money);

		// アイテム取得
		var jobItemList = getJobItemList(jobMaster.jobId);

		// 体力回復処理
		healHp(player, 2);
	}
	// ターン数増加
	gameInfo.turn ++;
}
/**
 * マップ移動.
 * @param {*} data 
 */
function moveArea(data) {
	console.log("move area.");
	console.log(data);
	var player = getObjByList(PLAYER_LIST, "playerId", data.playerId);

	// 移動処理
	var mapObject = getObjByList(M_AREA_LIST, "areaId", data.areaId);
	player.map = mapObject.areaId;
	player.params.hp -= 1;
}
/**
 * 転職.
 * @param {*} data 
 */
function changeJob(data) {
	console.log("change Job.");
	console.log(data);
	var player = getObjByList(PLAYER_LIST, "playerId", data.playerId);

	// 転職処理
	var jobObject = getObjByList(M_JOB_LIST, "rankId", data.rankId);
	player.job = jobObject.rankId;
}
/**
 * アイテム購入.
 * @param {*} data 
 */
function buyItem(data) {
	console.log("buyItem");
	console.log(data);
	var player = getObjByList(PLAYER_LIST, "playerId", data.playerId);

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
/**
 * アイテム使用.
 * @param {*} data 
 */
function useItem(data) {
	console.log("useItem");
	console.log(data);
	var player = getObjByList(PLAYER_LIST, "playerId", data.playerId);

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
function buyBuild(data) {
	console.log("buyBuild.");
	var player = getObjByList(PLAYER_LIST, "playerId", data.playerId);
	var area = getObjByList(M_AREA_LIST, "areaId", player.map);
	var build = getObjByList(M_BUILDING_LIST, "buildId", data.buildId);
	// 購入・買収チェック
	var buyCost = (!area.playerId || area.playerId === data.playerId) ? 1 : 3;
	// 金額チェック
	var canBuy = build.cost * buyCost <= player.money;
	// 建設条件チェック
	var canBuild = (build.population <= area.peo) && (build.security <= area.sec);
	// 全てのチェックがOKだったら購入
	if (canBuy && canBuild) {
		payment(player.money, build.cost * buyCost);
		area.playerId = data.playerId;
		area.buildId = data.buildId;
	} else {
		if (!canBuy) console.log("購入費用が不足しています。");
		if (!canBuild) console.log("施設設置条件を満たしていません。"); 
	}
}
function restHotel(data) {
	console.log("restHotel.");
	var player = getObjByList(PLAYER_LIST, "playerId", data.playerId);
	var area = getObjByList(M_AREA_LIST, "areaId", player.map);
	var build = getObjByList(M_BUILDING_LIST, "buildId", data.buildId);
	// 
}
/**
 * リスト内のオブジェクト取得.
 * @param {Array} list 検索対象リスト 
 * @param {String} keyName 検索するリスト情報の名称
 * @param {String} key 検索する値
 */
function getObjByList(list, keyName, key) {
	for (var i = 0; i < list.length; i++) {
		var tmp = list[i];
		if (tmp[keyName] === key) {
			return tmp;
		}
	}
	return null;
}
/**
 * 支払処理.
 * @param {Object} player 支払いをするプレイヤー
 * @param {Number} price 支払の数値
 */
function payment(player, price) {
	player.money -= price;
	console.log("payment: " + String(price) + ", result money:" + String(player.money));
}
/**
 * 収入処理.
 * @param {Object} player 収益を得るプレイヤー
 * @param {Number} price 収益の数値
 */
function income(player, price) {
	player.money += price;
	console.log("income: " + String(price) + ", result money:" + String(player.money));
}
/**
 * 対象のリストに登録されたクラスの数値を合計して返す.
 * @param {Array} list 対象のリスト
 * @param {String} sumClass 合計対象のリストの名称
 */
function sumListClass(list, sumClass) {
	var sumVal = 0;
	for (var i = 0, len = list.length; i < len; i++) {
		var tmp = list[i];
		sumVal += Number(tmp[sumClass]);
	}
	return sumVal;
}
/**
 * 体力回復処理.
 * @param {Object} player 体力が回復するプレイヤー
 * @param {Number} rest HPが回復する数値
 */
function healHp(player, rest) {
	var maxHp = 100;
	player.params.hp = (player.params.hp + rest < maxHp) ? player.params.hp + rest : maxHp;
}
/**
 * 2人のプレイヤーが同じチームかどうか真偽値を返す.
 * @param {Object} player1 比較対象のプレイヤー1
 * @param {Object} player2 比較対象のプレイヤー2
 */
function isSameTeam(player1, player2) {
	return true;
}
/*
ターン経過時にターン数増加・体力回復
土地購入・所有者表示
土地収益処理
増資処理
施設レベルアップ

ゲームクラス作成
ゲームクラスの登録
ゲームクラスの表示
*/

server.listen(8005);
