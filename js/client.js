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
		//self.setEventServer();
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
		self.ws.onmessage = function (event) {
			//console.log(event.data);
			var data = JSON.parse(event.data);
			var eventName = recieveData.eventName;
			switch (eventName) {
				case "client":
					var text = "";
					for (var i = 0; i < recieveData.playerList.length; i++) {
						var d = recieveData.playerList[i];
						text += d.playerId + " :\n    " + d.positionX + ", " + d.positionY + ", " + d.positionZ + "\n\n";
					}
					self.clientMessage.html(text);
					break;
				case "host":
					var text = "";
					for (var i = 0; i < recieveData.playerList.length; i++) {
						var d = recieveData.playerList[i];
						text += d.playerId + " :\n    " + d.positionX + ", " + d.positionY + ", " + d.positionZ + "\n\n";
					}
					self.hostMessage.html(text);
					break;
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
	new Client();
});
