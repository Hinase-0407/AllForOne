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
		$('#userName').val(localStorage.getItem("userName") || "");
		$('#addGame').click(function() {
			var data = {};
			data.userName = $('#userName').val();
			data.uuid = localStorage.getItem("uuid");
			self.send("addGame", data);
			localStorage.setItem("userName", data.userName);
		});
		// ターン経過
		$('#turnProgress').on("click", function() {
			var data = {};
			self.send("turnProgress", data);
		});
		// 転職
		$('#jobList').on("click", "tr", function() {
			console.log("itemList click");
			console.log(this);
			var uuid = localStorage.getItem("uuid");
			if (!uuid) return false;
			self.send("changeJob", {
				uuid: uuid,
				rankId: $(this).data("id")
			});
		});
		// アイテム購入
		$('#itemList').on("click", "tr", function() {
			console.log("itemList click");
			console.log(this);
			var uuid = localStorage.getItem("uuid");
			if (!uuid) return false;
			self.send("buyItem", {
				uuid: uuid,
				itemId: $(this).data("id"),
				count: 1
			});
		});
		// アイテム使用
		$('#useItem').click(function() {
			console.log("useItem click");
			var uuid = localStorage.getItem("uuid");
			if (!uuid) return false;
			self.send("useItem", {
				uuid: uuid,
				itemId: $('#itemId').val()
			});
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
				// プレイヤー一覧表示
				self.showObjList(data.playerList, "playerList");
				// マップ一覧表示
				self.showObjList(data.jobList, "jobList", "rankId");
				// アイテム一覧表示
				self.showObjList(data.itemList, "itemList", "itemId");
				// 建物一覧表示
				self.showObjList(data.buildingList, "buildingList", "buildId");
			} else if (eventName === "addGameCallback") {
				localStorage.setItem("uuid", data.uuid);
				console.log("addGameCallback: " + data.uuid);
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
	// ----------------------------------------------------------------------
	// マップ一覧表示.
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
	new Client();
});
