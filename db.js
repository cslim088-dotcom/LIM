// db.js - 자연치유 약초 홈페이지 로컬 데이터베이스 모듈

const STORAGE_KEYS = {
  HERBS: 'herb_healing_herbs',
  TEAS: 'herb_healing_teas',
  MEDIA: 'herb_healing_media',
  USERS: 'herb_healing_users',
  POSTS: 'herb_healing_posts',
  SETTINGS: 'herb_healing_settings',
  INQUIRIES: 'herb_healing_inquiries',
};

// 1. 초기 약초 데이터 (농사로 참고)
var initialHerbs = window.initialHerbs = [
  {
    id: 'herbs-1',
    name: '인삼 (Ginseng)',
    scientificName: 'Panax ginseng C.A. Mey.',
    category: '뿌리류',
    efficacy: '면역력 증진, 피로 개선, 혈소판 응집 억제를 통한 혈액 흐름 개선, 기억력 개선, 항산화 작용.',
    sideEffects: '몸에 열이 너무 많은 사람은 과다 복용 시 두통, 불면, 가슴 답답함이 생길 수 있습니다.',
    howToUse: '물 1L에 건조 인삼 10g을 넣고 약불에서 2시간 정도 달여 하루 2~3회 음용합니다. 삼계탕이나 요리에 첨가해도 좋습니다.',
    imageUrl: 'images/ginseng.jpg',
  },
  {
    id: 'herbs-2',
    name: '당귀 (Korean Angelica)',
    scientificName: 'Angelica gigas Nakai',
    category: '뿌리류',
    efficacy: '보혈작용(피를 보충함), 혈액 순환 개선, 부인과 질환(생리통, 생리불순) 완화, 수족냉증 개선.',
    sideEffects: '자궁 수축을 유발할 수 있으므로 임산부는 섭취를 금해야 하며, 설사가 잦은 사람도 주의가 필요합니다.',
    howToUse: '말린 당귀 뿌리 5~10g을 물 1L와 함께 끓여 차로 마십니다. 특유의 은은한 한약 향이 일품입니다.',
    imageUrl: 'images/angelica.jpg',
  },
  {
    id: 'herbs-3',
    name: '감초 (Licorice)',
    scientificName: 'Glycyrrhiza uralensis Fisch.',
    category: '뿌리류',
    efficacy: '약효 조화(모든 약초의 독성을 완화하고 해독함), 해열, 진해거담, 위장 점막 보호 및 소화 기능 촉진.',
    sideEffects: '장기 과다 복용 시 칼륨 수치 저하로 고혈압이나 부종(부기)을 유발할 수 있습니다.',
    howToUse: '다른 약초와 함께 달일 때 조화제로 2~3조각(3g) 넣거나, 단독으로 얇게 썬 감초를 끓여 달콤한 차로 마십니다.',
    imageUrl: 'images/licorice.png',
  },
  {
    id: 'herbs-4',
    name: '민들레 (Dandelion/포공영)',
    scientificName: 'Taraxacum officinale',
    category: '뿌리잎류',
    efficacy: '간 기능 개선(실리마린 성분 풍부), 해독 및 소염 작용, 소화 불량 개선, 이뇨 작용으로 부종 완화.',
    sideEffects: '성질이 차가우므로 몸이 찬 사람이 많이 먹으면 속 쓰림이나 설사를 유발할 수 있습니다.',
    howToUse: '봄철 어린잎은 나물이나 겉절이로 먹고, 뿌리와 전초를 말려 볶은 후 차로 우려내면 구수한 맛을 낼 수 있습니다.',
    imageUrl: 'images/dandelion.png',
  },
  {
    id: 'herbs-5',
    name: '쑥 (Mugwort/애엽)',
    scientificName: 'Artemisia princeps Pamp.',
    category: '잎류',
    efficacy: '몸을 따뜻하게 함, 위장 기능 강화, 면역 조절, 항균 및 항염 작용, 여성 질환 완화.',
    sideEffects: '봄철 외의 자란 쑥은 독성이 강해질 수 있어 피해야 하며, 너무 과하게 섭취하면 위장에 무리가 갈 수 있습니다.',
    howToUse: '어린 쑥잎을 덖어 쑥차로 우려 마시거나, 국, 떡 등의 요리에 활용합니다. 쑥뜸이나 족욕용으로도 훌륭합니다.',
    imageUrl: 'images/mugwort.png',
  },
  {
    id: 'herbs-6',
    name: '구기자 (Goji Berry)',
    scientificName: 'Lycium chinense Miller',
    category: '열매류',
    efficacy: '눈 건강 개선(베타카로틴 풍부), 노화 방지 및 항산화, 피로 회복, 간 세포 보호 및 지방간 예방.',
    sideEffects: '소화력이 약하고 설사를 자주 하는 사람은 소량만 섭취하는 것이 좋습니다.',
    howToUse: '잘 말린 구기자 열매 15g을 물 1.5L에 넣고 물이 붉은빛을 띨 때까지 끓여 식수 대용이나 차로 수시로 마십니다.',
    imageUrl: 'images/goji_berry.png',
  },
  {
    id: 'herbs-7',
    name: '연꽃 (Lotus)',
    scientificName: 'Nelumbo nucifera Gaertn.',
    category: '약초꽃류',
    efficacy: '마음을 안정시키고 기분을 맑게 하며, 불면증 완화와 피부 미용, 해독 작용에 도움을 줍니다.',
    sideEffects: '특별한 부작용은 없으나 성질이 평이하므로 과다 복용 시 위장이 약한 분은 소화 장애가 생길 수 있습니다.',
    howToUse: '말린 연꽃잎이나 연꽃 전체를 뜨거운 물에 넣어 천천히 우려내어 향을 음미하며 마십니다.',
    imageUrl: 'images/lotus.jpg',
  },
  {
    id: 'herbs-8',
    name: '목련꽃 (Magnolia)',
    scientificName: 'Magnolia kobus DC.',
    category: '약초꽃류',
    efficacy: '한방에서는 신이(辛夷)라고 불리며, 비염, 축농증, 코막힘 등 호흡기 질환 및 감기 예방에 탁월한 효과가 있습니다.',
    sideEffects: '따뜻하고 매운 성질이 있으므로 몸에 열이 아주 많은 분은 과다 섭취 시 주의해야 합니다.',
    howToUse: '꽃봉오리를 잘 말려 덖은 뒤 뜨거운 물 200ml에 꽃잎 2~3장을 넣고 2~3분간 우려 마십니다.',
    imageUrl: 'images/magnolia.jpg',
  },
  {
    id: 'herbs-9',
    name: '산목련꽃 (Wild Magnolia)',
    scientificName: 'Magnolia sieboldii K.Koch',
    category: '약초꽃류',
    efficacy: '목련과 유사하게 코 건강(비염, 코막힘)에 좋으며, 몸 안의 차가운 기운을 발산시키고 두통을 완화하는 데 도움을 줍니다.',
    sideEffects: '자궁 흥분 작용이 있을 수 있어 임산부는 복용을 피하는 것이 안전합니다.',
    howToUse: '잘 덖은 산목련꽃 1~2송이를 다관에 넣고 끓는 물을 부어 향이 충분히 우러난 뒤 따뜻하게 음용합니다.',
    imageUrl: 'images/wild_magnolia.jpg',
  },
  {
    id: 'herbs-10',
    name: '갈화 (Kuzu Flower)',
    scientificName: 'Pueraria lobata (Willd.) Ohwi',
    category: '약초꽃류',
    efficacy: '칡의 꽃으로, 주독(술독)을 해독하고 숙취 해소에 탁월하며, 갈증 해소와 이뇨 작용에 매우 효과적입니다.',
    sideEffects: '성질이 서늘하므로 아랫배가 차거나 소화 기능이 극도로 약한 분은 많이 마시지 않는 것이 좋습니다.',
    howToUse: '말린 갈화 5~10g을 물 1L에 넣고 달여서 음주 전후로 복용하거나 데일리 허브차로 가볍게 우려 마십니다.',
    imageUrl: 'images/galhwa.jpg',
  },
  {
    id: 'herbs-11',
    name: '맥문동꽃 (Liriope Flower)',
    scientificName: 'Liriope platyphylla Wang & Tang',
    category: '약초꽃류',
    efficacy: '폐를 윤택하게 하고 기관지 마른기침을 진정시키며, 갈증 해소와 열을 내리는 데 도움을 줍니다.',
    sideEffects: '몸에 습이 많거나 차가운 성질을 지닌 분은 설사를 유발할 수 있으므로 주의가 필요합니다.',
    howToUse: '건조된 맥문동꽃을 따뜻한 물에 우려 은은한 보랏빛 차로 음용하거나, 맥문동 뿌리와 함께 달여 복용합니다.',
    imageUrl: 'images/liriope.jpg',
  },
  {
    id: 'herbs-12',
    name: '찔레꽃 (Wild Rose Flower)',
    scientificName: 'Rosa multiflora Thunb.',
    category: '약초꽃류',
    efficacy: '혈액 순환을 돕고 장 운동을 활성화하며, 관절통 완화 및 부종 제거에 효과가 있습니다.',
    sideEffects: '성질이 서늘하므로 아랫배가 차거나 위장 기능이 약한 분은 과다 섭취 시 설사를 할 수 있습니다.',
    howToUse: '잘 덖은 찔레꽃잎 3~5송이를 따뜻한 물에 우려 은은한 향을 즐기며 차로 마십니다.',
    imageUrl: 'images/wild_rose.jpg',
  },
  {
    id: 'herbs-13',
    name: '아카시아와 찔레꽃 (Acacia & Wild Rose)',
    scientificName: 'Robinia pseudoacacia & Rosa multiflora',
    category: '약초꽃류',
    efficacy: '아카시아꽃의 천연 항생 성분(아카세틴)이 염증을 완화하고 해독을 도우며, 찔레꽃이 신진대사를 자극하여 시너지를 냅니다.',
    sideEffects: '꽃가루 알레르기가 있는 분은 섭취 전 주의를 요합니다.',
    howToUse: '덖어낸 아카시아 꽃잎과 찔레꽃을 적절히 블렌딩하여 뜨거운 물에 우려 향기롭고 달콤한 꽃차로 음용합니다.',
    imageUrl: 'images/acacia_wild_rose.jpg',
  },
  {
    id: 'herbs-14',
    name: '진달래꽃 (Azalea Flower)',
    scientificName: 'Rhododendron mucronulatum Turcz.',
    category: '약초꽃류',
    efficacy: '한방에서는 두견화(杜鵑花)라고 불리며, 혈액 순환을 활발히 하고 기침을 멎게 하며 기혈 조절에 도움을 줍니다.',
    sideEffects: '진달래꽃의 수술과 꽃받침에는 약한 독성(그레이아노톡신)이 있을 수 있어, 반드시 완전히 손질 및 법제하여 복용해야 합니다.',
    howToUse: '수술을 깨끗이 제거한 후 말려서 덖은 꽃잎 2~3장을 다관에 우려 핑크빛 고운 색과 향을 마십니다.',
    imageUrl: 'images/azalea.jpg',
  },
  {
    id: 'herbs-15',
    name: '치자꽃과 금은화 (Gardenia & Honeysuckle)',
    scientificName: 'Gardenia jasminoides & Lonicera japonica',
    category: '약초꽃류',
    efficacy: '치자꽃의 열을 내리는 해열 효능과 금은화(인동초)의 천연 소염 작용이 결합되어 기관지 염증, 열 감기, 해독에 아주 탁월합니다.',
    sideEffects: '두 약재 모두 찬 성질이 강하므로 몸이 찬 사람이나 만성 소화불량이 있는 분은 과용하지 않아야 합니다.',
    howToUse: '두 꽃의 덖음 믹스를 뜨거운 물에 3분간 우려 마시거나 가볍게 달여 수시로 음용합니다.',
    imageUrl: 'images/gardenia_honeysuckle.jpg',
  },
  {
    id: 'herbs-16',
    name: '장뇌삼 (Wild-cultivated Ginseng)',
    scientificName: 'Panax ginseng (Wild)',
    category: '약초꽃류',
    efficacy: '자연 속에서 자라나 일반 인삼에 비해 진세노사이드 성분이 매우 풍부하며, 원기 회복, 강력한 면역력 증진, 항암, 노화 예방에 효능이 뛰어납니다.',
    sideEffects: '몸에 열이 심하게 오르는 고열 환자나 지나친 열성 체질은 섭취량 조절이 필요합니다.',
    howToUse: '생으로 잘 씻어 뇌두를 제거한 뒤 꼭꼭 씹어 먹거나, 꿀에 재워 먹거나, 섭씨 80~90도 온수에서 오랫동안 달여 차처럼 복용합니다.',
    imageUrl: 'images/wild_ginseng.jpg',
  },
  {
    id: 'herbs-17',
    name: '반하 (Pinellia/끼무릇)',
    scientificName: 'Pinellia ternata (Thunb.) Makino',
    category: '약초꽃류',
    efficacy: '담을 제거하고 기침을 진정시키며(화담지해), 위장 내의 습한 기운을 다스려 메스꺼움, 구토, 가슴 답답함을 치료하는 데 탁월한 효과가 있습니다.',
    sideEffects: '생반하는 아린 맛과 강한 독성(점막 자극 및 신경 독성)이 있으므로 반드시 생강 즙이나 백반으로 법제(처리를 거친 법반하 등)하여 처방 하에 극소량만 안전하게 복용해야 합니다. 임산부는 복용을 절대 삼가야 합니다.',
    howToUse: '법제된 반하 3~5g을 생강과 함께 달여서 복용합니다. 독성이 강하므로 임의로 자연 약재를 날것으로 드시면 안 됩니다.',
    imageUrl: 'images/pinellia.jpg',
  },
  {
    id: 'herbs-18',
    name: '토종박하 (Korean Mint)',
    scientificName: 'Mentha arvensis var. piperascens',
    category: '잎류',
    efficacy: '머리를 맑게 하고 두통과 피로를 해소하는 데 도움을 주며, 해열작용 및 소화 불량 증상을 완화하는 데 탁월합니다.',
    sideEffects: '성질이 서늘하므로 몸이 차거나 소화기가 매우 약한 분은 다량 섭취 시 설사를 일으킬 수 있습니다.',
    howToUse: '깨끗이 말린 박하 잎 3~5g을 80~90도의 따뜻한 물에 넣어 2~3분간 우려내어 상쾌한 허브차로 마십니다.',
    imageUrl: 'images/peppermint.jpg',
  },
  {
    id: 'herbs-19',
    name: '산수유 (Cornus Fruit)',
    scientificName: 'Cornus officinalis Siebold & Zucc.',
    category: '열매류',
    efficacy: '간과 신장을 보호하고 원기 회복과 만성 피로 개선에 탁월하며, 면역 조절 및 노화 방지 효능이 있습니다.',
    sideEffects: '산수유 씨앗에는 독성 성분이 포함되어 있어, 반드시 씨앗을 완전히 제거한 과육만 섭취해야 합니다.',
    howToUse: '씨를 빼고 말린 산수유 열매 15g을 물 1.5L에 넣고 은은하게 달여 하루 2~3회 나누어 차로 마십니다.',
    imageUrl: 'images/sansuyu.jpg',
  },
  {
    id: 'herbs-20',
    name: '천궁 (Cnidium/川芎)',
    scientificName: 'Cnidium officinale Makino',
    category: '뿌리류',
    efficacy: '혈액순환을 원활하게 촉진하고 어혈을 풀어주며(활혈거어), 두통 완화 및 여성 생리통과 정혈 작용에 탁월합니다.',
    sideEffects: '음허화왕(몸에 진액이 부족하고 열이 많은 체질)이나 출혈성 질환 환자는 주의하여 섭취하며, 임산부의 과다 복용은 피합니다.',
    howToUse: '건조한 천궁 뿌리 5~10g을 물 1L에 당귀와 함께 달여 하루 2~3회 따뜻하게 마십니다.',
    imageUrl: 'images/cnidium.png',
  },
  {
    id: 'herbs-21',
    name: '작약 (Peony/백작약)',
    scientificName: 'Paeonia lactiflora Pall.',
    category: '뿌리류',
    efficacy: '간을 보하고 혈액을 보충해주며(보혈양간), 근육 경련과 급작스러운 통증 완화, 여성 생리통 및 복통 개선에 뛰어납니다.',
    sideEffects: '성질이 약간 차가우므로 평소 소화기능이 약하거나 설사를 자주 하는 사람은 장기 과다 복용을 자제합니다.',
    howToUse: '말린 백작약 뿌리 10g을 물 1L에 넣고 약불로 30~40분간 달여 차로 마시거나, 감초와 함께 달여(작약감초탕) 복용합니다.',
    imageUrl: 'images/peony.png',
  },
  {
    id: 'herbs-22',
    name: '지황 (Rehmannia/숙지황)',
    scientificName: 'Rehmannia glutinosa Liboschitz',
    category: '뿌리류',
    efficacy: '신장과 간의 정혈을 보하고(보혈자음), 만성 피로 회복과 허약 체질 개선, 혈당 조절 및 체력 증진에 도움을 줍니다.',
    sideEffects: '숙지황은 성질이 끈적하고 무게감이 있어, 소화력이 극도로 약하거나 담음으로 설사를 자주 하는 분은 소화 장애를 유발할 수 있습니다.',
    howToUse: '구증구포 과정을 거친 숙지황 10~15g을 물 1L에 넣고 깊게 달여 짙은 풍미의 건강차로 복용합니다.',
    imageUrl: 'images/rehmannia.jpg',
  },
  {
    id: 'herbs-23',
    name: '황기 (Astragalus)',
    scientificName: 'Astragalus membranaceus Bunge',
    category: '뿌리류',
    efficacy: '기운을 돋우고(보기승양), 면역력 강화, 식은땀(자한) 증상 완화, 피부 상처 회복 및 부종 제거에 탁월한 효능이 있습니다.',
    sideEffects: '몸에 발열이 심하거나 실열(實熱)이 찬 상태에서는 단독 사용을 피해야 합니다.',
    howToUse: '잘 말린 황기 뿌리 15~20g을 물 1.5L에 넣고 은은하게 달여 약선차로 마시거나 삼계탕 등 보양 요리에 활용합니다.',
    imageUrl: 'images/astragalus.png',
  },
  {
    id: 'herbs-24',
    name: '자소엽 (Purple Perilla Leaf/차조기)',
    scientificName: 'Perilla frutescens var. acuta',
    category: '잎류',
    efficacy: '감기 기운을 내보내고(발산풍한), 위장 기운을 편안하게 조절하며, 생선이나 게 중독 해독 및 소염, 신경 안정 효과가 뛰어납니다.',
    sideEffects: '성질이 따뜻하고 발산시키는 힘이 강하므로, 몸에 열이 많고 땀을 지나치게 많이 흘리는 체질은 과용하지 않습니다.',
    howToUse: '건조된 자소엽 잎 5~10g을 80~90도 따뜻한 물에 우려 은은한 자줏빛 향기차로 마십니다.',
    imageUrl: 'images/jasoyeop.jpg',
  },
  {
    id: 'herbs-25',
    name: '구절초 (Siberian Chrysanthemum)',
    scientificName: 'Chrysanthemum zawadskii Herbich',
    category: '뿌리잎류',
    efficacy: '몸을 따뜻하게 만들고 여성 질환(월경불순, 자궁 냉증) 완화, 혈액순환 촉진, 위장 기능 강화에 효과적입니다.',
    sideEffects: '따뜻한 성질을 지니고 있어 체질적으로 열이 심하게 많은 사람이 많이 마시면 답답함을 느낄 수 있습니다.',
    howToUse: '덖어낸 구절초 줄기와 잎 5~10g을 따뜻한 물에 우려내어 하루 2회 차로 음용합니다.',
    imageUrl: 'images/siberian_chrysanthemum.png',
  },
  {
    id: 'herbs-26',
    name: '곽향 (Agastache/배초향)',
    scientificName: 'Agastache rugosa (Fisch. & Mey.) Kuntze',
    category: '뿌리잎류',
    efficacy: '소화기 기운을 깨워주고(쾌위소식), 여름철 냉방병, 구토, 설사, 소화불량을 개선하며 구강 청결과 소염 작용에 탁월합니다.',
    sideEffects: '성질이 따뜻하고 향이 강하여 체내 진액이 부족하고 열이 잘 오르는 사람은 과다 섭취 시 주의해야 합니다.',
    howToUse: '말린 곽향 전초 5~10g을 끓는 물에 우려 상쾌하고 독특한 향을 즐기며 마십니다.',
    imageUrl: 'images/agastache.png',
  },
  {
    id: 'herbs-27',
    name: '엉겅퀴 (Thistle/대계)',
    scientificName: 'Cirsium japonicum DC.',
    category: '뿌리잎류',
    efficacy: '간 기능 개선 및 실리마린 성분을 통한 해독/지혈 작용, 혈액순환 증진, 체력 보강 및 소염 효능이 매우 높습니다.',
    sideEffects: '성질이 서늘하므로 아랫배가 차거나 위장 소화력이 약한 분은 다량 섭취 시 설사를 일으킬 수 있습니다.',
    howToUse: '엉겅퀴 뿌리와 잎 10g을 물 1L에 넣고 달여 하루 2회 마시거나 즙으로 드시면 좋습니다.',
    imageUrl: 'images/thistle.png',
  },
  {
    id: 'herbs-28',
    name: '산사 (Hawthorn Berry/산사나무 열매)',
    scientificName: 'Crataegus pinnatifida Bunge',
    category: '열매류',
    efficacy: '소화를 잘 시키고(건위소식, 특히 육류 소화), 혈중 콜레스테롤 저하, 혈관 건강 증진 및 고혈압 예방에 도움을 줍니다.',
    sideEffects: '위산 분비를 촉진하므로 위궤양 환자나 위산과다 증상이 있는 분은 공복 복용을 피해야 합니다.',
    howToUse: '말린 산사 열매 10~15g을 물 1L에 넣고 달여 새콤달콤한 건강차로 식후에 마십니다.',
    imageUrl: 'images/hawthorn.png',
  },
  {
    id: 'herbs-29',
    name: '황금 (Scutellaria Baicalensis)',
    scientificName: 'Scutellaria baicalensis Georgi',
    category: '뿌리류',
    efficacy: '열을 내리고 습을 말리며(청열조습), 해독 및 항염 작용, 상초의 열감을 완화하고 출혈을 억제하며 자궁을 안태(安胎)시킵니다.',
    sideEffects: '성질이 매우 차가우므로 속이 차고 소화력이 약하며 설사를 자주 하는 체질은 과다 복용을 금해야 합니다.',
    howToUse: '잘 말린 황금 뿌리 5~10g을 물 1L에 넣고 약불로 달여 하루 2~3회 따뜻한 차로 음용합니다.',
    imageUrl: 'images/scutellaria.jpg',
  },
  {
    id: 'herbs-30',
    name: '황련 (Coptis Rhizome)',
    scientificName: 'Coptis japonica Makino',
    category: '뿌리류',
    efficacy: '심장의 열을 내리고(청심전화), 위장 염증 완화, 강력한 천연 항균/소염 및 해독 작용으로 가슴 답답함과 입안 짓무름을 개선합니다.',
    sideEffects: '쓴맛과 찬 성질이 극심하므로 장기 복용 시 위장 기운을 상하게 할 수 있어 주의가 필요합니다.',
    howToUse: '법제된 황련 2~4g을 약불로 달여 소량씩 나누어 복용하거나 타 약재와 블렌딩하여 음용합니다.',
    imageUrl: 'images/coptis.jpg',
  },
  {
    id: 'herbs-31',
    name: '부자 (Aconite Root)',
    scientificName: 'Aconitum carmichaeli Debeaux',
    category: '뿌리류',
    efficacy: '몸속의 차가운 기운을 몰아내고 쇠퇴한 양기를 근본적으로 회복(회양구역), 무릎과 허리의 냉통을 완화시킵니다.',
    sideEffects: '아코니틴 독성이 매우 강하므로 생부자는 절대로 섭취하면 안 되며, 반드시 전문가 가이드에 따라 오포/포부자로 법제된 것만 극소량 사용해야 합니다.',
    howToUse: '법제된 부자 3~5g을 생강, 감초 등과 함께 푹 달여 지정된 용량만 엄격히 복용합니다.',
    imageUrl: 'images/aconite.jpg',
  },
  {
    id: 'herbs-32',
    name: '창출 (Atractylodes Lancea)',
    scientificName: 'Atractylodes lancea (Thunb.) DC.',
    category: '뿌리류',
    efficacy: '소화기의 습기를 말리고(조습건비), 풍한 기운을 발산시키며, 눈을 맑게 하고 위장 가스 배출 및 식욕을 촉진합니다.',
    sideEffects: '성질이 따뜻하고 건조시키는 힘이 강하므로 체내 진액이 부족하고 땀이 많은 분은 과용을 피해야 합니다.',
    howToUse: '말린 창출 6~12g을 물 1L와 함께 끓여 식후 따뜻한 건강차로 복용합니다.',
    imageUrl: 'images/atractylodes_lancea.jpg',
  },
  {
    id: 'herbs-33',
    name: '갈근 (Kuzu Root/칡뿌리)',
    scientificName: 'Pueraria lobata (Willd.) Ohwi',
    category: '뿌리류',
    efficacy: '뭉친 뼛속 열을 풀고(해기퇴열), 뭉친 어깨와 목 뒤 근육을 이완시키며, 숙취 해소 및 갈증/혈당 조절에 도움을 줍니다.',
    sideEffects: '성질이 서늘하므로 평소 속이 차거나 위장이 약한 분은 과다 섭취 시 속 쓰림을 유발할 수 있습니다.',
    howToUse: '말린 갈근 10~20g을 물 1.5L에 넣고 은은하게 달여 즙이나 차로 자주 음용합니다.',
    imageUrl: 'images/pueraria_root.jpg',
  },
  {
    id: 'herbs-34',
    name: '백복령 (Poria/복령)',
    scientificName: 'Poria cocos Wolf',
    category: '뿌리류',
    efficacy: '비장을 튼튼하게 하고(건비리습), 수분 대사를 활성화하여 부종을 제거하며, 마음을 편안하게(안신) 해 불면증을 완화합니다.',
    sideEffects: '이뇨 작용이 강하므로 소변 양이 지나치게 많고 몸이 여윈 체질은 적정량을 준수해야 합니다.',
    howToUse: '백복령 가루나 건조 덩어리 10~15g을 물 1L에 달여 달콤한 차로 드시거나 죽에 넣어 섭취합니다.',
    imageUrl: 'images/poria.jpg',
  },
  {
    id: 'herbs-74',
    name: '복신 (Poria cum Radice Pini/복신)',
    scientificName: 'Poria cocos Wolf',
    category: '뿌리류',
    efficacy: '마음을 편안하게 하고 신경을 안정시키며(안신정지), 건망증 및 불면증 완화, 가슴 두근거림(경계) 해소, 비장을 보하고 습기를 제거(건비리습).',
    sideEffects: '이뇨 작용이 있으므로 소변 양이 지나치게 많거나 체액이 부족한 체질은 적정량을 준수해야 합니다.',
    howToUse: '말린 복신 10~15g을 물 1~1.5L에 넣고 약불로 달여 차로 음용하거나 심신 안정을 돕는 약선차로 섭취합니다.',
    imageUrl: 'images/boksin.jpg',
  },
  {
    id: 'herbs-75',
    name: '적복령 (Red Poria/적복령)',
    scientificName: 'Poria cocos Wolf',
    category: '뿌리류',
    efficacy: '체내 습열을 배출(행수청열), 소변 불통 및 습열로 인한 배뇨 장애 개선, 수액 대사 촉진 및 부종 완화.',
    sideEffects: '성질이 서늘하고 습열을 배출시키므로 몸이 차거나 허약한 체질은 과다 복용을 피해야 합니다.',
    howToUse: '건조 적복령 10~15g을 물 1L에 넣고 은은한 불에 달여 하루 2~3회 나누어 마십니다.',
    imageUrl: 'images/jeokbokryeong.jpg',
  },
  {
    id: 'herbs-35',
    name: '택사 (Alisma Root)',
    scientificName: 'Alisma orientale (Sam.) Juzep.',
    category: '뿌리류',
    efficacy: '신장과 방광의 습열을 배출(리수삼습), 부종 감소, 혈중 지질 및 소변 대사 개선에 도움을 줍니다.',
    sideEffects: '장기 과다 복용 시 신장 기운이 둔해질 수 있으므로 몸이 허하고 차가운 경향이 있으면 과용을 자제합니다.',
    howToUse: '택사 6~12g을 물 1L로 달여 하루 2~3회 나누어 음용합니다.',
    imageUrl: 'images/alisma.jpg',
  },
  {
    id: 'herbs-36',
    name: '백출 (Atractylodes Rhizome)',
    scientificName: 'Atractylodes macrocephala Koidz.',
    category: '뿌리류',
    efficacy: '위장 기운을 대대적으로 보강(보기건비), 소화불량 및 무기력증 해소, 땀 조절 및 태아를 안정(안태)시킵니다.',
    sideEffects: '체내 열이 지나치게 많고 건조한 체질은 과다 복용 시 가슴 답답함을 느낄 수 있습니다.',
    howToUse: '말린 백출 8~12g을 물 1L에 끓여 식전 또는 식후 따뜻한 건강차로 수시로 복용합니다.',
    imageUrl: 'images/atractylodes_macrocephala.jpg',
  },
  {
    id: 'herbs-37',
    name: '향부자 (Cyperus Rhizome)',
    scientificName: 'Cyperus rotundus L.',
    category: '뿌리류',
    efficacy: '기의 순환을 원활하게 뚫어주고(수간리기), 울화나 스트레스를 해소하며 여성 생리통 및 하복부 통증을 완화합니다.',
    sideEffects: '기운을 흩뜨리는 성질이 있어 기혈이 심하게 허약한 사람은 과용을 삼가야 합니다.',
    howToUse: '덖은 향부자 6~10g을 달여 따뜻하게 차로 우려 마십니다.',
    imageUrl: 'images/cyperus_rotundus.jpg',
  },
  {
    id: 'herbs-38',
    name: '시호 (Bupleurum Root)',
    scientificName: 'Bupleurum falcatum L.',
    category: '뿌리류',
    efficacy: '가슴에 뭉친 열과 화병을 풀고(해울퇴열), 간 기운을 원활하게 소통(소간해울)시키며 감기 오한발열을 완화합니다.',
    sideEffects: '기운을 위로 끌어올리는 힘이 강하므로 고혈압이나 뇌충혈 경향이 있는 체질은 주의가 필요합니다.',
    howToUse: '건조 시호 4~8g을 물 1L로 약불에서 은은히 달여 복용합니다.',
    imageUrl: 'images/bupleurum_falcatum.jpg',
  },
  {
    id: 'herbs-39',
    name: '산약 (Yam/마)',
    scientificName: 'Dioscorea opposita Thunb.',
    category: '뿌리류',
    efficacy: '비장, 위장, 폐, 신장을 두루 보하고(건비익위), 체력을 증진시키며 만성 설사와 당뇨/갈증 개선에 도움을 줍니다.',
    sideEffects: '성질이 평이하나 끈적이는 점액질이 있어 체기나 습담이 심할 때는 조절이 필요합니다.',
    howToUse: '말린 산약 15~20g을 물 1.5L에 달이거나 분말로 따뜻한 우유나 물에 타서 복용합니다.',
    imageUrl: 'images/dioscorea.jpg',
  },
  {
    id: 'herbs-40',
    name: '우슬 (Achyranthes Root/쇠무릎)',
    scientificName: 'Achyranthes bidentata Blume',
    category: '뿌리류',
    efficacy: '관절과 뼈를 튼튼하게 하고(강근골), 어혈을 풀어 하체 혈액순환 촉진 및 무릎, 허리 통증 개선에 탁월합니다.',
    sideEffects: '자궁 수축을 자극할 수 있어 임산부 및 임신 가능성이 있는 분은 절대 섭취를 금해야 합니다.',
    howToUse: '잘 말린 우슬 뿌리 10~15g을 물 1.5L에 넣고 달여 차로 음용합니다.',
    imageUrl: 'images/achyranthes.jpg',
  },
  {
    id: 'herbs-41',
    name: '길경 (Balloon Flower Root/도라지)',
    scientificName: 'Platycodon grandiflorus (Jacq.) A. DC.',
    category: '뿌리류',
    efficacy: '폐 기운을 열어 기침을 진정(선폐배농), 가래 제거, 목 통증 및 기관지 염증 완화에 효과가 높습니다.',
    sideEffects: '사포닌 성분이 강해 위점막을 자극할 수 있으므로 위궤양 환자는 공복 복용을 자제합니다.',
    howToUse: '건조 길경 6~12g을 감초나 꿀과 함께 달여 따뜻한 차로 마십니다.',
    imageUrl: 'images/platycodon.jpg',
  },
  {
    id: 'herbs-42',
    name: '패모 (Fritillaria Bulb)',
    scientificName: 'Fritillaria thunbergii Miq.',
    category: '뿌리류',
    efficacy: '폐를 윤택하게 하고(청열화담), 마른기침과 짙은 가래를 삭이며 목 안의 멍울 및 염증을 진정시킵니다.',
    sideEffects: '성질이 차갑고 기침을 억제하므로 찬 바람 감기로 인한 맑은 가래 기침에는 적합하지 않습니다.',
    howToUse: '패모 4~8g을 달이거나 가루로 만들어 따뜻한 물과 함께 복용합니다.',
    imageUrl: 'images/fritillaria.jpg',
  },
  {
    id: 'herbs-43',
    name: '하수오 (Polygonum Multiflorum)',
    scientificName: 'Polygonum multiflorum Thunb.',
    category: '뿌리류',
    efficacy: '간과 신장의 정혈을 보하여(보간신익정혈) 흰 머리를 검게 돕고, 노화 방지, 체력 보강 및 장 운동을 원활하게 합니다.',
    sideEffects: '적하수오 날것은 간 독성을 유발할 수 있으므로 반드시 법제(구증구포)된 것을 안전하게 사용해야 합니다.',
    howToUse: '법제된 하수오 10g을 물 1L에 달여 차로 수시로 마십니다.',
    imageUrl: 'images/hasuo.jpg',
  },
  {
    id: 'herbs-44',
    name: '치자 (Gardenia Fruit)',
    scientificName: 'Gardenia jasminoides J. Ellis',
    category: '열매류',
    efficacy: '몸 안의 화기와 열을 내리고(청열사화), 불면증, 가슴 답답함, 소염 및 해독, 눈 충혈을 제거합니다.',
    sideEffects: '성질이 매우 차가우므로 몸이 차고 설사를 자주 하는 분은 장기 복용을 피해야 합니다.',
    howToUse: '말린 치자 열매 3~6g을 쪼개어 물 1L에 달여 수시로 마십니다.',
    imageUrl: 'images/gardenia.jpg',
  },
  {
    id: 'herbs-45',
    name: '오미자 (Schisandra Berry)',
    scientificName: 'Schisandra chinensis (Turcz.) Baill.',
    category: '열매류',
    efficacy: '다섯 가지 맛으로 장기를 보호(수렴고설), 만성 기침 진정, 식은땀 방지, 피로 회복 및 집중력 향상에 도움을 줍니다.',
    sideEffects: '발열이나 고열 감기 초기, 땀이 나지 않는 독감 상태에서는 과용에 주의합니다.',
    howToUse: '오미자 10g을 찬물 1L에 하루 동안 우려내어 붉은 수액차로 마십니다 (뜨거운 물은 쓴맛 유발).',
    imageUrl: 'images/schisandra.jpg',
  },
  {
    id: 'herbs-46',
    name: '연자육 (Lotus Seed)',
    scientificName: 'Nelumbo nucifera Gaertn. (Seed)',
    category: '열매류',
    efficacy: '마음을 정돈하고 신경을 안정(보비안신), 불면 완화, 위장 기능 강화 및 만성 설사를 개선합니다.',
    sideEffects: '변비가 심하거나 소화기가 많이 뭉친 경우 과다 섭취 시 가스 팽만감이 생길 수 있습니다.',
    howToUse: '연자육 10~15g을 따뜻한 물에 불려 밥에 넣거나 물에 차로 달여 드십니다.',
    imageUrl: 'images/lotus_seed.jpg',
  },
  {
    id: 'herbs-47',
    name: '산조인 (Jujuba Seed)',
    scientificName: 'Ziziphus jujuba Mill. var. spinosa',
    category: '열매류',
    efficacy: '심장을 보하고 신경을 이완(양심안신), 수면 장애 및 불면증, 가슴 두근거림과 식은땀 개선에 탁월합니다.',
    sideEffects: '날것은 오히려 잠을 깨울 수 있으므로 반드시 노랗게 덖어서(초산조인) 복용해야 합니다.',
    howToUse: '덖은 산조인 10~15g을 물 1L로 30분간 달여 잠들기 전 따뜻하게 마십니다.',
    imageUrl: 'images/sanjoin.jpg',
  },
  {
    id: 'herbs-48',
    name: '사인 (Amomum Fruit)',
    scientificName: 'Amomum villosum Lour.',
    category: '열매류',
    efficacy: '위장을 따뜻하게 하고(행기화습), 소화불량 및 헛배부름, 구토 완화, 임산부 유산 방지(안태)에 효과적입니다.',
    sideEffects: '성질이 따뜻하고 건조하므로 체진액이 부족하고 열이 많은 체질은 주의가 필요합니다.',
    howToUse: '씨앗 3~6g을 살짝 빻아 달이는 마지막 단계에 넣거나 차로 우려냅니다.',
    imageUrl: 'images/sain.jpg',
  },
  {
    id: 'herbs-49',
    name: '결명자 (Cassia Seed)',
    scientificName: 'Cassia tora L.',
    category: '열매류',
    efficacy: '간 열을 내려 눈을 밝게 하고(청간명목), 변비 개선 및 혈압과 콜레스테롤 조절에 도움을 줍니다.',
    sideEffects: '장 운동을 자극하고 서늘하므로 저혈압이나 묽은 변을 자주 보는 분은 주의가 필요합니다.',
    howToUse: '볶은 결명자 10~15g을 물 1.5L에 넣고 달여 고소한 식수차로 이용합니다.',
    imageUrl: 'images/gyeolmyungja.jpg',
  },
  {
    id: 'herbs-50',
    name: '청상자 (Celosia Seed/맨드라미 씨앗)',
    scientificName: 'Celosia argentea L.',
    category: '열매류',
    efficacy: '간화(간의 열)를 가라앉혀 눈의 충혈과 통증, 결막염 완화 및 눈 건강 증진에 도움을 줍니다.',
    sideEffects: '동공을 확대시키는 작용이 있을 수 있어 녹내장 환자는 복용을 금해야 합니다.',
    howToUse: '청상자 5~10g을 물 1L로 달여 차로 가볍게 우려 마십니다.',
    imageUrl: 'images/cheongsangja.jpg',
  },
  {
    id: 'herbs-51',
    name: '창이자 (Xanthium Fruit/도꼬마리)',
    scientificName: 'Xanthium strumarium L.',
    category: '열매류',
    efficacy: '코 막힘을 뚫고(통비구), 만성 비염, 축농증 완화, 피부 가려움 및 관절통 해소에 효과적입니다.',
    sideEffects: '약한 독성이 있으므로 반드시 가시를 가공하거나 볶아서(초창이자) 정량만 복용해야 합니다.',
    howToUse: '볶은 창이자 3~6g을 물 1L로 달여서 복용합니다.',
    imageUrl: 'images/changija.jpg',
  },
  {
    id: 'herbs-52',
    name: '백과 (Ginkgo Seed/은행)',
    scientificName: 'Ginkgo biloba L.',
    category: '열매류',
    efficacy: '폐 기운을 가라앉혀 기침과 천식을 진정(렴폐정천), 대하증 및 빈뇨 증상 완화에 도움을 줍니다.',
    sideEffects: '청산배당체 독성이 있으므로 날로 먹지 말고 반드시 익혀서 하루 성인 10알 내외로 제한해야 합니다.',
    howToUse: '겉껍질을 까고 구우거나 볶아 간식처럼 적량을 섭취합니다.',
    imageUrl: 'images/baekgwa.jpg',
  },
  {
    id: 'herbs-53',
    name: '행인 (Apricot Seed/살구씨)',
    scientificName: 'Prunus armeniaca L.',
    category: '열매류',
    efficacy: '기침을 진정시키고 가래를 삭이며(지해평천), 장을 윤택하게 하여 변비를 해소합니다.',
    sideEffects: '아미그달린 독성이 포함되어 과다 섭취 시 중독 우려가 있으므로 정량(3~6g)만 사용합니다.',
    howToUse: '법제된 행인을 달여 마시거나 타 약재와 함께 블렌딩하여 이용합니다.',
    imageUrl: 'images/haengin.jpg',
  },
  {
    id: 'herbs-54',
    name: '토사자 (Cuscuta Seed/새삼씨)',
    scientificName: 'Cuscuta chinensis Lam.',
    category: '열매류',
    efficacy: '간과 신장을 보하고(보익간신), 정력을 강화하며 눈을 맑게 하고 요통 및 하체 무력감을 개선합니다.',
    sideEffects: '성질이 따뜻하여 소변이 시원치 않거나 몸에 강한 실열이 있는 경우 섭취량을 조절합니다.',
    howToUse: '토사자 10~15g을 물 1L로 달여 건강차로 매일 나누어 음용합니다.',
    imageUrl: 'images/tosaja.jpg',
  },
  {
    id: 'herbs-55',
    name: '인진호 (Artemisia Capillaris/사철쑥)',
    scientificName: 'Artemisia capillaris Thunb.',
    category: '뿌리잎류',
    efficacy: '간의 습열을 제거하고(청열리습), 황달 예방 및 간 기능 개선, 지방간 및 소화 장애 해소에 탁월합니다.',
    sideEffects: '성질이 서늘하여 몸이 차거나 소화기가 매우 허약한 사람은 장기 과다 복용을 자제합니다.',
    howToUse: '말린 인진호 10~15g을 물 1.5L에 넣고 달여서 차로 수시로 복용합니다.',
    imageUrl: 'images/injinho.jpg',
  },
  {
    id: 'herbs-56',
    name: '감국 (Wild Chrysanthemum/국화꽃)',
    scientificName: 'Chrysanthemum indicum L.',
    category: '약초꽃류',
    efficacy: '두통과 눈의 피로를 풀어주고(청두명목), 감기 열감을 내리며 혈압 조절 및 신경 안정에 도움을 줍니다.',
    sideEffects: '찬 성질이 있어 복부가 차고 소화가 잘 안 되는 분은 다량 복용을 피해야 합니다.',
    howToUse: '잘 덖은 감국 꽃잎 3~5송이를 뜨거운 물 200ml에 넣어 은은하게 우려 마십니다.',
    imageUrl: 'images/gamguk.jpg',
  },
  {
    id: 'herbs-57',
    name: '육계 (Cinnamon Bark/계피)',
    scientificName: 'Cinnamomum cassia Presl',
    category: '껍질류',
    efficacy: '몸속 깊은 곳의 차가운 기운을 몰아내고(온통혈맥), 손발냉증 완화, 위장 운동 자극 및 혈액순환을 촉진합니다.',
    sideEffects: '열이 매우 높고 임산부이거나 출혈성 질환이 있는 경우 과다 복용을 금해야 합니다.',
    howToUse: '육계 껍질 3~6g을 달이거나 수정과, 차 등에 넣어 풍미와 효능을 즐깁니다.',
    imageUrl: 'images/yukgye.jpg',
  },
  {
    id: 'herbs-58',
    name: '진피 (Dried Tangerine Peel/귤껍질)',
    scientificName: 'Citrus unshiu Markovich',
    category: '껍질류',
    efficacy: '기순환을 촉진하고(리기건비), 습담을 제거하여 소화불량, 구토, 가래 기침 개선에 뛰어납니다.',
    sideEffects: '체내 진액이 몹시 부족하여 마른기침을 하는 분은 다량 섭취 시 주의가 필요합니다.',
    howToUse: '오래 묵은 건조 진피 5~10g을 따뜻한 물에 우려 구수한 향의 진피차로 음용합니다.',
    imageUrl: 'images/jinpi.jpg',
  },
  {
    id: 'herbs-59',
    name: '두충 (Eucommia Bark)',
    scientificName: 'Eucommia ulmoides Oliver',
    category: '껍질류',
    efficacy: '간과 신장을 보하여(보간신강근골), 허리와 무릎 통증 완화, 관절 강화 및 고혈압 개선에 효과적입니다.',
    sideEffects: '실열이 많거나 체질이 몹시 화기가 강한 분은 조절하여 섭취해야 합니다.',
    howToUse: '실을 제거하도록 볶은 두충 10~15g을 물 1.5L로 달여 건강차로 음용합니다.',
    imageUrl: 'images/duchung.jpg',
  },
  {
    id: 'herbs-60',
    name: '오가피 (Siberian Ginseng Bark/가시오가피)',
    scientificName: 'Acanthopanax sessiliflorum Seem.',
    category: '껍질류',
    efficacy: '기운을 돋우고 근골을 강화(보간신강근골), 면역력 증진, 피로 회복 및 뼈 건강 향상에 효능이 있습니다.',
    sideEffects: '성질이 따뜻하여 몸에 급성 염증이나 고열이 있을 때는 과용을 금해야 합니다.',
    howToUse: '말린 오가피 껍질이나 줄기 15~20g을 물 1.5L와 달여서 수시로 마십니다.',
    imageUrl: 'images/ogapi.jpg',
  },
  {
    id: 'herbs-61',
    name: '목단피 (Moutan Bark/모란뿌리껍질)',
    scientificName: 'Paeonia suffruticosa Andr.',
    category: '껍질류',
    efficacy: '혈열을 내리고 어혈을 삭임(청열량혈, 활혈거어), 여성 생리통 및 혈액순환 장애 개선에 도움을 줍니다.',
    sideEffects: '자궁을 자극하고 혈액을 맑게 하므로 임산부나 과다 출혈 환자는 복용을 금해야 합니다.',
    howToUse: '말린 목단피 6~12g을 물 1L로 달여서 나누어 마십니다.',
    imageUrl: 'images/mokdanpi.jpg',
  },
  {
    id: 'herbs-62',
    name: '곡기생 (Mistletoe/겨우살이)',
    scientificName: 'Viscum coloratum (Kom.) Nakai',
    category: '가지류',
    efficacy: '바람과 습기를 제거하고(거풍습강근골), 신경통/관절통 완화, 항암 및 고혈압 개선에 효과적입니다.',
    sideEffects: '과다 섭취 시 충혈이나 알레르기 반응이 나타날 수 있으므로 권장량을 지켜야 합니다.',
    howToUse: '건조 곡기생 가지 10~15g을 물 1.5L에 넣고 달여 차처럼 음용합니다.',
    imageUrl: 'images/gokgisaeng.jpg',
  },
  {
    id: 'herbs-63',
    name: '계지 (Cinnamon Twig)',
    scientificName: 'Cinnamomum cassia Presl (Twig)',
    category: '가지류',
    efficacy: '경락을 따뜻하게 통하게 하고(발한해肌, 온통경맥), 어깨 및 팔관절 통증 완화, 감기 초기 발한 해열에 뛰어납니다.',
    sideEffects: '따뜻한 성질이 강하여 높은 열이 나는 열성 감기에는 피하는 것이 좋습니다.',
    howToUse: '말린 계지 가지 6~10g을 끓여 감기 초기 따뜻하게 마십니다.',
    imageUrl: 'images/gyeji.jpg',
  },
  {
    id: 'herbs-64',
    name: '모려 (Oyster Shell/굴껍질)',
    scientificName: 'Ostrea gigas Thunberg',
    category: '해산물류',
    efficacy: '신경을 안정시키고(평간잠양, 수렴고설), 식은땀 완화, 위산과다 및 가슴 두근거림을 개선합니다.',
    sideEffects: '성질이 서늘하고 중량이 무거우므로 소화력이 심하게 저하된 경우 과용을 금합니다.',
    howToUse: '세척 및 달군 모려 껍질 15~30g을 먼저 오래 달인 후 약물을 음용합니다.',
    imageUrl: 'images/moryeo.jpg',
  },
  {
    id: 'herbs-65',
    name: '별갑 (Turtle Shell/자라껍질)',
    scientificName: 'Trionyx sinensis Wiegmann',
    category: '해산물류',
    efficacy: '음기를 보하고 열을 내리며(자음잠양, 야열조량), 뭉친 멍울이나 흉복부 어혈 제거에 효과가 있습니다.',
    sideEffects: '임산부 및 소화 기능이 극도로 약하고 식욕이 없는 경우 복용을 자제합니다.',
    howToUse: '법제된 별갑 10~20g을 오랫동안 달여 약차로 섭취합니다.',
    imageUrl: 'images/byeolgap.jpg',
  },
  {
    id: 'herbs-66',
    name: '용골 (Fossilized Dragon Bone)',
    scientificName: 'Fossilized Bone of Mammals',
    category: '화석류',
    efficacy: '마음과 정신을 강하게 안돈(정심안신), 불면증, 불안감, 식은땀 및 경련 증상을 진정시킵니다.',
    sideEffects: '체내에 무거운 기운이 머물 수 있으므로 식체나 감기 초기에는 사용하지 않습니다.',
    howToUse: '가공 및 단쇄한 용골 15~30g을 물에 30분 이상 먼저 달인 후 약물을 섭취합니다.',
    imageUrl: 'images/yonggol.jpg',
  },
  {
    id: 'herbs-67',
    name: '우슬꽃 (Achyranthes Flower)',
    scientificName: 'Achyranthes bidentata Blume var. japonica',
    category: '약초꽃류',
    efficacy: '관절과 뼈를 튼튼하게 하고 어혈을 풀며, 약초 꽃차로서 몸을 따뜻하게 하고 혈액 순환을 도우며 피로 회복과 면역 조절에 도움을 줍니다.',
    sideEffects: '임산부나 자궁 수축 우려가 있는 분은 섭취를 금해야 하며, 꽃가루 알레르기가 있는 분은 주의해야 합니다.',
    howToUse: '잘 말린 우슬꽃을 덖은 후, 뜨거운 물에 2~3송이를 우려내어 향이 그윽한 꽃차로 음용합니다.',
    imageUrl: 'images/achyranthes_flower.jpg',
  },
  {
    id: 'herbs-68',
    name: '선태 (Cicada Slough/매미허물)',
    scientificName: 'Cryptotympana atrata Fabricius',
    category: '껍질류',
    efficacy: '몸 안의 풍열을 발산시키고(소산풍열), 인후통 및 목이 쉰 증상을 개선하며, 소아의 경풍 및 피부 가려움증, 두드러기 완화에 도움을 줍니다.',
    sideEffects: '체질이 매우 허약하거나 기운이 없는 사람, 임산부는 신중하게 복용해야 합니다.',
    howToUse: '깨끗이 세척하여 건조된 선태 3~6g을 물 1L에 달여 차로 마시거나, 가루로 내어 미온수에 타서 복용합니다.',
    imageUrl: 'images/seontae.jpg',
  },
  {
    id: 'herbs-69',
    name: '건강 (Dried Ginger/말린 생강)',
    scientificName: 'Zingiber officinale Roscoe',
    category: '뿌리류',
    efficacy: '몸을 따뜻하게 구원(온중산한), 배속 찬 기운 제거, 뱃속 냉통 및 만성 소화불량 완화, 혈액순환 촉진 및 면역력 증진.',
    sideEffects: '성질이 몹시 따뜻하므로 몸에 열이 많거나 헛열이 뜨는 음허화왕 체질, 위궤양 환자는 과다 섭취를 주의해야 합니다.',
    howToUse: '건강 3~6g을 물 1L와 함께 약불에서 달여 따뜻하게 차로 마십니다. 대추나 감초를 함께 넣으면 더욱 부드럽게 음용할 수 있습니다.',
    imageUrl: 'images/geongang.jpg',
  },
  {
    id: 'herbs-70',
    name: '고본 (Ligusticum Rhizome)',
    scientificName: 'Ligusticum sinense Oliv.',
    category: '뿌리류',
    efficacy: '정수리 두통(두정통) 완화, 찬 기운과 습기를 몰아냄(거풍산한제습), 관절통 및 신경통 개선, 피부 가려움 완화.',
    sideEffects: '성질이 따뜻하고 기운을 흩뜨리므로 혈허로 인한 두통이나 몸에 열이 많은 분은 복용에 주의해야 합니다.',
    howToUse: '말린 고본 뿌리 4~8g을 물 1L에 넣고 달여 하루 2~3회 나누어 차로 음용합니다.',
    imageUrl: 'images/gobon.jpg',
  },
  {
    id: 'herbs-71',
    name: '단삼 (Red Sage Root)',
    scientificName: 'Salvia miltiorrhiza Bunge',
    category: '뿌리류',
    efficacy: '혈액순환 촉진 및 어혈 제거(활혈거어), 심혈관 질환 예방, 새로운 피를 생성(생혈양심), 심정 안정 및 생리통 완화.',
    sideEffects: '혈액 응고를 억제하므로 항응고제(와파린 등) 복용자, 출혈성 질환자 및 임산부는 섭취에 주의하거나 금해야 합니다.',
    howToUse: '말린 단삼 뿌리 6~12g을 물 1L에 넣고 약불로 달여 건강차로 하루 2~3회 따뜻하게 마십니다.',
    imageUrl: 'images/dansam.jpg',
  },
  {
    id: 'herbs-72',
    name: '맥문동 (Liriope Tuber/맥문동 뿌리)',
    scientificName: 'Liriope platyphylla Wang & Tang',
    category: '뿌리류',
    efficacy: '폐를 윤택하게 하고 진액 생성(양음윤폐, 생진청심), 마른기침 및 기관지염 완화, 체력 보강, 당뇨/갈증 해소 및 불면 완화.',
    sideEffects: '성질이 약간 서늘하므로 아랫배가 차거나 위장이 허약하여 설사를 자주 하는 분은 과다 복용을 금합니다.',
    howToUse: '심(심주)을 제거한 맥문동 10~15g을 물 1.5L에 넣고 은은하게 달여 차로 음용하거나 오미자, 인삼과 함께 달여(생맥산) 마십니다.',
    imageUrl: 'images/maekmundong.jpg',
  },
  {
    id: 'herbs-73',
    name: '마인 (Hemp Seed/대마씨/삼씨)',
    scientificName: 'Cannabis sativa L.',
    category: '열매류',
    efficacy: '장을 윤택하게 하여 변비 해소(윤장통변), 체내 진액 보충, 피부 건조 완화 및 장 기능 개선, 필수 아미노산 및 오메가 지방산 풍부.',
    sideEffects: '기름 성분이 많아 평소 묽은 변을 보거나 설사를 자주 하는 사람은 과다 섭취 시 설사를 유발할 수 있습니다.',
    howToUse: '마인 10~15g을 살짝 볶아 달여 차로 마시거나 껍질을 벗긴 햄프씨드를 요리, 샐러드, 죽 등에 뿌려 섭취합니다.',
    imageUrl: 'images/main.jpg',
  },
  {
    id: 'herbs-76',
    name: '복분자 (Korean Black Raspberry)',
    scientificName: 'Rubus coreanus Miq.',
    category: '열매류',
    efficacy: '신장 기능을 강화하여(보간익신) 남성의 정력 보강, 여성을 위한 자궁 건강 및 요실금 완화, 항산화 작용(안토시아닌 풍부)으로 피로 회복 및 시력 보호, 노화 방지에 도움을 줍니다.',
    sideEffects: '성질이 따뜻하여 몸에 열이 아주 많거나 소변을 시원하게 보지 못하는 실열 체질은 과다 복용 시 열감이 생길 수 있습니다.',
    howToUse: '말린 복분자 10~15g을 물 1L에 넣고 약불로 달여 건강차로 하루 2~3회 마시거나 엑기스, 복분자주, 효소 등으로 활용합니다.',
    imageUrl: 'images/bokbunja.jpg',
  },
  {
    id: 'herbs-77',
    name: '여주 (Bitter Melon/고瓜)',
    scientificName: 'Momordica charantia L.',
    category: '열매류',
    efficacy: '식물성 인슐린과 카란틴 성분이 풍부하여 혈당 조절 및 당뇨 예방에 탁월하며, 체지방 분해, 면역력 강화, 피로 회복 및 체내 열을 내려줍니다(청열해독).',
    sideEffects: '성질이 매우 차가우므로 임산부(자궁 수축 위험)나 평소 복통, 설사가 잦은 분은 과다 섭취를 주의해야 합니다.',
    howToUse: '말린 여주 슬라이스 3~5g(2~3조각)을 따뜻한 물 1L에 우려내어 구수한 여주차로 마시거나 볶아서 차로 음용합니다.',
    imageUrl: 'images/yeoju.jpg',
  },
  {
    id: 'herbs-78',
    name: '독활 (Dokhwal/땅두릅 뿌리)',
    scientificName: 'Aralia continentalis Kitagawa',
    category: '뿌리류',
    efficacy: '관절통·신경통·요통 완화, 풍습 제거(거풍습), 중풍 예방 및 항염 작용, 면역력 강화.',
    sideEffects: '성질이 따뜻하고 매운 편이므로 체질적으로 열이 지나치게 많거나(음허화왕) 고열 발열 증상이 있는 분은 복용에 주의해야 합니다.',
    howToUse: '건조 독활 뿌리 10~15g을 물 1.5L에 넣고 약불에서 30~40분간 달여 하루 2~3회 따뜻하게 마십니다. 당귀, 천궁 등과 함께 달여 마셔도 좋습니다.',
    imageUrl: 'images/dokhwal.jpg',
  },
  {
    id: 'herbs-79',
    name: '모과 (Quince/목과)',
    scientificName: 'Chaenomeles sinensis (Thunb.) Koehne',
    category: '열매류',
    efficacy: '근육 이완 및 관절통·신경통 완화(서근활락), 소화 증진, 감기 예방 및 기관지염·기침 완화, 피로 회복.',
    sideEffects: '산도가 높아 위산과다 환자는 공복 복용을 피하며, 섭취 후 치아 보호를 위해 입을 헹궈주는 것이 좋습니다. 또한 소변 양이 감소할 수 있어 주의합니다.',
    howToUse: '잘 말린 모과 10~15g을 물 1L에 넣고 약불로 30분 정도 달여 따뜻한 차로 음용하거나, 꿀에 재워 모과청으로 우려 마십니다.',
    imageUrl: 'images/mogwa.jpg',
  },
  {
    id: 'herbs-80',
    name: '석창포 (Grass-leaved Sweet Flag/석창포 뿌리)',
    scientificName: 'Acorus gramineus Soland.',
    category: '뿌리류',
    efficacy: '심구(心竅)를 열어 머리를 맑게 하고(개규화담), 건망증 및 기억력 개선, 불면증 완화, 치매 예방, 정신을 안정시키고 청력을 돕습니다.',
    sideEffects: '성질이 따뜻하고 건조하므로 음허화왕(체진액이 부족하여 열이 뜨는 체질)이나 땀을 너무 많이 흘리는 사람은 단독 과다 복용 시 주의가 필요합니다.',
    howToUse: '건조된 석창포 뿌리줄기 6~12g을 물 1L에 넣고 약불에서 30분간 달여 하루 2~3회 나누어 차로 음용합니다. 원지, 용안육과 함께 달여 복용하면 더욱 좋습니다.',
    imageUrl: 'images/seokchangpo.jpg',
  },
  {
    id: 'herbs-81',
    name: '용안육 (Longan Aril/용안 열매과육)',
    scientificName: 'Dimocarpus longan Lour.',
    category: '열매류',
    efficacy: '심장과 피를 보하고(보익심패, 양혈안신), 건망증·불면증 완화, 과도한 스트레스와 피로 회복, 불안감 해소 및 마음을 편안하게 안돈시킵니다.',
    sideEffects: '달고 따뜻하여 체내에 습열(濕熱)이 많거나 소화 장애로 헛배가 부르고 담이 많은 체질은 과다 섭취 시 속 답답함이 생길 수 있습니다.',
    howToUse: '말린 용안육 10~15g을 은은하게 달여 차로 마시거나, 산조인, 당귀 등과 함께 끓여 약선차로 복용합니다. 그대로 씹어서 간식으로 섭취해도 좋습니다.',
    imageUrl: 'images/yonganuk.jpg',
  },
  {
    id: 'herbs-82',
    name: '사상자 (Torilis Fruit/뱀도터라기 씨앗)',
    scientificName: 'Torilis japonica (Houtt.) DC.',
    category: '열매류',
    efficacy: '신장의 양기를 돋우고(온신장양), 남성의 음위증(정력 강화)과 여성의 불임·냉대하 개선, 피부 습진 및 가려움증 완화, 거풍살충 작용에 탁월합니다.',
    sideEffects: '성질이 따뜻하고 건조하므로 몸에 음허화왕 증상이 있거나 열성 질환 환자는 복용량을 조절해야 합니다.',
    howToUse: '말린 사상자 열매 5~10g을 물 1L에 넣고 달여 따뜻하게 차로 마시거나, 외용제로 끓인 물로 가려운 피부 부위를 씻어내도 좋습니다.',
    imageUrl: 'images/sasangja.jpg',
  },
  {
    id: 'herbs-83',
    name: '상백피 (Mulberry Root Bark/뽕나무뿌리껍질)',
    scientificName: 'Morus alba L.',
    category: '껍질류',
    efficacy: '폐열을 내려 기침과 천식을 진정시키고(청폐평천), 이뇨 작용으로 부종(붓기)을 완화하며, 혈압 조절 및 안면 홍조, 기관지 염증 개선에 도움을 줍니다.',
    sideEffects: '성질이 차가우므로 평소 소화기능이 매우 약하여 묽은 변을 자주 보거나 찬 기운으로 인한 감기 기침에는 과다 복용을 자제합니다.',
    howToUse: '잘 말린 상백피 10~15g을 물 1.5L에 넣고 30~40분간 달여 하루 2~3회 나누어 따뜻하게 음용합니다.',
    imageUrl: 'images/sangbaekpi.jpg',
  },
  {
    id: 'herbs-84',
    name: '형개 (Schizonepeta/형개)',
    scientificName: 'Schizonepeta tenuifolia Briq.',
    category: '잎류',
    efficacy: '풍열 기운을 발산시키고(발산풍열), 초기 감기, 두통, 목의 통증 완화, 지혈 작용 및 피부 가려움증·두드러기 해소에 효능이 뛰어납니다.',
    sideEffects: '성질이 따뜻하고 매워 진액이 부족하고 열이 심하게 잘 오르는 체질은 다량 복용 시 주의해야 합니다.',
    howToUse: '건조된 형개 5~10g을 물 1L와 함께 은은하게 끓여 차로 음용하거나 족욕 시 탕약수로 활용합니다.',
    imageUrl: 'images/hyeonggae.jpg',
  },
  {
    id: 'herbs-85',
    name: '지각 (Bitter Orange Peel/지각)',
    scientificName: 'Citrus aurantium L.',
    category: '열매류',
    efficacy: '가슴과 위장의 뭉친 기운을 뚫어주고(행기파적), 소화 불량, 복부 팽만감 완화, 답답함 해소 및 위장 운동 촉진에 탁월합니다.',
    sideEffects: '기운을 강하게 내리는 힘이 있으므로 임산부나 체력이 극도로 약한 기허(氣虛) 체질은 복용에 유의합니다.',
    howToUse: '잘 말린 지각 슬라이스 5~10g을 물 1L에 넣고 달여 은은한 귤향과 함께 식후에 따뜻한 차로 마십니다.',
    imageUrl: 'images/jigak.jpg',
  },
  {
    id: 'herbs-86',
    name: '구자 (Chive Seeds/부추 씨앗)',
    scientificName: 'Allium tuberosum Rottler ex Spreng.',
    category: '열매류',
    efficacy: '신장의 양기를 보하고(보신조양), 허리와 무릎을 따뜻하고 튼튼하게 하며 남성 양기 보강, 소변 조절 능력 및 기력 회복에 좋은 효과가 있습니다.',
    sideEffects: '성질이 따뜻하므로 체질적으로 몸에 열이 매우 많거나 음허화왕(陰虛火旺)으로 눈이 충혈되는 사람은 복용량을 조절해야 합니다.',
    howToUse: '구자(부추 씨앗) 5~10g을 살짝 볶은 후 물 1L에 넣고 끓여 따뜻한 약선차로 마십니다.',
    imageUrl: 'images/guja.jpg',
  },
  {
    id: 'herbs-87',
    name: '지골피 (Lycium Root Bark/구기자 나무 뿌리껍질)',
    scientificName: 'Lycium chinense Miller',
    category: '껍질류',
    efficacy: '폐와 신장의 허열을 내리고(청허열), 당뇨(소갈) 증상 완화, 혈관 건강 증진 및 신경통, 뼈마디의 열감을 완화해 줍니다.',
    sideEffects: '성질이 차가우므로 평소 비위가 차고 소화 기능이 약하여 설사를 자주 하는 분은 소량 섭취하거나 전문가 상담이 필요합니다.',
    howToUse: '말린 지골피 10~15g을 물 1.5L에 넣고 30분 이상 달여 식혀서 식수 대용이나 힐링차로 음용합니다.',
    imageUrl: 'images/jigolpi.jpg',
  },
  {
    id: 'herbs-88',
    name: '천마 (Gastrodia Rhizome)',
    scientificName: 'Gastrodia elata Blume',
    category: '뿌리류',
    efficacy: '간 기운을 평정하고 풍을 가라앉힘(평간식풍, 熄風止痙), 두통, 어지럼증(현훈) 완화, 뇌혈관 건강 증진 및 뇌신경 보호, 경련 완화.',
    sideEffects: '특별한 독성은 적으나 기혈이 심하게 허약한 체질은 단독 과다 복용 시 수면 유도나 나른함이 발생할 수 있어 적정량을 권장합니다.',
    howToUse: '건조 천마 슬라이스 5~10g을 물 1L에 넣고 약불에서 30~40분간 은은히 달여 하루 2~3회 따뜻하게 마십니다.',
    imageUrl: 'images/cheonma.jpg',
  },
  {
    id: 'herbs-89',
    name: '총백 (Scallion Bulb/파뿌리)',
    scientificName: 'Allium fistulosum L.',
    category: '뿌리류',
    efficacy: '몸의 차가운 기운을 발산하고 양기를 통하게 함(발산풍한, 통양산결), 초기 감기 오한 및 콧물 완화, 땀 유도, 몸살 및 해독 작용.',
    sideEffects: '성질이 따뜻하고 매워 몸에 열이 몹시 많거나 땀을 너무 많이 흘리는 사람은 과다 섭취 시 가슴 답답함이 생길 수 있습니다.',
    howToUse: '깨끗이 씻은 총백(흰 뿌리 부분) 5~10g을 생강과 함께 물 1L에 넣고 끓여 초기 감기 기운이 있을 때 따뜻한 차로 마십니다.',
    imageUrl: 'images/chongbaek.jpg',
  },
  {
    id: 'herbs-90',
    name: '강활 (Notopterygium Rhizome)',
    scientificName: 'Ostericum koreanum Maxim.',
    category: '뿌리류',
    efficacy: '바람과 습기를 없애고 통증을 완화(거풍승습, 지통), 상반신(머리, 어깨, 등, 관절) 통증 및 신경통 완화, 초기 풍한 감기 발한 해열.',
    sideEffects: '성질이 따뜻하고 건조시키는 힘이 강하므로 체진액이나 피가 부족한(음허혈허) 체질로 인한 통증에는 과용을 금합니다.',
    howToUse: '말린 강활 뿌리 4~8g을 물 1L에 넣고 약불로 달여 하루 2~3회 따뜻한 차로 음용합니다. 독활, 당귀 등과 함께 달여 마셔도 좋습니다.',
    imageUrl: 'images/ganghwal.jpg',
  },
  {
    id: 'herbs-91',
    name: '괄루근 (Trichosanthes Root/하늘타리 뿌리)',
    scientificName: 'Trichosanthes kirilowii Maxim.',
    category: '뿌리류',
    efficacy: '열을 내리고 진액을 생기게 함(청열생진), 마른기침 및 당뇨(소갈) 갈증 해소, 부종 및 염증 완화(배농소종).',
    sideEffects: '성질이 서늘하므로 비위가 차고 묽은 변이나 설사를 자주 하는 분은 주의하며, 임산부는 자궁 자극 우려가 있어 복용을 자제합니다.',
    howToUse: '건조 괄루근 10~15g을 물 1.5L에 넣고 약불에서 은은히 달여 하루 2~3회 차로 음용합니다.',
    imageUrl: 'images/gwallugeun.jpg',
  },
  {
    id: 'herbs-92',
    name: '대황 (Rhubarb Root)',
    scientificName: 'Rheum officinale Baill.',
    category: '뿌리류',
    efficacy: '장 운동을 촉진하여 체내 장독 및 실열 배출(사하통변, 청열사화), 어혈 제거(활혈거어), 습열 황달 및 고열·변비 개선.',
    sideEffects: '사하 작용(설사 유발)이 매우 강하므로 임산부, 수유부, 월경 중인 여성 및 비위가 심하게 차고 허약한 환자는 과다 또는 장기 복용을 절대 금합니다.',
    howToUse: '법제된 대황 3~6g을 짧게 달여서(오래 달이면 사하 효능 약화) 소량씩 나누어 복용합니다.',
    imageUrl: 'images/daehwang.jpg',
  },
  {
    id: 'herbs-93',
    name: '마황 (Ephedra / 麻黃)',
    scientificName: 'Ephedra sinica Stapf',
    category: '잎류',
    efficacy: '발한해표(땀을 내어 감기 기운을 해소), 선폐평천(폐 기운을 터주어 기침, 비염, 천식 완화), 이수소종(수분 대사 촉진 및 부종 완화).',
    sideEffects: '에페드린 성분이 있어 심장 두근거림, 불면, 고혈압을 유발할 수 있으므로 혈압이 높거나 심장이 약한 분은 주의하며 과다 복용을 금합니다.',
    howToUse: '말린 마황 줄기 4~8g을 물 1L에 넣고 약불에서 달여 따뜻한 차로 마십니다.',
    imageUrl: 'images/mahwang.jpg',
  },
  {
    id: 'herbs-94',
    name: '둥굴레 (Solomon\'s Seal / 옥죽)',
    scientificName: 'Polygonatum odoratum var. pluriflorum Ohwi',
    category: '뿌리류',
    efficacy: '자음윤조(체내 진액 보충 및 건조함 완화), 생진지갈(갈증 해소), 기력 회복, 혈당 및 혈압 조절, 소화 기능 개선.',
    sideEffects: '성질이 쿨하고 습을 유발하므로 비위가 매우 차고 설사를 자주 하거나 잘 체하는 사람은 과다 섭취 시 속 더부룩함이 생길 수 있습니다.',
    howToUse: '말린 둥굴레 뿌리를 덖은 뒤 10~15g을 물 1.5~2L에 넣고 은은히 끓여 구수한 약초차로 수시로 음용합니다.',
    imageUrl: 'images/dunggulle.jpg',
  },
  {
    id: 'herbs-95',
    name: '만형자 (Vitex Fruit / 蔓荊子)',
    scientificName: 'Vitex rotundifolia L.f.',
    category: '열매류',
    efficacy: '거풍청열(풍열 기운 해소), 두통 및 눈 충혈 완화, 정수리·잇몸 통증 개선, 신경통 및 어지럼증 완화.',
    sideEffects: '성질이 서늘하므로 위장이 차거나 체력이 허약하고 혈허로 인한 두통이 있는 분은 단독 장기 복용에 주의가 필요합니다.',
    howToUse: '만형자 열매 4~8g을 살짝 볶아서 짓찧은 후 물 1L에 넣고 약불로 달여 하루 2~3회 따뜻하게 마십니다.',
    imageUrl: 'images/manhyeongja.jpg',
  },
  {
    id: 'herbs-96',
    name: '목통 (Akebia Stem / 木通)',
    scientificName: 'Akebia quinata (Thunb.) Decne.',
    category: '가지류',
    efficacy: '소변을 원활하게 뚫어주고(리수통곤), 열을 내리며(청열사화), 이뇨 작용으로 부종 완화, 세뇨관 및 염증성 질환 완화, 가슴 답답함과 입안 짓무름 개선, 모유 분비 촉진(통유).',
    sideEffects: '성질이 차가우므로 몸이 차거나 소화력이 약한 분, 임산부는 과다 섭취를 삼가야 합니다.',
    howToUse: '건조 목통 가지 5~10g을 물 1L에 넣고 약불로 30분간 달여 하루 2~3회 따뜻한 차로 음용합니다.',
    imageUrl: 'images/moktong.jpg',
  },
  {
    id: 'herbs-97',
    name: '목향 (Aucklandia Root / 木香)',
    scientificName: 'Aucklandia lappa Decne.',
    category: '뿌리류',
    efficacy: '기의 순환을 원활하게 조절하고(행기지통), 위장을 따뜻하게 하여 소화불량, 복부 팽만감 및 가스 차는 증상 완화, 장염 및 설사 개선, 간담 기운 소통.',
    sideEffects: '성질이 따뜻하고 매워 체진액이 부족하여 열감이 뜨는 체질이나 땀을 많이 흘리는 사람은 과다 섭취에 주의해야 합니다.',
    howToUse: '말린 목향 뿌리 3~6g을 물 1L에 넣고 달여 식후 따뜻하게 차로 마십니다.',
    imageUrl: 'images/mokhyang.jpg',
  },
  {
    id: 'herbs-98',
    name: '방기 (Stephania Root / 防己)',
    scientificName: 'Stephania tetrandra S. Moore',
    category: '뿌리류',
    efficacy: '체내 습기와 바람 기운을 배출하고(거풍습리수), 신경통·관절염·요통 완화, 부종(붓기) 및 배뇨 장애 개선, 소염 및 진통 효능.',
    sideEffects: '이뇨 및 발산 작용이 강하므로 진액이 부족한 체질이나 임산부, 신장 기능 저하 환자는 다량 복용을 피해야 합니다.',
    howToUse: '말린 방기 뿌리 4~8g을 물 1L와 함께 약불로 달여 하루 2~3회 나누어 음용합니다.',
    imageUrl: 'images/banggi.jpg',
  },
  {
    id: 'herbs-99',
    name: '백개자 (White Mustard Seed / 겨자씨)',
    scientificName: 'Sinapis alba L.',
    category: '열매류',
    efficacy: '폐를 따뜻하게 하고 담을 삭임(溫肺化痰), 기 순환을 돕고 뭉친 덩어리를 풂(理氣散結), 담음성 기침·가래 및 관절/근육 통증 완화.',
    sideEffects: '성질이 따뜻하고 매워 위점막을 자극할 수 있으므로, 위궤양 환자나 체내 음허화왕(열감)이 심한 분은 과다 복용 시 주의해야 합니다.',
    howToUse: '백개자 3~6g을 살짝 볶은 후(초백개자) 물 1L에 넣고 달여 따뜻하게 음용하거나, 무씨(나복자), 자소자와 함께 달여(삼자양친탕) 마십니다.',
    imageUrl: 'images/baekgaeja.jpg',
  },
  {
    id: 'herbs-100',
    name: '백두구 (White Cardamom / 백두구 씨앗)',
    scientificName: 'Amomum cardamomum L.',
    category: '열매류',
    efficacy: '체내 습기를 제거하고 기 순환 촉진(化濕行氣), 위장을 따뜻하게 하여 구토 진정(溫中止嘔), 식욕 증진(開胃消食) 및 복부 팽만감 완화.',
    sideEffects: '성질이 따뜻하고 건조시키는 힘이 강하므로, 체내 진액이 부족하거나(음허) 음허로 열이 오르는 분은 과다 복용을 금합니다.',
    howToUse: '백두구 열매/씨앗 3~6g을 살짝 짓찧어 달이는 마지막 단계에 넣거나(향기 보존), 따뜻한 물에 우려서 우아한 향과 함께 소화차로 복용합니다.',
    imageUrl: 'images/baekdugu.jpg',
  },
  {
    id: 'herbs-101',
    name: '빈랑 (Betel Nut / Areca Seed / 빈랑자)',
    scientificName: 'Areca catechu L.',
    category: '열매류',
    efficacy: '체내 적체를 완화하고 소화 촉진(殺蟲消積), 기운을 내리고 수분 대사 촉진(降氣利水), 복부 가스 및 부종 완화, 장 운동 활성화.',
    sideEffects: '기운을 강하게 내리는 작용(강기)이 있으므로 임산부나 체력이 극도로 약한 기허(氣虛) 체질은 복용을 유의하고, 정량을 준수해야 합니다.',
    howToUse: '말린 빈랑 슬라이스 3~9g을 물 1L에 넣고 약불로 30분간 달여 식후에 나누어 음용합니다.',
    imageUrl: 'images/binrang.jpg',
  },
  {
    id: 'herbs-102',
    name: '백지 (Dahurian Angelica / 白芷)',
    scientificName: 'Angelica dahurica (Fisch. ex Hoffm.) Benth. & Hook.f. ex Franch. & Sav.',
    category: '뿌리류',
    efficacy: '거풍지통(바람 기운을 내쫓고 통증 완화), 두통·치통·신경통 완화, 배농소종(고름을 배출하고 부종을 가라앉힘), 통비(코막힘 및 비염 개선), 피부 습진 완화.',
    sideEffects: '성질이 따뜻하고 건조시키는 성질이 있으므로 체내 음허로 인한 열증이나 땀을 많이 흘리는 사람, 혈허 두통이 있는 분은 과다 섭취 시 주의해야 합니다.',
    howToUse: '말린 백지 뿌리 4~8g을 물 1L에 넣고 약불로 달여 하루 2~3회 따뜻하게 마십니다. 비염이나 코막힘 완화를 위해 다른 해표 약초와 함께 우려 마시면 좋습니다.',
    imageUrl: 'images/baekji.jpg',
  },
  {
    id: 'herbs-103',
    name: '방풍 (Saposhnikovia Root / 防風)',
    scientificName: 'Saposhnikovia divaricata (Turcz.) Schischk.',
    category: '뿌리류',
    efficacy: '거풍해표(풍사 기운을 몰아내고 두통·감기 증상 완화), 승습지통(습기를 제거하고 관절통·근육통 완화), 피부 가려움증 및 알레르기 증상 완화, 파상풍·경련 예방.',
    sideEffects: '성질이 온화하나 땀을 많이 흘리거나 체력이 극도로 허약한 사람, 음허화왕 체질은 장기 과다 복용 시 진액 손상이 생길 수 있습니다.',
    howToUse: '말린 방풍 뿌리 4~10g을 물 1L에 넣고 약불로 30분간 달여 하루 2~3회 음용합니다. 감기 초기나 관절 쑤심에 차로 복용하면 좋습니다.',
    imageUrl: 'images/bangpung.jpg',
  },
  {
    id: 'herbs-104',
    name: '속단 (Dipsacus Root / 續斷)',
    scientificName: 'Dipsacus asper Wall. ex DC.',
    category: '뿌리류',
    efficacy: '보간신(간과 신장을 보함), 강근골(뼈와 근육을 튼튼하게 함), 인근골(끊어진 뼈와 근육을 이어줌), 허리·무릎 통증 및 관절 염증 완화, 안태 작용(임신 중 유산 예방 및 자궁 안정).',
    sideEffects: '성질이 따뜻하고 보하는 성질이 있으므로 몸에 소화 불량이 심하거나 열감이 강한 실열 체질은 소량씩 복용해야 합니다.',
    howToUse: '말린 속단 뿌리 6~12g을 물 1L에 넣고 달여 하루 2~3회 따뜻한 차로 복용합니다. 우슬, 두충 등과 함께 달여 마시면 뼈와 관절 건강에 효과적입니다.',
    imageUrl: 'images/sokdan.jpg',
  },
  {
    id: 'herbs-105',
    name: '세신 (Asarum Root / 족도리풀 뿌리)',
    scientificName: 'Asarum heterotropoides F. Schmidt',
    category: '뿌리류',
    efficacy: '찬 기운을 발산시키고 통증을 완화(거풍산한, 진통), 두통·치통·비염·코막힘 및 관절통 완화, 폐를 따뜻하게 하여 담음을 삭이고 기침을 진정(온폐화담).',
    sideEffects: '매운 성질과 약성이 강하고 소량의 독성이 있으므로(아사론 등) 섭취 시 정량(1~3g)을 준수해야 하며, 체내 진액이 부족하고 열이 오르는 음허화왕 체질이나 반하, 여로와 함께 복용하는 것은 금합니다.',
    howToUse: '건조 세신 뿌리 1~3g을 물 1L에 넣고 약불에서 은은히 달여 따뜻하게 차로 마십니다.',
    imageUrl: 'images/sesin.jpg',
  },
  {
    id: 'herbs-106',
    name: '청피 (Green Tangerine Peel / 미익은 귤껍질)',
    scientificName: 'Citrus reticulata Blanco',
    category: '껍질류',
    efficacy: '간 기운을 소통시키고 뭉친 기를 깸(소간파기), 옆구리 통증 완화, 소화 불량 및 복부 팽만감·식체 개선, 멍울이나 담적을 삭임(산적화담).',
    sideEffects: '기의 순환을 강하게 뚫어주는 작용(파기)이 있어 체력이 매우 약한 기허(氣虛) 체질이나 임산부는 섭취에 주의하거나 장기 과다 복용을 피해야 합니다.',
    howToUse: '잘 말린 청피 3~6g을 물 1L에 넣고 은은하게 달여 식후에 따뜻한 차로 마십니다.',
    imageUrl: 'images/cheongpi.jpg',
  },
  {
    id: 'herbs-107',
    name: '승마 (Cimicifuga Rhizome / 승마)',
    scientificName: 'Cimicifuga heracleifolia Komarov',
    category: '뿌리류',
    efficacy: '양기를 끌어올리고(승거양기), 열을 내리며 해독(청열해독), 풍열기운을 발산하고(거풍발표), 자궁하수·탈항·감기 두통 완화에 도움을 줍니다.',
    sideEffects: '위로 상승시키는 약성이 강하므로 상초에 열이 심하게 오르는 체질이나 고혈압, 음허화왕 체질은 과다 섭취 시 주의해야 합니다.',
    howToUse: '말린 승마 뿌리줄기 3~6g을 물 1L에 넣고 약불로 달여 하루 2~3회 나누어 음용합니다.',
    imageUrl: 'images/seungma.jpg',
  },
  {
    id: 'herbs-108',
    name: '오약 (Lindera Root / 오약)',
    scientificName: 'Lindera strychnifolia Villars',
    category: '뿌리류',
    efficacy: '기의 순환을 촉진하고 찬 기운을 몰아내며(순기지통, 온경산한), 아랫배 냉통·방광 차가움·생리통 완화, 위장 가스 배출 및 소화 작용을 돕습니다.',
    sideEffects: '성질이 따뜻하고 매끄럽게 소통시키므로 체진액이 부족하여 열이 잘 뜨는 음허내열 체질은 다량 복용에 주의해야 합니다.',
    howToUse: '말린 오약 덩이뿌리 4~8g을 물 1L에 넣고 30분간 약불로 달여 식후 따뜻하게 차로 마십니다.',
    imageUrl: 'images/oyak.jpg',
  },
  {
    id: 'herbs-109',
    name: '위령선 (Clematis Root / 사위질빵 뿌리)',
    scientificName: 'Clematis chinensis Osbeck',
    category: '뿌리류',
    efficacy: '바람과 습기를 없애 경락을 통하게 함(거풍습, 통경락), 관절통·신경통·요통 완화, 사지 마비 및 근육 경련 개선, 담음 제거 및 통증 완화.',
    sideEffects: '약성이 맵고 발산하는 힘이 강하여 장기 복용 시 정기를 손상시킬 수 있으므로 기혈이 몹시 허약한 분은 신중히 복용해야 합니다.',
    howToUse: '잘 건조된 위령선 뿌리 5~10g을 물 1L에 넣고 달여 하루 2~3회 따뜻한 차로 나누어 마십니다.',
    imageUrl: 'images/wiryeongseon.jpg',
  },
  {
    id: 'herbs-110',
    name: '오수유 (Evodia Fruit / 吳茱萸)',
    scientificName: 'Tetradium ruticarpum (A.Juss.) T.G.Hartley',
    category: '열매류',
    efficacy: '따뜻한 성질로 찬 기운을 몰아내고 통증을 완화(산한지통), 복부 차가움 및 구토 진정(온중하기), 역류성 소화 장애, 머리 정수리 통증 및 아랫배 냉통 개선.',
    sideEffects: '성질이 매우 따뜻하고 독성이 다소 있으므로, 몸에 열이 많거나(음허화왕) 임산부는 섭취를 금하고 정해진 용법과 정량을 준수해야 합니다.',
    howToUse: '말린 오수유 열매 2~5g을 물 1L에 넣고 은은하게 달여 하루 2~3회 나누어 음용합니다.',
    imageUrl: 'images/osuyu.jpg',
  },
  {
    id: 'herbs-111',
    name: '지구자 (Hovenia Fruit / 헛개나무 열매 / 枳具子)',
    scientificName: 'Hovenia dulcis Thunb.',
    category: '열매류',
    efficacy: '알코올 분해 촉진 및 간독성 해소(해주독), 숙취 완화, 갈증 해소(생진지갈), 이뇨 작용을 통한 체내 노폐물 배출 및 간 기능 보호.',
    sideEffects: '성질이 평온하나 위장이 매우 차고 약하거나 소화 불량이 심한 분은 과다 섭취 시 속 더부룩함이 생길 수 있으므로 적정량을 섭취합니다.',
    howToUse: '말린 지구자(헛개나무 열매) 10~15g을 물 1.5~2L에 넣고 약불로 30~40분간 달여 고소한 건강차로 수시로 마십니다.',
    imageUrl: 'images/jiguja.jpg',
  },
  {
    id: 'herbs-112',
    name: '용담 (Gentian Root / 龍膽)',
    scientificName: 'Gentiana scabra Bunge',
    category: '뿌리류',
    efficacy: '간과 담의 습열을 제거하고(청간담습열), 눈 충혈, 두통, 황달, 하초의 염증 및 가려움증 완화, 열성 소화 불량 개선.',
    sideEffects: '성질이 몹시 차고 쓴맛이 강하므로 평소 비위가 차고 허약하여 설사를 자주 하는 분은 과다 복용을 금해야 합니다.',
    howToUse: '말린 용담 뿌리 3~6g을 물 1L에 넣고 은은하게 달여 하루 2~3회 나누어 차로 음용합니다.',
    imageUrl: 'images/yongdam.jpg',
  },
  {
    id: 'herbs-113',
    name: '저령 (Polyporus / 猪苓)',
    scientificName: 'Polyporus umbellatus (Pers.) Fries',
    category: '뿌리류',
    efficacy: '체내의 수분 대사를 원활하게 촉진하고(리수삼습), 소변 불통, 부종(붓기) 및 임증(배뇨통) 완화, 습열 제거 및 면역 조절.',
    sideEffects: '성질이 평온하나 이뇨 작용이 강하므로 체내 진액이 부족하거나 음허(陰虛)로 소변량이 이미 많은 체질은 과다 복용을 자제합니다.',
    howToUse: '말린 저령 6~12g을 물 1L에 넣고 약불에서 30분간 달여 하루 2~3회 따뜻한 차로 나누어 마십니다.',
    imageUrl: 'images/jeoryeong.jpg',
  },
  {
    id: 'herbs-114',
    name: '아교 (Donkey-Hide Gelatin / Colla Corii Asini)',
    scientificName: 'Asini Corii Colla (당나귀 가죽 교질)',
    category: '화석류',
    efficacy: '혈액을 보하고 출혈을 멈추게 하며(보혈지혈), 음기를 자양하고 건조함을 윤택하게 합니다(자음윤조). 출혈성 질환 완화, 피로 회복, 빈혈 및 여성 건강 증진, 피부 탄력 보호.',
    sideEffects: '성질이 끈적이고 무거워 소화 기능이 극도로 약하거나 뱃속이 냉하여 설사를 자주 하는 분은 소화 장애를 유발할 수 있으므로 주의해서 복용해야 합니다.',
    howToUse: '아교 구슬(또는 슬라이스) 3~9g을 미온수나 끓인 탕약, 따뜻한 미음에 녹여서 복용하거나 가루 내어 섭취합니다.',
    imageUrl: 'images/agyo.jpg',
  },
  {
    id: 'herbs-115',
    name: '석고 (Gypsum / Gypsum Fibrosum)',
    scientificName: 'Gypsum Fibrosum (천연 광물 석고)',
    category: '화석류',
    efficacy: '몸 안의 심한 고열을 내리고(청열사화), 진액을 생기게 하여 갈증을 해소하며(생진지갈), 인후통 및 위열로 인한 치통/두통 완화, 심한 열성 질환 및 피부 염증 완화.',
    sideEffects: '성질이 매우 차가우므로(대한), 평소 몸이 차거나 비위가 약해 설사를 자주 하는 분, 열이 없는 음증(陰證) 환자는 복용을 금하거나 신중해야 합니다.',
    howToUse: '부수어 단쇄한 석고 15~30g을 약재 달이는 물에 먼저 넣어 20~30분 오랫동안 선전(先煎)한 후 다른 약재와 함께 달여 복용합니다.',
    imageUrl: 'images/seokgo.jpg',
  },
  {
    id: 'herbs-116',
    name: '진교 (Gentiana Root / 秦艽)',
    scientificName: 'Gentiana macrophylla Pall.',
    category: '뿌리류',
    efficacy: '풍습을 제거하고 통증을 완화(거풍습 지통), 사지 마비 및 관절통·신경통 완화, 허열(虛熱)을 내리고 진액 생성을 촉진, 황달 완화.',
    sideEffects: '성질이 평온하나 습을 말리는 작용이 있으므로, 체내 진액이 몹시 부족하거나 평소 비위가 약해 설사를 자주 하는 분은 과다 복용 시 주의해야 합니다.',
    howToUse: '말린 진교 뿌리 5~10g을 물 1L에 넣고 약불로 30분간 달여 하루 2~3회 따뜻한 차로 나누어 음용합니다.',
    imageUrl: 'images/jingyo.jpg',
  },
  {
    id: 'herbs-117',
    name: '지모 (Anemarrhena Rhizome / 知母)',
    scientificName: 'Anemarrhena asphodeloides Bunge',
    category: '뿌리류',
    efficacy: '열을 내리고 불을 다스리며(청열사화), 음기를 자양하고 건조함을 윤택하게 함(자음윤조). 고열·갈증 완화, 골증조열(뼈 마디가 쑤시고 식은땀이 나는 증상) 개선, 당뇨(소갈) 및 마른기침, 변비 완화.',
    sideEffects: '성질이 매우 차고 윤택하게 하는 작용이 강하므로, 평소 비위가 차고 허약하여 대변이 묽거나 설사를 자주 하는 분은 복용을 금해야 합니다.',
    howToUse: '말린 지모 뿌리줄기 6~12g을 물 1L에 넣고 약불에서 30분간 달여 하루 2~3회 따뜻한 차로 나누어 음용합니다.',
    imageUrl: 'images/jimo.jpg',
  },
  {
    id: 'herbs-118',
    name: '지실 (Immature Bitter Orange / 枳實 / 탱자 열매)',
    scientificName: 'Poncirus trifoliata (L.) Raf.',
    category: '열매류',
    efficacy: '뭉친 기운을 강력하게 트여주고(파기적체), 담음을 삭이며(화담), 뱃속 팽만감 및 소화불량, 위장 정체, 복부 둔통 완화, 위하수 및 장무력증 개선.',
    sideEffects: '기를 강하게 파뜨리는 작용(파기)이 강하므로, 임산부나 평소 기혈이 극도로 허약하고 소화력이 약한 사람은 과다 복용을 금해야 합니다.',
    howToUse: '말린 지실(어린 탱자 열매) 3~9g을 물 1L에 넣고 약불에서 30분간 달여 하루 2~3회 따뜻한 차로 나누어 음용합니다.',
    imageUrl: 'images/jisil.jpg',
  },
  {
    id: 'herbs-119',
    name: '차전자 (Plantago Seed / 車前子 / 질경이 씨)',
    scientificName: 'Plantago asiatica L.',
    category: '열매류',
    efficacy: '수분 대사를 촉진하여 소변을 원활하게 하고(리수통림), 간의 열을 내려 눈을 맑게 함(청간명목), 부종(붓기) 완화, 설사 진정 및 배뇨통 개선.',
    sideEffects: '성질이 차갑고 이뇨 작용이 강하므로, 체내 진액이 몹시 부족한 분(음허)이나 신장이 허약하여 소변이 과도하게 많은 분은 과다 복용 시 주의해야 합니다.',
    howToUse: '차전자 5~10g을 팩이나 삼베 주머니에 넣어 물 1L와 함께 약불에서 30분간 달여 하루 2~3회 따뜻한 차로 음용합니다.',
    imageUrl: 'images/chajeonja.jpg',
  },
  {
    id: 'herbs-120',
    name: '황백 (Phellodendron Bark / 황벽나무 껍질)',
    scientificName: 'Phellodendron amurense Ruprecht',
    category: '껍질류',
    efficacy: '신장과 방광의 습열을 내려주고(청열조습), 뼈마디의 허열 및 안면 홍조를 진정시키며(퇴허열), 해독, 항염 작용, 피부 염증과 습진 완화에 효과적입니다.',
    sideEffects: '성질이 몹시 차고 쓴맛이 강하므로 평소 소화기능이 매우 약하여 속이 차고 설사를 자주 하는 분은 과다 복용을 금해야 합니다.',
    howToUse: '말린 황백 껍질 5~10g을 물 1L에 넣고 약불에서 달여 하루 2~3회 나누어 차로 음용하거나, 달인 물로 가려운 피부 부위를 씻어줍니다.',
    imageUrl: 'images/hwangbaek.jpg',
  },
  {
    id: 'herbs-121',
    name: '후박 (Magnolia Bark / 厚朴 / 일본목련·토후박 껍질)',
    scientificName: 'Magnolia officinalis Rehd. et Wils.',
    category: '껍질류',
    efficacy: '위장의 정체된 기운을 소통시키고 담습을 제거하며(조습화담, 행기소적, 하기평천), 복부 팽만감 및 소화불량, 식체, 메스꺼움 완화, 가래 기침 진정 및 장 기능 활성화에 효과적입니다.',
    sideEffects: '성질이 따뜻하고 매콤하며 기를 아래로 강하게 내리는 작용이 있으므로, 기력이 쇠약한 기허(氣虛) 환자나 체내 진액이 부족한 음허 체질, 임산부는 과다 복용을 피해야 합니다.',
    howToUse: '말린 후박 껍질 3~9g을 물 1L에 넣고 약불에서 30분간 은은하게 달여 하루 2~3회 따뜻하게 나누어 차로 음용하거나, 생강과 함께 달여 마십니다.',
    imageUrl: 'images/hubak.jpg',
  },
  {
    id: 'herbs-122',
    name: '황정 (King Solomon\'s Seal / 黃精 / 층층둥굴레 뿌리줄기)',
    scientificName: 'Polygonatum sibiricum Redouté',
    category: '뿌리류',
    efficacy: '비위의 기운을 보하고(보중익기), 폐를 윤택하게 하여 마른기침을 멎게 하며(윤폐지갈), 신장의 정기와 음액을 보양합니다(자음보신). 면역력 강화, 기력 회복, 혈당 및 혈압 조절, 골다공증 예방, 항산화 및 노화 방지에 탁월한 효과가 있습니다.',
    sideEffects: '성질이 평온하나 점액질과 자양 영양 성분이 풍부하므로, 평소 비위가 매우 차고 습담(濕痰)이 많아 소화가 잘 안 되거나 묽은 변·설사를 자주 하는 분은 과다 복용 시 복부 팽만감이나 소화불량이 나타날 수 있습니다.',
    howToUse: '말린 황정(또는 구증구포 황정) 10~15g을 물 1.5~2L에 넣고 약불에서 30~40분간 은은하게 달여 하루 2~3회 구수하고 달콤한 건강 약초차로 따뜻하게 음용합니다.',
    imageUrl: 'images/hwangjeong.jpg',
  },
  {
    id: 'herbs-123',
    name: '사상자 (Cnidium Seed)',
    scientificName: 'Cnidium monnieri (L.) Cusson',
    category: '열매류',
    efficacy: '신장의 양기를 돋우고(보신장양), 풍을 제거하며 습을 건조하게 합니다(거풍조습). 남성의 발기부전, 음낭 습진, 여성의 불감증, 냉대하 및 피부 가려움증 치료에 효과적입니다.',
    sideEffects: '몸에 열이 많고 음허화왕(음기가 부족해 열이 오름) 상태이거나 기운이 아주 약한 분은 한의사와 상담 후 복용해야 합니다.',
    howToUse: '하루 5~10g을 물 1L와 함께 끓여 찻물로 복용하거나, 피부 질환이 있는 부위에 달인 물로 씻어내거나 바르는 외용제로도 사용합니다.',
    imageUrl: 'images/sasangja.png',
  },
];

