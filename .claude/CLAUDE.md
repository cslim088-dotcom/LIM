# YouTube Production Harness

YouTube 영상 콘텐츠의 기획→대본→썸네일→SEO를 에이전트 팀이 협업하여 생성하는 하네스.

## 구조

```
.claude/
├── agents/
│   ├── content-strategist.md  — 콘텐츠 전략 (주제분석, 경쟁벤치마킹, 컨셉설계)
│   ├── scriptwriter.md        — 대본 작성 (훅, 세그먼트, CTA, 시각큐)
│   ├── thumbnail-designer.md  — 썸네일 설계 + Gemini 이미지 생성
│   ├── seo-optimizer.md       — SEO 패키지 (제목/설명/태그/챕터/자막)
│   └── production-reviewer.md — 교차 검증 (전략↔대본↔썸네일↔SEO 정합성)
├── skills/
│   └── youtube-production/
│       └── skill.md           — 오케스트레이터 (팀 조율, 워크플로우, 에러핸들링)
└── CLAUDE.md                  — 이 파일
```

## 사용법

`/youtube-production` 스킬을 트리거하거나, "유튜브 영상 기획해줘" 같은 자연어로 요청한다.

## 산출물

모든 산출물은 `_workspace/` 디렉토리에 저장된다:
- `00_input.md` — 사용자 입력 정리
- `01_strategist_brief.md` — 전략 브리프
- `02_scriptwriter_script.md` — 영상 대본
- `03_thumbnail_concept.md` — 썸네일 컨셉
- `04_seo_package.md` — SEO 패키지
- `05_review_report.md` — 리뷰 보고서
- `subtitle.srt` — 자막 파일


---

# Mobile App Builder Harness

모바일 앱의 UI/UX 설계→네이티브 코드 생성→API 연동→스토어 배포 준비를 에이전트 팀이 협업하여 수행하는 하네스.

## 구조

```
.claude/
├── agents/
│   ├── ux-designer.md        — UX/UI 설계 (와이어프레임, 디자인 시스템, 인터랙션)
│   ├── app-developer.md      — 네이티브/크로스플랫폼 앱 개발 (Swift, Kotlin, Flutter, RN)
│   ├── api-integrator.md     — API 연동 (REST/GraphQL 클라이언트, 인증, 캐싱)
│   ├── store-manager.md      — 스토어 배포 (메타데이터, 스크린샷, 심사 대응)
│   └── qa-engineer.md        — 품질 검증 (UI 테스트, 성능, 접근성, 보안)
├── skills/
│   ├── mobile-app-builder/
│   │   └── skill.md           — 오케스트레이터 (팀 조율, 워크플로우, 에러핸들링)
│   ├── mobile-ux-patterns/
│   │   └── skill.md           — UX디자이너 확장 (iOS HIG/Material 3, 네비게이션, 디자인 토큰)
│   └── app-store-optimization/
│       └── skill.md           — 스토어매니저 확장 (ASO 메타데이터, 키워드 전략, 심사 대응)
└── CLAUDE.md                  — 이 파일
```

## 사용법

`/mobile-app-builder` 스킬을 트리거하거나, "모바일 앱 만들어줘" 같은 자연어로 요청한다.

## 산출물

모든 산출물은 `_workspace/` 디렉토리에 저장된다:
- `00_input.md` — 사용자 입력 정리
- `01_ux_design.md` — UX/UI 설계 문서
- `02_app_code/` — 앱 소스 코드
- `02_app_architecture.md` — 앱 아키텍처 문서
- `03_api_integration.md` — API 연동 명세
- `04_store_listing.md` — 스토어 배포 메타데이터
- `05_qa_report.md` — QA 검증 보고서


---

# Design System Harness

UI 디자인 시스템 구축: 디자인토큰→컴포넌트라이브러리→스토리북→접근성검증→문서를 에이전트 팀이 협업하여 수행하는 하네스.

## 구조

```
.claude/
├── agents/
│   ├── token-designer.md       — 디자인 토큰 (색상, 타이포, 간격, 그림자, 모션)
│   ├── component-developer.md  — 컴포넌트 개발 (React/Vue, 변형, 합성, 상태)
│   ├── a11y-auditor.md         — 접근성 검증 (WCAG 2.1, ARIA, 키보드, 스크린리더)
│   ├── storybook-builder.md    — 스토리북 (스토리, 인터랙션 테스트, 문서화)
│   └── doc-writer.md           — 문서 작성 (설계 원칙, 사용 가이드, 기여 가이드)
├── skills/
│   ├── design-system/
│       └── skill.md            — 오케스트레이터 (팀 조율, 워크플로우, 에러핸들링)
│   ├── wcag-checker/
│   │   └── skill.md            — 접근성 검증 (WCAG 체크리스트, 대비비, ARIA)
│   └── token-generator/
│       └── skill.md            — 디자인 토큰 생성 (색상 스케일, 타이포, 간격)
└── CLAUDE.md                   — 이 파일
```

## 사용법

`/design-system` 스킬을 트리거하거나, "디자인 시스템 만들어줘" 같은 자연어로 요청한다.

## 산출물

모든 산출물은 `_workspace/` 디렉토리에 저장된다:
- `00_input.md` — 사용자 입력 및 브랜드 정보
- `01_design_tokens/` — 디자인 토큰 정의 파일
- `02_components/` — 컴포넌트 라이브러리 코드
- `03_storybook/` — 스토리북 스토리 및 설정
- `04_a11y_report.md` — 접근성 검증 보고서
- `05_docs/` — 디자인 시스템 문서
