var M_BUILDING_LIST = [
	{
		buildId: "BL000",
		buildMei: "新地",
		cost: 0,
		population: 0,
		security: 0,
		income: 0,
		matchJob: "JB000",
		efficacy: {},
		effect: "なし。",
		memo: "何も無い場所。草生える。"
	}, {
		buildId: "BL001",
		buildMei: "住宅地",
		cost: 10,
		population: 10,
		security: 10,
		income: 10,
		matchJob: "JB000",
		efficacy: {peo: 3},
		effect: "周辺地域の人口+3。",
		memo: "人々が生活する施設。周辺地域の人口が自動で増える。"
	}, {
		buildId: "BL002",
		buildMei: "住宅街",
		cost: 50,
		population: 50,
		security: 50,
		income: 50,
		matchJob: "JB000",
		efficacy: {peo: 5},
		effect: "周辺地域の人口+5。",
		memo: "人々が生活する施設が集まる土地。周辺地域の人口が結構増える。"
	}, {
		buildId: "BL003",
		buildMei: "関所",
		cost: 5,
		population: 5,
		security: 20,
		income: 20,
		matchJob: "JB010",
		efficacy: {sec: 3},
		effect: "周辺地域の治安+3",
		memo: "土地を守る施設。指名手配犯は通過・滞在ができない。"
	}, {
		buildId: "BL004",
		buildMei: "警察署",
		cost: 20,
		population: 20,
		security: 100,
		income: 100,
		matchJob: "JB010",
		efficacy: {sec: 5},
		effect: "周辺地域の治安+5",
		memo: "周辺地域の守る施設。指名手配犯が通過・滞在すると捕まる。"
	}, {
		buildId: "BL005",
		buildMei: "商店",
		cost: 20,
		population: 20,
		security: 20,
		income: 20,
		matchJob: "JB030",
		effect: "アイテムの売買ができる。",
		memo: "売買ができる施設。地域の名産品が購入できる。"
	}, {
		buildId: "BL006",
		buildMei: "市場",
		cost: 100,
		population: 100,
		security: 100,
		income: 100,
		matchJob: "JB030",
		effect: "アイテムの売買ができる。",
		memo: "売買ができる施設が集まる土地。地域の名産品が購入できる。"
	}, {
		buildId: "BL007",
		buildMei: "学校",
		cost: 50,
		population: 50,
		security: 20,
		income: 20,
		matchJob: "JB020",
		efficacy: {moneypara: 5},
		effect: "有料で任意のパラメータを5アップできる。",
		memo: "人々が様々な知識を学ぶ施設。好きなステータスを強化できる。"
	}, {
		buildId: "BL008",
		buildMei: "研究所",
		cost: 10,
		population: 10,
		security: 100,
		income: 100,
		matchJob: "JB020",
		efficacy: {money: 100, para: 10},
		effect: "有料で任意のパラメータを10アップできる。",
		memo: "人々が深い知識を学ぶ施設。好きなステータスを強化できる。"
	}, {
		buildId: "BL009",
		buildMei: "旅館",
		cost: 10,
		population: 10,
		security: 20,
		income: 20,
		matchJob: "JB040",
		efficacy: {money: 50, hp: 10},
		effect: "有料で体力を10回復できる。",
		memo: "人々を癒す施設。娯楽施設も兼ね備えている。宿泊できる。"
	}, {
		buildId: "BL010",
		buildMei: "繁華街",
		cost: 100,
		population: 100,
		security: 50,
		income: 50,
		matchJob: "JB040",
		efficacy: {money: 100, hp: 20},
		effect: "有料で体力を20回復できる。",
		memo: "人々を楽しませる施設が集まる土地。宿泊できる。"
	}, {
		buildId: "BL011",
		buildMei: "城下町",
		cost: 80,
		population: 80,
		security: 80,
		income: 80,
		matchJob: "JR011",
		efficacy: {peo: 2, sec: 2},
		effect: "周辺地域の人口+2 & 治安+2",
		memo: "城と街がある土地。"
	}, {
		buildId: "BL012",
		buildMei: "病院",
		cost: 100,
		population: 100,
		security: 10,
		income: 10,
		matchJob: "JR022",
		efficacy: {money: 200, hp: 100},
		effect: "有料で体力を全回復できる。",
		memo: "病を治癒する施設。"
	}, {
		buildId: "BL013",
		buildMei: "駅",
		cost: 50,
		population: 50,
		security: 50,
		income: 50,
		matchJob: "JR032",
		effect: "有料で別の駅へ移動できる。",
		efficacy: {money: 200},
		memo: "人や物資を運ぶ施設。駅がある土地に移動できる。"
	}, {
		buildId: "BL014",
		buildMei: "大規模会場",
		cost: 10,
		population: 10,
		security: 100,
		income: 100,
		matchJob: "JR041",
		effect: "所有者の利用で市場・研究所・カジノに変更可能。初期：市場。",
		memo: "多くの人々が楽しむ施設。時期によって催し物が変わる。"
	}, {
		buildId: "BL015",
		buildMei: "カジノ",
		cost: 50,
		population: 50,
		security: 5,
		income: "5000～-100",
		matchJob: "JR033",
		efficacy: {sec: -5},
		effect: "周辺地域の治安-5。",
		memo: "一攫千金の夢をお金で買う施設。周辺の土地の治安が下がる。"
	}, {
		buildId: "BL016",
		buildMei: "焼却場",
		cost: 5,
		population: 5,
		security: 50,
		income: 50,
		matchJob: "JR021",
		efficacy: {peo: -5},
		effect: "周辺地域の人口-5。",
		memo: "ゴミを焼却する施設。臭いがするので周辺の土地の人口が減る。"
	}
];
module.exports = M_BUILDING_LIST;