// 2. 초기 약선 힐링차 상품 데이터 (네이버 스마트스토어 고려)
var initialTeas = window.initialTeas = [
  {
    id: 'tea-1',
    name: '쌍화차',
    description: '쌍화차는 당귀, 숙지황, 황기, 계피 등등을 덖어서 만든 것으로 육체피로, 근육통, 감기몸살에 도움을 주는 약선힐링차입니다.',
    price: 45000,
    imageUrl: 'images/ssanghwa.jpg',
    naverUrl: 'https://smartstore.naver.com/sanbitherbflowertea/products/5383403384',
    agentBuyAvailable: true,
  },
  {
    id: 'tea-2',
    name: '코꽃차',
    description: '코꽃차는 목련, 박하, 천궁, 계지 등을 덖어서 만든 것으로 콧물, 코막힘에 도움을 주는 약초꽃차입니다.',
    price: 45000,
    imageUrl: 'images/ko_flower_tea.jpg',
    naverUrl: 'https://smartstore.naver.com/sanbitherbflowertea/products/5383425775',
    agentBuyAvailable: true,
  },
  {
    id: 'tea-3',
    name: '눈꽃차',
    description: '눈꽃차는 감국, 금잔화 등등을 덖어서 만든 것으로 눈이 뻑뻑하거나 침침할 때 도움을 주는 약초꽃차입니다.',
    price: 45000,
    imageUrl: 'images/nun_flower_tea.jpg',
    naverUrl: 'https://smartstore.naver.com/sanbitherbflowertea/products/5383435281',
    agentBuyAvailable: true,
  },
  {
    id: 'tea-4',
    name: '혈꽃차',
    description: '혈꽃차는 지황, 당귀, 금은화, 감국 등등을 덖어서 만든 것으로 혈관을 튼튼하게 하고 피를 맑게 하는 데 도움을 주는 약초꽃차입니다.',
    price: 45000,
    imageUrl: 'images/hyeol_flower_tea.jpg',
    naverUrl: 'https://smartstore.naver.com/sanbitherbflowertea/products/5383413906',
    agentBuyAvailable: true,
  },
  {
    id: 'tea-5',
    name: '휘파람차',
    description: '휘파람차는 백출, 복령, 당귀, 연자육 등등을 덖어서 만든 것으로 마음을 편하게 하는 데 도움을 주는 약초꽃차입니다.',
    price: 45000,
    imageUrl: 'images/hwiparam_tea.jpg',
    naverUrl: 'https://smartstore.naver.com/sanbitherbflowertea/products/10973994172',
    agentBuyAvailable: true,
  }
];

