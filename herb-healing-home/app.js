// app.js - 자연치유 약초 홈페이지 애플리케이션 코어

// 1. 상태 객체 선언
const state = {
  currentUser: null,
  herbs: [],
  teas: [],
  media: [],
  users: [],
  posts: [],
  settings: {},
  inquiries: [],
  activeAdminTab: 'users' // 'users', 'website', 'media', 'plans', 'orders'
};

// 2. 초기화 함수
function initApp() {
  // DB에서 데이터 로드
  state.herbs = Db.getHerbs();
  state.teas = Db.getTeas();
  state.media = Db.getMedia();
  state.users = Db.getUsers();
  state.posts = Db.getPosts();
  state.settings = Db.getSettings();
  state.inquiries = Db.getInquiries();

  // 로그인 세션 확인
  const session = localStorage.getItem('herb_healing_session');
  if (session) {
    state.currentUser = JSON.parse(session);
  }

  // 브랜드 텍스트 초기 적용
  updateBrandText();

  // 라우터 연결
  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);

  // 글로벌 이벤트 리스너 등록
  Auth.renderAuthUI();
}

// 브랜드 정보 실시간 업데이트
function updateBrandText() {
  const brandTitleEl = document.getElementById('header-brand-title');
  const brandSubEl = document.getElementById('header-brand-subtitle');
  if (brandTitleEl && state.settings.mainTitle) {
    brandTitleEl.innerText = state.settings.mainTitle;
  }
  if (brandSubEl && state.settings.subTitle) {
    brandSubEl.innerText = state.settings.subTitle;
  }
  // 푸터 이메일/전화번호 연동
  const footerEmailEl = document.querySelector('.footer-email');
  const footerPhoneEl = document.querySelector('.footer-phone');
    if (footerEmailEl) footerEmailEl.innerText = state.settings.contactEmail || 'tksqlc08@gmail.com';
  if (footerPhoneEl) footerPhoneEl.innerText = state.settings.contactPhone || '031-942-0545(산빛약초꽃차)';
}

// 3. 라우터 구현
function router() {
  const hash = window.location.hash || '#home';
  const page = hash.substring(1);

  // 관리자 권한 체크 가드
  if (page === 'admin') {
    if (!state.currentUser || state.currentUser.role !== 'admin') {
      alert('관리자 권한이 필요합니다.');
      window.location.hash = '#home';
      return;
    }
  }

  // 네비게이션 액티브 상태 업데이트
  const navLinks = document.querySelectorAll('#main-nav-links li');
  navLinks.forEach(link => {
    if (link.getAttribute('data-target') === page) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 콘텐츠 렌더링 컨테이너 비우기
  const appContainer = document.getElementById('app-view-container');
  appContainer.innerHTML = '';

  // 라우팅 스위치
  switch (page) {
    case 'home':
      renderHome(appContainer);
      break;
    case 'encyclopedia':
      renderEncyclopedia(appContainer);
      break;
    case 'teas':
      renderTeas(appContainer);
      break;
    case 'academy':
      renderAcademy(appContainer);
      break;
    case 'community':
      renderCommunity(appContainer);
      break;
    case 'location':
      renderLocation(appContainer);
      break;
    case 'media':
      renderMedia(appContainer);
      break;
    case 'barefoot':
      renderBarefoot(appContainer);
      break;
    case 'meditation':
      renderMeditation(appContainer);
      break;
    case 'pricing':
      renderPricing(appContainer);
      break;
    case 'admin':
      renderAdmin(appContainer);
      break;
    default:
      renderHome(appContainer);
  }
}

// ==========================================
// 4. 페이지 렌더러 함수들
// ==========================================

// --- HOME PAGE ---
function renderHome(container) {
  const homeView = document.createElement('div');
  homeView.className = 'page-view';

  // 히어로 섹션
  const heroHtml = `
    <section class="hero-section">
      <div class="hero-text">
        <h2>${state.settings.mainTitle}</h2>
        <p class="subtitle">${state.settings.subTitle}</p>
        <p class="intro">${state.settings.introContent}</p>
        <div class="hero-buttons">
          <a href="#encyclopedia" class="btn-primary"><i class="fa-solid fa-leaf"></i> 약초 사전 알아보기</a>
          <a href="#teas" class="btn-secondary"><i class="fa-solid fa-mug-hot"></i> 힐링차 상품 보기</a>
        </div>
      </div>
      <div class="hero-image">
        <img src="images/premium_tea_box.jpg" alt="산빛 수제 약선차">
        <div class="hero-badge">
          <i class="fa-solid fa-hand-holding-heart"></i>
          <span>자연에서 온<br>치유의 생명력</span>
        </div>
      </div>
    </section>
  `;

  // 추천 약초 3개
  let herbCardsHtml = '';
  state.herbs.slice(0, 3).forEach(herb => {
    herbCardsHtml += `
      <div class="herb-card">
        <img src="${herb.imageUrl}" alt="${herb.name}" class="herb-card-img">
        <div class="herb-card-content">
          <span class="herb-card-cat">${herb.category}</span>
          <h3 class="herb-card-title">${herb.name}</h3>
          <span class="herb-card-sci">${herb.scientificName}</span>
          <p class="herb-card-desc">${herb.efficacy}</p>
          <button class="btn-card-more" onclick="Encyclopedia.openDetail('${herb.id}')">효능 & 복용법 보기 <i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    `;
  });

  // 추천 약선차 2개
  let teaCardsHtml = '';
  state.teas.slice(0, 2).forEach(tea => {
    const isPremium = tea.price >= 30000;
    teaCardsHtml += `
      <div class="tea-card">
        <div class="tea-card-img-wrap">
          <img src="${tea.imageUrl}" alt="${tea.name}" class="tea-card-img">
          <span class="tea-price-badge">${tea.price.toLocaleString()}원</span>
        </div>
        <div class="tea-card-content">
          <h3 class="tea-card-title">${tea.name}</h3>
          <p class="tea-card-desc">${tea.description}</p>
          <div class="tea-card-actions">
            <a href="${tea.naverUrl}" target="_blank" class="btn-naver-buy"><i class="fa-solid fa-cart-shopping"></i> 네이버 구매</a>
            ${tea.agentBuyAvailable 
              ? `<button class="btn-agent-buy" onclick="Teas.openAgentBuyModal('${tea.id}')"><i class="fa-solid fa-paper-plane"></i> 구매대행</button>` 
              : `<button class="btn-agent-buy btn-disabled" disabled><i class="fa-solid fa-ban"></i> 대행 불가</button>`
            }
          </div>
        </div>
      </div>
    `;
  });

  // 연구원 소개 섹션
  const aboutHtml = `
    <section class="about-section" style="margin-bottom: 5rem;">
      <div class="section-title-wrap">
        <h2 class="section-title">산빛약초꽃차문화연구원 소개</h2>
        <p class="section-subtitle">자연의 생명력과 치유를 연구하는 10년의 여정</p>
      </div>
      
      <div class="about-grid">
        <div class="about-image-container">
          <img src="images/about_institute.jpg" alt="산빛약초꽃차문화연구원 전경" class="about-img">
          <div class="about-experience-badge">
            <span class="exp-num">10+</span>
            <span class="exp-text">약초 및 꽃차<br>연구 경력</span>
          </div>
        </div>
        
        <div class="about-details">
          <div class="about-desc-card">
            <p class="about-main-text">
              산빛약초꽃차문화연구원은 10여년 넘게 약초와 꽃차에 대해 연구를 해오고 있고, 이를 실생활에 활용할 수 있도록 연구, 개발, 교육을 하고 있으며 자연치유분야를 활용해 사람들의 건강과 치유에 대해서도 연구, 개발하는 연구원입니다.
            </p>
          </div>
          
          <div class="about-info-cards">
            <!-- 전문 연구진 -->
            <div class="about-info-card">
              <div class="info-card-icon"><i class="fa-solid fa-user-doctor"></i></div>
              <div class="info-card-content">
                <h4>전문 연구진</h4>
                <ul>
                  <li><strong>대표원장:</strong> 약선차 전문강사, 꽃차 전문강사 및 보건교육사(3급) 자격증을 보유하고, 대학원에서 자연치유학(보건학 석사)을 전공했습니다.</li>
                  <li><strong>실장:</strong> 전 약초관리사, 한국약용작물교육협회 교·강사 출신으로 약초에 대한 연구를 10여년 넘게 해오고 있고, 현재 대학원에서 자연치유학을 전공하면서 대표원장과 연구를 함께 하고 있습니다.</li>
                </ul>
              </div>
            </div>
            
            <!-- 수제 약선 힐링차 & 카페 -->
            <div class="about-info-card">
              <div class="info-card-icon"><i class="fa-solid fa-mug-hot"></i></div>
              <div class="info-card-content">
                <h4>산빛약초꽃차 카페 & 수제 차</h4>
                <p>
                  산빛약초꽃차문화연구원에서 운영하는 <strong>산빛약초꽃차 카페</strong>에서는 시중에서 판매되고 있는 GMP제품의 한약재(식약처 인정 식·약 공용 한약재)를 깨끗하게 다시 손질하여 수작업(hand made)으로 만든 우슬차, 맑음차, 쌍화차, 바람차, 도라지차, 휘파람차와 정갈하게 손질한 약재와 꽃을 블랜딩하여 만든 혈꽃차, 코꽃차, 눈꽃차 등을 판매하고 있습니다.
                </p>
                <p class="accent-p"><i class="fa-solid fa-circle-check"></i> 산빛약초꽃차에서 만들어 판매하는 약선힐링차는 한의학 의서에 있는 기본 방제를 기초로 하여 만든 제품입니다.</p>
              </div>
            </div>
            
            <!-- 민간자격증 과정 -->
            <div class="about-info-card">
              <div class="info-card-icon"><i class="fa-solid fa-graduation-cap"></i></div>
              <div class="info-card-content">
                <h4>전문 교육 및 자격증 과정</h4>
                <p>
                  아울러 산빛약초꽃차문화연구원에서는 꽃차와 약초교육을 통해 민간자격증인 <strong>‘약초꽃차관리사’</strong>를 제공하고 있는 연구원이기도 합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  homeView.innerHTML = `
    ${heroHtml}
    
    ${aboutHtml}
    
    <div style="margin-bottom: 5rem;">
      <div class="section-title-wrap">
        <h2 class="section-title">자연이 준 선물, 대표 약초</h2>
        <p class="section-subtitle">농사로 표준 데이터에 근거한 건강 약초의 올바른 쓰임새</p>
      </div>
      <div class="cards-grid">
        ${herbCardsHtml}
      </div>
    </div>

    <div>
      <div class="section-title-wrap">
        <h2 class="section-title">산빛 수제 약선 힐링차</h2>
        <p class="section-subtitle">파주 청정 꽃차와 약초를 현대적인 기법으로 블렌딩한 명품 수제차</p>
      </div>
      <div class="cards-grid" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));">
        ${teaCardsHtml}
      </div>
    </div>
  `;

  container.appendChild(homeView);
}

// --- ENCYCLOPEDIA PAGE ---
const Encyclopedia = {
  activeCategory: '전체',
  searchQuery: '',

  render(container) {
    const view = document.createElement('div');
    view.className = 'page-view';

    // 카테고리 탭 리스트 추출 (신규 4개 카테고리 포함)
    const categories = ['전체', '약초꽃류', '뿌리류', '잎류', '뿌리잎류', '열매류', '껍질류', '가지류', '해산물류', '화석류'];
    let filterTabsHtml = '';
    categories.forEach(cat => {
      const activeClass = cat === this.activeCategory ? 'active' : '';
      filterTabsHtml += `<button class="filter-tab ${activeClass}" onclick="Encyclopedia.setCategory('${cat}')">${cat}</button>`;
    });

    view.innerHTML = `
      <div class="section-title-wrap">
        <h2 class="section-title">자연치유 약초 사전</h2>
        <p class="section-subtitle">올바른 효능과 올바른 섭취법으로 부작용 없이 더욱 건강하게</p>
      </div>

      <div class="search-filter-bar">
        <div class="search-input-wrap">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="herb-search-input" placeholder="약초 이름이나 효능으로 검색하세요..." value="${this.searchQuery}" onkeyup="Encyclopedia.search(this.value)">
        </div>
        <div class="filter-tabs">
          ${filterTabsHtml}
        </div>
      </div>

      <div class="cards-grid" id="herbs-list-container">
        <!-- Herbs Cards will be loaded dynamically -->
      </div>
    `;

    container.appendChild(view);
    this.renderHerbCards();
  },

  renderHerbCards() {
    const herbsContainer = document.getElementById('herbs-list-container');
    if (!herbsContainer) return;

    let filtered = state.herbs;

    // 카테고리 필터링
    if (this.activeCategory !== '전체') {
      filtered = filtered.filter(h => 
        h.category === this.activeCategory || 
        (this.activeCategory === '뿌리잎류' && (h.category === '뿌리/잎류' || h.category === '잎/뿌리류'))
      );
    }

    // 키워드 검색 필터링
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(query) || 
        h.scientificName.toLowerCase().includes(query) ||
        h.efficacy.toLowerCase().includes(query)
      );
    }

    if (filtered.length === 0) {
      herbsContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--text-muted);">검색 조건에 맞는 약초 데이터가 없습니다.</div>`;
      return;
    }

    let cardsHtml = '';
    filtered.forEach(herb => {
      cardsHtml += `
        <div class="herb-card">
          <img src="${herb.imageUrl}" alt="${herb.name}" class="herb-card-img" onerror="this.onerror=null; this.src='images/peony.png';">
          <div class="herb-card-content">
            <span class="herb-card-cat">${herb.category}</span>
            <h3 class="herb-card-title">${herb.name}</h3>
            <span class="herb-card-sci">${herb.scientificName}</span>
            <p class="herb-card-desc">${herb.efficacy}</p>
            <button class="btn-card-more" onclick="Encyclopedia.openDetail('${herb.id}')">효능 & 복용법 보기 <i class="fa-solid fa-arrow-right"></i></button>
          </div>
        </div>
      `;
    });
    herbsContainer.innerHTML = cardsHtml;
  },

  setCategory(cat) {
    this.activeCategory = cat;
    // 탭 버튼 클래스 교체
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
      if (tab.innerText === cat) tab.classList.add('active');
      else tab.classList.remove('active');
    });
    this.renderHerbCards();
  },

  search(val) {
    this.searchQuery = val;
    this.renderHerbCards();
  },

  openDetail(id) {
    const herb = state.herbs.find(h => h.id === id);
    if (!herb) return;

    let contentHtml = `
        <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
          <img src="${herb.imageUrl}" alt="${herb.name}" style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--border-radius-md);" onerror="this.onerror=null; this.src='images/peony.png';">
          <div>
            <span class="herb-card-cat" style="margin-bottom: 8px;">${herb.category}</span>
            <h2 style="font-family: var(--font-title); font-size: 1.8rem; color: var(--primary-color);">${herb.name}</h2>
            <p style="font-style: italic; color: var(--text-muted); margin-bottom: 20px;">학명: ${herb.scientificName}</p>
            
            <div style="margin-bottom: 20px; background: rgba(30,63,32,0.03); padding: 15px; border-radius: var(--border-radius-sm); border-left: 4px solid var(--primary-color);">
              <h4 style="font-weight: 700; color: var(--primary-color); margin-bottom: 5px;"><i class="fa-solid fa-hand-holding-heart"></i> 자연치유 효능</h4>
              <p>${herb.efficacy}</p>
            </div>
            
            <div style="margin-bottom: 20px; background: rgba(231,76,60,0.03); padding: 15px; border-radius: var(--border-radius-sm); border-left: 4px solid #e74c3c;">
              <h4 style="font-weight: 700; color: #e74c3c; margin-bottom: 5px;"><i class="fa-solid fa-triangle-exclamation"></i> 부작용 및 주의사항</h4>
              <p>${herb.sideEffects}</p>
            </div>
            
            <div style="background: rgba(140,98,57,0.03); padding: 15px; border-radius: var(--border-radius-sm); border-left: 4px solid var(--secondary-color);">
              <h4 style="font-weight: 700; color: var(--secondary-color); margin-bottom: 5px;"><i class="fa-solid fa-mortar-pestle"></i> 복용법 & 활용 가이드</h4>
              <p>${herb.howToUse}</p>
            </div>
          </div>
        </div>
      `;

    const detailContainer = document.getElementById('detail-modal-body');
    detailContainer.innerHTML = contentHtml;
    UI.openModal('detail-modal');
  }
};

