# Spenny
#### 수입/지출을 기록하고 소비 패턴을 분석해 다양한 서비스를 제공하는 개인 자산 관리 웹 어플리케이션입니다
<a href="https://spenny.vercel.app">
  <img width="1200" alt="spenny-intro" src="https://github.com/user-attachments/assets/bff263ed-6613-4c38-a329-21a5695e124b" />
</a>
(이미지 클릭 시 배포 사이트로 이동합니다)

## Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![date-fns](https://img.shields.io/badge/date--fns-770C56?style=for-the-badge&logo=date-fns&logoColor=white)

### Backend
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Next.js API](https://img.shields.io/badge/Next.js_API_Routes-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
## Features

### 가계부 관리
수입/지출 거래 기록 및 조회, 카테고리별 분류 및 검색, 캘린더 뷰로 월별 거래 현황 확인, OCR 영수증 자동 인식

| 홈화면(가계부) | 홈화면(캘린더) | 캘린더 일자별 가계부 |
|------|------|------|
| <img width="300" alt="spenny (6)" src="https://github.com/user-attachments/assets/a5a0da49-3500-4025-9a36-e78b56bd6a12" />| <img width="300" alt="spenny (9)" src="https://github.com/user-attachments/assets/5eda18e0-4fca-4fb4-8909-96d864707a7c" />| <img width="300" alt="spenny (14)" src="https://github.com/user-attachments/assets/19009f59-de6f-46cc-8837-9e702802b0bd" />|

|가계부 작성 폼 |영수증 업로드 |OCR 영수증 자동인식 |
|------|------|------|
| <img width="300" alt="spenny (13)" src="https://github.com/user-attachments/assets/555409f9-d552-44a2-aa43-3cfaf3f0c9c2" /> | <img width="300" alt="spenny (15)" src="https://github.com/user-attachments/assets/f9ad9a62-c4db-40c8-b33f-deb7123c21cf" /> | <img width="300" alt="spenny (16)" src="https://github.com/user-attachments/assets/7e6ec99c-ebfa-44e9-9308-9b2750a29fe8" /> |

### 일일 지출 추천
월별 예산과 고정비를 고려한 일일 지출 권장액 계산, 실시간 차트로 예산 대비 지출 현황 시각화

|일일 지출 추천 |산정 기준 및 소비패턴|
|------|------|
|<img width="300" alt="localhost_3000_" src="https://github.com/user-attachments/assets/00c81070-ad17-4abf-b8e8-66f1412b247b" />|<img width="300" alt="localhost_3000_ (1)" src="https://github.com/user-attachments/assets/51845e2b-fd46-4b6e-a497-cbc35c786df8" /> |




### 고정비 관리
월세, 구독료 등 정기적 지출 자동 등록, 반복 주기 설정

| 고정비 리스트| 고정비 추가|
|------|------|
| <img width="300" alt="spenny (17)" src="https://github.com/user-attachments/assets/4ce9d9b1-0f43-41aa-a733-9c6fc1d1cade" /> | <img width="300" alt="spenny (12)" src="https://github.com/user-attachments/assets/a2d063bf-012a-4ade-a617-65ab55dbbfad" />|

### 예산 관리
카테고리별 예산 설정, 예산 템플릿 제공, 예산 대비 실제 지출 비교 분석

|예산 열람 | 자동 예산 산정|
|------|------|
| <img width="300" alt="spenny (5)" src="https://github.com/user-attachments/assets/158cdaff-3a58-49ba-aef3-5c5ddcf0e546" />| <img width="5028" height="1868" alt="Group 2" src="https://github.com/user-attachments/assets/3c1dfe58-4058-4b93-b909-43e7201523ed" /> |

### 분석 및 리포트
월별/카테고리별 지출 분석, 차트를 통한 시각적 데이터 제공

|수입 분석 |지출 분석 |
|------|------|
| <img width="300" alt="spenny (10)" src="https://github.com/user-attachments/assets/f305d156-4b91-44e2-8a2d-3f9a7046e672" /> | <img width="300" alt="spenny (11)" src="https://github.com/user-attachments/assets/b2660f87-81e9-44de-b7cf-7c712bb435e6" /> |

## Project Structure
```
src/
├── app/
│   ├── (app)/           # 인증된 사용자 페이지
│   │   ├── analysis/    # 지출 분석 페이지
│   │   ├── budget/      # 예산 관리 페이지
│   │   ├── fixed-costs/ # 고정비 관리 페이지
│   │   ├── history/     # 거래 내역
│   │   └── onboarding/  # 온보딩
│   ├── (auth)/          # 인증 페이지
│   └── api/             # API Routes
├── components/          # React 컴포넌트
├── hooks/               # Custom Hooks
├── stores/              # Tanstack Query Client
├── types/               # TypeScript 타입 정의
└── utils/               # 유틸리티 함수
```

##  팀원 및 담당 기능
### 개발 기간
`2025.12.22`~`2026.02.05`


### 김형진

#### 거래내역 관리
- 거래내역 CRUD 기능 구현
- 거래 입력 폼 유효성 검증 및 공통 컴포넌트화
- 거래내역 필터링 및 검색 UI

#### 캘린더
- 반응형 월별 캘린더 구현
- 일자별 총 수입/지출 표시 및 거래내역 관리

#### 영수증 OCR
- OpenAI GPT-4o mini 기반 영수증 OCR API 구현
- 한국 영수증 인식 및 연도 추론 프롬프팅
- 다중 영수증 스캔 UI (카메라 촬영, 드래그 앤 드롭)
- 배치 OCR 비동기 처리를 통한 API 최적화
- OCR 결과 편집 및 선택적 등록 기능

#### 통합 및 최적화
- 홈 화면 통합 (거래내역/캘린더 탭, Floating Button)
- 초기 데이터 페칭 아키텍처 설계 (서버/클라이언트 컴포넌트 분리)
- 월별 데이터 클라이언트 캐싱 및 useMemo 활용 최적화

---

### 정윤진

#### 공통 UI
- Header, Navigation, Footer 공통 레이아웃
- 반응형 패널 컴포넌트 (모바일 Drawer / 데스크탑 Sheet)

#### 분석 페이지
- **월별 분석**: 총 사용 금액, 전월 대비 증감
- **주간 분석**: 지출/수입 라인 차트 및 거래 리스트
- **카테고리별 분석**: 도넛 차트 시각화 및 거래 리스트

#### 예산 페이지
- **예산 관리**: 총 예산 및 카테고리 예산 CRUD
- **예산 현황**: 총 예산/현재 지출/고정비/남은 예산 요약
- **시각화**: Progress Bar, 예산 초과 피드백 UI
- **예산 추천 시스템** (4단계)
  - 최근 3개월 소비 패턴 분석 (Essential/Flexible 그룹)
  - 수입 및 저축 목표 기반 가용 예산 산출
  - 템플릿 기반 예산 설계 (유지형/절감형/강력절약형)
  - 그룹 → 카테고리 예산 자동 분배
  - 진행 상태 및 입력 데이터 유지

---

### 최아로인

#### 인증/인가
- Supabase 기반 OAuth 인증 (Google/Kakao)
- 게스트 로그인 기능 및 데모 데이터 구조
- Supabase RLS 정책을 통한 게스트 데이터 접근 제한

#### 온보딩 및 프로필
- 신규 사용자 온보딩 페이지
- MyInfo 패널 (프로필 조회/수정)

#### 고정비 관리
- 월·주 단위 반복 지출 규칙 CRUD
- 고정비 규칙 기반 월별 거래 자동 생성

#### 일일 권장 사용 금액 추천
- 월 예산, 고정비, 실제 지출 기반 **가변 지출 분리 계산**
- 평일/주말, 월 초·중·말 소비 패턴 가중치 적용
- 과도한 변동 방지 (상·하한 처리)
- UI 차트 및 안내 문구 연동
## Getting Started
```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# 빌드
yarn build

# 프로덕션 실행
yarn start
```