// 3. 초기 미디어 갤러리 데이터
var initialMedia = window.initialMedia = [
  {
    id: 'media-1',
    type: 'image',
    title: '동해 일출과 비상하는 철새 무리',
    url: 'images/sea_birds.jpg',
    description: '붉게 솟아오르는 아침 해를 마주하며 힘차게 날아가는 철새들의 모습에서 자연의 경이로운 생명력을 느껴보세요.'
  },
  {
    id: 'media-2',
    type: 'image',
    title: '차 한 잔의 여유와 윤슬 가득한 바다',
    url: 'images/tea_window.jpg',
    description: '따뜻하게 김이 피어오르는 찻상에 앉아 눈부시게 빛나는 겨울 바다의 풍경을 바라보며 마음에 평온을 담아냅니다.'
  },
  {
    id: 'media-3',
    type: 'image',
    title: '아침 숲길에 내리는 치유의 빛내림',
    url: 'images/forest_sunlight.jpg',
    description: '안개 낀 고요한 숲속 흙길 계단 새로 쏟아져 내리는 신비로운 아침 햇살을 마주하며 깊은 걷기 명상에 빠져듭니다.'
  },
  {
    id: 'media-4',
    type: 'image',
    title: '고요한 처마 밑 겨울의 속삭임, 고드름',
    url: 'images/icicles.jpg',
    description: '파란 겨울 하늘을 배경으로 지붕 처마 밑에 맑고 차갑게 얼어붙은 고드름 풍경이 겨울 다도원의 고요한 정취를 더해줍니다.'
  },
  {
    id: 'media-5',
    type: 'image',
    title: '햇살 가득한 비밀의 숲속 놀이터',
    url: 'images/forest_playground.jpg',
    description: '아름드리 울창한 나무들 사이로 따스한 아침 햇살이 비추는 숲속 쉼터에서 일상의 피로를 풀고 자연과 호흡합니다.'
  },
  {
    id: 'media-6',
    type: 'image',
    title: '바람개비 춤추는 찬란한 소나무 산책로',
    url: 'images/forest_path_windmills.jpg',
    description: '하늘을 향해 곧게 뻗은 소나무 숲길 사이로 찬란하게 내리는 아침 햇빛을 맞으며, 오색 바람개비와 함께 상쾌한 산책을 즐겨봅니다.'
  },
  {
    id: 'media-7',
    type: 'image',
    title: '동해 절벽 위 전각과 푸른 바다의 절경',
    url: 'images/cliff_temple.jpg',
    description: '해안 절벽 위에 우뚝 선 고즈넉한 정자와 파도가 일렁이는 푸른 동해 바다가 어우러져 한 폭의 산수화 같은 자연의 평온함을 전해줍니다.'
  },
  {
    id: 'media-8',
    type: 'image',
    title: '화사한 벚꽃과 고혹적인 자목련의 봄날 정취',
    url: 'images/magnolia_cherry_blossom.jpg',
    description: '은은한 봄 안개 속 화사하게 피어난 흰 벚꽃과 보랏빛 자목련이 고운 조화를 이루며 마음을 포근하게 밝혀주는 봄의 선물입니다.'
  }
];