function renderEncyclopedia(container) {
  Encyclopedia.render(container);
}

// --- HEALING TEA PAGE ---
const Teas = {
  render(container) {
    const view = document.createElement('div');
    view.className = 'page-view';

    let cardsHtml = '';
    state.teas.forEach(tea => {
      cardsHtml += `
        <div class="tea-card">
          <div class="tea-card-img-wrap">
            <img src="${tea.imageUrl}" alt="${tea.name}" class="tea-card-img">
            <span class="tea-price-badge">${tea.price.toLocaleString()}원</span>
          </div>
          <div class="tea-card-content">
            <h3 class="tea-card-title">${tea.name}</h3>
            <p class="tea-card-desc">${tea.description}</p>
            <div class="tea-card-actions">
              <a href="${tea.naverUrl}" target="_blank" class="btn-naver-buy"><i class="fa-solid fa-cart-shopping"></i> 네이버 구매</a>
              ${tea.agentBuyAvailable 
                ? `<button class="btn-agent-buy" onclick="Teas.openAgentBuyModal('${tea.id}')"><i class="fa-solid fa-paper-plane"></i> 구매대행</button>` 
                : `<button class="btn-agent-buy btn-disabled" disabled><i class="fa-solid fa-ban"></i> 대행 불가</button>`
              }
            </div>
          </div>
        </div>
      `;
    });

    const processHtml = `
      <section class="process-section" style="margin-top: 6rem; margin-bottom: 3rem;">
        <div class="section-title-wrap">
          <h2 class="section-title">약선힐링차(맑음차) 만드는 과정</h2>
          <p class="section-subtitle">한의학 의서의 전통 방제를 기초로, 100% 수작업으로 정성껏 만들어지는 과정입니다.</p>
        </div>

        <div class="process-layout">
          <!-- 왼쪽: 인트로 소개 및 대표 이미지 -->
          <div class="process-intro-card">
            <div class="process-img-wrap">
              <img src="images/roasting_tea.jpg" alt="100% 수작업 덖음 작업" class="process-main-img">
              <div class="process-badge">
                <i class="fa-solid fa-hand-holding-heart"></i>
                <span>100% 수작업<br>덖음</span>
              </div>
            </div>
            <div class="process-intro-content">
              <h3>전통 방식과 정성의 만남</h3>
              <p>산빛약초꽃차에서 제조하여 판매하는 약선힐링차는 한의학 의서에 있는 기본 방제를 기초로 하여 만듭니다. 모든 원재료의 세척, 약재손질, 건조, 덖음, 포장까지 전 과정을 수작업으로 꼼꼼하게 진행하고 있습니다.</p>
              <div class="process-quote">
                <i class="fa-solid fa-quote-left"></i>
                <span>모든 과정이 수작업이다 보니 손이 많이 가지만, 정직한 한 잔의 치유를 위해 타협하지 않습니다.</span>
              </div>
            </div>
          </div>

          <!-- 오른쪽: 9단계 타임라인 -->
          <div class="process-timeline">
            <!-- 1단계 -->
            <div class="process-step-card">
              <div class="step-header">
                <span class="step-num">01</span>
                <h4>원지(遠志) 손질</h4>
              </div>
              <p class="step-desc">한의서에 기록된 처방대로 정갈하게 약재를 선별하고, 먼저 원지에 대한 전문적인 약재 손질을 시작합니다.</p>
            </div>

            <!-- 2단계 -->
            <div class="process-step-card">
              <div class="step-header">
                <span class="step-num">02</span>
                <h4>약재 세척</h4>
              </div>
              <p class="step-desc">손질된 원재료 약재들의 미세 먼지와 이물질을 깨끗한 물로 맑게 세척합니다.</p>
            </div>

            <!-- 3단계 -->
            <div class="process-step-card">
              <div class="step-header">
                <span class="step-num">03</span>
                <h4>세절 및 1차 건조</h4>
              </div>
              <p class="step-desc">약효 성분이 차로 가장 잘 우러나올 수 있도록 잘게 자르는 세절(細切)을 거친 뒤, 다시 꼼꼼하게 건조 작업을 진행합니다.</p>
            </div>

            <!-- 4단계 -->
            <div class="process-step-card">
              <div class="step-header">
                <span class="step-num">04</span>
                <h4>석창포(石菖蒲) 손질</h4>
              </div>
              <p class="step-desc">두 번째 핵심 약재인 석창포를 원지와 똑같은 공정(손질-세척-세절-건조)으로 정성껏 작업합니다. 석창포는 물가에서 자라기에 고운 흙이나 이물질이 많이 나올 수 있어 더욱 주의 깊게 씻어냅니다.</p>
            </div>

            <!-- 5단계 -->
            <div class="process-step-card">
              <div class="step-header">
                <span class="step-num">05</span>
                <h4>복신(茯神) 손질</h4>
              </div>
              <p class="step-desc">세 번째로 정신을 안정시키고 속을 보하는 복신에 대한 섬세한 약재 손질과 정교하게 자르는 자르기 작업을 진행합니다. (원래 전통 한의서 방제에 따르면 여기까지의 배합으로 맑음차가 완성됩니다.)</p>
            </div>

            <!-- 6단계 -->
            <div class="process-step-card">
              <div class="step-header">
                <span class="step-num">06</span>
                <h4>용안육(龍眼肉) 추가 및 손질</h4>
              </div>
              <p class="step-desc">차의 효능을 더욱 높이기 위해 신경 안정과 기력을 보강하는 효과가 탁월한 용안육을 추가로 처방합니다. 용안육에 미세하게 붙어 있는 씨앗들을 수작업으로 완벽하게 제거하고 약효가 고루 우러나도록 세심하게 자릅니다.</p>
            </div>

            <!-- 7단계 -->
            <div class="process-step-card">
              <div class="step-header">
                <span class="step-num">07</span>
                <h4>용안육 특수 건조</h4>
              </div>
              <p class="step-desc">용안육은 풍부한 보음(補陰) 효과를 지녀 이미 건조된 상품이라도 끈적끈적함이 강합니다. 이를 그대로 차로 만들면 티백 필터에 묻어 나와 품질이 낮아질 수 있으므로, 끈적함을 말려주기 위해 정성어린 2차 건조 작업을 별도로 거칩니다.</p>
            </div>

            <!-- 8단계 -->
            <div class="process-step-card">
              <div class="step-header">
                <span class="step-num">08</span>
                <h4>덖음 작업</h4>
              </div>
              <p class="step-desc">잘 건조된 약재들을 모아 전통 방식의 덖음(볶음) 과정을 거칩니다. 불 조절과 손맛을 통해 약재 고유의 쓰고 아린 맛은 잡고, 한층 고소하고 깊은 풍미를 더해줍니다. 덖은 직후 약재들은 더욱 깊은 향과 훌륭한 빛깔을 띱니다.</p>
            </div>

            <!-- 9단계 -->
            <div class="process-step-card">
              <div class="step-header">
                <span class="step-num">09</span>
                <h4>수분 체크 및 제품 완성</h4>
              </div>
              <p class="step-desc">마지막으로 수분이 완전히 제거되었는지 까다롭게 수분 잔여량을 체크합니다. 이 엄격한 검사를 통과한 고품질 약재들만이 최종 <strong>'맑음차'</strong> 상품으로 패키징되어 고객님들께 전해집니다.</p>
            </div>
          </div>
        </div>
      </section>
    `;

    view.innerHTML = `
      <div class="section-title-wrap">
        <h2 class="section-title">약선 힐링차 상품관</h2>
        <p class="section-subtitle">산빛약초꽃차에서 수제 가공한 건강차를 제공합니다.</p>
      </div>

      <div class="cards-grid">
        ${cardsHtml}
        <!-- 추가 약선힐링차 소개 -->
        <div class="tea-card intro-tea-card" style="background: linear-gradient(135deg, rgba(30, 63, 32, 0.03), rgba(140, 98, 57, 0.05)); border: 2px dashed rgba(30, 63, 32, 0.2);">
          <div class="tea-card-img-wrap" style="background: rgba(30, 63, 32, 0.05); display: flex; align-items: center; justify-content: center; height: 240px; overflow: hidden; position: relative;">
            <img src="images/additional_healing_tea.jpg" alt="추가 약선힐링차 소개" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.85;">
            <div style="position: absolute; bottom: 15px; left: 15px; background: rgba(30, 63, 32, 0.85); color: white; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: 500;">
              <i class="fa-solid fa-leaf"></i> 수제 전통차 연구
            </div>
          </div>
          <div class="tea-card-content" style="padding: 25px; display: flex; flex-direction: column; justify-content: space-between; flex: 1;">
            <div>
              <h3 class="tea-card-title" style="color: var(--primary-color); border-bottom: 2px solid rgba(30, 63, 32, 0.1); padding-bottom: 8px; margin-bottom: 15px; font-size: 1.3rem;">추가 약선힐링차 소개</h3>
              <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
                <li style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.92rem; line-height: 1.4; color: var(--text-main);">
                  <i class="fa-solid fa-circle-check" style="color: var(--secondary-color); margin-top: 4px; font-size: 0.9rem;"></i>
                  <span>목을 부드럽게 도와주는 <strong>도라지차</strong></span>
                </li>
                <li style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.92rem; line-height: 1.4; color: var(--text-main);">
                  <i class="fa-solid fa-circle-check" style="color: var(--secondary-color); margin-top: 4px; font-size: 0.9rem;"></i>
                  <span>무릎이 웃는 <strong>우슬차</strong></span>
                </li>
                <li style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.92rem; line-height: 1.4; color: var(--text-main);">
                  <i class="fa-solid fa-circle-check" style="color: var(--secondary-color); margin-top: 4px; font-size: 0.9rem;"></i>
                  <span>땀을 덜 흐르게 하는 <strong>여름차</strong></span>
                </li>
                <li style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.92rem; line-height: 1.4; color: var(--text-main);">
                  <i class="fa-solid fa-circle-check" style="color: var(--secondary-color); margin-top: 4px; font-size: 0.9rem;"></i>
                  <span>깜박, 두근거림을 완화하는 <strong>바람차</strong></span>
                </li>
                <li style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.92rem; line-height: 1.4; color: var(--text-main);">
                  <i class="fa-solid fa-circle-check" style="color: var(--secondary-color); margin-top: 4px; font-size: 0.9rem;"></i>
                  <span>총명탕의 한약 재료로 만든 <strong>맑음차</strong></span>
                </li>
              </ul>
            </div>
            <p style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 20px; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 10px; font-style: italic;">
              * 추가 소개된 맞춤 약선차는 전화 및 고객지원 이메일로 별도 주문/문의 가능합니다.
            </p>
          </div>
        </div>
      </div>

      ${processHtml}
    `;

    container.appendChild(view);
  },

  openAgentBuyModal(id) {
    if (!state.currentUser) {
      alert('구매대행을 신청하시려면 로그인이 필요합니다.');
      UI.openModal('google-login-modal');
      return;
    }

    const tea = state.teas.find(t => t.id === id);
    if (!tea) return;

    // 폼 인풋 채우기
    document.getElementById('buy-product-id').value = tea.id;
    document.getElementById('buy-product-name').value = tea.name;
    document.getElementById('buy-product-price').value = `${tea.price.toLocaleString()}원`;
    document.getElementById('buy-user-name').value = '';
    
    UI.openModal('agent-buy-modal');
  },

  submitAgentBuy() {
    const teaId = document.getElementById('buy-product-id').value;
    const teaName = document.getElementById('buy-product-name').value;
    const name = document.getElementById('buy-user-name').value;
    const phone = document.getElementById('buy-user-phone').value;
    const address = document.getElementById('buy-user-address').value;
    const notes = document.getElementById('buy-user-notes').value;

    if (!name || !phone || !address) {
      alert('신청자, 연락처, 주소를 정확히 입력해주세요.');
      return;
    }

    const newInquiry = {
      id: 'inq-' + Date.now(),
      productId: teaId,
      productName: teaName,
      userName: name,
      userEmail: state.currentUser.email,
      phone: phone,
      address: address,
      notes: notes,
      status: '접수대기',
      date: new Date().toISOString().split('T')[0]
    };

    state.inquiries.push(newInquiry);
    Db.saveInquiries(state.inquiries);

    alert(`구매대행 신청이 성공적으로 접수되었습니다.\n접수 상태: 접수대기`);
    UI.closeModal('agent-buy-modal');

    // 입력 폼 리셋
    document.getElementById('agent-buy-form').reset();
  }
};

