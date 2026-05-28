# FDL CARD — 전략 설계 문서 v1.0

> "축구하는 아이들에게 프로선수의 감동을. 아카데미에 최강의 브랜딩 무기를."

---

## 목차

1. [서비스 전략](#1-서비스-전략)
2. [전체 기능 구조](#2-전체-기능-구조)
3. [수익 모델](#3-수익-모델)
4. [UX 흐름 설계](#4-ux-흐름-설계)
5. [DB 구조](#5-db-구조)
6. [카드 등급 시스템](#6-카드-등급-시스템)
7. [템플릿 판매 구조](#7-템플릿-판매-구조)
8. [MVP 범위 정의](#8-mvp-범위-정의)

---

## 1. 서비스 전략

### 1-1. 문제 정의

| 페인포인트 | 현실 |
|-----------|------|
| 아카데미 브랜딩 도구가 없다 | 전단지·카카오채널이 전부 |
| 아이들이 축구를 "게임"처럼 즐기지 못한다 | 순위표·트로피 정도가 보상의 끝 |
| 부모가 자랑할 콘텐츠가 없다 | 경기 사진 찍어서 올리는 게 전부 |
| 등록률 하락을 막을 재등록 유인이 없다 | 할인 외에 수단 없음 |
| 선수 성장 기록을 시각화할 방법이 없다 | 구두 피드백만 존재 |

### 1-2. 솔루션

**FDL CARD = 축구 아카데미용 FIFA Ultimate Team + 트레이딩 카드 플랫폼**

- 실제 선수처럼 느끼는 **나만의 공식 카드** 발급
- 능력치 성장이 카드에 **실시간 반영**되는 진화 시스템
- 부모가 SNS에 **자랑하고 싶은 비주얼**
- 아카데미 로고가 박힌 **브랜딩 콘텐츠** 자동 생성
- 카드팩 개봉 같은 **보상 UX**로 등록 유인 제공

### 1-3. 타겟 시장

```
1차 타겟: 국내 축구 아카데미 (유·청소년) — 추정 3,000개+
          └ 평균 등록 선수 30~80명, 연회비 120~600만원
2차 타겟: 학부모 (디지털 굿즈 결제 의향 높음, 30~45세)
3차 타겟: 선수 본인 (10~17세, 게임·SNS 친화)
확장: 농구/야구/테니스 등 타 스포츠 아카데미
```

### 1-4. 포지셔닝

```
                    감성/게임화 ↑
                         |
              FDL CARD ●  |
                         |
  운영 도구 ←————————————+————————————→ 콘텐츠 도구
                         |
                         |
                    감성/게임화 ↓

경쟁자 없음 — 이 포지션은 공백 지대
```

### 1-5. 핵심 KPI

| 지표 | 목표 (출시 후 12개월) |
|------|----------------------|
| 가입 아카데미 수 | 200개 |
| 발급 카드 수 | 50,000장 |
| 월 활성 아카데미 | 70% |
| 카드 SNS 공유율 | 40% |
| 아카데미 12개월 재계약률 | 80% |
| 월 MRR | ₩15,000,000 |

---

## 2. 전체 기능 구조

```
FDL CARD
│
├── 🎴 카드 시스템
│   ├── 카드 생성 (사진 업로드 → AI 배경제거 → 자동 레이아웃)
│   ├── 카드 등급 (COMMON ~ MONSTER CLASS)
│   ├── 카드 진화 (능력치 향상 → 등급 자동 업그레이드)
│   ├── 시즌 카드 (시즌마다 새 카드 발급)
│   ├── 이벤트 카드 (MVP · 대회 우승 · 특별 업적)
│   └── 카드 다운로드 / 공유
│
├── 🎁 카드팩 시스템
│   ├── 팩 타입 (Standard / Premium / Legend / Mystery)
│   ├── 개봉 애니메이션 (Web Animation API + CSS)
│   ├── 희귀 카드 연출 (화면 흔들림, 파티클, 빛 효과)
│   ├── 팩 획득 경로 (출석 · 레벨업 · 이벤트 · 구매)
│   └── 히스토리 (내가 뽑은 카드 기록)
│
├── 📊 성장 & 게임화
│   ├── 능력치 시스템 (PAC · DRI · PHY · ACC · TACT · PSYCH)
│   ├── OVR 자동 계산
│   ├── 성장 그래프 (시즌별 추이)
│   ├── 경험치 & 레벨
│   ├── 업적 시스템 (배지 + 보상)
│   ├── 출석 체크 (연속 출석 보너스)
│   ├── MVP 시스템 (주간 · 월간 · 시즌)
│   ├── 포지션별 랭킹
│   └── 컬렉션 도감
│
├── 🏟️ 아카데미 관리 (어드민)
│   ├── 선수 등록 & 관리
│   ├── 카드 일괄 생성
│   ├── 시즌 관리 (시즌 생성 · 종료 · 아카이브)
│   ├── 능력치 일괄 업데이트
│   ├── MVP 선정
│   ├── 대회 카드 발급
│   ├── 출석 관리
│   ├── 통계 대시보드
│   ├── 공유 링크 / QR 발급
│   └── 아카데미 브랜딩 (로고 · 색상 · 이름)
│
├── 🛒 마켓플레이스
│   ├── 템플릿 마켓 (무료 · 유료 · 시즌 한정)
│   ├── 카드팩 구매
│   ├── 프리미엄 기능 업그레이드
│   └── 굿즈 주문 연계 (실물 카드 인쇄)
│
└── 👤 선수 / 학부모 포털
    ├── 내 카드 컬렉션
    ├── 성장 기록 조회
    ├── 카드 공유 (인스타 · 카카오 · 링크)
    ├── 알림 (새 카드 발급 · 레벨업 · MVP 선정)
    └── 다운로드 (SNS 최적화 이미지)
```

---

## 3. 수익 모델

### 3-1. 수익 구조 개요

```
총 수익
├── B2B 구독 (아카데미) ————————————— 60%
├── B2C 인앱 결제 (학부모·선수) ——————— 25%
└── 굿즈/실물 인쇄 마진 ————————————— 15%
```

### 3-2. B2B 아카데미 구독 플랜

| 플랜 | 가격 | 선수 수 | 주요 기능 |
|------|------|--------|----------|
| **STARTER** | ₩29,000/월 | ~20명 | 기본 카드 생성, FDL 기본 템플릿, 카드 공유 |
| **ACADEMY** | ₩79,000/월 | ~60명 | + 프리미엄 템플릿 2종, 성장 그래프, MVP 시스템 |
| **PRO** | ₩149,000/월 | ~150명 | + 전체 템플릿 접근, 카드팩 시스템, 커스텀 로고 |
| **ELITE** | ₩299,000/월 | 무제한 | + 화이트라벨, API 접근, 전담 CS |
| **연간 할인** | 2개월 무료 | — | 연간 결제 시 적용 |

### 3-3. B2C 인앱 결제

| 상품 | 가격 | 설명 |
|------|------|------|
| Standard 카드팩 | ₩1,900 | 카드 1장, COMMON~RARE |
| Premium 카드팩 | ₩3,900 | 카드 1장, RARE 이상 보장 |
| Legend 팩 (3+1) | ₩9,900 | 카드 3장+, EPIC 이상 1장 보장 |
| 프리미엄 템플릿 단품 | ₩4,900~₩9,900 | 시즌 한정 · 이벤트 |
| 실물 카드 인쇄 1장 | ₩6,900 | 고급 무광 코팅 |
| 실물 카드 5장 | ₩24,900 | 인기 |
| 실물 카드 11장 | ₩49,900 | BEST |

### 3-4. 수익 추정 (12개월)

```
아카데미 200개 × 평균 ₩79,000/월 = ₩15,800,000 MRR
연간 ARR = ₩189,600,000

B2C (카드팩·실물·템플릿): 월 ₩3,000,000 추가
합산 연간 매출: ~₩220,000,000
```

---

## 4. UX 흐름 설계

### 4-1. 아카데미 어드민 핵심 플로우

```
[가입] → 아카데미 정보 입력 → 로고 업로드
  ↓
[선수 등록] → 이름/사진/포지션/등번호 입력 → AI 배경제거 자동 실행
  ↓
[능력치 입력] → 6개 스탯 슬라이더 → OVR 자동 계산 → 등급 자동 결정
  ↓
[템플릿 선택] → 미리보기 → 구매/선택
  ↓
[카드 생성] → 3초 생성 애니메이션 → 카드 완성
  ↓
[배포] → QR 코드 생성 → 링크 공유 → 개별 카드 발송 (카카오)
```

### 4-2. 선수/학부모 핵심 플로우

```
[링크/QR 수신] → 내 카드 첫 공개 애니메이션 (3초 연출)
  ↓
[카드 보기] → 앞면/뒷면 플립 → 능력치 상세
  ↓
[성장 그래프] → 지난 시즌 vs 현재 → OVR 상승 시각화
  ↓
[공유] → 인스타 스토리 최적화 이미지 자동 생성 → 1탭 공유
  ↓
[다운로드] → 고해상도 PNG → 실물 주문 연결
```

### 4-3. 카드팩 개봉 UX (핵심 감동 포인트)

```
팩 선택 → 화면 중앙에 팩 등장 (scale-in 애니메이션)
  ↓
팩 터치/클릭 → 팩 흔들림 효과 (진동 API)
  ↓
팩 뜯기 애니메이션 (상단부터 찢어지는 효과)
  ↓
카드 등장:
  - COMMON: 단순 페이드인
  - RARE: 빛 줄기 + 파란 파티클
  - EPIC: 보라색 폭발 + 화면 진동
  - LEGEND: 금색 폭발 + BGM 변경 + 파티클 폭풍
  - ICON 이상: 전체 화면 연출 + 슬로모션 등장 + 특수 사운드
  ↓
카드 정보 표시 → 컬렉션 추가 → 공유 유도
```

### 4-4. 모바일 UX 원칙

- **첫 화면**: 내 카드가 빛나며 회전 (3D CSS transform)
- **터치 기반**: 스와이프로 카드 넘기기, 핀치로 카드 확대
- **피드백**: 모든 탭에 햅틱 피드백 (Vibration API)
- **속도**: 카드 생성 3초 이내, LCP 1.5초 이내
- **공유 최적화**: 공유 버튼이 항상 화면에 고정

---

## 5. DB 구조

### 5-1. 핵심 테이블 설계

```sql
-- 아카데미
academies
  id            uuid PK
  name          text
  logo_url      text
  color_primary text        -- 아카데미 브랜딩 색상
  plan          text        -- starter/academy/pro/elite
  plan_expires_at timestamptz
  created_at    timestamptz

-- 선수
players
  id            uuid PK
  academy_id    uuid FK → academies
  name          text
  name_en       text
  position      text        -- GK/CB/SB/CM/CAM/ST 등
  jersey_number int
  age           int
  birth_date    date
  photo_url     text
  photo_bg_removed_url text
  is_active     bool
  created_at    timestamptz

-- 카드 (발급된 카드 인스턴스)
cards
  id            uuid PK
  player_id     uuid FK → players
  academy_id    uuid FK → academies
  template_id   uuid FK → card_templates
  season        text        -- '2025-S1', '2025-S2'
  grade         text        -- common/rare/epic/legend/icon/toty/monster
  ovr           int
  pac int, dri int, phy int, acc int, tac int, psy int
  tier_label    text[]      -- ['THE', 'SPEED', 'STAR']
  is_published  bool
  share_token   text UNIQUE -- 공개 링크용 토큰
  created_at    timestamptz

-- 카드 등급 기준 (설정 테이블)
card_grades
  id            uuid PK
  slug          text UNIQUE -- common/rare/epic/legend/icon/toty/monster
  name          text
  min_ovr       int         -- 등급 최소 OVR
  max_ovr       int
  color_primary text
  color_glow    text
  animation     text        -- none/shimmer/pulse/explosion
  order_rank    int

-- 템플릿
card_templates
  id            uuid PK
  slug          text UNIQUE
  name          text
  description   text
  is_premium    bool
  price         int
  config        jsonb       -- { width, height, theme, ... }
  thumbnail_url text
  grade_compat  text[]      -- 호환 등급 목록
  season_limited bool
  available_from timestamptz
  available_until timestamptz
  created_at    timestamptz

-- 카드팩 정의
card_pack_types
  id            uuid PK
  slug          text UNIQUE -- standard/premium/legend/mystery
  name          text
  price         int
  guaranteed_grade text     -- 이 등급 이상 보장
  card_count    int
  animation_type text
  thumbnail_url text

-- 카드팩 구매/지급 내역
card_pack_items
  id            uuid PK
  player_id     uuid FK → players
  pack_type_id  uuid FK → card_pack_types
  source        text        -- 'purchase'/'attendance'/'event'/'level_up'
  opened_at     timestamptz
  cards_received uuid[]     -- 받은 카드 ID 목록

-- 능력치 히스토리 (성장 기록)
stat_history
  id            uuid PK
  player_id     uuid FK → players
  season        text
  recorded_at   date
  pac int, dri int, phy int, acc int, tac int, psy int
  ovr           int
  note          text        -- 코치 메모

-- 업적 정의
achievements
  id            uuid PK
  slug          text UNIQUE
  name          text
  description   text
  icon          text
  condition_type text       -- 'ovr_reach'/'attendance'/'mvp'/'grade_get'
  condition_value jsonb
  reward_pack_type_id uuid FK → card_pack_types

-- 선수 업적 달성
player_achievements
  id            uuid PK
  player_id     uuid FK → players
  achievement_id uuid FK → achievements
  achieved_at   timestamptz

-- MVP 기록
mvp_records
  id            uuid PK
  academy_id    uuid FK → academies
  player_id     uuid FK → players
  period_type   text        -- 'weekly'/'monthly'/'season'
  period_label  text        -- '2025-W21', '2025-05', '2025-S1'
  created_at    timestamptz

-- 출석 기록
attendance_records
  id            uuid PK
  player_id     uuid FK → players
  date          date
  academy_id    uuid FK → academies
  streak_count  int         -- 연속 출석 일수
```

### 5-2. 인덱스 전략

```sql
-- 자주 조회되는 쿼리 기준
CREATE INDEX idx_cards_player_season   ON cards(player_id, season);
CREATE INDEX idx_cards_share_token     ON cards(share_token);
CREATE INDEX idx_stat_history_player   ON stat_history(player_id, recorded_at DESC);
CREATE INDEX idx_attendance_player     ON attendance_records(player_id, date DESC);
CREATE INDEX idx_mvp_academy_period    ON mvp_records(academy_id, period_type, period_label);
```

### 5-3. RLS (Row Level Security) 정책

```
academies     → 본인 아카데미만 수정 가능
players       → 해당 아카데미 어드민만 CRUD
cards         → 해당 아카데미 어드민 + share_token으로 공개 조회
stat_history  → 해당 아카데미 어드민만
mvp_records   → 해당 아카데미 어드민만 생성, 전체 조회 가능
```

---

## 6. 카드 등급 시스템

### 6-1. 등급 정의표

| 등급 | OVR 범위 | 색상 | 글로우 | 애니메이션 | 획득 방법 |
|------|---------|------|--------|-----------|----------|
| **COMMON** | ~62 | #8A9BB0 (회색 블루) | 없음 | 없음 | 시즌 카드 기본 발급 |
| **RARE** | 63~72 | #4A90D9 (블루) | 파란 shimmer | 카드 테두리 pulse | 성장 달성, Standard팩 |
| **EPIC** | 73~80 | #9B59B6 (퍼플) | 보라 glow | 파티클 + pulse | Premium팩, MVP |
| **LEGEND** | 81~88 | #C8A951 (골드) | 금색 폭발 | 홀로그램 shimmer | Legend팩, 시즌 TOP |
| **ICON** | 89~94 | #E8C060 + #FF6B35 (금오렌지) | 화염 효과 | 불꽃 파티클 루프 | 특별 업적, 시즌 1위 |
| **TOTY** | 95~98 | #00D4FF + #FFD700 (하늘+금) | 무지개 오로라 | 전체화면 오로라 + 슬로모션 | 시즌 최우수 선수 (아카데미당 1장) |
| **MONSTER CLASS** | 99 | #FF0044 + #FFD700 (레드골드) | 번개 효과 | 화면 전체 폭발 + BGM | 퍼펙트 100점 달성 (전체 희귀) |

### 6-2. 등급별 시각 효과 스펙

#### COMMON
```css
border: 2px solid #8A9BB0;
background: linear-gradient(135deg, #1a2332 0%, #0d1520 100%);
filter: none;
animation: none;
```

#### RARE
```css
border: 2px solid #4A90D9;
background: linear-gradient(135deg, #0d1e35 0%, #0a1525 100%);
box-shadow: 0 0 20px rgba(74, 144, 217, 0.4);
animation: rare-shimmer 3s ease-in-out infinite;
/* @keyframes rare-shimmer: 테두리 빛이 좌→우로 흐름 */
```

#### EPIC
```css
border: 2px solid #9B59B6;
background: linear-gradient(135deg, #1a0d2e 0%, #0d0820 100%);
box-shadow: 0 0 30px rgba(155, 89, 182, 0.6), 0 0 60px rgba(155, 89, 182, 0.2);
animation: epic-pulse 2s ease-in-out infinite;
/* 파티클 20개 랜덤 부유 */
```

#### LEGEND
```css
border: 3px solid #C8A951;
background: linear-gradient(135deg, #1a1400 0%, #0d0e00 50%, #1a1200 100%);
box-shadow: 0 0 40px rgba(200, 169, 81, 0.8), 0 0 80px rgba(200, 169, 81, 0.3);
animation: legend-hologram 4s linear infinite;
/* 홀로그램: 카드 전체에 rainbow gradient가 각도 변화하며 흐름 */
```

#### ICON
```css
border: 3px solid;
border-image: linear-gradient(135deg, #E8C060, #FF6B35, #E8C060) 1;
background: linear-gradient(135deg, #1a0800 0%, #0d0500 100%);
box-shadow: 0 0 50px rgba(255, 107, 53, 0.9);
animation: icon-fire 1.5s ease-in-out infinite;
/* 파티클: 불꽃 모양 200개, 아래→위 floating */
```

#### TOTY
```css
/* 전체화면 오로라 배경 + 카드 슬로모션 등장 */
background: linear-gradient(135deg, #001a2e 0%, #002040 100%);
border: 3px solid transparent;
background-clip: padding-box;
/* 테두리에 무지개 애니메이션 */
animation: toty-aurora 6s linear infinite;
/* 획득 시: 전체화면 darkening + 중앙 빛 폭발 + 카드 내려옴 */
```

#### MONSTER CLASS
```css
/* 전설 중의 전설 — 화면 전체 빨간 번개 */
border: 3px solid #FF0044;
box-shadow: 0 0 60px #FF0044, 0 0 120px rgba(255, 0, 68, 0.5);
animation: monster-lightning 0.5s ease-in-out infinite alternate;
/* 획득 연출: 화면 흔들림 0.5s → 암전 → 번개 3회 → 카드 등장 */
```

### 6-3. 등급 자동 결정 로직

```javascript
function determineGrade(ovr) {
  if (ovr >= 99)      return 'monster';
  if (ovr >= 95)      return 'toty';
  if (ovr >= 89)      return 'icon';
  if (ovr >= 81)      return 'legend';
  if (ovr >= 73)      return 'epic';
  if (ovr >= 63)      return 'rare';
  return 'common';
}

// 등급 상승 감지 (이전 카드 vs 현재 카드)
function isGradeUp(prevGrade, currentGrade) {
  const ORDER = ['common','rare','epic','legend','icon','toty','monster'];
  return ORDER.indexOf(currentGrade) > ORDER.indexOf(prevGrade);
}
// → 등급 상승 시 특별 애니메이션 트리거
```

### 6-4. 카드팩 확률표

| 팩 타입 | COMMON | RARE | EPIC | LEGEND | ICON+ |
|--------|--------|------|------|--------|-------|
| Standard | 60% | 30% | 8% | 1.9% | 0.1% |
| Premium | 0% | 50% | 38% | 10% | 2% |
| Legend | 0% | 0% | 40% | 50% | 10% |
| Mystery | 균등 분배 (각 16.7%) |

---

## 7. 템플릿 판매 구조

### 7-1. 템플릿 티어 체계

| 티어 | 가격 | 특징 | 예시 |
|------|------|------|------|
| **FREE** | 무료 | 기본 FDL 인증카드 1종 | fdl |
| **STANDARD** | ₩4,900 | 단일 구매, 영구 사용 | 승급카드, 클래식 |
| **PREMIUM** | ₩7,900 | 고급 등급 호환, 특수 효과 | Champion, Legend |
| **SEASON** | ₩5,900 | 시즌 기간만 사용 가능 | 2025 Summer Edition |
| **EXCLUSIVE** | ₩14,900 | 아카데미 단위 구매, 로고 삽입 | 아카데미 공식 카드 |
| **BUNDLE** | ₩19,900 | 5종 세트 할인 | 올인원 팩 |

### 7-2. 템플릿 기획 로드맵

#### Phase 1 (MVP) — 무료
| No. | 슬러그 | 이름 | 설명 |
|-----|--------|------|------|
| 1 | fdl | FDL 인증카드 | 그린+다크, 기본 공식 카드 |

#### Phase 2 (출시 + 1개월)
| No. | 슬러그 | 이름 | 가격 | 등급 호환 |
|-----|--------|------|------|----------|
| 2 | promotion | 승급카드 | FREE | COMMON~EPIC |
| 3 | champion | Champion | ₩7,900 | LEGEND~MONSTER |
| 4 | elite | Elite | ₩4,900 | RARE~LEGEND |
| 5 | shadow | Shadow Night | ₩4,900 | EPIC~ICON |

#### Phase 3 (분기별)
| No. | 슬러그 | 이름 | 가격 | 특이사항 |
|-----|--------|------|------|----------|
| 6 | summer25 | 2025 Summer | ₩5,900 | 시즌 한정 (6~8월) |
| 7 | toty25 | TOTY 2025 | ₩9,900 | 연말 한정 |
| 8 | academy_custom | 아카데미 전용 | ₩14,900 | 로고·색상 커스텀 |

### 7-3. 템플릿 config 스펙

```typescript
interface TemplateConfig {
  width: number;          // 400
  height: number;         // 560
  theme: 'dark' | 'light';
  
  // 색상 팔레트
  colors: {
    primary: string;      // 메인 컬러
    secondary: string;    // 서브 컬러
    bg: string;           // 배경
    text: string;         // 텍스트
    accent: string;       // 강조
  };
  
  // 레이아웃 섹션 비율
  layout: {
    header_ratio: number;   // 0~1 (헤더 높이 비율)
    photo_ratio: number;
    info_ratio: number;
    stats_ratio: number;
  };
  
  // 등급별 오버라이드 (선택)
  grade_overrides?: {
    [grade: string]: Partial<TemplateConfig['colors']>;
  };
  
  // 특수 효과
  effects: {
    border_glow: boolean;
    hologram: boolean;
    particles: boolean;
    diagonal_stripe: boolean;
  };
  
  // 스탯 표시 방식
  stats_layout: 'grid_2x3' | 'hexagon' | 'bars' | 'radar';
}
```

### 7-4. 아카데미 커스텀 템플릿 프로세스

```
아카데미 어드민 → 커스텀 템플릿 신청
  → 로고 업로드
  → 색상 선택 (컬러피커)
  → 베이스 템플릿 선택
  → 미리보기 생성
  → 결제 (₩14,900/시즌)
  → 24시간 내 활성화
```

---

## 8. MVP 범위 정의

### 8-1. 현재 구현 상태 (AS-IS)

✅ 완료:
- FDL 인증카드 앞면 (CardCanvas.jsx)
- FDL 인증카드 뒷면 (CardBack.jsx)
- 데모 페이지 (DemoCardPage.jsx)
- AI 배경제거 연동 (기 구현)
- 템플릿 선택 UI (TemplateSelector.jsx)
- Supabase 연동 기반
- Vercel 배포 파이프라인

🔧 진행 중:
- 승급카드 (Promotion) 템플릿

### 8-2. MVP Phase 1 (현재 → 4주)

**목표: 아카데미 1곳이 실제로 쓸 수 있는 수준**

| 기능 | 우선순위 | 예상 공수 |
|------|---------|----------|
| 승급카드 템플릿 완성 | P0 | 1일 |
| 아카데미 가입/로그인 | P0 | 3일 |
| 선수 등록 (이름·포지션·사진) | P0 | 2일 |
| 능력치 입력 → 카드 생성 | P0 | 1일 |
| 카드 공유 링크 생성 | P0 | 1일 |
| 카드 PNG 다운로드 | P0 | 1일 |
| 선수 목록 어드민 페이지 | P1 | 2일 |
| 시즌 카드 발급 어드민 | P1 | 2일 |
| 모바일 반응형 | P1 | 2일 |

### 8-3. MVP Phase 2 (4주 → 8주)

**목표: 재방문 유인 + SNS 바이럴**

| 기능 | 우선순위 |
|------|---------|
| 카드 등급 시스템 (COMMON~LEGEND) | P0 |
| 등급별 시각 효과 (CSS 애니메이션) | P0 |
| 성장 그래프 (시즌 비교) | P1 |
| 인스타 스토리 최적화 이미지 생성 | P1 |
| Champion 템플릿 추가 | P1 |
| MVP 시스템 기본 | P2 |
| 출석 체크 | P2 |

### 8-4. MVP Phase 3 (8주 → 16주)

**목표: 수익화 + 바이럴 엔진**

| 기능 | 우선순위 |
|------|---------|
| 카드팩 개봉 시스템 + 애니메이션 | P0 |
| Stripe/토스페이 결제 연동 | P0 |
| 프리미엄 템플릿 마켓 | P0 |
| 실물 카드 인쇄 주문 연동 | P1 |
| ICON·TOTY·MONSTER 등급 + 연출 | P1 |
| 업적 시스템 | P2 |
| 시즌 한정 템플릿 | P2 |
| 아카데미 커스텀 템플릿 | P2 |

### 8-5. 기술 스택 최종 확정

```
Frontend:     React 18 + Vite 5 (현재) → Next.js 14 (Phase 2 이전)
Canvas:       Konva.js + react-konva (현재 유지)
Animation:    Framer Motion + CSS Animations + Lottie
Styling:      Inline CSS → Tailwind CSS (Phase 2)
Backend:      Supabase (Auth + DB + Storage + Realtime)
AI:           Replicate API (배경제거 기 구현)
Payment:      Toss Payments (국내) + Stripe (해외)
Deploy:       Vercel (현재) + Supabase Edge Functions
Image Export: html2canvas + Konva toDataURL
Push:         Supabase Realtime → 웹 푸시
```

### 8-6. 즉시 실행 우선순위 (다음 1주)

```
Day 1: 승급카드(Promotion) 템플릿 완성 및 배포
Day 2: 아카데미 가입/로그인 페이지
Day 3: 선수 등록 어드민 페이지
Day 4: 카드 생성 → 공유 링크 전체 플로우
Day 5: 모바일 반응형 + QA
```

---

## 부록 A. 카드 디자인 아이덴티티

### 공통 원칙

1. **카드는 항상 400×560px** (2.5:3.5 트레이딩 카드 비율)
2. **폰트**: 헤더/숫자 → 고딕 Bold 계열, 텍스트 → 산세리프
3. **선수 사진**: 항상 AI 배경제거 + 카드 배경에 자연스럽게 합성
4. **아카데미 로고**: 항상 카드 하단 정보 바에 표시
5. **OVR 숫자**: 항상 가장 크게, 등급 색상으로 표현

### 승급카드 (Promotion) 디자인 콘셉트

```
배경: 다크 네이비 (#050B14) — 프리미엄 스포츠 카드 느낌
헤더: 대각선 골드 스트라이프 + 승급/PROMOTION 레이블
OVR:  황금 그라디언트 대형 숫자 (좌측)
사진: 풀블리드 중간 영역
정보: 어두운 바 + 골드 강조 라인
스탯: 3컬럼 × 2행 + 미니 프로그레스 바 (골드)
테두리: 2.5px 골드 + 4 코너 원형 장식
```

---

*이 문서는 FDL CARD 개발 진행에 따라 지속 업데이트됩니다.*
*최종 수정: 2026-05-24*
