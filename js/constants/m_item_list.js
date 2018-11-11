var M_ITEM_LIST = [
	{
		itemId: "IM0000",
		itemMei: "タウリン",
		classId: "JB000",
		price: 100,
		classMei: "薬",
		memo: "1ターンの間消費体力を半分にする",
		efficacy: {
			tairyokuShohiritsu: -0.5
		}
	}, {
		itemId: "IM001",
		itemMei: "タウリンEX",
		classId: "JB010",
		price: 300,
		classMei: "薬",
		memo: "1ターンの間消費体力を0にする",
		efficacy: {
			tairyokuShohiritsu: -1
		}
	}, {
		itemId: "IM002",
		itemMei: "DNAサプリ",
		classId: "JB010",
		price: 500,
		classMei: "薬",
		memo: "知性パラメーター4アップ",
		efficacy: {
			intel: 4
		}
	}, {
		itemId: "IM003",
		itemMei: "謎の汁",
		classId: "JB010",
		price: 1000,
		classMei: "薬",
		memo: "知性パラメーター8アップ",
		efficacy: {
			intel: 8
		}
	}, {
		itemId: "IM004",
		itemMei: "美容液",
		classId: "JB010",
		price: 500,
		classMei: "薬",
		memo: "魅力パラメーター4アップ",
		efficacy: {
			charm: 4
		}
	}, {
		itemId: "IM005",
		itemMei: "若返り薬",
		classId: "JB020",
		price: 1000,
		classMei: "薬",
		memo: "魅力パラメーター8アップ",
		efficacy: {
			charm: 8
		}
	}, {
		itemId: "IM006",
		itemMei: "ダンベル",
		classId: "JB020",
		price: 500,
		classMei: "道具",
		memo: "筋力パラメーター4アップ",
		efficacy: {
			power: 4
		}
	}, {
		itemId: "IM007",
		itemMei: "筋トレマシン",
		classId: "JB020",
		price: 1000,
		classMei: "道具",
		memo: "筋力パラメーター8アップ",
		efficacy: {
			power: 8
		}
	}, {
		itemId: "IM008",
		itemMei: "情報誌",
		classId: "JB020",
		price: 500,
		classMei: "道具",
		memo: "センスパラメーター4アップ",
		efficacy: {
			sense: 4
		}
	}, {
		itemId: "IM009",
		itemMei: "携帯充電器",
		classId: "JB030",
		price: 1000,
		classMei: "道具",
		memo: "センスパラメーター8アップ",
		efficacy: {
			sense: 8
		}
	}, {
		itemId: "IM010",
		itemMei: "吹き矢",
		classId: "JB030",
		price: 1000,
		classMei: "道具",
		memo: "指定したプレイヤーの体力を5減らす"
	}, {
		itemId: "IM011",
		itemMei: "爆弾",
		classId: "JB030",
		price: 5000,
		classMei: "道具",
		memo: "指定した土地の人口と治安を減少させる"
	}, {
		itemId: "IM012",
		itemMei: "バス回数券(10マス)",
		classId: "JB030",
		price: 1000,
		classMei: "チケット",
		memo: "最大10マス分体力を消費せずに移動できる"
	}, {
		itemId: "IM013",
		itemMei: "工務店の割引券",
		classId: "JB040",
		price: 1000,
		classMei: "チケット",
		memo: "建設時のコストが安くなる"
	}, {
		itemId: "IM014",
		itemMei: "土地の権利書",
		classId: "JB040",
		price: 5000,
		classMei: "チケット",
		memo: "建設時のコストが大幅に安くなる"
	}, {
		itemId: "IM015",
		itemMei: "ギフト券",
		classId: "JB040",
		price: 1000,
		classMei: "チケット",
		memo: "商品1000円分無料になる（お釣りは出ません）"
	}, {
		itemId: "IM016",
		itemMei: "買取アップ券",
		classId: "JB040",
		price: 500,
		classMei: "チケット",
		memo: "ショップの買取価格が半額になる"
	}
];
module.exports = M_ITEM_LIST;