function renderTeas(container) {
  Teas.render(container);
}

// --- COMMUNITY PAGE ---
const Community = {
  render(container) {
    const view = document.createElement('div');
    view.className = 'page-view';

    let tableRowsHtml = '';
    state.posts.forEach(post => {
      tableRowsHtml += `
        <div class="post-row" onclick="Community.viewPostDetail('${post.id}')">
          <div class="post-main-info">
            <span class="post-title">${post.title}</span>
            <span class="post-author"><i class="fa-solid fa-circle-user"></i> ${post.author} (${post.authorEmail})</span>
          </div>
          <span class="post-date">${post.date}</span>
          <span class="post-comments"><i class="fa-regular fa-comment-dots"></i> ${post.comments || 0}</span>
        </div>
      `;
    });

    view.innerHTML = `
      <div class="section-title-wrap">
        <h2 class="section-title">자연치유 체험 나눔방</h2>
        <p class="section-subtitle">약초와 꽃차를 활용한 건강 회복 체험담과 질문을 자유롭게 나누어주세요.</p>
      </div>

      <div class="community-actions">
        <button class="btn-primary" onclick="Community.openWriteModal()"><i class="fa-solid fa-pen-to-square"></i> 새 글 쓰기</button>
      </div>

      <div class="posts-list">
        <div class="post-row" style="background: rgba(30,63,32,0.08); font-weight: 700; pointer-events: none; border-bottom: 2px solid rgba(30,63,32,0.15);">
          <div>제목 / 작성자</div>
          <div style="text-align: center;">작성일</div>
          <div style="text-align: center;">조회</div>
        </div>
        ${tableRowsHtml ? tableRowsHtml : '<div style="text-align: center; padding: 40px; color: var(--text-muted);">작성된 게시글이 없습니다.</div>'}
      </div>
    `;

    container.appendChild(view);
  },

  openWriteModal() {
    if (!state.currentUser) {
      alert('커뮤니티 글을 작성하려면 로그인이 필요합니다.');
      UI.openModal('google-login-modal');
      return;
    }

    // 폼 초기화
    document.getElementById('post-id-input').value = '';
    document.getElementById('post-title-input').value = '';
    document.getElementById('post-content-input').value = '';
    document.getElementById('community-modal-title').innerText = '새 글 쓰기';

    UI.openModal('community-modal');
  },

  savePost() {
    const id = document.getElementById('post-id-input').value;
    const title = document.getElementById('post-title-input').value;
    const content = document.getElementById('post-content-input').value;

    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    if (id) {
      // 수정 모드
      const postIndex = state.posts.findIndex(p => p.id === id);
      if (postIndex > -1) {
        // 권한 확인
        if (state.posts[postIndex].authorEmail !== state.currentUser.email && state.currentUser.role !== 'admin') {
          alert('수정 권한이 없습니다.');
          return;
        }
        state.posts[postIndex].title = title;
        state.posts[postIndex].content = content;
      }
    } else {
      // 새 글 모드
      const newPost = {
        id: 'post-' + Date.now(),
        title: title,
        content: content,
        author: state.currentUser.name || '무명씨',
        authorEmail: state.currentUser.email,
        date: new Date().toISOString().split('T')[0],
        comments: 0
      };
      state.posts.unshift(newPost);
    }

    Db.savePosts(state.posts);
    UI.closeModal('community-modal');
    // 현재 커뮤니티 탭 새로고침
    router();
  },

  viewPostDetail(id) {
    const post = state.posts.find(p => p.id === id);
    if (!post) return;

    // 해당 글이 본인 글인지 혹은 관리자 계정인지 체크하여 제어 버튼 노출
    const canEdit = state.currentUser && (state.currentUser.email === post.authorEmail || state.currentUser.role === 'admin');

    const contentHtml = `
      <div>
        <h2 style="font-family: var(--font-title); font-size: 1.6rem; color: var(--primary-color); margin-bottom: 10px;">${post.title}</h2>
        <div style="display: flex; justify-content: space-between; align-items: center; color: var(--text-muted); font-size: 0.85rem; padding-bottom: 15px; border-bottom: 1px solid rgba(0,0,0,0.08); margin-bottom: 25px;">
          <span><i class="fa-solid fa-circle-user"></i> ${post.author} (${post.authorEmail})</span>
          <span>작성일: ${post.date}</span>
        </div>
        <div style="font-size: 1rem; line-height: 1.8; color: var(--text-main); min-height: 180px; white-space: pre-line; margin-bottom: 30px;">
          ${post.content}
        </div>
        
        <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 20px;">
          <div>
            ${canEdit ? `
              <button class="btn-secondary" style="padding: 8px 16px; font-size: 0.85rem; margin-right: 8px;" onclick="Community.editPost('${post.id}')"><i class="fa-solid fa-pen"></i> 수정</button>
              <button class="btn-secondary" style="padding: 8px 16px; font-size: 0.85rem; color: #e74c3c; border-color: #e74c3c;" onclick="Community.deletePost('${post.id}')"><i class="fa-solid fa-trash"></i> 삭제</button>
            ` : ''}
          </div>
          <button class="btn-primary" style="padding: 8px 20px; font-size: 0.85rem;" onclick="UI.closeModal('detail-modal')">목록으로</button>
        </div>
      </div>
    `;

    document.getElementById('detail-modal-body').innerHTML = contentHtml;
    UI.openModal('detail-modal');
  },

  editPost(id) {
    UI.closeModal('detail-modal');
    const post = state.posts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('post-id-input').value = post.id;
    document.getElementById('post-title-input').value = post.title;
    document.getElementById('post-content-input').value = post.content;
    document.getElementById('community-modal-title').innerText = '글 수정하기';

    UI.openModal('community-modal');
  },

  deletePost(id) {
    if (!confirm('정말로 이 글을 삭제하시겠습니까?')) return;

    const postIndex = state.posts.findIndex(p => p.id === id);
    if (postIndex > -1) {
      state.posts.splice(postIndex, 1);
      Db.savePosts(state.posts);
      UI.closeModal('detail-modal');
      router();
    }
  }
};

function renderCommunity(container) {
  Community.render(container);
}

// --- MEDIA GALLERY PAGE ---
const Media = {
  render(container) {
    const view = document.createElement('div');
    view.className = 'page-view';

    let cardsHtml = '';
    state.media.forEach(item => {
      let previewHtml = '';
      if (item.type === 'video') {
        previewHtml = `<iframe src="${item.url}" allowfullscreen></iframe>`;
      } else {
        previewHtml = `<img src="${item.url}" alt="${item.title}">`;
      }

      cardsHtml += `
        <div class="media-card">
          <div class="media-preview-container">
            ${previewHtml}
            <div class="media-badge-icon">
              ${item.type === 'video' ? '<i class="fa-solid fa-play"></i>' : '<i class="fa-solid fa-image"></i>'}
            </div>
          </div>
          <div class="media-card-content">
            <h3 class="media-card-title">${item.title}</h3>
            <p class="media-card-desc">${item.description}</p>
          </div>
        </div>
      `;
    });

    view.innerHTML = `
      <div class="section-title-wrap">
        <h2 class="section-title">산빛 힐링 미디어</h2>
        <p class="section-subtitle">잠시 쉬어 가세요</p>
      </div>

      <div class="cards-grid">
        ${cardsHtml ? cardsHtml : '<div style="grid-column:1/-1; text-align:center; padding: 50px; color:var(--text-muted);">미디어 라이브러리가 비어 있습니다.</div>'}
      </div>
    `;

    container.appendChild(view);
  }
};

function renderMedia(container) {
  Media.render(container);
}