// 4. 초기 가상 회원 정보 (관리자 1명, 일반 회원 3명)
const initialUsers = [
  {
    id: 'user-admin',
    email: 'tksqlc08@gmail.com',
    name: '관리자',
    role: 'admin',
    plan: 'Premium',
    status: 'Active',
    joinedDate: '2026-01-01',
  },
  {
    id: 'user-1',
    email: 'hong@naver.com',
    name: '홍길동',
    role: 'user',
    plan: 'Gold',
    status: 'Active',
    joinedDate: '2026-05-12',
  },
  {
    id: 'user-2',
    email: 'kim@gmail.com',
    name: '김철수',
    role: 'user',
    plan: 'Silver',
    status: 'Active',
    joinedDate: '2026-06-03',
  },
  {
    id: 'user-3',
    email: 'lee@daum.net',
    name: '이영희',
    role: 'user',
    plan: 'Basic',
    status: 'Suspended', // 활성화/정지 제어 확인용
    joinedDate: '2026-06-20',
  }
];

// 5. 초기 홈페이지 수정 설정
const initialSettings = {
  mainTitle: '자연의 숨결로 건강한 삶을 추구하는',
  subTitle: '산빛약초꽃차문화연구원',
  introContent: '우리는 대자연의 치유력을 믿습니다. 예로부터 전해 내려온 신비로운 약초의 효능을 현대적인 관점에서 해석하고, 일상 속에서 가장 쉽고 아름답게 섭취할 수 있는 수제 약선 힐링차를 제안합니다. 몸과 마음의 균형을 되찾아주는 자연치유 라이프스타일을 만나보세요.',
  brandColor: '#1E3F20',
  contactEmail: 'tksqlc08@gmail.com',
  contactPhone: '031-942-0545(산빛약초꽃차)',
  pricingPlans: {
    Basic: { price: '무료', period: '평생', desc: '기본적인 약초 백과 조회 및 게시판 쓰기 권한 제공' },
    Silver: { price: '월 9,900원', period: '월간', desc: '프리미엄 약초 상세 분석 칼럼 열람 가능 및 힐링차 5% 할인 쿠폰 발급' },
    Gold: { price: '월 19,900원', period: '월간', desc: '전문가 1:1 자연치유 자문 서비스 제공, 프리미엄 칼럼 무제한 열람 및 힐링차 10% 상시 할인' }
  }
};

