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
// ----------------------------------------------------------------------
// イベント処理.
// ----------------------------------------------------------------------
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
	var player = getObjectByList(PLAYER_LIST, "playerId", playerId);
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
 * 各プレイヤ : money +物件収入 & hp +2
 * ターン数: +1
 */
function turnProgress() {
	console.log("next turn.");

	// 各プレイヤーに収益処理・体力回復
	for (var i = 0; i < PLAYER_LIST.length; i++) {
		var player = PLAYER_LIST[i];
		// 物件収入
		var incomeByBuilds = sumIncomeByBuilds(player);
		player.money = fluctuationParamByInteger(player.money, incomeByBuilds, "money");
		// 給与
		incomeByJob(player);
		// 体力回復処理
		player.params.hp = fluctuationParamByInteger(player.params.hp, 2, "hp");
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
	var player = getObjectByList(PLAYER_LIST, "playerId", data.playerId);

	// 移動処理
	var mapObject = getObjectByList(M_AREA_LIST, "areaId", data.areaId);
	player.map = mapObject.areaId;
	player.params.hp = fluctuationParamByInteger(player.params.hp, -1, "hp");
}
/**
 * 転職.
 * @param {*} data 
 */
function changeJob(data) {
	console.log("change Job.");
	console.log(data);
	var player = getObjectByList(PLAYER_LIST, "playerId", data.playerId);

	// 転職処理
	var jobObject = getObjectByList(M_JOB_LIST, "rankId", data.rankId);
	player.job = jobObject.rankId;
}
/**
 * アイテム購入.
 * @param {*} data 
 */
function buyItem(data) {
	console.log("buyItem");
	console.log(data);
	var player = getObjectByList(PLAYER_LIST, "playerId", data.playerId);
	var item = getObjectByList(M_ITEM_LIST, "itemId", data.itemId);
	var area = getObjectByList(M_AREA_LIST, "areaId", player.map);

	// 支払い処理
	var areaBonus = (player.map === area.playerId) ? 2 : 1;
	var price = (item.price / areaBonus) * data.count;
	player.money = fluctuationParamByInteger(player.money, price, "money");

	// 所持数変更処理
	var isExist = fluctuationItem(player.itemList, data.itemId, data.count);
}
/**
 * アイテム売却.
 * @param {*} data 
 */
function saleItem(data) {
	console.log("sellItem");
	console.log(data);
	var player = getObjectByList(PLAYER_LIST, "playerId", data.playerId);
	var item = getObjectByList(M_ITEM_LIST, "itemId", data.itemId);
	var area = getObjectByList(M_AREA_LIST, "areaId", player.map);

	// 収入処理
	var areaBonus = (player.map === area.playerId) ? 2 : 1;
	var price = ((item.price / 2) * areaBonus) * data.count;
	player.money = fluctuationParamByInteger(player.money, price, "money");

	// 所持数変更処理
	fluctuationItem(player.itemList, data.itemId, data.count);
}
/**
 * アイテム使用.
 * @param {*} data 
 */
function useItem(data) {
	console.log("useItem");
	console.log(data);
	var player = getObjectByList(PLAYER_LIST, "playerId", data.playerId);

	// 所持数変更処理
	var isExist = fluctuationItem(player.itemList, data.itemId, -1);
	// アイテムの効果発動
	if (isExist) {
		var itemMaster = getObjectByList(M_ITEM_LIST, "itemId", data.itemId);
		var efficacyKeys = Object.keys(itemMaster.efficacy);
		for (var i = 0; i < efficacyKeys.length; i++) {
			var key = efficacyKeys[i];
			player.params[key] += itemMaster.efficacy[key];
		}
	}
}
/**
 * 物件購入.
 * @param {*} data 
 */
function buyBuild(data) {
	console.log("buyBuild.");
	var player = getObjectByList(PLAYER_LIST, "playerId", data.playerId);
	var area = getObjectByList(M_AREA_LIST, "areaId", player.map);
	var build = getObjectByList(M_BUILDING_LIST, "buildId", data.buildId);

	// 購入・買収チェック
	var buyCost = (!area.playerId || area.playerId === data.playerId) ? 1 : 3;
	// 金額チェック
	var canBuy = build.cost * buyCost <= player.money;
	// 建設条件チェック
	var canBuild = (build.population <= area.population) && (build.security <= area.security);

	// 全てのチェックがOKだったら購入
	if (canBuy && canBuild) {
		player.money = fluctuationParamByInteger(player.money, (build.cost * buyCost), "money");
		area.playerId = data.playerId;
		area.buildId = data.buildId;
	} else {
		if (!canBuy) console.log("購入費用が不足しています。");
		if (!canBuild) console.log("施設設置条件を満たしていません。"); 
	}
}
/**
 * 宿泊施設利用処理.
 * @param {*} data 
 */
function restHotel(data) {
	console.log("restHotel.");
	var player = getObjectByList(PLAYER_LIST, "playerId", data.playerId);
	var area = getObjectByList(M_AREA_LIST, "areaId", player.map);
	var build = getObjectByList(M_BUILDING_LIST, "buildId", data.buildId);
	// 回復処理
	player.params.hp = fluctuationParamByInteger(player.params.hp, 20, "hp");
}
/**
 * 物件収入合計値計算.
 * @param {Object} player 対象のプレイヤーオブジェクト
 * @returns 収入合計数値
 */
function sumIncomeByBuilds(player) {
	var haveArea = getObjectsByList(M_AREA_LIST, "playerId", player.playerId);

	// 所有する物件の収入を合計
	var income = 0;
	for (var i in haveArea) {
		var area = haveArea[i];
		income += (area.buildId * area.level);
	}
	return income;
}
/**
 * 給与（お金＋アイテム取得）.
 * @param {Object} player 対象のプレイヤーオブジェクト 
 */
function incomeByJob(player) {
	console.log(player.job);
	var jobInfo = getObjectByList(M_JOB_LIST, "rankId", player.job);

	// 所持金加算
	console.log(jobInfo);
	player.money = fluctuationParamByInteger(player.money, jobInfo.money, "money");

	// アイテム取得
	var jobItemList = getObjectsByList(M_ITEM_LIST, "classId", jobInfo.classId);
	if (0 < jobItemList.length) {
		var randomNum1 = Math.floor(Math.random() * jobItemList.length);
		fluctuationItem(player.itemList, jobItemList[randomNum1].itemId, 1);
		if (player.classId === "JB040") {
			var randomNum2 = NaN;
			do {
				randomNum2 = Math.floor(Math.random() * jobItemList.length);
			} while (randomNum1 === randomNum2);
			fluctuationItem(player.itemList, jobItemList[randomNum2].itemId, 1);		
		}
	}
}
// ----------------------------------------------------------------------
// 共通処理.
// ----------------------------------------------------------------------
/**
 * リスト内のオブジェクトを取得.
 * @param {Array} list 検索対象リスト 
 * @param {String} className 検索対象リストのクラス名
 * @param {String} key 検索する値
 * @returns {Object} 検索結果
 */
function getObjectByList(list, className, key) {
	for (var i = 0; i < list.length; i++) {
		var tmp = list[i];
		if (tmp[className] === key) {
			return tmp;
		}
	}
	return null;
}
/**
 * リスト内のオブジェクトをリストで取得.
 * @param {Array} list 検索対象リスト 
 * @param {String} className 検索対象リストのクラス名
 * @param {String} key 検索する値
 * @returns {Array} 検索結果
 */
function getObjectsByList(list, className, key) {
	var resultList = [];
	for (var i = 0; i < list.length; i++) {
		var tmp = list[i];
		if (tmp[className] === key) {
			resultList.push(tmp);
		}
	}
	return resultList;
}
/**
 * 対象の数値を増減させる.
 * @param {Number} target 数値を増減させる対象
 * @param {Number} int 増減値
 * @param {String} type 対象の内容（param, item, level, build, hp）
 * @return {Number} target + int の結果
 */
function fluctuationParamByInteger(target, int, type) {
	// 基準値設定（多用される type === "param" を使用）
	var max = NaN;
	var min = NaN;
	if (type === "param") max = 999, min = 0;
	else if (type === "item") max = 10, min = 0;
	else if (type === "level") max = 5, min = 1;
	else if (type === "build") max = 99999;
	else if (type === "hp") max = 100;

	// 増減処理
	var result = Number(target) + Number(int);
	if (max < result) result = max;
	else if (result < min) result = min;

	console.log("type: " + type + ", before: " + Number(target) + ", after: " + result + ", integer: " + Number(int));
	return result;
}
/**
 * 所持アイテム増減処理.
 * @param {Array} itemList 対象プレイヤーのアイテムリスト
 * @param {String} itemId 増減対象のアイテムID
 * @param {Number} int 増減個数 
 * @returns {Boolean} 増減処理の実施可否
 */
function fluctuationItem (itemList, itemId, int) {
	if (int === 0) return false;
	var targetItem = getObjectByList(itemList, "itemId", itemId);

	// すでに所有済みのアイテムを増減させる
	if (targetItem) {
		console.log("change itemCount By player's itemList.");
		// 増加処理の場合、所持数を上回る数の増加は受け付けない
		if (0 < int && 10 < targetItem.count + int) return false;
		// 減少処理の場合、所持数未満の減少を受け付けない
		else if (int < 0 && targetItem.count + int < 0) return false;

		targetItem.count += int;

		// アイテム数が0になった場合、アイテムリストから対象を削除
		if (targetItem.count === 0) {
			console.log("delete item By player's itemList.");
			for (var i in itemList) {
				if (itemList[i].itemId === targetItem.itemId) itemList.splice(i, 1);
			}
		}
		return true;
	}

	// 持っていないアイテムの増加処理の場合、新規追加
	else if (!targetItem && 0 < int) {
		console.log("add item By player's itemList.");
		console.log(itemId);
		var item = {
			itemId: itemId,
			count: int
		};
		itemList.push(item);
		return true;		
	}
	return false;
}
/**
 * 2人のプレイヤーが同じチームかどうか真偽値を返す.
 * @param {Object} player1 比較対象のプレイヤー1
 * @param {Object} player2 比較対象のプレイヤー2
 */
function isSameTeam(player1, player2) {
	return true;
}
/**
 * 対象のリストに登録されたクラスの数値を合計して返す.
 * @param {Array} list 対象のリスト
 * @param {String} sumClass 合計対象のリストの名称
 */
function sumListClassValue(list, sumClass) {
	var sumVal = 0;
	for (var i = 0, len = list.length; i < len; i++) {
		var tmp = list[i];
		sumVal += Number(tmp[sumClass]);
	}
	return sumVal;
}
/*
土地購入・所有者表示
土地収益処理
増資処理
施設レベルアップ
*/

server.listen(8005);