// --- ACADEMY PAGE (약초교실) ---
const Academy = {
  render(container) {
    const view = document.createElement('div');
    view.className = 'page-view';

    view.innerHTML = `
      <!-- Hero Section -->
      <div class="hero-section" style="margin-bottom: 3.5rem; background: linear-gradient(135deg, rgba(30,63,32,0.88), rgba(140,98,57,0.78)), url('https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80') no-repeat center center; background-size: cover; border-radius: var(--border-radius-lg); padding: 5rem 2rem; color: #fff; text-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; text-align: center; box-shadow: var(--glass-shadow);">
        <div style="max-width: 850px; backdrop-filter: blur(10px); background: rgba(0,0,0,0.25); padding: 3rem 2rem; border-radius: var(--border-radius-md); border: 1px solid rgba(255,255,255,0.2);">
          <span style="background: var(--accent-color); color: #1E3F20; padding: 5px 15px; border-radius: 30px; font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 15px; display: inline-block;">산빛 자연치유 아카데미</span>
          <h2 style="font-family: var(--font-title); font-size: 2.8rem; margin-bottom: 15px; font-weight: 700; color: #fff; line-height: 1.2;"><i class="fa-solid fa-graduation-cap"></i> 자연의 숨결을 전하는 약초교실</h2>
          <p style="font-size: 1.15rem; color: rgba(255,255,255,0.9); font-weight: 400; line-height: 1.7; max-width: 700px; margin: 0 auto; font-family: var(--font-body);">우리 땅에서 자라나는 토종 약초와 정갈한 꽃차의 지혜를 체계적으로 배웁니다. 자연치유를 생활화하고, 가족과 이웃의 건강을 지켜주는 든든한 건강 전도사로 거듭나세요.</p>
        </div>
      </div>

      <!-- Section 1: 대상별 운영 -->
      <div class="section-title-wrap">
        <h2 class="section-title">교육 대상별 과정 운영</h2>
        <p class="section-subtitle">배움의 깊이와 목적에 맞춰 선택할 수 있는 두 가지 맞춤형 교육 트랙</p>
      </div>

      <div class="cards-grid" style="grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 30px; margin-bottom: 5rem;">
        <!-- 취미반 -->
        <div class="herb-card" style="background: var(--card-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: var(--border-radius-md); padding: 35px; transition: var(--transition-smooth); box-shadow: var(--glass-shadow); display: flex; flex-direction: column; gap: 20px; position: relative; overflow: hidden; border-top: 5px solid var(--primary-light);">
          <div style="position: absolute; right: -20px; top: -20px; font-size: 8rem; color: rgba(30,63,32,0.03); font-weight: 900; pointer-events: none;">01</div>
          <div style="width: 60px; height: 60px; background: rgba(30,63,32,0.08); border-radius: 15px; display: flex; align-items: center; justify-content: center; color: var(--primary-color); font-size: 1.8rem;">
            <i class="fa-solid fa-heart"></i>
          </div>
          <div>
            <h3 style="font-family: var(--font-body); font-size: 1.5rem; color: var(--primary-color); font-weight: 700; margin-bottom: 8px;">생활 치유 취미반</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">약초와 꽃차를 취미로 가볍고 재미있게 배우고 싶은 분들을 위한 과정입니다. 일상 속에서 바로 실천할 수 있는 건강한 습관과 다도 라이프스타일을 배웁니다.</p>
          </div>
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem; color: var(--text-main); margin-top: auto;">
            <li style="display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-circle-check" style="color: var(--primary-color);"></i> 약초 및 꽃차 기초 효능 알아보기</li>
            <li style="display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-circle-check" style="color: var(--primary-color);"></i> 일상생활 속 차 우림법 및 음용 가이드</li>
            <li style="display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-circle-check" style="color: var(--primary-color);"></i> 부담 없는 체험 중심의 소통 수업</li>
          </ul>
        </div>

        <!-- 자격증반 -->
        <div class="herb-card" style="background: var(--card-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: var(--border-radius-md); padding: 35px; transition: var(--transition-smooth); box-shadow: var(--glass-shadow); display: flex; flex-direction: column; gap: 20px; position: relative; overflow: hidden; border-top: 5px solid var(--accent-color);">
          <div style="position: absolute; right: -20px; top: -20px; font-size: 8rem; color: rgba(212,175,55,0.05); font-weight: 900; pointer-events: none;">02</div>
          <div style="width: 60px; height: 60px; background: rgba(212,175,55,0.1); border-radius: 15px; display: flex; align-items: center; justify-content: center; color: var(--secondary-color); font-size: 1.8rem;">
            <i class="fa-solid fa-award"></i>
          </div>
          <div>
            <h3 style="font-family: var(--font-body); font-size: 1.5rem; color: var(--secondary-color); font-weight: 700; margin-bottom: 8px;">전문 자격증반 <span style="font-size: 0.75rem; background: var(--accent-color); color: #fff; padding: 2px 8px; border-radius: 10px; vertical-align: middle; margin-left: 5px;">인기</span></h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">약초와 차문화 전문가로서의 역량을 키우는 코스입니다. 초급, 중급, 고급 전 과정을 이수하고 자격시험을 통과하시면 정식 민간 자격증을 취득할 수 있습니다.</p>
          </div>
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem; color: var(--text-main); margin-top: auto;">
            <li style="display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-circle-check" style="color: var(--secondary-color);"></i> 초급 · 중급 · 고급의 체계적 연계 커리큘럼</li>
            <li style="display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-circle-check" style="color: var(--secondary-color);"></i> 민간 공인 자격증 <strong>‘약초꽃차관리사’</strong> 수여</li>
            <li style="display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-circle-check" style="color: var(--secondary-color);"></i> 수료 후 아카데미 강사 및 전문가 활동 연계</li>
          </ul>
        </div>
      </div>

      <!-- Section 2: 교육 과정 상세 -->
      <div class="section-title-wrap">
        <h2 class="section-title">단계별 커리큘럼</h2>
        <p class="section-subtitle">기초부터 동의보감 비법 전수까지, 산빛만의 깊이 있는 교육 내용</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 40px; margin-bottom: 5rem;">
        <!-- Step 1: 초급 -->
        <div style="display: grid; grid-template-columns: 100px 1fr; gap: 30px; background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: var(--border-radius-lg); padding: 30px; box-shadow: var(--glass-shadow); align-items: center; transition: var(--transition-smooth);">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px;">
            <span style="font-size: 2.2rem; font-weight: 800; color: var(--primary-color);">01</span>
            <span style="background: rgba(30,63,32,0.08); color: var(--primary-color); font-size: 0.75rem; font-weight: 700; padding: 2px 10px; border-radius: 10px;">초급 과정</span>
          </div>
          <div style="border-left: 2px dashed rgba(30,63,32,0.15); padding-left: 30px;">
            <h4 style="font-size: 1.3rem; font-weight: 700; color: var(--primary-color); margin-bottom: 10px;">생활 약선차 & 꽃차의 첫걸음 (기초 이론 및 실생활 응용)</h4>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 12px;">
              동양 의학 및 약초 치료의 가장 근간이 되는 기초 원리를 이해하고, 일상 속 건강 증진을 위해 꽃차와 약선차를 실용적으로 활용하는 것을 목표로 합니다.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
              <span style="background: rgba(30,63,32,0.04); border: 1px solid rgba(30,63,32,0.1); color: var(--text-main); font-size: 0.8rem; padding: 4px 12px; border-radius: 20px;"><i class="fa-solid fa-spa" style="color: var(--primary-color); margin-right: 5px;"></i> 기(氣)와 혈(血)의 균형</span>
              <span style="background: rgba(30,63,32,0.04); border: 1px solid rgba(30,63,32,0.1); color: var(--text-main); font-size: 0.8rem; padding: 4px 12px; border-radius: 20px;"><i class="fa-solid fa-brain" style="color: var(--primary-color); margin-right: 5px;"></i> 정신 안정 (안신)</span>
              <span style="background: rgba(30,63,32,0.04); border: 1px solid rgba(30,63,32,0.1); color: var(--text-main); font-size: 0.8rem; padding: 4px 12px; border-radius: 20px;"><i class="fa-solid fa-disease" style="color: var(--primary-color); margin-right: 5px;"></i> 장기별 이로운 약초 (소화 · 관절 · 안/이/비/인후 · 간 · 콩팥)</span>
            </div>
          </div>
        </div>

        <!-- Step 2: 중급 -->
        <div style="display: grid; grid-template-columns: 100px 1fr; gap: 30px; background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: var(--border-radius-lg); padding: 30px; box-shadow: var(--glass-shadow); align-items: center; transition: var(--transition-smooth);">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px;">
            <span style="font-size: 2.2rem; font-weight: 800; color: var(--secondary-color);">02</span>
            <span style="background: rgba(140,98,57,0.08); color: var(--secondary-color); font-size: 0.75rem; font-weight: 700; padding: 2px 10px; border-radius: 10px;">중급 과정</span>
          </div>
          <div style="border-left: 2px dashed rgba(140,98,57,0.15); padding-left: 30px;">
            <h4 style="font-size: 1.3rem; font-weight: 700; color: var(--secondary-color); margin-bottom: 10px;">가족을 위한 건강 보양차 (쌍화탕 & 십전대보탕과 특화 약재 손질법)</h4>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 12px;">
              사랑하는 가족들의 면역과 원기 보충을 위해 한방의 정수를 담은 건강 보양차 조제법을 마스터합니다. 약효를 배가시키는 정성 어린 실습이 중심이 됩니다.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
              <span style="background: rgba(140,98,57,0.04); border: 1px solid rgba(140,98,57,0.15); color: var(--text-main); font-size: 0.8rem; padding: 4px 12px; border-radius: 20px;"><i class="fa-solid fa-mug-hot" style="color: var(--secondary-color); margin-right: 5px;"></i> 쌍화탕 배합 이론 & 조제 실습</span>
              <span style="background: rgba(140,98,57,0.04); border: 1px solid rgba(140,98,57,0.15); color: var(--text-main); font-size: 0.8rem; padding: 4px 12px; border-radius: 20px;"><i class="fa-solid fa-fire" style="color: var(--secondary-color); margin-right: 5px;"></i> 십전대보탕 원리와 약재 배합</span>
              <span style="background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.3); color: var(--text-main); font-size: 0.8rem; padding: 4px 12px; border-radius: 20px; font-weight: 600;"><i class="fa-solid fa-star" style="color: var(--accent-color); margin-right: 5px;"></i> [독자적 특화] 수제 약재 손질 및 법제 기법</span>
            </div>
          </div>
        </div>

        <!-- Step 3: 고급 -->
        <div style="display: grid; grid-template-columns: 100px 1fr; gap: 30px; background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: var(--border-radius-lg); padding: 30px; box-shadow: var(--glass-shadow); align-items: center; transition: var(--transition-smooth);">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px;">
            <span style="font-size: 2.2rem; font-weight: 800; color: var(--accent-color);">03</span>
            <span style="background: rgba(212,175,55,0.1); color: var(--secondary-color); font-size: 0.75rem; font-weight: 700; padding: 2px 10px; border-radius: 10px;">고급 과정</span>
          </div>
          <div style="border-left: 2px dashed rgba(212,175,55,0.25); padding-left: 30px;">
            <h4 style="font-size: 1.3rem; font-weight: 700; color: var(--text-main); margin-bottom: 10px;">동의보감 방제학과 현대 응용 (14대 방제 및 자율 가감 처방)</h4>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 12px;">
              고전 의학의 보고인 동의보감과 한의과대학 필수 과목인 방제학(方劑學)을 이론적 토대로 삼아, 개개인의 체질과 증상에 알맞게 약재를 조절하여 맞춤형 처방을 설계하는 최고급 과정입니다.
            </p>
            <div style="margin-top: 15px;">
              <h5 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 8px; color: var(--primary-color);">주요 학습 14대 방제 및 보약</h5>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; font-size: 0.82rem; margin-bottom: 15px;">
                <div style="background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.05); text-align: center;">보중익기탕 (補중益氣)</div>
                <div style="background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.05); text-align: center;">육미지황탕 (六味地黃)</div>
                <div style="background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.05); text-align: center;">생맥산 (生脈散)</div>
                <div style="background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.05); text-align: center;">귀비탕 (歸脾湯)</div>
                <div style="background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.05); text-align: center;">감맥대조탕 (甘麥大棗)</div>
                <div style="background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.05); text-align: center;">구미강활탕 (九味羌活)</div>
                <div style="background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.05); text-align: center;">황련해독탕 (黃連解毒)</div>
                <div style="background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.05); text-align: center;">오적산 (五積散)</div>
                <div style="background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.05); text-align: center;">당귀사역탕 (當歸四逆)</div>
                <div style="background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.05); text-align: center;">평위산 (平胃散)</div>
                <div style="background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.05); text-align: center;">소시호탕 (小柴胡湯)</div>
                <div style="background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.05); text-align: center;">소건중탕 (小建中湯)</div>
                <div style="background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(212,175,55,0.2); border-left: 3px solid var(--accent-color); font-weight: 700; text-align: center; color: var(--secondary-color);">경옥고 (瓊玉膏)</div>
                <div style="background: #fff; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(212,175,55,0.2); border-left: 3px solid var(--accent-color); font-weight: 700; text-align: center; color: var(--secondary-color);">공진단 (拱辰丹)</div>
              </div>
              <p style="background: rgba(30,63,32,0.03); border-radius: 8px; padding: 12px 15px; font-size: 0.88rem; color: var(--text-main); border-left: 4px solid var(--primary-color);">
                <i class="fa-solid fa-circle-info" style="color: var(--primary-color); margin-right: 6px;"></i> <strong>방제 가감 처방 교육:</strong> 기본 방제에 안주하지 않고, 증상에 따라 약재 종류나 분량을 직접 추가하거나 줄여서 나만의 특별한 건강 레시피를 만드는 실전 활용법이 병행됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(view);
  }
};

function renderAcademy(container) {
  Academy.render(container);
}

// --- BAREFOOT WALKING PAGE ---
const Barefoot = {
  render(container) {
    const view = document.createElement('div');
    view.className = 'page-view';

    view.innerHTML = `
      <div class="hero-section" style="margin-bottom: 3.5rem; background: linear-gradient(135deg, rgba(30,63,32,0.85), rgba(45,94,48,0.75)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80') no-repeat center center; background-size: cover; border-radius: var(--border-radius-lg); padding: 4.5rem 2rem; color: #fff; text-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; text-align: center; box-shadow: var(--glass-shadow);">
        <div style="max-width: 800px; backdrop-filter: blur(8px); background: rgba(0,0,0,0.2); padding: 2.5rem; border-radius: var(--border-radius-md); border: 1px solid rgba(255,255,255,0.15);">
          <h2 style="font-family: var(--font-title); font-size: 2.6rem; margin-bottom: 12px; font-weight: 700; color: #fff;"><i class="fa-solid fa-shoe-prints"></i> 대지와 통하는 치유, 맨발걷기</h2>
          <p style="font-size: 1.2rem; color: rgba(255,255,255,0.95); font-weight: 400; line-height: 1.6; font-family: var(--font-body);">인공의 신발을 벗고 땅을 딛는 순간, 대지의 무한한 음이온 에너지와 치유력이 체내로 직접 스며듭니다.</p>
        </div>
      </div>

      <div class="section-title-wrap">
        <h2 class="section-title">맨발걷기(어싱, Earthing)의 3대 치유 효능</h2>
        <p class="section-subtitle">자연과 직접 맞닿아 신체의 균형을 되찾는 천연 면역 치유법</p>
      </div>

      <div class="cards-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); margin-bottom: 4rem;">
        <!-- Card 1 -->
        <div class="herb-card" style="background: var(--card-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: var(--border-radius-md); padding: 30px; transition: var(--transition-smooth); box-shadow: var(--glass-shadow); display: flex; flex-direction: column; gap: 15px; text-align: center; align-items: center;">
          <div style="width: 70px; height: 70px; background: rgba(30,63,32,0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary-color); font-size: 2rem; margin-bottom: 5px;">
            <i class="fa-solid fa-leaf"></i>
          </div>
          <h3 style="font-family: var(--font-title); font-size: 1.4rem; color: var(--primary-color); font-weight: 700;">항염증 및 어싱(Earthing) 효과</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; text-align: justify; text-justify: inter-word;">지구 표면의 자유전자가 체내로 흡수되어 만성 질환과 노화의 원인이 되는 유해 활성산소를 중화시키고 체내 염증 수치를 혁신적으로 낮춰줍니다.</p>
        </div>

        <!-- Card 2 -->
        <div class="herb-card" style="background: var(--card-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: var(--border-radius-md); padding: 30px; transition: var(--transition-smooth); box-shadow: var(--glass-shadow); display: flex; flex-direction: column; gap: 15px; text-align: center; align-items: center;">
          <div style="width: 70px; height: 70px; background: rgba(140,98,57,0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--secondary-color); font-size: 2rem; margin-bottom: 5px;">
            <i class="fa-solid fa-heart-pulse"></i>
          </div>
          <h3 style="font-family: var(--font-title); font-size: 1.4rem; color: var(--secondary-color); font-weight: 700;">천연 전신 지압 효과</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; text-align: justify; text-justify: inter-word;">맨발로 걸으며 흙과 돌, 모래의 불규칙한 돌기들이 발바닥의 60여 개 반사구와 자율신경을 자극하여 혈액 순환을 개선하고 신진대사를 왕성하게 만듭니다.</p>
        </div>

        <!-- Card 3 -->
        <div class="herb-card" style="background: var(--card-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: var(--border-radius-md); padding: 30px; transition: var(--transition-smooth); box-shadow: var(--glass-shadow); display: flex; flex-direction: column; gap: 15px; text-align: center; align-items: center;">
          <div style="width: 70px; height: 70px; background: rgba(212,175,55,0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--accent-color); font-size: 2rem; margin-bottom: 5px;">
            <i class="fa-solid fa-moon"></i>
          </div>
          <h3 style="font-family: var(--font-title); font-size: 1.4rem; color: var(--text-main); font-weight: 700;">신경 안정 및 불면증 극복</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; text-align: justify; text-justify: inter-word;">지구와의 접촉이 수면 및 스트레스 조절 호르몬인 코르티솔 분비를 정상화하여 스트레스 수치를 완화하고 깊은 수면(숙면)을 유도합니다.</p>
        </div>
      </div>

      <!-- Roadmap -->
      <div style="margin-bottom: 4rem; background: #fff; padding: 40px; border-radius: var(--border-radius-lg); box-shadow: var(--glass-shadow); border: 1px solid var(--glass-border);">
        <h3 style="font-family: var(--font-title); font-size: 1.7rem; color: var(--primary-color); margin-bottom: 30px; text-align: center; font-weight:700;"><i class="fa-solid fa-route"></i> 안전하고 올바른 맨발걷기 3단계</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 30px;">
          <!-- Step 1 -->
          <div style="position: relative; padding-top: 20px;">
            <div style="position: absolute; top: -15px; left: 0; background: var(--primary-color); color:#fff; width:35px; height:35px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.1rem; box-shadow:0 3px 6px rgba(0,0,0,0.16);">1</div>
            <h4 style="font-family: var(--font-title); font-size: 1.15rem; color: var(--primary-color); margin-bottom: 10px; font-weight:700; border-bottom:1px solid rgba(0,0,0,0.06); padding-bottom:5px;">안전한 흙길 탐색</h4>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">돌멩이나 깨진 유리가 없는 정돈된 황토 전용길, 부드러운 잔디, 숲길 혹은 바닷가 모래사장 등에서 시작하는 것이 가장 안전합니다.</p>
          </div>
          <!-- Step 2 -->
          <div style="position: relative; padding-top: 20px;">
            <div style="position: absolute; top: -15px; left: 0; background: var(--secondary-color); color:#fff; width:35px; height:35px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.1rem; box-shadow:0 3px 6px rgba(0,0,0,0.16);">2</div>
            <h4 style="font-family: var(--font-title); font-size: 1.15rem; color: var(--secondary-color); margin-bottom: 10px; font-weight:700; border-bottom:1px solid rgba(0,0,0,0.06); padding-bottom:5px;">바른 보행 자세</h4>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">시선은 전방 3~4미터를 응시해 장애물을 감지하고, 발뒤꿈치부터 지면에 닿은 뒤 발바닥 전체, 발가락 순서로 힘이 흐르도록 걷습니다.</p>
          </div>
          <!-- Step 3 -->
          <div style="position: relative; padding-top: 20px;">
            <div style="position: absolute; top: -15px; left: 0; background: var(--accent-color); color:#fff; width:35px; height:35px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.1rem; box-shadow:0 3px 6px rgba(0,0,0,0.16);">3</div>
            <h4 style="font-family: var(--font-title); font-size: 1.15rem; color: var(--text-main); margin-bottom: 10px; font-weight:700; border-bottom:1px solid rgba(0,0,0,0.06); padding-bottom:5px;">철저한 마무리 세척</h4>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">보행을 마친 직후에는 찬물이나 미온수로 발을 깨끗이 씻어내고 꼼꼼하게 건조한 뒤, 보습제를 발라 피부 건조 현상을 예방합니다.</p>
          </div>
        </div>
      </div>

      <!-- Indoor Earthing Section -->
      <div style="margin-bottom: 4rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 40px; align-items: center; background: #fff; padding: 40px; border-radius: var(--border-radius-lg); box-shadow: var(--glass-shadow); border: 1px solid var(--glass-border);">
        <div style="border-radius: var(--border-radius-md); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <img src="images/indoor_earthing.jpg" alt="실내 황토볼 어싱 체험" style="width: 100%; height: auto; display: block; object-fit: cover;">
        </div>
        <div>
          <span style="font-size: 0.85rem; background: var(--primary-color); color: #fff; padding: 4px 10px; border-radius: 20px; font-weight:700; font-family: var(--font-body);">실내 어싱 테라피</span>
          <h3 style="font-family: var(--font-title); font-size: 1.8rem; color: var(--primary-color); margin: 10px 0 15px 0; font-weight:700;">사계절 홈 어싱: 황토볼 지압 프로그램</h3>
          <p style="font-size: 0.95rem; color: var(--text-main); line-height: 1.7; margin-bottom: 15px; text-align: justify; text-justify: inter-word;">
            기온 변화가 심한 계절이나 외부 활동이 어려운 날에도 실내에서 쾌적하게 자연 치유를 이어갈 수 있는 **산빛 실내 황토볼 어싱 지압 체험**입니다. 
            원적외선이 풍부한 천연 생황토를 동글동글하게 빚어 건조한 황토볼 베드에 발을 담그고 딛음으로써, 발바닥 전체의 경혈을 고르게 지압하고 전신의 혈액 순환과 기초 체온을 따뜻하게 유지해 줍니다.
          </p>
          <ul style="list-style: none; padding: 0; font-size: 0.9rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 8px;">
            <li><i class="fa-solid fa-circle-check" style="color: var(--primary-color); margin-right: 8px;"></i> **100% 순수 천연 황토**로 빚어낸 무독성 황토볼 사용</li>
            <li><i class="fa-solid fa-circle-check" style="color: var(--primary-color); margin-right: 8px;"></i> 날씨와 공간 제약 없는 **안전하고 청결한 실내 어싱**</li>
            <li><i class="fa-solid fa-circle-check" style="color: var(--primary-color); margin-right: 8px;"></i> 연구원 명상 지도사의 가이드를 통한 **심신 이완 요법 병행**</li>
          </ul>
        </div>
      </div>

      <!-- Warning Box -->
      <div style="background: rgba(231,76,60,0.04); border-left: 5px solid #e74c3c; border-radius: var(--border-radius-md); padding: 25px; display: flex; gap: 20px; align-items: flex-start; box-shadow: 0 4px 15px rgba(231,76,60,0.05); margin-bottom: 2rem;">
        <div style="color: #e74c3c; font-size: 2rem;"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <div>
          <h4 style="color: #e74c3c; font-weight: 700; font-size: 1.1rem; margin-bottom: 6px;">맨발걷기 필수 안전 수칙</h4>
          <p style="font-size: 0.92rem; color: var(--text-main); line-height: 1.7;">
            발바닥에 크고 작은 상처가 있을 때는 세균 감염(파상풍 등) 우려가 크므로 맨발 걷기를 삼가십시오. 
            특히 <strong>당뇨 환자</strong>의 경우 신경 손상 및 미세 상처로 인한 당뇨병성 족부궤양 위험이 있으므로 맨발 노출을 최소화하고, 어싱 슈즈나 가죽 접지 신발을 활용하시는 것을 강력히 권장합니다.
          </p>
        </div>
      </div>
    `;

    container.appendChild(view);
  }
};

function renderBarefoot(container) {
  Barefoot.render(container);
}

// --- WALKING MEDITATION PAGE ---
const Meditation = {
  render(container) {
    const view = document.createElement('div');
    view.className = 'page-view';

    view.innerHTML = `
      <div class="hero-section" style="margin-bottom: 3.5rem; background: linear-gradient(135deg, rgba(140,98,57,0.85), rgba(30,63,32,0.75)), url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80') no-repeat center center; background-size: cover; border-radius: var(--border-radius-lg); padding: 4.5rem 2rem; color: #fff; text-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; text-align: center; box-shadow: var(--glass-shadow);">
        <div style="max-width: 800px; backdrop-filter: blur(8px); background: rgba(0,0,0,0.25); padding: 2.5rem; border-radius: var(--border-radius-md); border: 1px solid rgba(255,255,255,0.15);">
          <h2 style="font-family: var(--font-title); font-size: 2.6rem; margin-bottom: 12px; font-weight: 700; color: #fff;"><i class="fa-solid fa-spa"></i> 걸음속에 깃드는 평온, 걷기명상</h2>
          <p style="font-size: 1.2rem; color: rgba(255,255,255,0.95); font-weight: 400; line-height: 1.6; font-family: var(--font-body);">달려가기만 하는 바쁜 일상에서 한 걸음 물러나, 내 발걸음의 감각에 마음을 모으는 움직이는 선(禪) 명상입니다.</p>
        </div>
      </div>

      <div class="section-title-wrap">
        <h2 class="section-title">걷기명상(행선, 行禪)의 4단계 알아차림</h2>
        <p class="section-subtitle">한 발걸음마다 일어나는 감각의 일어남과 사라짐에 집중하기</p>
      </div>

      <div class="cards-grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); margin-bottom: 4rem;">
        <!-- Step 1 -->
        <div class="herb-card" style="background: var(--card-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: var(--border-radius-md); padding: 25px; transition: var(--transition-smooth); box-shadow: var(--glass-shadow); display: flex; flex-direction: column; gap: 12px;">
          <span style="font-size: 0.8rem; background: var(--primary-color); color: #fff; padding: 3px 8px; border-radius: 10px; width: fit-content; font-weight:700;">1단계</span>
          <h3 style="font-family: var(--font-title); font-size: 1.25rem; color: var(--primary-color); font-weight: 700;"><i class="fa-solid fa-circle-dot"></i> 지면 알아차리기</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">어깨를 내리고 바른 자세로 서서 발바닥 전체가 지구와 맞닿아 체중을 고루 지탱하고 있음을 마음 깊이 인지하며 명상을 시작합니다.</p>
        </div>

        <!-- Step 2 -->
        <div class="herb-card" style="background: var(--card-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: var(--border-radius-md); padding: 25px; transition: var(--transition-smooth); box-shadow: var(--glass-shadow); display: flex; flex-direction: column; gap: 12px;">
          <span style="font-size: 0.8rem; background: var(--secondary-color); color: #fff; padding: 3px 8px; border-radius: 10px; width: fit-content; font-weight:700;">2단계</span>
          <h3 style="font-family: var(--font-title); font-size: 1.25rem; color: var(--secondary-color); font-weight: 700;"><i class="fa-solid fa-arrow-trend-up"></i> 발 들어 올리기</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">뒤꿈치가 먼저 떠오르고 이어서 발바닥 전체, 마지막으로 엄지발가락 끝이 땅에서 가벼워지고 완전히 분리되는 역학적 감각을 조용히 관찰합니다.</p>
        </div>

        <!-- Step 3 -->
        <div class="herb-card" style="background: var(--card-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: var(--border-radius-md); padding: 25px; transition: var(--transition-smooth); box-shadow: var(--glass-shadow); display: flex; flex-direction: column; gap: 12px;">
          <span style="font-size: 0.8rem; background: var(--accent-color); color: #fff; padding: 3px 8px; border-radius: 10px; width: fit-content; font-weight:700; color:var(--text-main);">3단계</span>
          <h3 style="font-family: var(--font-title); font-size: 1.25rem; color: var(--text-main); font-weight: 700;"><i class="fa-solid fa-arrow-right-to-bracket"></i> 앞으로 내딛기</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">들어 올려진 다리가 허공을 가르며 전방으로 천천히 움직일 때, 공기의 감촉, 다리 근육의 팽창과 수축, 균형의 섬세한 이동을 자각합니다.</p>
        </div>

        <!-- Step 4 -->
        <div class="herb-card" style="background: var(--card-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); border-radius: var(--border-radius-md); padding: 25px; transition: var(--transition-smooth); box-shadow: var(--glass-shadow); display: flex; flex-direction: column; gap: 12px;">
          <span style="font-size: 0.8rem; background: #2c3e2b; color: #fff; padding: 3px 8px; border-radius: 10px; width: fit-content; font-weight:700;">4단계</span>
          <h3 style="font-family: var(--font-title); font-size: 1.25rem; color: #2c3e2b; font-weight: 700;"><i class="fa-solid fa-anchor"></i> 다시 딛기</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">뒤꿈치가 먼저 부드럽게 지면에 닿은 후 발바닥, 발가락 순서로 무거운 체중이 안전하게 다시 땅에 옮겨 가 닿는 압력의 변화에 몰입합니다.</p>
        </div>
      </div>

      <!-- Section 3: 양반걷기명상 -->
      <div class="section-title-wrap" style="margin-top: 5rem;">
        <h2 class="section-title">산빛 특화: 양반걷기명상</h2>
        <p class="section-subtitle">틱낫한 스님의 평온과 한국 전통 '양반걸음'의 여유가 융합된 본원 독자 개발 명상법</p>
      </div>

      <div style="background: linear-gradient(135deg, rgba(30,63,32,0.03), rgba(140,98,57,0.05)); border-radius: var(--border-radius-lg); padding: 40px; border: 1px solid var(--glass-border); box-shadow: var(--glass-shadow); margin-bottom: 4rem; display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px; align-items: center;">
        <div>
          <span style="background: var(--accent-color); color: #1E3F20; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; margin-bottom: 15px; display: inline-block;">세계 최초 · 본 연구원 독자 명명</span>
          <h3 style="font-family: var(--font-title); font-size: 1.8rem; color: var(--primary-color); margin-bottom: 15px; font-weight: 700; line-height:1.3;">"만약 틱낫한 스님이<br>한국인이었다면 어떻게 걸으셨을까?"</h3>
          <p style="color: var(--text-main); font-size: 0.95rem; line-height: 1.7; text-align: justify; margin-bottom: 15px;">
            양반걷기명상은 본 연구원에서 한국인의 정서와 신체 리듬에 맞추어 독자적으로 연구·개발한 명상법입니다. 
            오래전 우리 선조들이 걷던 아주 여유롭고 천천히 걷는 <strong>'양반걸음'</strong>에 세계적인 걷기명상 대가 틱낫한 스님의 호흡법을 결합하여, 바쁜 현대인들에게 가장 친근하고 깊은 몰입감을 선사합니다.
          </p>
        </div>
        <div style="background: #fff; padding: 30px; border-radius: var(--border-radius-md); border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
          <h4 style="font-family: var(--font-body); font-size: 1.15rem; color: var(--secondary-color); font-weight: 700; margin-bottom: 20px; border-bottom: 2px solid rgba(140,98,57,0.15); padding-bottom: 8px;">
            <i class="fa-solid fa-wind"></i> 양반걷기명상 핵심 실천법
          </h4>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <!-- Step 1 -->
            <div style="display: flex; gap: 15px; align-items: flex-start;">
              <div style="width: 35px; height: 35px; background: rgba(30,63,32,0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary-color); font-weight: 700; font-size: 0.9rem; flex-shrink: 0;">1</div>
              <div>
                <strong style="color: var(--text-main); font-size: 0.95rem;">발걸음과 호흡의 완벽한 일치</strong>
                <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px; line-height: 1.5;">숨을 들이쉬고 내쉬는 리듬에 맞춰 한 걸음 한 걸음 여유롭게 내딛습니다.</p>
              </div>
            </div>
            <!-- Step 2 -->
            <div style="display: flex; gap: 15px; align-items: flex-start;">
              <div style="width: 35px; height: 35px; background: rgba(30,63,32,0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary-color); font-weight: 700; font-size: 0.9rem; flex-shrink: 0;">2</div>
              <div>
                <strong style="color: var(--text-main); font-size: 0.95rem;">숨을 들이쉬며 (In)</strong>
                <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px; line-height: 1.5;">
                  <strong>초보자:</strong> 두 걸음 천천히 걷기<br>
                  <strong>숙련자:</strong> 세 걸음 천천히 걷기
                </p>
              </div>
            </div>
            <!-- Step 3 -->
            <div style="display: flex; gap: 15px; align-items: flex-start;">
              <div style="width: 35px; height: 35px; background: rgba(30,63,32,0.08); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary-color); font-weight: 700; font-size: 0.9rem; flex-shrink: 0;">3</div>
              <div>
                <strong style="color: var(--text-main); font-size: 0.95rem;">숨을 내쉬며 (Out)</strong>
                <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px; line-height: 1.5;">
                  <strong>초보자:</strong> 세 걸음 천천히 걷기<br>
                  <strong>숙련자:</strong> 네 걸음 천천히 걷기
                </p>
              </div>
            </div>
          </div>
          <div style="margin-top: 25px; padding: 12px 15px; background: rgba(140,98,57,0.05); border-radius: 8px; border-left: 3px solid var(--secondary-color); font-size: 0.85rem; color: var(--text-main);">
            <i class="fa-solid fa-quote-left" style="color: var(--secondary-color); margin-right: 5px;"></i>
            한국 전통의 뒷짐 지거나 편안히 손을 모으고 아주 천천히 걷는 <strong>'양반걸음'</strong>의 템포는 틱낫한 스님의 호흡 주기와 최상의 일치를 보입니다.
          </div>
        </div>
      </div>

      <!-- Practice Tips & Insights -->
      <div style="background: #fff; border-radius: var(--border-radius-lg); padding: 35px; border: 1px solid var(--glass-border); box-shadow: var(--glass-shadow); margin-bottom: 2rem;">
        <h3 style="font-family: var(--font-title); font-size: 1.6rem; color: var(--primary-color); margin-bottom: 20px; font-weight:700;"><i class="fa-solid fa-heart"></i> 일상 걷기명상을 위한 유용한 조언</h3>
        <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
          <div style="border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom:12px;">
            <strong style="color: var(--primary-color); font-size: 1.05rem;"><i class="fa-solid fa-check"></i> 속도를 늦추십시오</strong>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px; line-height:1.6;">너무 빠르게 걸으면 발끝의 자잘한 자극을 놓치기 쉽습니다. 호흡 1주기(들숨과 날숨)에 1~2보폭 정도로 아주 천천히 걸어가 봅니다.</p>
          </div>
          <div style="border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom:12px;">
            <strong style="color: var(--secondary-color); font-size: 1.05rem;"><i class="fa-solid fa-check"></i> 잡념을 다정하게 보내주십시오</strong>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px; line-height:1.6;">마음에 잡념이나 걱정거리가 떠오를 때 억지로 억누르지 마십시오. '생각이 일어났구나'하고 부드러운 마음으로 명명한 뒤 자연스럽게 보내주고, 곧바로 발바닥과 호흡의 감각으로 되돌아옵니다.</p>
          </div>
          <div>
            <strong style="color: var(--text-main); font-size: 1.05rem;"><i class="fa-solid fa-check"></i> 실내와 일상 생활에서도 가능합니다</strong>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 4px; line-height:1.6;">넓은 자연이 없더라도 집안 복도나 사무실 계단, 출퇴근 시 보도를 걷는 잠깐의 시간에도 발바닥에 모든 주의집중을 온전히 다 쏟아붓는 것만으로 훌륭한 걷기명상이 성립됩니다.</p>
          </div>
        </div>
      </div>
    `;

    container.appendChild(view);
  }
};

function renderBarefoot(container) {
  Barefoot.render(container);
}

function renderMeditation(container) {
  Meditation.render(container);
}

// --- MEMBERSHIP PRICING PAGE ---
const Pricing = {
  render(container) {
    const view = document.createElement('div');
    view.className = 'page-view';

    const p = state.settings.pricingPlans || {};
    const currentPlan = state.currentUser ? state.currentUser.plan : 'Basic';

    view.innerHTML = `
      <div class="section-title-wrap">
        <h2 class="section-title">자연치유 멤버십 요금제</h2>
        <p class="section-subtitle">구독 등급에 맞추어 전문적이고 심도 있는 약초 치유 가이드라인과 혜택을 제공합니다.</p>
      </div>

      <div class="pricing-grid">
        <!-- Basic Plan -->
        <div class="pricing-card ${currentPlan === 'Basic' ? 'premium-pick' : ''}">
          <h3 class="plan-name">Basic</h3>
          <div class="plan-price">${p.Basic?.price || '무료'}</div>
          <div class="plan-period">${p.Basic?.period || '평생'}</div>
          <p class="plan-desc">${p.Basic?.desc || '기본 서비스'}</p>
          <ul class="plan-features">
            <li><i class="fa-solid fa-check"></i> 약초 백과 일반 정보 열람</li>
            <li><i class="fa-solid fa-check"></i> 커뮤니티 체험기 공유/쓰기</li>
            <li><i class="fa-solid fa-check"></i> 미디어 갤러리 영상 시청</li>
            <li style="color:#aaa;"><i class="fa-solid fa-xmark"></i> 프리미엄 전용 약초 칼럼 제한</li>
            <li style="color:#aaa;"><i class="fa-solid fa-xmark"></i> 수제 힐링차 상품 구매 상시 할인 제외</li>
          </ul>
          <button class="btn-pricing-action" onclick="Pricing.subscribe('Basic')">
            ${currentPlan === 'Basic' ? '이용 중' : '선택하기'}
          </button>
        </div>

        <!-- Silver Plan -->
        <div class="pricing-card ${currentPlan === 'Silver' ? 'premium-pick' : ''}">
          <h3 class="plan-name">Silver</h3>
          <div class="plan-price">${p.Silver?.price || '월 9,900원'}</div>
          <div class="plan-period">${p.Silver?.period || '월간'}</div>
          <p class="plan-desc">${p.Silver?.desc || '합리적인 프리미엄 서비스'}</p>
          <ul class="plan-features">
            <li><i class="fa-solid fa-check"></i> 약초 백과 고급 한방 약리 분석</li>
            <li><i class="fa-solid fa-check"></i> 프리미엄 약선차 레시피 제공</li>
            <li><i class="fa-solid fa-check"></i> 신제품 힐링차 5% 상시 할인 쿠폰</li>
            <li><i class="fa-solid fa-check"></i> 커뮤니티 정회원 자격 부여</li>
            <li style="color:#aaa;"><i class="fa-solid fa-xmark"></i> 1:1 맞춤 자연치유 건강 상담 제외</li>
          </ul>
          <button class="btn-pricing-action" onclick="Pricing.subscribe('Silver')">
            ${currentPlan === 'Silver' ? '이용 중' : '구독 신청'}
          </button>
        </div>

        <!-- Gold Plan -->
        <div class="pricing-card ${currentPlan === 'Gold' ? 'premium-pick' : ''}">
          <h3 class="plan-name">Gold</h3>
          <div class="plan-price">${p.Gold?.price || '월 19,900원'}</div>
          <div class="plan-period">${p.Gold?.period || '월간'}</div>
          <p class="plan-desc">${p.Gold?.desc || '최고의 특화 힐링 케어'}</p>
          <ul class="plan-features">
            <li><i class="fa-solid fa-check"></i> 프리미엄 및 일반 약초 백과 무제한</li>
            <li><i class="fa-solid fa-check"></i> 수제 힐링차 10% 상시 할인 쿠폰</li>
            <li><i class="fa-solid fa-check"></i> <strong>1:1 전문 한의다도 전문가 자문</strong></li>
            <li><i class="fa-solid fa-check"></i> 커뮤니티 VIP 등급 및 글 상단 노출</li>
            <li><i class="fa-solid fa-check"></i> 자연치유 오프라인 오감 다도 강좌 초대</li>
          </ul>
          <button class="btn-pricing-action" onclick="Pricing.subscribe('Gold')">
            ${currentPlan === 'Gold' ? '이용 중' : '구독 신청'}
          </button>
        </div>
      </div>
    `;

    container.appendChild(view);
  },

  subscribe(plan) {
    if (!state.currentUser) {
      alert('멤버십을 구독하시려면 구글 계정 로그인이 필요합니다.');
      UI.openModal('google-login-modal');
      return;
    }

    const currentPlan = state.currentUser.plan;
    if (currentPlan === plan) {
      alert('이미 이용 중이신 요금제입니다.');
      return;
    }

    if (confirm(`'${plan}' 요금제(구독)로 변경을 신청하시겠습니까?`)) {
      // 1. 세션 상태 업데이트
      state.currentUser.plan = plan;
      localStorage.setItem('herb_healing_session', JSON.stringify(state.currentUser));

      // 2. 가상 회원 DB의 요금제 정보 업데이트
      const userIdx = state.users.findIndex(u => u.email === state.currentUser.email);
      if (userIdx > -1) {
        state.users[userIdx].plan = plan;
        Db.saveUsers(state.users);
      }

      alert(`구독이 완료되었습니다. 이제 '${plan}' 등급 혜택이 적용됩니다.`);
      Auth.renderAuthUI();
      router();
    }
  }
};

function renderPricing(container) {
  Pricing.render(container);
}

// --- ADMIN PANEL PAGE ---
const Admin = {
  render(container) {
    const view = document.createElement('div');
    view.className = 'page-view';

    // 템플릿 구조
    view.innerHTML = `
      <div class="section-title-wrap" style="text-align: left; margin-bottom: 2rem;">
        <h2 class="section-title"><i class="fa-solid fa-gears"></i> 관리자 대시보드 & 패널</h2>
        <p class="section-subtitle">회원 데이터, 사이트 기본 텍스트, 그림/영상 관리 및 구매대행 내역 관리</p>
      </div>

      <div class="admin-layout">
        <!-- Sidebar Navigation -->
        <aside class="admin-sidebar">
          <button class="admin-menu-btn ${state.activeAdminTab === 'users' ? 'active' : ''}" onclick="Admin.switchTab('users')">
            <i class="fa-solid fa-users-gear"></i> 회원아이디 관리
          </button>
          <button class="admin-menu-btn ${state.activeAdminTab === 'website' ? 'active' : ''}" onclick="Admin.switchTab('website')">
            <i class="fa-solid fa-file-pen"></i> 홈페이지 수정
          </button>
          <button class="admin-menu-btn ${state.activeAdminTab === 'media' ? 'active' : ''}" onclick="Admin.switchTab('media')">
            <i class="fa-solid fa-photo-film"></i> 그림 & 영상 관리
          </button>
          <button class="admin-menu-btn ${state.activeAdminTab === 'plans' ? 'active' : ''}" onclick="Admin.switchTab('plans')">
            <i class="fa-solid fa-credit-card"></i> 회원요금제 관리
          </button>
          <button class="admin-menu-btn ${state.activeAdminTab === 'orders' ? 'active' : ''}" onclick="Admin.switchTab('orders')">
            <i class="fa-solid fa-truck-moving"></i> 구매대행 조회 (${state.inquiries.filter(i => i.status === '접수대기').length}건 신규)
          </button>
        </aside>

        <!-- Dynamic Admin Section Content -->
        <section class="admin-content" id="admin-subcontent-container">
          <!-- Dynamically loaded admin components -->
        </section>
      </div>
    `;

    container.appendChild(view);
    this.renderSubTabContent();
  },

  switchTab(tabName) {
    state.activeAdminTab = tabName;
    // 탭 액티브 상태 교체
    const btns = document.querySelectorAll('.admin-menu-btn');
    btns.forEach(btn => {
      btn.classList.remove('active');
    });
    // 현재 누른 탭에 active 부여는 돔 갱신되면서 자연스레 됨.
    router();
  },

  renderSubTabContent() {
    const subContainer = document.getElementById('admin-subcontent-container');
    if (!subContainer) return;

    subContainer.innerHTML = '';

    switch (state.activeAdminTab) {
      case 'users':
        this.renderUserManagement(subContainer);
        break;
      case 'website':
        this.renderWebsiteEdit(subContainer);
        break;
      case 'media':
        this.renderMediaManagement(subContainer);
        break;
      case 'plans':
        this.renderPlanManagement(subContainer);
        break;
      case 'orders':
        this.renderOrdersManagement(subContainer);
        break;
    }
  },

  // 1) 회원관리 탭
  renderUserManagement(container) {
    let rowsHtml = '';
    state.users.forEach(user => {
      const isSelf = user.email === state.currentUser.email;
      rowsHtml += `
        <tr>
          <td><strong>${user.name}</strong></td>
          <td>${user.email}</td>
          <td>
            <select style="padding: 4px; border-radius: 4px;" onchange="Admin.changeUserPlan('${user.id}', this.value)" ${isSelf ? 'disabled' : ''}>
              <option value="Basic" ${user.plan === 'Basic' ? 'selected' : ''}>Basic</option>
              <option value="Silver" ${user.plan === 'Silver' ? 'selected' : ''}>Silver</option>
              <option value="Gold" ${user.plan === 'Gold' ? 'selected' : ''}>Gold</option>
              <option value="Premium" ${user.plan === 'Premium' ? 'selected' : ''}>Premium (Admin)</option>
            </select>
          </td>
          <td>
            <span class="status-badge ${user.status.toLowerCase()}">${user.status === 'Active' ? '활성' : '정지'}</span>
          </td>
          <td>${user.joinedDate}</td>
          <td>
            ${!isSelf ? `
              <button class="btn-secondary" style="padding: 4px 8px; font-size: 0.75rem; border-color: ${user.status === 'Active' ? '#e74c3c' : '#2ecc71'}; color: ${user.status === 'Active' ? '#e74c3c' : '#2ecc71'};" onclick="Admin.toggleUserStatus('${user.id}')">
                ${user.status === 'Active' ? '정지하기' : '활성화'}
              </button>
              <button class="btn-secondary" style="padding: 4px 8px; font-size: 0.75rem; color: #fff; background: #e74c3c; border:none;" onclick="Admin.deleteUser('${user.id}')">
                탈퇴
              </button>
            ` : '<span>관리자 본인</span>'}
          </td>
        </tr>
      `;
    });

    container.innerHTML = `
      <h3 class="admin-sec-title">회원아이디 및 요금제 관리</h3>
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>구글 이메일</th>
              <th>멤버십 요금제</th>
              <th>계정 상태</th>
              <th>가입일</th>
              <th>관리 조치</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  },

  changeUserPlan(userId, newPlan) {
    const userIndex = state.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      state.users[userIndex].plan = newPlan;
      Db.saveUsers(state.users);
      alert(`해당 회원의 멤버십 등급이 '${newPlan}'(으)로 강제 조정되었습니다.`);
    }
  },

  toggleUserStatus(userId) {
    const userIndex = state.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      const nextStatus = state.users[userIndex].status === 'Active' ? 'Suspended' : 'Active';
      state.users[userIndex].status = nextStatus;
      Db.saveUsers(state.users);
      alert(`계정이 ${nextStatus === 'Active' ? '활성화' : '정지'} 처리되었습니다.`);
      this.renderSubTabContent();
    }
  },

  deleteUser(userId) {
    if (!confirm('정말로 이 회원을 강제 탈퇴 처리하시겠습니까?')) return;
    const userIndex = state.users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      state.users.splice(userIndex, 1);
      Db.saveUsers(state.users);
      alert('회원이 탈퇴 처리되었습니다.');
      this.renderSubTabContent();
    }
  },

  // 2) 홈페이지 수정 탭
  renderWebsiteEdit(container) {
    container.innerHTML = `
      <h3 class="admin-sec-title">홈페이지 브랜드 텍스트 편집</h3>
      <form id="admin-website-form" onsubmit="event.preventDefault();">
        <div class="form-group">
          <label for="input-main-title">메인 홈 대형 타이틀</label>
          <input type="text" id="input-main-title" value="${state.settings.mainTitle}" required>
        </div>
        <div class="form-group">
          <label for="input-sub-title">메인 홈 서브 타이틀</label>
          <input type="text" id="input-sub-title" value="${state.settings.subTitle}" required>
        </div>
        <div class="form-group">
          <label for="input-intro-content">브랜드 인트로 소개글</label>
          <textarea id="input-intro-content" rows="6" required>${state.settings.introContent}</textarea>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div class="form-group">
            <label for="input-contact-email">고객지원 이메일</label>
            <input type="email" id="input-contact-email" value="${state.settings.contactEmail}">
          </div>
          <div class="form-group">
            <label for="input-contact-phone">고객지원 전화번호</label>
            <input type="text" id="input-contact-phone" value="${state.settings.contactPhone}">
          </div>
        </div>
        <button class="btn-primary" style="margin-top: 10px;" onclick="Admin.saveWebsiteSettings()"><i class="fa-solid fa-floppy-disk"></i> 변경 사항 적용</button>
      </form>
    `;
  },

  saveWebsiteSettings() {
    state.settings.mainTitle = document.getElementById('input-main-title').value;
    state.settings.subTitle = document.getElementById('input-sub-title').value;
    state.settings.introContent = document.getElementById('input-intro-content').value;
    state.settings.contactEmail = document.getElementById('input-contact-email').value;
    state.settings.contactPhone = document.getElementById('input-contact-phone').value;

    Db.saveSettings(state.settings);
    updateBrandText();
    alert('홈페이지 기본 정보 및 텍스트 수정이 완벽하게 저장되고 사이트에 즉시 반영되었습니다.');
  },

  // 3) 미디어 관리 탭 (그림 및 영상 추가/삭제)
  renderMediaManagement(container) {
    let listHtml = '';
    state.media.forEach(item => {
      listHtml += `
        <div style="display:flex; align-items:center; gap: 15px; background: rgba(0,0,0,0.02); padding: 12px; border-radius: var(--border-radius-sm); border: 1px solid rgba(0,0,0,0.05); margin-bottom: 12px;">
          <div style="width: 80px; height: 60px; background:#000; border-radius: 4px; overflow:hidden;">
            ${item.type === 'video' 
              ? `<iframe src="${item.url}" style="width:100%; height:100%; border:none;"></iframe>` 
              : `<img src="${item.url}" style="width:100%; height:100%; object-fit:cover;">`
            }
          </div>
          <div style="flex:1;">
            <strong style="color:var(--primary-color);">${item.title}</strong>
            <span style="font-size:0.75rem; background:#eee; padding:2px 6px; border-radius:10px; margin-left:8px; font-weight:700;">
              ${item.type === 'video' ? '영상' : '그림'}
            </span>
            <p style="font-size:0.8rem; color:var(--text-muted); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; margin-top:2px;">${item.description}</p>
          </div>
          <button class="btn-secondary" style="color: #e74c3c; border-color: #e74c3c; padding: 6px 12px; font-size: 0.8rem;" onclick="Admin.deleteMediaItem('${item.id}')">삭제</button>
        </div>
      `;
    });

    container.innerHTML = `
      <h3 class="admin-sec-title">그림 및 영상 업로드/관리</h3>
      
      <!-- 업로드 폼 -->
      <div style="background: rgba(30,63,32,0.03); border: 1px dashed var(--primary-color); border-radius: var(--border-radius-md); padding: 25px; margin-bottom: 2.5rem;">
        <h4 style="font-weight: 700; color:var(--primary-color); margin-bottom: 15px;"><i class="fa-solid fa-circle-plus"></i> 신규 미디어 추가</h4>
        <form id="admin-media-form" onsubmit="event.preventDefault();">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="form-group">
              <label for="media-type-select">미디어 형식</label>
              <select id="media-type-select" onchange="Admin.toggleMediaUrlPlaceholder(this.value)">
                <option value="image">그림 (Image URL)</option>
                <option value="video">영상 (YouTube Embed URL)</option>
              </select>
            </div>
            <div class="form-group">
              <label for="media-title-input">제목</label>
              <input type="text" id="media-title-input" required placeholder="예: 국화꽃차 덖는 날">
            </div>
          </div>
          <div class="form-group">
            <label for="media-url-input" id="media-url-label">그림 URL</label>
            <input type="text" id="media-url-input" required placeholder="https://images.unsplash.com/... 또는 이미지 주소">
            <span id="media-url-tip" style="font-size: 0.75rem; color: var(--text-muted); display:block; margin-top:5px;">
              * 웹상의 고해상도 이미지 URL 주소를 복사해 입력해주세요.
            </span>
          </div>
          <div class="form-group">
            <label for="media-desc-input">미디어 상세 설명</label>
            <textarea id="media-desc-input" rows="3" required placeholder="해당 그림/영상에 대한 스토리를 짧게 작성해주세요."></textarea>
          </div>
          <button class="btn-primary" style="font-size: 0.85rem; padding: 10px 20px;" onclick="Admin.addMediaItem()"><i class="fa-solid fa-cloud-arrow-up"></i> 미디어 등록</button>
        </form>
      </div>

      <!-- 리스트 -->
      <h4 style="font-weight: 700; color:var(--primary-color); margin-bottom: 15px;">등록된 미디어 라이브러리 목록</h4>
      <div id="admin-media-list-container">
        ${listHtml ? listHtml : '<div style="color:var(--text-muted); padding:20px 0;">등록된 미디어가 없습니다.</div>'}
      </div>
    `;
  },

  toggleMediaUrlPlaceholder(type) {
    const label = document.getElementById('media-url-label');
    const input = document.getElementById('media-url-input');
    const tip = document.getElementById('media-url-tip');
    
    if (type === 'video') {
      label.innerText = '유튜브 임베드 URL';
      input.placeholder = 'https://www.youtube.com/embed/실제동영상아이디';
      tip.innerHTML = '* 유튜브 동영상 우클릭 -> <strong>소스코드 복사</strong> 후 나오는 주소(iframe 내 src의 주소)를 입력해야 사이트 내에서 정상 임베드 재생됩니다.';
    } else {
      label.innerText = '그림 URL';
      input.placeholder = 'https://images.unsplash.com/... 또는 이미지 주소';
      tip.innerHTML = '* 웹상의 고해상도 이미지 URL 주소를 복사해 입력해주세요.';
    }
  },

  addMediaItem() {
    const type = document.getElementById('media-type-select').value;
    const title = document.getElementById('media-title-input').value;
    const url = document.getElementById('media-url-input').value;
    const desc = document.getElementById('media-desc-input').value;

    if (!title || !url || !desc) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    const newItem = {
      id: 'media-' + Date.now(),
      type: type,
      title: title,
      url: url,
      description: desc
    };

    state.media.push(newItem);
    Db.saveMedia(state.media);

    alert(`새로운 ${type === 'video' ? '동영상' : '그림'}이 미디어 갤러리에 추가되었습니다.`);
    document.getElementById('admin-media-form').reset();
    this.renderSubTabContent();
  },

  deleteMediaItem(id) {
    if (!confirm('정말로 이 미디어를 갤러리에서 완전히 제거하시겠습니까?')) return;
    const mediaIdx = state.media.findIndex(m => m.id === id);
    if (mediaIdx > -1) {
      state.media.splice(mediaIdx, 1);
      Db.saveMedia(state.media);
      alert('성공적으로 삭제되었습니다.');
      this.renderSubTabContent();
    }
  },

  // 4) 회원 요금제 설정 탭
  renderPlanManagement(container) {
    const p = state.settings.pricingPlans || {};
    container.innerHTML = `
      <h3 class="admin-sec-title">멤버십 구독 요금제 설정</h3>
      <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom: 20px;">
        각 등급 요금제의 이름, 월 비용, 갱신 기간 및 소개 설명을 수정합니다. 요금제 안내 탭에 실시간 적용됩니다.
      </p>

      <form id="admin-pricing-plans-form" onsubmit="event.preventDefault();">
        <div style="border:1px solid rgba(0,0,0,0.06); padding: 20px; border-radius: var(--border-radius-md); margin-bottom:1.5rem; background:rgba(30,63,32,0.01);">
          <h4 style="font-weight:700; color:var(--primary-color); margin-bottom:12px;">Basic 요금제</h4>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
            <div class="form-group">
              <label>가격 표시</label>
              <input type="text" id="plan-basic-price" value="${p.Basic?.price || '무료'}">
            </div>
            <div class="form-group">
              <label>갱신 기간</label>
              <input type="text" id="plan-basic-period" value="${p.Basic?.period || '평생'}">
            </div>
          </div>
          <div class="form-group">
            <label>요금제 설명</label>
            <input type="text" id="plan-basic-desc" value="${p.Basic?.desc || ''}">
          </div>
        </div>

        <div style="border:1px solid rgba(0,0,0,0.06); padding: 20px; border-radius: var(--border-radius-md); margin-bottom:1.5rem; background:rgba(30,63,32,0.01);">
          <h4 style="font-weight:700; color:var(--primary-color); margin-bottom:12px;">Silver 요금제</h4>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
            <div class="form-group">
              <label>가격 표시</label>
              <input type="text" id="plan-silver-price" value="${p.Silver?.price || ''}">
            </div>
            <div class="form-group">
              <label>갱신 기간</label>
              <input type="text" id="plan-silver-period" value="${p.Silver?.period || ''}">
            </div>
          </div>
          <div class="form-group">
            <label>요금제 설명</label>
            <input type="text" id="plan-silver-desc" value="${p.Silver?.desc || ''}">
          </div>
        </div>

        <div style="border:1px solid rgba(0,0,0,0.06); padding: 20px; border-radius: var(--border-radius-md); margin-bottom:1.5rem; background:rgba(30,63,32,0.01);">
          <h4 style="font-weight:700; color:var(--primary-color); margin-bottom:12px;">Gold 요금제</h4>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
            <div class="form-group">
              <label>가격 표시</label>
              <input type="text" id="plan-gold-price" value="${p.Gold?.price || ''}">
            </div>
            <div class="form-group">
              <label>갱신 기간</label>
              <input type="text" id="plan-gold-period" value="${p.Gold?.period || ''}">
            </div>
          </div>
          <div class="form-group">
            <label>요금제 설명</label>
            <input type="text" id="plan-gold-desc" value="${p.Gold?.desc || ''}">
          </div>
        </div>

        <button class="btn-primary" onclick="Admin.savePlansSettings()"><i class="fa-solid fa-floppy-disk"></i> 요금제 설정 저장</button>
      </form>
    `;
  },

  savePlansSettings() {
    state.settings.pricingPlans = {
      Basic: {
        price: document.getElementById('plan-basic-price').value,
        period: document.getElementById('plan-basic-period').value,
        desc: document.getElementById('plan-basic-desc').value
      },
      Silver: {
        price: document.getElementById('plan-silver-price').value,
        period: document.getElementById('plan-silver-period').value,
        desc: document.getElementById('plan-silver-desc').value
      },
      Gold: {
        price: document.getElementById('plan-gold-price').value,
        period: document.getElementById('plan-gold-period').value,
        desc: document.getElementById('plan-gold-desc').value
      }
    };

    Db.saveSettings(state.settings);
    alert('회원 요금제 및 멤버십 혜택 설정이 데이터베이스에 저장되었으며, 이용자 화면에 즉시 적용되었습니다.');
  },

  // 5) 구매대행 접수 내역 관리 탭
  renderOrdersManagement(container) {
    let rowsHtml = '';
    state.inquiries.forEach(inq => {
      rowsHtml += `
        <tr>
          <td><strong style="color:var(--primary-color);">${inq.productName}</strong></td>
          <td>
            <strong>${inq.userName}</strong><br>
            <span style="font-size:0.75rem; color:var(--text-muted);">${inq.userEmail}</span>
          </td>
          <td>${inq.phone}</td>
          <td><span style="font-size:0.8rem;">${inq.address}</span></td>
          <td><span style="font-size:0.8rem; color:var(--text-muted);">${inq.notes || '-'}</span></td>
          <td>
            <select style="padding: 4px; border-radius: 4px; font-weight:700; ${inq.status === '접수대기' ? 'color:#ff9900;' : inq.status === '대행완료' ? 'color:#2ecc71;' : 'color:#e74c3c;'}" onchange="Admin.changeOrderStatus('${inq.id}', this.value)">
              <option value="접수대기" ${inq.status === '접수대기' ? 'selected' : ''}>접수대기</option>
              <option value="대행완료" ${inq.status === '대행완료' ? 'selected' : ''}>대행완료 (결제완료/발송)</option>
              <option value="주문취소" ${inq.status === '주문취소' ? 'selected' : ''}>주문취소</option>
            </select>
          </td>
          <td>${inq.date}</td>
        </tr>
      `;
    });

    container.innerHTML = `
      <h3 class="admin-sec-title">약선차 구매대행 신청 및 접수 조회</h3>
      <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom: 20px;">
        회원들이 가상으로 신청한 약선 힐링차의 구매 대행 현황입니다. 쿠팡 연결 상태나 배송지 정보를 기반으로 전화 상담 후 대행을 조율할 수 있습니다.
      </p>

      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>대행 신청 상품</th>
              <th>신청자</th>
              <th>연락처</th>
              <th>배송지</th>
              <th>요청사항</th>
              <th>처리 상태</th>
              <th>신청일</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml ? rowsHtml : '<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">구매대행 접수 내역이 존재하지 않습니다.</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  },

  changeOrderStatus(inqId, nextStatus) {
    const idx = state.inquiries.findIndex(i => i.id === inqId);
    if (idx > -1) {
      state.inquiries[idx].status = nextStatus;
      Db.saveInquiries(state.inquiries);
      alert(`구매대행 주문 번호 [${inqId}]의 접수 상태가 '${nextStatus}'(으)로 갱신되었습니다.`);
      // 주문 탭 내 뱃지 수 갱신을 위해 사이드바/전체 새로 그림
      router();
    }
  }
};

function renderAdmin(container) {
  Admin.render(container);
}

// ==========================================
// 5. 구글 로그인 및 권한 관리 (Mocking)
// ==========================================
const Auth = {
  renderAuthUI() {
    const authContainer = document.getElementById('auth-ui-container');
    const adminLink = document.getElementById('nav-admin-link');

    if (!authContainer) return;

    if (state.currentUser) {
      // 로그인 상태
      authContainer.innerHTML = `
        <div class="user-profile">
          <div class="user-avatar">${state.currentUser.name ? state.currentUser.name.substring(0, 1) : 'U'}</div>
          <div class="user-info">
            <span class="user-name">${state.currentUser.name}님</span>
            <span class="user-plan-badge">${state.currentUser.plan}</span>
          </div>
          <button class="btn-logout" onclick="Auth.logout()"><i class="fa-solid fa-right-from-bracket"></i> 로그아웃</button>
        </div>
      `;

      // 관리자 메뉴 보임 여부 조절
      if (state.currentUser.role === 'admin') {
        adminLink.style.display = 'block';
      } else {
        adminLink.style.display = 'none';
      }
    } else {
      // 미로그인 상태
      authContainer.innerHTML = `
        <button class="btn-google-login" onclick="UI.openModal('google-login-modal')">
          <svg viewBox="0 0 18 18" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.7-1.57 2.69-3.88 2.69-6.57z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.47-.8 5.96-2.2l-2.9-2.24c-.8.54-1.84.87-3.06.87-2.35 0-4.34-1.58-5.05-3.72H.96v2.3C2.44 15.97 5.48 18 9 18z" fill="#34A853"/>
            <path d="M3.95 10.71c-.18-.54-.28-1.12-.28-1.71s.1-1.17.28-1.71V5H.96C.35 6.2.01 7.56.01 9s.34 2.8.95 4l2.99-2.29z" fill="#FBBC05"/>
            <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.1C13.46.66 11.43 0 9 0 5.48 0 2.44 2.03.96 5.03l2.99 2.29c.71-2.14 2.7-3.74 5.05-3.74z" fill="#EA4335"/>
          </svg>
          Google 로그인
        </button>
      `;
      adminLink.style.display = 'none';
    }
  },

  simulateGoogleLogin(email, name) {
    // 1. 유저 DB 내 이메일 존재 유무 매칭
    let matchedUser = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    const isAdminEmail = (email.toLowerCase() === 'tksqlc08@gmail.com');

    if (!matchedUser) {
      // 새로운 계정이면 가입 처리 (tksqlc08@gmail.com은 관리자로 자동 연동)
      matchedUser = {
        id: 'user-' + Date.now(),
        email: email,
        name: isAdminEmail ? '관리자' : name,
        role: isAdminEmail ? 'admin' : 'user',
        plan: isAdminEmail ? 'Premium' : 'Basic',
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0]
      };
      state.users.push(matchedUser);
      Db.saveUsers(state.users);
    } else if (isAdminEmail && matchedUser.role !== 'admin') {
      matchedUser.role = 'admin';
      matchedUser.name = '관리자';
      matchedUser.plan = 'Premium';
      Db.saveUsers(state.users);
    }

    // 계정 상태 체크
    if (matchedUser.status === 'Suspended') {
      alert('해당 계정은 관리자에 의해 사용이 정지되었습니다.\n문의: tksqlc08@gmail.com');
      UI.closeModal('google-login-modal');
      return;
    }

    // 2. 세션에 저장
    state.currentUser = matchedUser;
    localStorage.setItem('herb_healing_session', JSON.stringify(matchedUser));

    alert(`구글 연동 로그인 성공!\n반갑습니다, ${name}님.`);
    UI.closeModal('google-login-modal');
    
    // UI 업데이트
    this.renderAuthUI();
    router();
  },

  simulateCustomLogin() {
    const email = document.getElementById('custom-google-email').value;
    if (!email || !email.includes('@')) {
      alert('올바른 형식의 이메일 주소를 입력해주세요.');
      return;
    }

    // 닉네임은 이메일 앞부분 추출
    const name = email.split('@')[0];
    this.simulateGoogleLogin(email, name);
  },

  logout() {
    state.currentUser = null;
    localStorage.removeItem('herb_healing_session');
    
    this.renderAuthUI();
    alert('로그아웃 처리되었습니다.');
    
    // 만약 현재 탭이 관리자 패널이었다면 홈으로 리다이렉트
    if (window.location.hash === '#admin') {
      window.location.hash = '#home';
    } else {
      router();
    }
  }
};

// ==========================================
// 6. UI 모달 제어 헬퍼
// ==========================================
const UI = {
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  }
};

// --- DIRECTIONS (LOCATION) PAGE ---
const Directions = {
  render(container) {
    const view = document.createElement('div');
    view.className = 'page-view';

    view.innerHTML = `
      <div class="section-title-wrap">
        <h2 class="section-title">오시는 길</h2>
        <p class="section-subtitle">산빛약초꽃차문화연구원은 맑은 공기와 자연이 함께하는 파주에 위치하고 있습니다.</p>
      </div>

      <div class="location-grid">
        <!-- 왼쪽: 주소 및 교통편 상세 안내 -->
        <div class="location-info-card">
          <div class="info-group">
            <h3 class="info-title"><i class="fa-solid fa-location-dot"></i> 연구원 주소</h3>
            <p class="info-text"><strong>도로명 주소:</strong> 경기도 파주시 가재울로 99-26</p>
          </div>

          <div class="info-group">
            <h3 class="info-title"><i class="fa-solid fa-phone"></i> 연락처 및 운영시간</h3>
            <p class="info-text" style="margin-bottom: 5px;"><strong>대표전화:</strong> 031-942-0545</p>
            <p class="info-text"><strong>운영시간:</strong> 10:30 ~ 20:00 (매주 월요일 휴무)</p>
          </div>

          <div class="info-group">
            <h3 class="info-title"><i class="fa-solid fa-bus"></i> 대중교통 이용 안내</h3>
            <div class="transport-detail" style="margin-bottom: 12px;">
              <h4 class="transport-sub"><i class="fa-solid fa-train"></i> 지하철 연계 안내</h4>
              <p>경의중앙선 <strong>운정역 1번 출구</strong> → 마을버스 <strong>074, 070A, 080A번</strong> 탑승 → <strong>두레공원(중) 정류장</strong> 하차 (도보 약 5분)</p>
            </div>
            <div class="transport-detail">
              <h4 class="transport-sub"><i class="fa-solid fa-bus-simple"></i> 주변 정류장 및 버스 노선</h4>
              <p><strong>두레공원(중) 정류장</strong> 하차 (광역버스 9030, 3100, 1500, M7111 / 시내버스 065, 066, 080번 경유)</p>
            </div>
          </div>

          <div class="info-group">
            <h3 class="info-title"><i class="fa-solid fa-car"></i> 자가용 이용 및 주차</h3>
            <p class="info-text">네비게이션에 <strong>"산빛약초꽃차"</strong> 또는 <strong>"경기도 파주시 가재울로 99-26"</strong>을 입력하고 찾아오시면 됩니다. 건물 내 전용 주차장에 무료 주차 가능합니다.</p>
          </div>
        </div>

        <!-- 오른쪽: 지도 표시 및 길찾기 링크 -->
        <div class="location-map-card">
          <div class="map-container">
            <iframe 
              src="https://maps.google.com/maps?q=%EA%B2%BD%EA%B8%B0%EB%8F%84%20%ED%8C%8C%EC%A3%BC%EC%8B%9C%20%EA%B0%80%EC%9E%AC%EC%9A%B8%EB%A1%9C%2099-26&t=&z=16&ie=UTF8&iwloc=&output=embed" 
              allowfullscreen="" 
              loading="lazy">
            </iframe>
          </div>
          
          <div class="map-links">
            <a href="https://map.naver.com/v5/search/%EA%B2%BD%EA%B8%B0%EB%8F%84%20%ED%8C%8C%EC%A3%BC%EC%8B%9C%20%EA%B0%80%EC%9E%AC%EC%9A%B8%EB%A1%9C%2099-26" target="_blank" class="btn-map-link btn-naver">
              <i class="fa-solid fa-map-marked-alt"></i> 네이버 지도 길찾기
            </a>
            <a href="https://map.kakao.com/link/search/%EA%B2%BD%EA%B8%B0%EB%8F%84%20%ED%8C%8C%EC%A3%BC%EC%8B%9C%20%EA%B0%80%EC%9E%AC%EC%9A%B8%EB%A1%9C%2099-26" target="_blank" class="btn-map-link btn-kakao">
              <i class="fa-solid fa-location-arrow"></i> 카카오맵 길찾기
            </a>
          </div>
        </div>
      </div>
    `;

    container.appendChild(view);
  }
};

function renderLocation(container) {
  Directions.render(container);
}

// 전역 객체 바인딩 (HTML에서 onclick 등으로 호출하기 위함)
window.Auth = Auth;
window.UI = UI;
window.Encyclopedia = Encyclopedia;
window.Teas = Teas;
window.Community = Community;
window.Admin = Admin;
window.Pricing = Pricing;
window.Barefoot = Barefoot;
window.Meditation = Meditation;
window.Directions = Directions;


// 앱 구동 시작
document.addEventListener('DOMContentLoaded', initApp);
