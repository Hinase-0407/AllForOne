var m_building_list = [
  {
    buildId: 'BL000',
    buildMei: '新地',
    cost: 0,
    population: 0,
    security: 0,
    income: 0,
    matchClass: 'JB000',
    matchRank: null,
    canUse: false,
    efficacy: {},
    memoEffect: 'なし。',
    memoBuild: '何も無い場所。草生える。'
  },
  {
    buildId: 'BL001',
    buildMei: '住宅地',
    cost: 100,
    population: 10,
    security: 10,
    income: 10,
    matchClass: 'JB000',
    matchRank: null,
    canUse: false,
    efficacy: {population: 3},
    memoEffect: '周辺地域の人口+3。',
    memoBuild: '人々が生活する施設。周辺地域の人口が自動で増える。'
  },
  {
    buildId: 'BL002',
    buildMei: '住宅街',
    cost: 500,
    population: 50,
    security: 50,
    income: 50,
    matchClass: 'JB000',
    matchRank: null,
    canUse: false,
    efficacy: {population: 5},
    memoEffect: '周辺地域の人口+5。',
    memoBuild: '人々が生活する施設が集まる土地。周辺地域の人口が結構増える。'
  },
  {
    buildId: 'BL003',
    buildMei: '関所',
    cost: 100,
    population: 5,
    security: 10,
    income: 5,
    matchClass: 'JB010',
    matchRank: null,
    canUse: false,
    efficacy: {security: 3},
    memoEffect: '周辺地域の治安+3',
    memoBuild: '土地を守る施設。指名手配犯は通過・滞在ができない。'
  },
  {
    buildId: 'BL004',
    buildMei: '警察署',
    cost: 500,
    population: 10,
    security: 50,
    income: 25,
    matchClass: 'JB010',
    matchRank: null,
    canUse: false,
    efficacy: {security: 5},
    memoEffect: '周辺地域の治安+5',
    memoBuild: '周辺地域の守る施設。指名手配犯が通過・滞在すると捕まる。'
  },
  {
    buildId: 'BL005',
    buildMei: '商店',
    cost: 200,
    population: 20,
    security: 20,
    income: 20,
    matchClass: 'JB030',
    matchRank: null,
    canUse: true,
    efficacy: {event: "shop"},
    memoEffect: 'アイテムの売買ができる。',
    memoBuild: '売買ができる施設。地域の名産品が購入できる。'
  },
  {
    buildId: 'BL006',
    buildMei: '市場',
    cost: 1000,
    population: 100,
    security: 100,
    income: 100,
    matchClass: 'JB030',
    matchRank: null,
    canUse: true,
    efficacy: {event: "shop"},
    memoEffect: 'アイテムの売買ができる。',
    memoBuild: '売買ができる施設が集まる土地。地域の名産品が購入できる。'
  },
  {
    buildId: 'BL007',
    buildMei: '学校',
    cost: 1000,
    population: 50,
    security: 20,
    income: 20,
    matchClass: 'JB020',
    matchRank: null,
    canUse: true,
    efficacy: {event: "school", plus: 5},
    memoEffect: '有料で任意のパラメータを5アップできる。',
    memoBuild: '人々が様々な知識を学ぶ施設。好きなステータスを強化できる。'
  },
  {
    buildId: 'BL008',
    buildMei: '研究所',
    cost: 10000,
    population: 10,
    security: 100,
    income: 100,
    matchClass: 'JB020',
    matchRank: null,
    canUse: true,
    efficacy: {event: "school", plus: 10},
    memoEffect: '有料で任意のパラメータを10アップできる。',
    memoBuild: '人々が深い知識を学ぶ施設。好きなステータスを強化できる。'
  },
  {
    buildId: 'BL009',
    buildMei: '旅館',
    cost: 5000,
    population: 10,
    security: 20,
    income: 20,
    matchClass: 'JB040',
    matchRank: null,
    canUse: true,
    efficacy: {event: "hotel", heal: 20},
    memoEffect: '有料で体力を20回復できる。',
    memoBuild: '人々を癒す施設。娯楽施設も兼ね備えている。宿泊できる。'
  },
  {
    buildId: 'BL010',
    buildMei: '繁華街',
    cost: 10000,
    population: 100,
    security: 50,
    income: 50,
    matchClass: 'JB040',
    matchRank: null,
    canUse: true,
    efficacy: {event: "hotel", heal: 50},
    memoEffect: '有料で体力を50回復できる。',
    memoBuild: '人々を楽しませる施設が集まる土地。宿泊できる。'
  },
  {
    buildId: 'BL011',
    buildMei: '城下町',
    cost: 2000,
    population: 80,
    security: 80,
    income: 80,
    matchClass: null,
    matchRank: 'JR011',
    canUse: true,
    efficacy: {event: "shop", population: 2, population: 2},
    memoEffect: '周辺地域の人口+2 & 治安+2。アイテムの売買ができる。',
    memoBuild: '城と街がある土地。商店もあるので、買い物ができる。'
  },
  {
    buildId: 'BL012',
    buildMei: '病院',
    cost: 10000,
    population: 100,
    security: 10,
    income: 10,
    matchClass: null,
    matchRank: 'JR022',
    canUse: true,
    efficacy: {event: "hotel", heal: 100},
    memoEffect: '有料で体力を全回復できる。',
    memoBuild: '病を治癒する施設。'
  },
  {
    buildId: 'BL013',
    buildMei: '駅',
    cost: 3000,
    population: 50,
    security: 50,
    income: 50,
    matchClass: null,
    matchRank: 'JR032',
    canUse: true,
    efficacy: {event: "station"},
    memoEffect: '有料で別の駅へ移動できる。',
    memoBuild: '人や物資を運ぶ施設。駅がある土地に移動できる。'
  },
  {
    buildId: 'BL014',
    buildMei: '大規模会場',
    cost: 2000,
    population: 10,
    security: 100,
    income: 100,
    matchClass: null,
    matchRank: 'JR041',
    canUse: true,
    efficacy: {event: "changeEvent"},
    memoEffect: '(所有者の利用で市場・研究所・カジノに変更可能。初期：市場)',
    memoBuild: '多くの人々が楽しむ施設。時期によって催し物が変わる。'
  },
  {
    buildId: 'BL015',
    buildMei: 'カジノ',
    cost: 1000,
    population: 50,
    security: 5,
    income: '5000～-100',
    matchClass: null,
    matchRank: 'JR033',
    canUse: false,
    efficacy: {security: -5},
    memoEffect: '周辺地域の治安-5。',
    memoBuild: '一攫千金の夢をお金で買う施設。周辺の土地の治安が下がる。'
  },
  {
    buildId: 'BL016',
    buildMei: '焼却場',
    cost: 50,
    population: 1,
    security: 5,
    income: 5,
    matchClass: null,
    matchRank: 'JR021',
    canUse: false,
    efficacy: {population: -5},
    memoEffect: '周辺地域の人口-5。',
    memoBuild: 'ゴミを焼却する施設。臭いがするので周辺の土地の人口が減る。'
  }
];
