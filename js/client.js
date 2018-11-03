$(function() {
	// ----------------------------------------------------------------------
	// クライアントの処理を扱うクラス.
	// ----------------------------------------------------------------------
	function Client() {
		var self = this;

		self.socket = io.connect();
		self.registUserName();
		self.connect();

		self.socket.on('viewUpdate', function(datas) {
			self.viewUpdate(datas);
		});

		$('#deleteAll').click(function() {
			if (self.userName === "中山 友貴") {
				self.send("deleteAll");
			}
		});
	}
	// ----------------------------------------------------------------------
	// 名前登録.
	// ----------------------------------------------------------------------
	Client.prototype.registUserName = function() {
		var self = this;
		self.userName = localStorage.getItem('ConnectionTestUserName');
		var $regist = $('#registUserName');
		if (self.userName) {
			$regist.hide();
		} else {
			var $view = $('#view');
			$view.hide();
			$regist.find('button').first().click(function() {
				var userName = $regist.find('input[type="text"]').first().val();
				if (userName) {
					localStorage.setItem('ConnectionTestUserName', userName);
					self.userName = userName;
					$regist.hide();
					$view.show();
				}
			});
		}
	};
	// ----------------------------------------------------------------------
	// 送信処理.
	// ----------------------------------------------------------------------
	Client.prototype.send = function(eventKey, params) {
		this.socket.emit(eventKey, params);
	};
	// ----------------------------------------------------------------------
	// 接続.
	// ----------------------------------------------------------------------
	Client.prototype.connect = function() {
		var self = this;
		var timer = setInterval(function() {
			if (self.userName) {
				self.send("save", {userName: self.userName});
			}
		}, 1000);
	};
	// ----------------------------------------------------------------------
	// 描画.
	// ----------------------------------------------------------------------
	Client.prototype.viewUpdate = function(datas) {
		this.viewUpdateSetsuzoku(datas.setsuzokuList);
		this.viewUpdateKiroku(datas.kirokuList);
	};
	// ----------------------------------------------------------------------
	// 描画（接続状況）.
	// ----------------------------------------------------------------------
	Client.prototype.viewUpdateSetsuzoku = function(setsuzokuList) {
		var $setsuzoku = $('#setsuzoku').find('tbody');
		$setsuzoku.empty();
		var tag = "";
		$.each(setsuzokuList, function() {
			tag += "<tr><td>" + this.userName + "</td><td>" + this.lastTime + "</td></tr>";
		});
		$setsuzoku.append($(tag));
	};
	// ----------------------------------------------------------------------
	// 描画（切断記録）.
	// ----------------------------------------------------------------------
	Client.prototype.viewUpdateKiroku = function(kirokuList) {
		var $tbody = $('#kiroku').find('tbody');
		$tbody.empty();
		var tag = "";
		$.each(kirokuList, function() {
			tag += "<tr><td>" + this.userName + "</td><td>" + this.setsudan + "</td><td>" + this.saisetsuzoku + "</td></tr>";
		});
		$tbody.append($(tag));
	};
	new Client();
});