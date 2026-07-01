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
const initialHerbs = [
  {
    id: 'herbs-1',
    name: '인삼 (Ginseng)',
    scientificName: 'Panax ginseng C.A. Mey.',
    category: '뿌리류',
    efficacy: '면역력 증진, 피로 개선, 혈소판 응집 억제를 통한 혈액 흐름 개선, 기억력 개선, 항산화 작용.',
    sideEffects: '몸에 열이 너무 많은 사람은 과다 복용 시 두통, 불면, 가슴 답답함이 생길 수 있습니다.',
    howToUse: '물 1L에 건조 인삼 10g을 넣고 약불에서 2시간 정도 달여 하루 2~3회 음용합니다. 삼계탕이나 요리에 첨가해도 좋습니다.',
    imageUrl: 'images/ginseng.png',
  },
  {
    id: 'herbs-2',
    name: '당귀 (Korean Angelica)',
    scientificName: 'Angelica gigas Nakai',
    category: '뿌리/잎류',
    efficacy: '보혈작용(피를 보충함), 혈액 순환 개선, 부인과 질환(생리통, 생리불순) 완화, 수족냉증 개선.',
    sideEffects: '자궁 수축을 유발할 수 있으므로 임산부는 섭취를 금해야 하며, 설사가 잦은 사람도 주의가 필요합니다.',
    howToUse: '말린 당귀 뿌리 5~10g을 물 1L와 함께 끓여 차로 마십니다. 특유의 은은한 한약 향이 일품입니다.',
    imageUrl: 'images/angelica.png',
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
    category: '잎/뿌리류',
    efficacy: '간 기능 개선(실리마린 성분 풍부), 해독 및 소염 작용, 소화 불량 개선, 이뇨 작용으로 부종 완화.',
    sideEffects: '성질이 차가우므로 몸이 찬 사람이 많이 먹으면 속 쓰림이나 설사를 유발할 수 있습니다.',
    howToUse: '봄철 어린잎은 나물이나 겉절이로 먹고, 뿌리와 전초를 말려 볶은 후 차로 우려내면 구수한 맛을 낼 수 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1567606404787-84bc5e0e84b8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'herbs-5',
    name: '쑥 (Mugwort/애엽)',
    scientificName: 'Artemisia princeps Pamp.',
    category: '잎류',
    efficacy: '몸을 따뜻하게 함, 위장 기능 강화, 면역 조절, 항균 및 항염 작용, 여성 질환 완화.',
    sideEffects: '봄철 외의 자란 쑥은 독성이 강해질 수 있어 피해야 하며, 너무 과하게 섭취하면 위장에 무리가 갈 수 있습니다.',
    howToUse: '어린 쑥잎을 덖어 쑥차로 우려 마시거나, 국, 떡 등의 요리에 활용합니다. 쑥뜸이나 족욕용으로도 훌륭합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'herbs-6',
    name: '구기자 (Goji Berry)',
    scientificName: 'Lycium chinense Miller',
    category: '열매류',
    efficacy: '눈 건강 개선(베타카로틴 풍부), 노화 방지 및 항산화, 피로 회복, 간 세포 보호 및 지방간 예방.',
    sideEffects: '소화력이 약하고 설사를 자주 하는 사람은 소량만 섭취하는 것이 좋습니다.',
    howToUse: '잘 말린 구기자 열매 15g을 물 1.5L에 넣고 물이 붉은빛을 띨 때까지 끓여 식수 대용이나 차로 수시로 마십니다.',
    imageUrl: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=600&q=80',
  }
];

// 2. 초기 약선 힐링차 상품 데이터 (쿠팡/구매대행 고려)
const initialTeas = [
  {
    id: 'tea-1',
    name: '산빛 백화 약초꽃차 (Premium Blending)',
    description: '파주 감악산 자락의 청정 기운을 머금고 자란 야생 약초꽃 9가지를 엄선하여 정성껏 덖은 명품 수제 꽃차입니다. 심신 안정과 머리를 맑게 하는 데 탁월합니다.',
    price: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    coupangUrl: 'https://www.coupang.com', // 가상 쿠팡 링크
    agentBuyAvailable: true,
  },
  {
    id: 'tea-2',
    name: '몸을 데우는 당귀 쌍화차',
    description: '엄선된 국산 당귀, 천궁, 황기, 작약 등을 비법 비율로 황토 가마에서 서서히 달여 파우더 및 액상 차로 구현했습니다. 수족냉증과 만성 피로에 시달리는 분들께 강력 추천합니다.',
    price: 28000,
    imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80',
    coupangUrl: 'https://www.coupang.com',
    agentBuyAvailable: true,
  },
  {
    id: 'tea-3',
    name: '유기농 구운 민들레 뿌리차',
    description: '간 건강과 해독에 탁월한 유기농 민들레 뿌리를 3대째 내려오는 로스팅 기법으로 덖어 커피처럼 깊고 구수한 풍미를 선사합니다. 무카페인으로 밤에도 부담 없이 즐길 수 있습니다.',
    price: 19500,
    imageUrl: 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?auto=format&fit=crop&w=600&q=80',
    coupangUrl: 'https://www.coupang.com',
    agentBuyAvailable: false,
  }
];