// 6. 초기 커뮤니티 게시글 데이터
const initialPosts = [
  {
    id: 'post-1',
    category: '체험담',
    title: '당귀차 매일 한 잔씩 마신 뒤로 손발이 따뜻해졌어요!',
    content: '평생 수족냉증으로 고생해서 겨울은 물론 여름 에어컨 밑에서도 장갑을 끼고 싶을 정도였는데, 당귀차를 약 3주간 꾸준히 연하게 우려 마셨더니 혈액 순환이 되는 게 느껴집니다. 정말 자연치유의 힘은 대단하네요. 강추합니다!',
    author: '김철수',
    authorEmail: 'kim@gmail.com',
    date: '2026-06-25',
    views: 42,
    likes: 12,
    commentsList: [
      {
        id: 'comment-101',
        author: '홍길동',
        authorEmail: 'hong@naver.com',
        content: '저도 당귀차 우려 마셔봐야겠네요! 좋은 체험담 감사합니다.',
        date: '2026-06-26'
      },
      {
        id: 'comment-102',
        author: '산빛 관리자',
        authorEmail: 'tksqlc08@gmail.com',
        content: '당귀는 림프 및 혈액순환 개선에 으뜸입니다. 꾸준히 드시되 따뜻하게 보온해서 음용해 주세요.',
        date: '2026-06-26'
      }
    ]
  },
  {
    id: 'post-2',
    category: '질문/답변',
    title: '민들레 뿌리는 볶아서 마시는 건가요?',
    content: '민들레 생뿌리를 그냥 물에 끓여 마셨더니 너무 쓰고 떫어서 먹기 힘들더라고요. 찾아보니 한 번 볶거나 덖어서 차로 우려내면 둥굴레차처럼 고소하다고 하던데 방법이 맞나요? 고수분들의 조언 부탁드립니다.',
    author: '이영희',
    authorEmail: 'lee@daum.net',
    date: '2026-06-28',
    views: 28,
    likes: 5,
    commentsList: [
      {
        id: 'comment-103',
        author: '산빛 대표',
        authorEmail: 'tksqlc08@gmail.com',
        content: '네, 민들레 뿌리는 깨끗이 씻어 말린 후 약불에서 노릇하게 덖어내면 쓴맛이 줄고 고소한 커피 대체차(민들레커피)가 됩니다!',
        date: '2026-06-29'
      }
    ]
  },
  {
    id: 'post-3',
    category: '힐링차 후기',
    title: '산빛 약선 힐링 가마덖음차 구매후기입니다',
    content: '파주 산빛 약초원에서 직접 가마덖음한 힐링차를 구매대행 신청해서 받아서 마셔봤는데 향이 정말 깊고 머리가 맑아지네요. 석창포와 구기자 조합 차를 우려 마시니 수면의 질도 훨씬 올라갔습니다.',
    author: '홍길동',
    authorEmail: 'hong@naver.com',
    date: '2026-07-10',
    views: 65,
    likes: 18,
    commentsList: []
  }
];


