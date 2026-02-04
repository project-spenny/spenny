# Spenny
<img width="1200" alt="spenny-intro" src="https://github.com/user-attachments/assets/bff263ed-6613-4c38-a329-21a5695e124b" />

## Features

### 가계부 관리
수입/지출 거래 기록 및 조회, 카테고리별 분류 및 검색, 캘린더 뷰로 월별 거래 현황 확인, OCR 영수증 자동 인식

| 홈화면(가계부) | 홈화면(캘린더) | 캘린더 일자별 가계부 |
|------|------|------|
| <img width="300" alt="spenny (6)" src="https://github.com/user-attachments/assets/a5a0da49-3500-4025-9a36-e78b56bd6a12" />| <img width="300" alt="spenny (9)" src="https://github.com/user-attachments/assets/5eda18e0-4fca-4fb4-8909-96d864707a7c" />| <img width="300" alt="spenny (14)" src="https://github.com/user-attachments/assets/19009f59-de6f-46cc-8837-9e702802b0bd" />|
| 설명 입력 | 설명 입력 | 설명 입력 |

|가계부 작성 폼 |영수증 업로드 |OCR 영수증 자동인식 |
|------|------|------|
| <img width="300" alt="spenny (13)" src="https://github.com/user-attachments/assets/555409f9-d552-44a2-aa43-3cfaf3f0c9c2" /> | <img width="300" alt="spenny (15)" src="https://github.com/user-attachments/assets/f9ad9a62-c4db-40c8-b33f-deb7123c21cf" /> | <img width="300" alt="spenny (16)" src="https://github.com/user-attachments/assets/7e6ec99c-ebfa-44e9-9308-9b2750a29fe8" /> |

### 일일 지출 추천
월별 예산과 고정비를 고려한 일일 지출 권장액 계산, 실시간 차트로 예산 대비 지출 현황 시각화

|일일 지출 추천 |산정 기준 및 소비패턴|
|------|------|
| <img width="300" alt="spenny (8)" src="https://github.com/user-attachments/assets/09467e48-f569-473d-a339-e7dca0b79012" /> |<img width="300" alt="spenny (8)" src="https://github.com/user-attachments/assets/305645b7-8e4f-46e6-ae2a-47e2968a9191" />|


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
