var m_item_list = [
	{
		itemId: 'IM000',
		itemMei: 'タウリン',
		classId: 'JB020',
		price: 100,
		classMei: '薬',
		target: 'move',
		efficacy: {tairyokuShohiritsu: 50},
		memoItem: '1ターンの間消費体力を半分にする'
	},
	{
		itemId: 'IM001',
		itemMei: 'タウリンEX',
		classId: 'JB020',
		price: 300,
		classMei: '薬',
		target: 'move',
		efficacy: {tairyokuShohiritsu: 100},
		memoItem: '1ターンの間消費体力を0にする'
	},
	{
		itemId: 'IM002',
		itemMei: 'DNAサプリ',
		classId: 'JB020',
		price: 500,
		classMei: '薬',
		target: 'mine',
		efficacy: {intellect: 4},
		memoItem: '知性パラメーター4アップ'
	},
	{
		itemId: 'IM003',
		itemMei: '謎の汁',
		classId: 'JB020',
		price: 1000,
		classMei: '薬',
		target: 'mine',
		efficacy: {intellect: 8},
		memoItem: '知性パラメーター8アップ'
	},
	{
		itemId: 'IM004',
		itemMei: '美容液',
		classId: 'JB020',
		price: 500,
		classMei: '薬',
		target: 'mine',
		efficacy: {charm: 4},
		memoItem: '魅力パラメーター4アップ'
	},
	{
		itemId: 'IM005',
		itemMei: '若返り薬',
		classId: 'JB020',
		price: 1000,
		classMei: '薬',
		target: 'mine',
		efficacy: {charm: 8},
		memoItem: '魅力パラメーター8アップ'
	},
	{
		itemId: 'IM006',
		itemMei: 'ダンベル',
		classId: 'JB030',
		price: 500,
		classMei: '道具',
		target: 'mine',
		efficacy: {power: 4},
		memoItem: '筋力パラメーター4アップ'
	},
	{
		itemId: 'IM007',
		itemMei: '筋トレマシン',
		classId: 'JB030',
		price: 1000,
		classMei: '道具',
		target: 'mine',
		efficacy: {power: 8},
		memoItem: '筋力パラメーター8アップ'
	},
	{
		itemId: 'IM008',
		itemMei: '情報誌',
		classId: 'JB030',
		price: 500,
		classMei: '道具',
		target: 'mine',
		efficacy: {sense: 4},
		memoItem: 'センスパラメーター4アップ'
	},
	{
		itemId: 'IM009',
		itemMei: '携帯充電器',
		classId: 'JB030',
		price: 1000,
		classMei: '道具',
		target: 'mine',
		efficacy: {sense: 8},
		memoItem: 'センスパラメーター8アップ'
	},
	{
		itemId: 'IM010',
		itemMei: '吹き矢',
		classId: 'JB030',
		price: 1000,
		classMei: '道具',
		target: 'enemy',
		efficacy: {hp: -10},
		memoItem: '指定したプレイヤーの体力を5減らす'
	},
	{
		itemId: 'IM011',
		itemMei: '爆弾',
		classId: 'JB030',
		price: 5000,
		classMei: '道具',
		target: 'area',
		efficacy: {population: -5, security: -5},
		memoItem: '指定した土地の人口と治安を減少させる'
	},
	{
		itemId: 'IM012',
		itemMei: 'バス回数券(10マス)',
		classId: 'JB030',
		price: 1000,
		classMei: 'チケット',
		target: 'move',
		efficacy: {canMove: 10},
		memoItem: '最大10マス分体力を消費せずに移動できる'
	},
	{
		itemId: 'IM013',
		itemMei: '工務店の割引券',
		classId: 'JB030',
		price: 1000,
		classMei: 'チケット',
		target: 'build',
		efficacy: {buildCost: 75},
		memoItem: '建設時のコストが安くなる'
	},
	{
		itemId: 'IM014',
		itemMei: '土地の権利書',
		classId: 'JB030',
		price: 5000,
		classMei: 'チケット',
		target: 'build',
		efficacy: {buildCost: 50},
		memoItem: '建設時のコストが大幅に安くなる'
	},
	{
		itemId: 'IM015',
		itemMei: 'ギフト券',
		classId: 'JB030',
		price: 1000,
		classMei: 'チケット',
		target: 'shop',
		efficacy: {nebiki: 1000},
		memoItem: '商品1000円分無料になる（お釣りは出ません）'
	},
	{
		itemId: 'IM016',
		itemMei: '買取アップ券',
		classId: 'JB030',
		price: 500,
		classMei: 'チケット',
		target: 'shop',
		efficacy: {saleCost: 2},
		memoItem: 'ショップの買取価格が倍になる'
	}
];
module.exports = m_item_list;