// LocalStorage Helper Functions
const getLocalStorage = (key, initialValue) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null || value === undefined) {
      try { localStorage.setItem(key, JSON.stringify(initialValue)); } catch (e) {}
      return Array.isArray(initialValue) ? initialValue.map(item => (item && typeof item === 'object' ? { ...item } : item)) : initialValue;
    }
    let parsed = JSON.parse(value);
    if (Array.isArray(initialValue) && initialValue.length > 0) {
      if (!Array.isArray(parsed) || parsed.length === 0) {
        const fresh = initialValue.map(item => (item && typeof item === 'object' ? { ...item } : item));
        try { localStorage.setItem(key, JSON.stringify(fresh)); } catch (e) {}
        return fresh;
      }
      parsed = parsed.filter(item => item !== null && item !== undefined && typeof item === 'object');
      if (parsed.length === 0) {
        const fresh = initialValue.map(item => (item && typeof item === 'object' ? { ...item } : item));
        try { localStorage.setItem(key, JSON.stringify(fresh)); } catch (e) {}
        return fresh;
      }
      return parsed;
    }
    if (typeof initialValue === 'object' && initialValue !== null) {
      return Object.assign({}, initialValue, parsed);
    }
    return parsed;
  } catch (e) {
    return Array.isArray(initialValue) ? initialValue.map(item => (item && typeof item === 'object' ? { ...item } : item)) : initialValue;
  }
};

