$(function() {
	// ----------------------------------------------------------------------
	// クライアントの処理を扱うクラス.
	// ----------------------------------------------------------------------
	function Client() {
		// 通信用オブジェクト
		var host = "153.126.204.61";
		//var host = "localhost";
		this.ws = new WebSocket('ws://' + host + ':8005/');
		// イベント設定
		this.setEvent();
	}
	// ----------------------------------------------------------------------
	// 送信処理.
	// ----------------------------------------------------------------------
	Client.prototype.send = function(eventName, sendData) {
		console.log("send: " + eventName);
		sendData.eventName = eventName;
		this.ws.send(JSON.stringify(sendData));
	};

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
		$('#userName').val(localStorage.getItem("playerName") || "");
		$('#addGame').click(function() {
			var data = {};
			data.playerName = $('#userName').val();
			data.playerId = localStorage.getItem("playerId");
			self.send("addGame", data);
			localStorage.setItem("playerName", data.playerName);
		});
		// ターン経過
		$('#turnProgress').on("click", function() {
			var data = {};
			self.send("turnProgress", data);
		});
		// 移動
		$('#areaList').on("click", "tr", function() {
			console.log("areaList click");
			console.log(this);
			var playerId = localStorage.getItem("playerId");
			if (!playerId) return false;
			self.send("moveArea", {
				playerId: playerId,
				areaId: $(this).data("id")
			});
		});
		// 転職
		$('#jobList').on("click", "tr", function() {
			console.log("itemList click");
			console.log(this);
			var playerId = localStorage.getItem("playerId");
			if (!playerId) return false;
			self.send("changeJob", {
				playerId: playerId,
				rankId: $(this).data("id")
			});
		});
		// アイテム購入
		$('#itemList').on("click", "tr", function() {
			console.log("itemList click");
			console.log(this);
			var playerId = localStorage.getItem("playerId");
			if (!playerId) return false;
			self.send("buyItem", {
				playerId: playerId,
				itemId: $(this).data("id"),
				count: 1
			});
		});
		// アイテム使用
		$('#useItem').click(function() {
			console.log("useItem click");
			var playerId = localStorage.getItem("playerId");
			if (!playerId) return false;
			self.send("useItem", {
				playerId: playerId,
				itemId: $('#itemId').val()
			});
		});
		// 土地購入（施設建設）
		$('#buyBuild').click(function() {
			console.log("buyBuild click");
			var build = getBuildInfo();
			// 持ち主がいなければ、通常購入
			// 持ち主がいれば、3倍価格で買収
		});
		// 施設利用
		$('#useBuild').click(function() {
			console.log("useBuild click");
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
				// ターン数表示
				self.showGameInfo(data.gameInfo);
				// プレイヤー一覧表示
				self.showObjList(data.playerList, "playerList");
				// マップ一覧表示
				self.showObjList(data.areaList, "areaList", "areaId");
				// 職業一覧表示
				self.showObjList(data.jobList, "jobList", "rankId");
				// アイテム一覧表示
				self.showObjList(data.itemList, "itemList", "itemId");
				// 建物一覧表示
				self.showObjList(data.buildingList, "buildingList", "buildId");
			} else if (eventName === "addGameCallback") {
				localStorage.setItem("playerId", data.playerId);
				console.log("addGameCallback: " + data.playerId);
			}
		};
	};
	// ----------------------------------------------------------------------
	// 情報一覧表示.
	// ----------------------------------------------------------------------
	Client.prototype.showObjList = function(objList, tableId, idKey) {
		var self = this;
		// 前回の描画情報を保持し、変更があった場合のみ再描画する
		var json = JSON.stringify(objList);
		if (self["pre_" + tableId] === json) return;

		console.log("showObjList");
		self["pre_" + tableId] = json;
		var tag = "";
		for (var i = 0; i < objList.length; i++) {
			var obj = objList[i];
			var keys = Object.keys(obj);
			var values = [];
			for (var j = 0; j < keys.length; j++) {
				var key = keys[j];
				values.push(obj[key]);
			}
			tag += self.convertTrTd(values, obj[idKey]);
		}
		$("#" + tableId).empty().append($(tag));
	};
	//----------------------------------------------------------------------
	// 値リストをテーブル行表示用タグに変換.
	//----------------------------------------------------------------------
	Client.prototype.convertTrTd = function(values, id) {
		var tag = '<tr data-id="' + id + '">';
		for (var i = 0; i < values.length; i++) {
			var value = values[i];
			if (typeof(value) === "object") {
				value = JSON.stringify(value);
			}
			tag += "<td>" + value + "</td>";
		}
		tag += "</tr>";
		return tag;
	};
	//----------------------------------------------------------------------
	// ゲーム情報を表示.
	//----------------------------------------------------------------------
	Client.prototype.showGameInfo = function(gameInfo) {
		var self = this;
		// 前回の描画情報を保持し、変更があった場合のみ再描画する
		var json = JSON.stringify(gameInfo);
		if (self["pre_gameInfo"] === json) return;

		self["pre_gameInfo"] = json;
		var text = "";
		// ターン数表示
		text = gameInfo.turn;
		$("#turn").text(text);
	}
		new Client();
});
