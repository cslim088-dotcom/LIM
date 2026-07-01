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
  if (footerEmailEl) footerEmailEl.innerText = state.settings.contactEmail || 'contact@nature.com';
  if (footerPhoneEl) footerPhoneEl.innerText = state.settings.contactPhone || '031-940-1234';
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
    case 'community':
      renderCommunity(appContainer);
      break;
    case 'media':
      renderMedia(appContainer);
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
        <img src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80" alt="힐링꽃차 우려내기">
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
            <a href="${tea.coupangUrl}" target="_blank" class="btn-coupang"><i class="fa-solid fa-cart-shopping"></i> 쿠팡 구매</a>
            ${tea.agentBuyAvailable 
              ? `<button class="btn-agent-buy" onclick="Teas.openAgentBuyModal('${tea.id}')"><i class="fa-solid fa-paper-plane"></i> 구매대행</button>` 
              : `<button class="btn-agent-buy btn-disabled" disabled><i class="fa-solid fa-ban"></i> 대행 불가</button>`
            }
          </div>
        </div>
      </div>
    `;
  });

  homeView.innerHTML = `
    ${heroHtml}
    
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

    // 카테고리 탭 리스트 추출
    const categories = ['전체', '뿌리류', '잎류', '뿌리/잎류', '열매류'];
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
      filtered = filtered.filter(h => h.category === this.activeCategory);
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
          <img src="${herb.imageUrl}" alt="${herb.name}" class="herb-card-img">
          <div class="herb-card-content">
            <span class="herb-card-cat">${herb.category}</span>
            <h3 class="herb-card-title">${herb.name}</h3>
            <span class="herb-card-sci">${herb.scientificName}</span>
            <p class="herb-card-desc">${herb.efficacy}</p>
            <button class="btn-card-more" onclick="Encyclopedia.openDetail('${herb.id}')">상세 보기 (부작용/복용법) <i class="fa-solid fa-arrow-right"></i></button>
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

    // 요금제별 정보 등급 제어 데모 (Silver/Gold 전용 고급 정보 제한 시나리오)
    const isPremiumInfo = herb.name.includes('인삼') || herb.name.includes('구기자');
    const userPlan = state.currentUser ? state.currentUser.plan : 'Basic';

    let contentHtml = '';
    if (isPremiumInfo && userPlan === 'Basic') {
      contentHtml = `
        <div style="text-align: center; padding: 40px 20px;">
          <i class="fa-solid fa-lock" style="font-size: 3rem; color: var(--accent-color); margin-bottom: 20px;"></i>
          <h3 style="font-family: var(--font-title); font-size: 1.6rem; color: var(--primary-color); margin-bottom: 10px;">멤버십 전용 프리미엄 정보</h3>
          <p style="color: var(--text-muted); margin-bottom: 25px;">'${herb.name}'의 심층 약리작용 및 전문가 처방 레시피는 Silver 등급 이상 요금제 회원만 열람할 수 있습니다.</p>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button class="btn-secondary" onclick="UI.closeModal('detail-modal')">닫기</button>
            <a href="#pricing" class="btn-primary" onclick="UI.closeModal('detail-modal')">멤버십 가입하기</a>
          </div>
        </div>
      `;
    } else {
      contentHtml = `
        <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
          <img src="${herb.imageUrl}" alt="${herb.name}" style="width: 100%; height: 300px; object-fit: cover; border-radius: var(--border-radius-md);">
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
    }

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
              <a href="${tea.coupangUrl}" target="_blank" class="btn-coupang"><i class="fa-solid fa-cart-shopping"></i> 쿠팡 구매</a>
              ${tea.agentBuyAvailable 
                ? `<button class="btn-agent-buy" onclick="Teas.openAgentBuyModal('${tea.id}')"><i class="fa-solid fa-paper-plane"></i> 구매대행</button>` 
                : `<button class="btn-agent-buy btn-disabled" disabled><i class="fa-solid fa-ban"></i> 대행 불가</button>`
              }
            </div>
          </div>
        </div>
      `;
    });

    view.innerHTML = `
      <div class="section-title-wrap">
        <h2 class="section-title">약선 힐링차 상품관</h2>
        <p class="section-subtitle">산빛 다도원에서 수제 가공한 건강차를 쿠팡과 편리한 대행 구매를 통해 제공합니다.</p>
      </div>

      <div class="cards-grid">
        ${cardsHtml}
      </div>
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
    document.getElementById('buy-user-name').value = state.currentUser.name || '';
    
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
      alert('신청자 성함, 연락처, 주소를 정확히 입력해주세요.');
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
        <p class="section-subtitle">청정 약초 채취 전경과 꽃차 제조 비법, 다도 강좌 동영상을 감상하세요.</p>
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
    let matchedUser = state.users.find(u => u.email === email);

    if (!matchedUser) {
      // 새로운 계정이면 가입 처리 (기본 Basic plan)
      matchedUser = {
        id: 'user-' + Date.now(),
        email: email,
        name: name,
        role: 'user',
        plan: 'Basic',
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0]
      };
      state.users.push(matchedUser);
      Db.saveUsers(state.users);
    }

    // 계정 상태 체크
    if (matchedUser.status === 'Suspended') {
      alert('해당 계정은 관리자에 의해 사용이 정지되었습니다.\n문의: contact@nature.com');
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

// 전역 객체 바인딩 (HTML에서 onclick 등으로 호출하기 위함)
window.Auth = Auth;
window.UI = UI;
window.Encyclopedia = Encyclopedia;
window.Teas = Teas;
window.Community = Community;
window.Admin = Admin;
window.Pricing = Pricing;

// 앱 구동 시작
document.addEventListener('DOMContentLoaded', initApp);
