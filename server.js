// ----------------------------------------------------------------------
// アプリケーション設定.
// ----------------------------------------------------------------------
var http = require('http');
var express = require('express')
var app = express();
app.use(express.static(__dirname + '/'));
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(8005);
// ----------------------------------------------------------------------
// DB設定.
// ----------------------------------------------------------------------
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var roomCln = null;
var playerCln = null;
MongoClient.connect("mongodb://127.0.0.1:27017/", function(err, db) {
	if (err) throw err;
	var dbo = db.db("AllForOne");
	roomCln = dbo.collection("room");
	playerCln = dbo.collection("player");
});
io.sockets.on('connection', function(socket) {
	new Connection(socket);
});
// ----------------------------------------------------------------------
// サーバー状態監視処理.
// ----------------------------------------------------------------------
var kanri = new Connection();
setInterval(function() {
	kanri.findAllSetsuzoku(function(setsuzokuList) {
		for (var i = 0; i < setsuzokuList.length; i++) {
			var data = setsuzokuList[i];
			if (kanri.isSetsudan(data.lastTime)) {
				kanri.findByUserNameKiroku(data.userName, data.lastTime, function(userName, lastTime, kirokuList) {
					if (kirokuList.length === 0 ||
							kirokuList.every(tmp => !!tmp.saisetsuzoku)) {
						kanri.insertKiroku(userName, lastTime);
					}
				});
			}
		};
	});
}, 2000);
// ----------------------------------------------------------------------
// コネクションクラス.
// ----------------------------------------------------------------------
function Connection(socket) {
	if (!socket) return;

	var self = this;

	self.socket = socket;
	self.socketId = socket.id;

	socket.on("save", function(params) {
		self.connect(params);
	});

	socket.on("deleteAll", function(params) {
		self.deleteAll();
	});
}
// ----------------------------------------------------------------------
// 接続処理.
// ----------------------------------------------------------------------
Connection.prototype.connect = function(params) {
	var self = this;
	self.updateKiroku(params.userName);
	self.upsetSetsuzoku(params, function() {
		self.findAllSetsuzoku(function(setsuzokuList) {
			self.findAllKiroku(function(kirokuList) {
				var datas = {};
				datas.setsuzokuList = setsuzokuList;
				datas.kirokuList = kirokuList;
				io.to(self.socketId).emit('viewUpdate', datas);
			});
		});
	});
};
// ----------------------------------------------------------------------
// 接続状況更新.
// ----------------------------------------------------------------------
Connection.prototype.upsetSetsuzoku = function(params, callback) {
	var self = this;

	var where = {userName: params.userName};
	var set = {$set:
		{
			userName: params.userName,
			lastTime: self.getDateTime()
		}
	};
	setsuzokuCln.updateMany(where, set, {upsert: true}, function(err, result) {
		if (err) throw err;
		callback();
	});
};
// ----------------------------------------------------------------------
// 接続状況全件取得.
// ----------------------------------------------------------------------
Connection.prototype.findAllSetsuzoku = function(callback) {
	var sort = {userName: 1};
	setsuzokuCln.find({}).sort(sort).toArray(function(err, result) {
		if (err) throw err;
		// console.log(result);
		callback(result);
	});
};
// ----------------------------------------------------------------------
// 接続状況をユーザー名により取得.
// ----------------------------------------------------------------------
Connection.prototype.findByUserNameSetsuzoku = function(userName, callback) {
	setsuzokuCln.find({userName: userName}).toArray(function(err, result) {
		if (err) throw err;
		// console.log(result);
		callback(result);
	});
};
// ----------------------------------------------------------------------
// 切断記録追加.
// ----------------------------------------------------------------------
Connection.prototype.insertKiroku = function(userName, lastTime) {
	var self = this;

	var where = {
		userName: userName,
		setsudan: lastTime
	};
	var set = {$set:
		{
			userName: userName,
			setsudan: lastTime,
			saisetsuzoku: ""
		}
	};
	kirokuCln.updateMany(where, set, {upsert: true}, function(err, result) {
		if (err) throw err;
	});
};
// ----------------------------------------------------------------------
// 切断記録をユーザー名により取得.
// ----------------------------------------------------------------------
Connection.prototype.findByUserNameKiroku = function(userName, lastTime, callback) {
	var where = {userName: userName};
	var sort = {saisetsuzoku: 1};
	kirokuCln.find(where).sort(sort).toArray(function(err, result) {
		if (err) throw err;
		// console.log(result);
		callback(userName, lastTime, result);
	});
};
// ----------------------------------------------------------------------
// 切断記録更新.
// ----------------------------------------------------------------------
Connection.prototype.updateKiroku = function(userName) {
	var self = this;

	var where = {userName: userName, saisetsuzoku: ""};
	var set = {$set:
		{
			saisetsuzoku: self.getDateTime()
		}
	};
	kirokuCln.updateMany(where, set, function(err, result) {
		if (err) throw err;
	});
};
// ----------------------------------------------------------------------
// 切断記録全件取得.
// ----------------------------------------------------------------------
Connection.prototype.findAllKiroku = function(callback) {
	var sort = {
		setsudan: -1,
		userName: 1
	};
	kirokuCln.find({}).sort(sort).toArray(function(err, result) {
		if (err) throw err;
		// console.log(result);
		callback(result);
	});
};
// ----------------------------------------------------------------------
// 全件削除.
// ----------------------------------------------------------------------
Connection.prototype.deleteAll = function() {
	setsuzokuCln.deleteMany({}, function(err, result) {
		if (err) throw err;
	});
	kirokuCln.deleteMany({}, function(err, result) {
		if (err) throw err;
	});
};
// ----------------------------------------------------------------------
// 切断判定.
// ----------------------------------------------------------------------
Connection.prototype.isSetsudan = function(targetTime) {
	return new Date(this.getDateTime()) - new Date(targetTime) > 5000;
};
// ----------------------------------------------------------------------
// 現在の日時を取得する.
// ----------------------------------------------------------------------
Connection.prototype.getDateTime = function() {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var day = now.getDate();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	return year 
			+ "-" + ('00' + month).slice(-2)
			+ "-" + ('00' + day).slice(-2)
			+ " " + ('00' + hour).slice(-2)
			+ ":" + ('00' + minute).slice(-2)
			+ ":" + ('00' + second).slice(-2);
};
