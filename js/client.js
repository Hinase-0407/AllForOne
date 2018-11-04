$(function() {
	// ----------------------------------------------------------------------
	// クライアントの処理を扱うクラス.
	// ----------------------------------------------------------------------
	function Client() {
		// 通信用オブジェクト
		//var host = "153.126.204.61";
		var host = "localhost";
		this.ws = new WebSocket('ws://' + host + ':8005/');
		// イベント設定
		this.setEvent();
	}
	
	// ----------------------------------------------------------------------
	// イベント設定.
	// ----------------------------------------------------------------------
	Client.prototype.setEvent = function() {
		var self = this;
		self.setClientEvent();
		self.setServerEvent();
	};
	// ----------------------------------------------------------------------
	// イベント設定（クライアント）.
	// ----------------------------------------------------------------------
	Client.prototype.setClientEvent = function() {
		var self = this;
		// ゲーム参加.
		$('#addGame').click(function() {
			var data = {};
			data.userName = $('#userName').val();
			self.send("addGame", data);
		});
	};
	// ----------------------------------------------------------------------
	// イベント設定（サーバー）.
	// ----------------------------------------------------------------------
	Client.prototype.setServerEvent = function() {
		var self = this;
		self.ws.onmessage = function (event) {
			var data = JSON.parse(event.data);
			var eventName = data.eventName;
			//console.log(eventName)
			if (eventName === "showGameInfo") {
				// マップ一覧表示
				self.showObjList(data.mapList, "mapList");
				// アイテム一覧表示
				self.showObjList(data.itemList, "itemList");
				// 建物一覧表示
				self.showObjList(data.buildingList, "buildingList");
			}
		};
	};
	// ----------------------------------------------------------------------
	// 送信処理.
	// ----------------------------------------------------------------------
	Client.prototype.send = function(eventName, sendData) {
		console.log("send: " + eventName);
		sendData.eventName = eventName;
		this.ws.send(JSON.stringify(sendData));
	};
	//----------------------------------------------------------------------
	// 値リストをテーブル行表示用タグに変換.
	//----------------------------------------------------------------------
	Client.prototype.convertTrTd = function(values) {
		var tag = "<tr>";
		for (var i = 0; i < values.length; i++) {
			tag += "<td>" + values[i] + "</td>";
		}
		tag += "</tr>";
		return tag;
	};
	// ----------------------------------------------------------------------
	// マップ一覧表示.
	// ----------------------------------------------------------------------
	Client.prototype.showObjList = function(objList, tableId) {
		var self = this;
		// 前回の描画情報を保持し、変更があった場合のみ再描画する
		var json = JSON.stringify(objList);
		if (self.preObjList === json) return;
		console.log("showObjList");
		self.preObjList = json;
		var tag = "";
		for (var i = 0; i < objList.length; i++) {
			var obj = objList[i];
			var keys = Object.keys(obj);
			var values = [];
			for (var j = 0; j < keys.length; j++) {
				var key = keys[j];
				values.push(obj[key]);
			}
			tag += self.convertTrTd(values);
		}
		$("#" + tableId).empty().append($(tag));
	};
	new Client();
});