// 3. 초기 미디어 갤러리 데이터
const initialMedia = [
  {
    id: 'media-1',
    type: 'image',
    title: '봄철 청정 구기자 채취 현장',
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    description: '청정한 산기슭에서 깨끗하게 자란 야생 약초와 구기자를 정성껏 채취하는 모습입니다.',
  },
  {
    id: 'media-2',
    type: 'image',
    title: '전통 가마 덖음 수제 꽃차 제조 과정',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    description: '약효 성분을 온전히 보존하기 위해 구증구포(아홉 번 찌고 아홉 번 말림) 방식으로 꽃차를 덖는 과정입니다.',
  },
  {
    id: 'media-3',
    type: 'video',
    title: '자연치유를 위한 5가지 약초 달이는 방법',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // 임시 유튜브 임베드 링크
    description: '약초의 유효 성분을 파괴하지 않고 몸에 가장 흡수가 잘 되게끔 홈메이드로 달이는 노하우 영상입니다.',
  },
  {
    id: 'media-4',
    type: 'video',
    title: '파주 산빛약초꽃차 다도 강좌 기초편',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // 임시 유튜브 임베드 링크
    description: '꽃차의 향과 색, 그리고 약성을 오감으로 음미할 수 있는 올바른 다도법 안내입니다.',
  }
];

// 4. 초기 가상 회원 정보 (관리자 1명, 일반 회원 3명)
const initialUsers = [
  {
    id: 'user-admin',
    email: 'admin@nature.com',
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
  mainTitle: '자연의 숨결로 채우는 건강한 삶',
  subTitle: '농사로 및 산빛약초꽃차의 지혜를 담은 자연치유 약초&약선차 가이드',
  introContent: '우리는 대자연의 치유력을 믿습니다. 예로부터 전해 내려온 신비로운 약초의 효능을 현대적인 관점에서 해석하고, 일상 속에서 가장 쉽고 아름답게 섭취할 수 있는 수제 약선 힐링차를 제안합니다. 몸과 마음의 균형을 되찾아주는 자연치유 라이스타일을 만나보세요.',
  brandColor: '#1E3F20',
  contactEmail: 'contact@nature.com',
  contactPhone: '031-940-1234 (파주 산빛 지점)',
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
    title: '당귀차 매일 한 잔씩 마신 뒤로 손발이 따뜻해졌어요!',
    content: '평생 수족냉증으로 고생해서 겨울은 물론 여름 에어컨 밑에서도 장갑을 끼고 싶을 정도였는데, 당귀차를 약 3주간 꾸준히 연하게 우려 마셨더니 혈액 순환이 되는 게 느껴집니다. 정말 자연치유의 힘은 대단하네요. 강추합니다!',
    author: '김철수',
    authorEmail: 'kim@gmail.com',
    date: '2026-06-25',
    comments: 3,
  },
  {
    id: 'post-2',
    title: '민들레 뿌리는 볶아서 마시는 건가요?',
    content: '민들레 생뿌리를 그냥 물에 끓여 마셨더니 너무 쓰고 떫어서 먹기 힘들더라고요. 찾아보니 한 번 볶거나 덖어서 차로 우려내면 둥굴레차처럼 고소하다고 하던데 방법이 맞나요? 고수분들의 조언 부탁드립니다.',
    author: '이영희',
    authorEmail: 'lee@daum.net',
    date: '2026-06-28',
    comments: 1,
  }
];

// LocalStorage Helper Functions
const getLocalStorage = (key, initialValue) => {
  const value = localStorage.getItem(key);
  if (value === null) {
    localStorage.setItem(key, JSON.stringify(initialValue));
    return initialValue;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    return initialValue;
  }
};

const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// 데이터 허브 인스턴스
const Db = {
  init() {
    const herbs = getLocalStorage(STORAGE_KEYS.HERBS, initialHerbs);
    // 이미지 로컬 경로 강제 동기화 (실물 이미지 교체용 마이그레이션)
    let updated = false;
    herbs.forEach(h => {
      if (h.id === 'herbs-1' && h.imageUrl.includes('unsplash')) {
        h.imageUrl = 'images/ginseng.png';
        updated = true;
      }
      if (h.id === 'herbs-2' && h.imageUrl.includes('unsplash')) {
        h.imageUrl = 'images/angelica.png';
        updated = true;
      }
      if (h.id === 'herbs-3' && h.imageUrl.includes('unsplash')) {
        h.imageUrl = 'images/licorice.png';
        updated = true;
      }
    });
    if (updated) {
      setLocalStorage(STORAGE_KEYS.HERBS, herbs);
    }

    getLocalStorage(STORAGE_KEYS.TEAS, initialTeas);
    getLocalStorage(STORAGE_KEYS.MEDIA, initialMedia);
    getLocalStorage(STORAGE_KEYS.USERS, initialUsers);
    getLocalStorage(STORAGE_KEYS.POSTS, initialPosts);
    getLocalStorage(STORAGE_KEYS.SETTINGS, initialSettings);
    getLocalStorage(STORAGE_KEYS.INQUIRIES, []);
  },

  // Herbs
  getHerbs() {
    return getLocalStorage(STORAGE_KEYS.HERBS, initialHerbs);
  },
  saveHerbs(herbs) {
    setLocalStorage(STORAGE_KEYS.HERBS, herbs);
  },

  // Teas
  getTeas() {
    return getLocalStorage(STORAGE_KEYS.TEAS, initialTeas);
  },
  saveTeas(teas) {
    setLocalStorage(STORAGE_KEYS.TEAS, teas);
  },

  // Media
  getMedia() {
    return getLocalStorage(STORAGE_KEYS.MEDIA, initialMedia);
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

  // Posts
  getPosts() {
    return getLocalStorage(STORAGE_KEYS.POSTS, initialPosts);
  },
  savePosts(posts) {
    setLocalStorage(STORAGE_KEYS.POSTS, posts);
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

// 모듈 스크립트로 동작할 때와 일반 스크립트로 동작할 때 모두 대응할 수 있도록 전역 객체 바인딩 처리
window.Db = Db;
Db.init();