const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage set failed:', e);
  }
};

// 데이터 허브 인스턴스
var Db = window.Db = {
  init() {
    try {
      const herbs = getLocalStorage(STORAGE_KEYS.HERBS, initialHerbs);
      let updated = false;
      
      // initialHerbs 데이터를 로컬스토리지 herbs 데이터에 동기화
      initialHerbs.forEach(ih => {
        if (!ih) return;
        const existing = herbs.find(h => h && h.id === ih.id);
        if (!existing) {
          herbs.push({...ih});
          updated = true;
        } else {
          // 기존 데이터 중 Unsplash 이미지가 있는 경우 실물 이미지 경로로 마이그레이션
          if (existing.imageUrl && existing.imageUrl.includes('unsplash') && ih.imageUrl && !ih.imageUrl.includes('unsplash')) {
            existing.imageUrl = ih.imageUrl;
            updated = true;
          }
          // 이미지 경로 및 나머지 속성 정보 동기화
          if (existing.imageUrl !== ih.imageUrl ||
              existing.name !== ih.name || 
              existing.category !== ih.category || 
              existing.efficacy !== ih.efficacy || 
              existing.scientificName !== ih.scientificName || 
              existing.sideEffects !== ih.sideEffects || 
              existing.howToUse !== ih.howToUse) {
            existing.imageUrl = ih.imageUrl;
            existing.name = ih.name;
            existing.category = ih.category;
            existing.efficacy = ih.efficacy;
            existing.scientificName = ih.scientificName;
            existing.sideEffects = ih.sideEffects;
            existing.howToUse = ih.howToUse;
            updated = true;
          }
        }
      });

      if (updated) {
        setLocalStorage(STORAGE_KEYS.HERBS, herbs);
      }

      const teas = getLocalStorage(STORAGE_KEYS.TEAS, initialTeas);
      let teasUpdated = false;
      initialTeas.forEach(it => {
        if (!it) return;
        const existing = teas.find(t => t && t.id === it.id);
        if (!existing) {
          teas.push({...it});
          teasUpdated = true;
        } else {
          // sync database values in case initial data changed
          existing.name = it.name;
          existing.description = it.description;
          existing.price = it.price;
          existing.imageUrl = it.imageUrl;
          existing.naverUrl = it.naverUrl;
          delete existing.coupangUrl;
          existing.agentBuyAvailable = it.agentBuyAvailable;
          teasUpdated = true;
        }
      });
      if (teasUpdated) {
        setLocalStorage(STORAGE_KEYS.TEAS, teas);
      }

      const media = getLocalStorage(STORAGE_KEYS.MEDIA, initialMedia);
      let mediaUpdated = false;
      initialMedia.forEach(im => {
        if (!im) return;
        const existing = media.find(m => m && m.id === im.id);
        if (!existing) {
          media.push({...im});
          mediaUpdated = true;
        } else {
          existing.type = im.type;
          existing.title = im.title;
          existing.url = im.url;
          existing.description = im.description;
          mediaUpdated = true;
        }
      });
      setLocalStorage(STORAGE_KEYS.MEDIA, media);

      const users = getLocalStorage(STORAGE_KEYS.USERS, initialUsers);
      let usersUpdated = false;
      const adminUser = users.find(u => u && (u.id === 'user-admin' || u.role === 'admin' || u.email === 'admin@nature.com' || u.email === 'tksqlc08@gmail.com'));
      if (adminUser) {
        if (adminUser.email !== 'tksqlc08@gmail.com' || adminUser.role !== 'admin') {
          adminUser.email = 'tksqlc08@gmail.com';
          adminUser.role = 'admin';
          adminUser.name = '관리자';
          usersUpdated = true;
        }
      } else if (initialUsers && initialUsers.length > 0) {
        users.unshift({...initialUsers[0]});
        usersUpdated = true;
      }
      if (usersUpdated) {
        setLocalStorage(STORAGE_KEYS.USERS, users);
      }

      const posts = getLocalStorage(STORAGE_KEYS.POSTS, initialPosts);
      let postsUpdated = false;
      posts.forEach(p => {
        if (!p) return;
        if (!p.category) { p.category = '체험담'; postsUpdated = true; }
        if (typeof p.views !== 'number') { p.views = 10; postsUpdated = true; }
        if (typeof p.likes !== 'number') { p.likes = 0; postsUpdated = true; }
        if (!Array.isArray(p.commentsList)) { p.commentsList = []; postsUpdated = true; }
      });
      if (postsUpdated) {
        setLocalStorage(STORAGE_KEYS.POSTS, posts);
      }

      const settings = getLocalStorage(STORAGE_KEYS.SETTINGS, initialSettings);
      settings.contactEmail = 'tksqlc08@gmail.com';
      settings.contactPhone = '031-942-0545(산빛약초꽃차)';
      settings.introContent = initialSettings.introContent;
      if (settings.mainTitle === '자연의 숨결로 채우는 건강한 삶' || settings.mainTitle === '자연의 숨결로 채우는 건강한 삶을 추구하는' || settings.subTitle === '농사로 및 산빛약초꽃차의 지혜를 담은 자연치유 약초&약선차 가이드') {
        settings.mainTitle = '자연의 숨결로 건강한 삶을 추구하는';
        settings.subTitle = '산빛약초꽃차문화연구원';
      }
      setLocalStorage(STORAGE_KEYS.SETTINGS, settings);
      getLocalStorage(STORAGE_KEYS.INQUIRIES, []);

      // 원격 클라우드 게시글 동기화 및 실시간 자동 폴링 실행
      Db.syncRemotePosts();
      Db.startAutoSync();
    } catch(e) {
      console.warn('Db.init warning:', e);
    }
  },

  resetToDefault(showNotification = true) {
    try {
      const herbs = initialHerbs.map(item => ({ ...item }));
      const teas = initialTeas.map(item => ({ ...item }));
      const media = initialMedia.map(item => ({ ...item }));
      const settings = Object.assign({}, initialSettings);
      const users = initialUsers.map(item => ({ ...item }));

      setLocalStorage(STORAGE_KEYS.HERBS, herbs);
      setLocalStorage(STORAGE_KEYS.TEAS, teas);
      setLocalStorage(STORAGE_KEYS.MEDIA, media);
      setLocalStorage(STORAGE_KEYS.SETTINGS, settings);
      setLocalStorage(STORAGE_KEYS.USERS, users);

      if (window.state) {
        window.state.herbs = herbs;
        window.state.teas = teas;
        window.state.media = media;
        window.state.settings = settings;
        window.state.users = users;
      }

      if (typeof window.Encyclopedia !== 'undefined') {
        window.Encyclopedia.activeCategory = '전체';
        window.Encyclopedia.searchQuery = '';
      }

      if (showNotification && typeof alert === 'function') {
        alert('✅ 약초, 약선차, 미디어 원본 데이터가 성공적으로 초기화 및 복구되었습니다!');
      }

      if (typeof window.router === 'function') {
        window.router();
      } else if (window.Encyclopedia && typeof window.Encyclopedia.renderHerbCards === 'function') {
        window.Encyclopedia.renderHerbCards();
      }
      return herbs;
    } catch(e) {
      console.error('resetToDefault error:', e);
      return initialHerbs.map(item => ({ ...item }));
    }
  },

  // Herbs
  getHerbs() {
    let herbs = getLocalStorage(STORAGE_KEYS.HERBS, initialHerbs);
    if (!Array.isArray(herbs) || herbs.length === 0 || !herbs.some(h => h && h.name)) {
      herbs = initialHerbs.map(item => ({ ...item }));
      setLocalStorage(STORAGE_KEYS.HERBS, herbs);
    }
    return herbs;
  },
  saveHerbs(herbs) {
    setLocalStorage(STORAGE_KEYS.HERBS, herbs);
  },

  // Teas
  getTeas() {
    let teas = getLocalStorage(STORAGE_KEYS.TEAS, initialTeas);
    if (!Array.isArray(teas) || teas.length === 0 || !teas.some(t => t && t.name)) {
      teas = initialTeas.map(item => ({ ...item }));
      setLocalStorage(STORAGE_KEYS.TEAS, teas);
    }
    return teas;
  },
  saveTeas(teas) {
    setLocalStorage(STORAGE_KEYS.TEAS, teas);
  },

  // Media
  getMedia() {
    let media = getLocalStorage(STORAGE_KEYS.MEDIA, initialMedia);
    if (!Array.isArray(media) || media.length === 0 || !media.some(m => m && m.title)) {
      media = initialMedia.map(item => ({ ...item }));
      setLocalStorage(STORAGE_KEYS.MEDIA, media);
    }
    return media;
  },
  saveMedia(media) {
    setLocalStorage(STORAGE_KEYS.MEDIA, media);
  },

  // Users
  getUsers() {
    return getLocalStorage(STORAGE_KEYS.USERS, initialUsers);
  },
  saveUsers(users) {
    setLocalStorage(STORAGE_KEYS.USERS, users);
  },

  // Deleted tracking
  getDeletedPostIds() {
    return getLocalStorage(STORAGE_KEYS.DELETED_POSTS, []);
  },
  addDeletedPostId(id) {
    if (!id) return;
    const list = this.getDeletedPostIds();
    const strId = String(id);
    if (!list.includes(strId)) {
      list.push(strId);
      setLocalStorage(STORAGE_KEYS.DELETED_POSTS, list);
    }
  },
  getDeletedCommentIds() {
    return getLocalStorage(STORAGE_KEYS.DELETED_COMMENTS, []);
  },
  addDeletedCommentId(id) {
    if (!id) return;
    const list = this.getDeletedCommentIds();
    const strId = String(id);
    if (!list.includes(strId)) {
      list.push(strId);
      setLocalStorage(STORAGE_KEYS.DELETED_COMMENTS, list);
    }
  },

  // Smart Merge for Posts
  mergePosts(localPosts, remotePosts) {
    if (!Array.isArray(localPosts)) localPosts = [];
    if (!Array.isArray(remotePosts)) remotePosts = [];

    const deletedPosts = this.getDeletedPostIds();
    const deletedComments = this.getDeletedCommentIds();

    const map = new Map();

    // 1) Remote posts (삭제된 글 제외)
    remotePosts.forEach(rp => {
      if (rp && rp.id && !deletedPosts.includes(String(rp.id))) {
        map.set(String(rp.id), Object.assign({}, rp));
      }
    });

    // 2) Local posts 스마트 병합 (삭제된 글 제외)
    localPosts.forEach(lp => {
      if (!lp || !lp.id) return;
      const lpIdStr = String(lp.id);
      if (deletedPosts.includes(lpIdStr)) return;

      const filterComments = (cList) => {
        if (!Array.isArray(cList)) return [];
        return cList.filter((c, idx) => {
          if (!c) return false;
          const cId = c.id ? String(c.id) : ('comment-idx-' + idx);
          return !deletedComments.includes(cId);
        });
      };

      const cleanLpComments = filterComments(lp.commentsList);
      lp.commentsList = cleanLpComments;
      lp.comments = cleanLpComments.length;

      if (!map.has(lpIdStr)) {
        map.set(lpIdStr, Object.assign({}, lp));
      } else {
        const existing = map.get(lpIdStr);
        const cleanExistingComments = filterComments(existing.commentsList);

        // 댓글 병합
        const cMap = new Map();
        cleanExistingComments.forEach((c, idx) => {
          const cId = c.id ? String(c.id) : ('comment-idx-' + idx);
          cMap.set(cId, c);
        });
        cleanLpComments.forEach((c, idx) => {
          const cId = c.id ? String(c.id) : ('comment-idx-' + idx);
          cMap.set(cId, c);
        });

        const mergedComments = Array.from(cMap.values());

        map.set(lpIdStr, Object.assign({}, existing, lp, {
          commentsList: mergedComments,
          comments: mergedComments.length,
          views: Math.max(existing.views || 0, lp.views || 0),
          likes: Math.max(existing.likes || 0, lp.likes || 0)
        }));
      }
    });

    const result = Array.from(map.values());
    // 날짜 및 ID 기준 정렬
    result.sort((a, b) => {
      if (a.date !== b.date) {
        return (b.date || '').localeCompare(a.date || '');
      }
      return String(b.id).localeCompare(String(a.id));
    });
    return result;
  },

  // Posts
  getPosts() {
    const posts = getLocalStorage(STORAGE_KEYS.POSTS, initialPosts);
    const deletedPosts = this.getDeletedPostIds();
    const deletedComments = this.getDeletedCommentIds();

    return posts.filter(p => p && p.id && !deletedPosts.includes(String(p.id))).map(p => {
      if (Array.isArray(p.commentsList)) {
        p.commentsList = p.commentsList.filter((c, idx) => {
          const cId = c && c.id ? String(c.id) : ('comment-idx-' + idx);
          return !deletedComments.includes(cId);
        });
        p.comments = p.commentsList.length;
      }
      return p;
    });
  },
  savePosts(posts, skipCloudPush) {
    if (!Array.isArray(posts)) posts = [];
    const deletedPosts = this.getDeletedPostIds();
    const filtered = posts.filter(p => p && p.id && !deletedPosts.includes(String(p.id)));

    setLocalStorage(STORAGE_KEYS.POSTS, filtered);
    if (window.state) {
      window.state.posts = filtered;
    }

    // 1) 멀티 탭 / 멀티 창 즉시 알림 (BroadcastChannel)
    if (window._postsBroadcastChannel) {
      try {
        window._postsBroadcastChannel.postMessage({ type: 'POSTS_UPDATED', posts: filtered });
      } catch (e) {}
    }

    if (!skipCloudPush) {
      // 2) 전역 클라우드 데이터베이스 업링크 동기화
      try {
        fetch('https://extendsclass.com/api/json-storage/bin/dedabdd', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ posts: filtered })
        }).catch(function(err) {
          console.warn('Cloud sync save warning:', err);
        });
      } catch (e) {
        console.warn('Cloud sync save exception:', e);
      }
    }
  },
  syncRemotePosts(callback) {
    try {
      fetch('https://extendsclass.com/api/json-storage/bin/dedabdd')
        .then(function(res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function(data) {
          const remotePosts = (data && Array.isArray(data.posts)) ? data.posts : [];
          const localPosts = getLocalStorage(STORAGE_KEYS.POSTS, initialPosts);

          const merged = Db.mergePosts(localPosts, remotePosts);
          const localStr = JSON.stringify(localPosts);
          const mergedStr = JSON.stringify(merged);
          const remoteStr = JSON.stringify(remotePosts);

          // 1) 로컬과 병합 결과가 다르면 로컬/State 갱신 및 UI 콜백
          if (localStr !== mergedStr) {
            setLocalStorage(STORAGE_KEYS.POSTS, merged);
            if (window.state) {
              window.state.posts = merged;
            }
            if (window._postsBroadcastChannel) {
              try {
                window._postsBroadcastChannel.postMessage({ type: 'POSTS_UPDATED', posts: merged });
              } catch(e) {}
            }
            if (typeof callback === 'function') {
              callback(merged);
            }
          }

          // 2) 원격 서버와 병합 결과가 다르면 (내 로컬에 새로 쓴 글이나 삭제 내역이 있는 경우) 원격에도 PUT 업데이트
          if (mergedStr !== remoteStr && merged.length > 0) {
            fetch('https://extendsclass.com/api/json-storage/bin/dedabdd', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ posts: merged })
            }).catch(function(err) {
              console.warn('Cloud push-back failed:', err);
            });
          }
        })
        .catch(function(err) {
          console.warn('Cloud sync fetch error:', err);
        });
    } catch (e) {
      console.warn('Cloud sync exception:', e);
    }
  },
  startAutoSync() {
    if (this._syncTimer) clearInterval(this._syncTimer);
    this._syncTimer = setInterval(function() {
      Db.syncRemotePosts(function() {
        const detailModal = document.getElementById('detail-modal');
        const isDetailOpen = detailModal && detailModal.classList.contains('active');
        if (window.location.hash === '#community' && !isDetailOpen && typeof window.router === 'function') {
          window.router();
        }
      });
    }, 4000);
  },

  // Settings
  getSettings() {
    return getLocalStorage(STORAGE_KEYS.SETTINGS, initialSettings);
  },
  saveSettings(settings) {
    setLocalStorage(STORAGE_KEYS.SETTINGS, settings);
  },

  // Purchase/Inquiries (구매대행 접수 내역)
  getInquiries() {
    return getLocalStorage(STORAGE_KEYS.INQUIRIES, []);
  },
  saveInquiries(inquiries) {
    setLocalStorage(STORAGE_KEYS.INQUIRIES, inquiries);
  }
};

// 7. 실시간 멀티 브라우저/탭 통신 채널 & Storage Event Listener 초기화
if (typeof BroadcastChannel !== 'undefined') {
  window._postsBroadcastChannel = new BroadcastChannel('herb_healing_posts_sync');
  window._postsBroadcastChannel.onmessage = function(e) {
    if (e.data && e.data.type === 'POSTS_UPDATED' && Array.isArray(e.data.posts)) {
      if (window.state) {
        window.state.posts = e.data.posts;
      }
      const detailModal = document.getElementById('detail-modal');
      const isDetailOpen = detailModal && detailModal.classList.contains('active');
      if (window.location.hash === '#community' && !isDetailOpen && typeof window.router === 'function') {
        window.router();
      }
    }
  };
}

window.addEventListener('storage', function(e) {
  if (e.key === STORAGE_KEYS.POSTS) {
    try {
      const parsed = JSON.parse(e.newValue);
      if (Array.isArray(parsed) && window.state) {
        window.state.posts = parsed;
        const detailModal = document.getElementById('detail-modal');
        const isDetailOpen = detailModal && detailModal.classList.contains('active');
        if (window.location.hash === '#community' && !isDetailOpen && typeof window.router === 'function') {
          window.router();
        }
      }
    } catch(err) {}
  }
});

// 모듈 스크립트로 동작할 때와 일반 스크립트로 동작할 때 모두 대응할 수 있도록 전역 객체 바인딩 처리
window.Db = Db;
Db.init();