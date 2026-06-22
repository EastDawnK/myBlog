# 실적 발표 영향 분석 블로그 설계 문서

## 1. 프로젝트 개요

### 프로젝트명

실적 발표 영향 분석 블로그

### 개발 목적

이 프로젝트는 마이크론, 삼성전자, SK하이닉스 등 반도체 기업의 실적 발표 이벤트를 기록하고 분석하기 위한 MongoDB 기반 웹 블로그 서비스이다.

마이크론 실적 발표는 DRAM, NAND, HBM 업황을 파악하는 데 중요한 참고 지표가 될 수 있다. 이 서비스는 초기에는 마이크론 실적이 삼성전자와 SK하이닉스에 미치는 영향을 테스트 사례로 다룬다. 이후에는 관리자가 다른 기업도 직접 입력하여, 특정 기업 이벤트가 여러 기업에 어떤 영향을 주는지 기록하고 대응 전략을 관리할 수 있도록 설계한다.

### 프로젝트 선정 이유

프로젝트 개요 자료의 요구사항은 일상생활에서 데이터베이스를 활용할 수 있는 자유 주제를 선정하고, Render에 배포된 MongoDB 기반 서비스를 제출하는 것이다.

이 프로젝트는 단순 도서관리나 연락처 관리가 아니라, 투자자가 실제로 사용할 수 있는 반도체 실적 이벤트 기록 서비스를 주제로 한다. 사용자는 실적 이벤트별로 분석글을 작성하고, 기업별 영향 점수와 핵심 코멘트를 MongoDB에 저장할 수 있다.

### 핵심 기능

- 반도체 실적 이벤트 분석글 목록 조회
- 분석글 상세 조회
- 관리자 로그인
- 분석글 작성
- 분석글 수정
- 분석글 삭제
- 기업 입력 및 관리
- 실적 발표 기업과 영향을 받는 기업별 점수 관리
- 기업별 대응 전략 관리
- HBM, DRAM, NAND, 가이던스 코멘트 관리
- MongoDB Atlas에 데이터 저장
- Render를 통한 웹 서비스 배포

## 2. 참고 프로젝트 반영 방식

### myBlog 반영

`myBlog`는 Express, EJS, layout, routes, views, public 폴더 구조를 이미 가지고 있으므로 최종 프로젝트의 기본 구조로 사용한다.

반영할 요소는 다음과 같다.

- `app.js` 기반 Express 서버 구조
- `express-ejs-layouts` 기반 레이아웃 구조
- `views/layouts/main.ejs` 공통 레이아웃
- `routes/main.js` 라우팅 분리 방식
- `public/css/style.css` 정적 파일 관리 방식
- 블로그형 화면 구성

### myContacts 반영

`myContacts`는 데이터베이스 기반 완성 프로젝트라기보다 Express 라우팅과 HTTP method 사용 예제에 가깝다. 따라서 폴더 구조 전체를 가져오기보다는 CRUD 라우팅 흐름만 참고한다.

반영할 요소는 다음과 같다.

- `GET /items` 형태의 목록 조회
- `POST /items` 형태의 등록 처리
- `GET /items/:id` 형태의 상세 조회
- `PUT`, `DELETE` 개념을 블로그 글 수정/삭제 기능에 적용

다만 HTML form은 기본적으로 `GET`, `POST`만 안정적으로 지원하므로, 4시간 구현 범위에서는 수정과 삭제도 `POST` 방식으로 처리한다.

## 3. 최종 폴더 구조

```text
myBlog/
  app.js
  package.json
  .env
  .gitignore

  config/
    db.js

  models/
    Post.js
    User.js
    Company.js

  routes/
    main.js
    posts.js
    admin.js
    companies.js

  views/
    layouts/
      main.ejs
    index.ejs
    about.ejs
    posts/
      list.ejs
      detail.ejs
    admin/
      login.ejs
      dashboard.ejs
      new.ejs
      edit.ejs
      companies.ejs

  public/
    css/
      style.css
    img/
```

## 4. 시스템 구조

### 전체 아키텍처

```text
사용자 브라우저
  -> Render Web Service
  -> Node.js / Express App
  -> Mongoose
  -> MongoDB Atlas
```

### 역할 분담

```text
VS Code
- 로컬 개발 환경
- 코드 작성 및 테스트

GitHub
- 프로젝트 코드 저장소
- Render 배포 연동 대상

Render
- Node.js 서버 실행
- GitHub push 감지 후 자동 배포
- 환경변수 관리

MongoDB Atlas
- 게시글과 사용자 계정 저장
- Render 서버에서 접속하는 클라우드 데이터베이스
```

## 5. 데이터베이스 설계

### Company 모델

분석에 사용할 기업 정보를 저장하는 컬렉션이다. 마이크론, 삼성전자, SK하이닉스를 기본 테스트 기업으로 등록하고, 이후 다른 기업도 추가할 수 있다.

```js
{
  name: String,
  ticker: String,
  market: String,
  sector: String,
  memo: String,

  createdAt: Date,
  updatedAt: Date
}
```

### Post 모델

분석글과 실적 이벤트 정보를 저장하는 핵심 컬렉션이다.

```js
{
  title: String,
  summary: String,
  body: String,

  influencing_company: String,
  influencing_ticker: String,
  eventType: String,
  eventDate: Date,

  influencing_score: Number,
  affected_companies: [
    {
      affected_company: String,
      affected_ticker: String,
      impact_score: Number,
      strategy: String,
      comment: String
    }
  ],

  hbmComment: String,
  dramComment: String,
  nandComment: String,
  guidanceComment: String,

  sourceUrl: String,

  createdAt: Date,
  updatedAt: Date
}
```

### 주요 필드 설명

```text
title
- 분석글 제목

summary
- 목록 화면에 표시할 요약문

body
- 상세 분석 본문

influencing_company
- 실적이나 이벤트를 통해 다른 기업에 영향을 주는 기업

eventType
- Earnings, Guidance, HBM, DRAM, NAND 등 이벤트 유형

influencing_score
- 영향을 주는 기업의 이벤트 자체에 대한 평가 점수

affected_companies
- influencing_company의 이벤트로 영향을 받을 수 있는 기업 목록

affected_company
- 영향을 받는 기업명

impact_score
- 영향을 받는 기업별 예상 영향 점수

strategy
- 영향을 받는 기업별 대응 전략

hbmComment, dramComment, nandComment, guidanceComment
- 세부 업황 코멘트
```

### User 모델

관리자 로그인을 위한 계정 정보 컬렉션이다.

```js
{
  username: String,
  password: String
}
```

비밀번호는 평문 저장을 피하고 bcrypt로 암호화한다. 시간이 부족하면 `16_Deploy.pdf` 방식처럼 MongoDB Atlas에서 관리자 계정 document를 직접 생성할 수 있다.

## 6. 라우팅 설계

### 공개 페이지

```text
GET /                    최신 분석글이 보이는 메인 페이지
GET /about               프로젝트 소개 페이지
GET /posts               전체 분석글 목록
GET /posts/:id           분석글 상세 페이지
```

### 관리자 페이지

```text
GET  /admin/login              관리자 로그인 화면
POST /admin/login              관리자 로그인 처리
POST /admin/logout             로그아웃 처리

GET  /admin                    관리자 대시보드
GET  /admin/posts/new          분석글 작성 화면
POST /admin/posts              분석글 저장

GET  /admin/posts/:id/edit     분석글 수정 화면
POST /admin/posts/:id/edit     분석글 수정 처리
POST /admin/posts/:id/delete   분석글 삭제 처리

GET  /admin/companies           기업 목록 관리 화면
POST /admin/companies           기업 추가 처리
POST /admin/companies/:id/delete 기업 삭제 처리
```

## 7. 화면 설계

### 메인 페이지

메인 페이지는 평가자가 프로젝트 목적을 바로 이해할 수 있도록 최신 분석글과 주요 점수를 보여준다.

```text
실적 발표 영향 분석 블로그

최근 분석글
- 마이크론 Q3 실적 발표 Preview
  실적 발표 기업: Micron Technology
  영향을 받는 기업: 삼성전자 62 / SK하이닉스 78
  대응 전략: 삼성전자 관망 / SK하이닉스 보유
  핵심 키워드: HBM, DRAM, Guidance
```

### 목록 페이지

분석글 목록에는 제목, 요약, 이벤트 유형, 실적 발표 기업, 영향을 받는 기업별 점수와 대응 전략을 표시한다.

### 상세 페이지

상세 페이지는 다음 정보를 표시한다.

```text
제목
이벤트 날짜
실적 발표 기업
이벤트 유형

실적 발표 이벤트 평가 점수
영향을 받는 기업별 점수
영향을 받는 기업별 대응 전략

HBM 코멘트
DRAM 코멘트
NAND 코멘트
가이던스 코멘트

본문 분석
참고 링크
```

### 관리자 페이지

관리자 페이지에서는 저장된 분석글 목록을 확인하고, 작성/수정/삭제 작업을 수행한다. 기업 관리 화면에서는 기업명, 티커, 시장, 섹터를 입력해 새로운 분석 대상 기업을 추가할 수 있다.

## 8. 배포 설계

`16_Deploy.pdf` 기준에 맞춰 Render와 MongoDB Atlas 기반으로 배포한다.

### app.js 포트 설정

Render는 서버 포트를 직접 지정하므로, 고정 포트만 사용하면 배포 후 실행에 실패할 수 있다.

```js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### 환경변수

로컬 `.env` 파일에는 다음 값을 저장한다.

```text
MONGODB_URI=mongodb+srv://...
SESSION_SECRET=your-session-secret
```

Render 대시보드의 Environment Variables에도 동일한 key를 등록한다.

```text
MONGODB_URI
SESSION_SECRET
```

### .gitignore

민감정보와 불필요한 파일은 GitHub에 올리지 않는다.

```text
node_modules
.env
npm-debug.log*
```

### package.json

Render에서 실행할 수 있도록 start script를 설정한다.

```json
{
  "scripts": {
    "start": "node app.js"
  }
}
```

### Render 설정

```text
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

## 9. 구현 우선순위

4시간 안에 안정적으로 완성하기 위해 다음 순서로 구현한다.

```text
1. myBlog 구조 정리
2. package.json start script 추가
3. mongoose, express-session, connect-mongo, bcrypt 설치
4. config/db.js 생성
5. Company, Post, User 모델 생성
6. 공개 글 목록/상세 조회 구현
7. 관리자 로그인 구현
8. 기업 입력 기능 구현
9. 글 작성/수정/삭제 구현
10. EJS 화면과 CSS 정리
11. MongoDB Atlas 연결 테스트
12. GitHub push
13. Render 배포 및 Logs 확인
```

## 10. 4시간 개발 계획

```text
0:00 - 0:30
- 기존 myBlog 구조 확인
- 필요한 패키지 설치
- DB 연결 코드 작성

0:30 - 1:20
- Company, Post 모델 작성
- posts 라우트 작성
- 목록/상세 페이지 구현

1:20 - 2:20
- 관리자 로그인 구현
- admin 라우트 작성
- 기업 입력 기능 구현
- 작성/수정/삭제 구현

2:20 - 3:10
- EJS 화면 구성
- CSS 정리
- 샘플 데이터 입력

3:10 - 3:40
- 로컬 실행 테스트
- MongoDB Atlas 연결 확인

3:40 - 4:00
- GitHub push
- Render 배포
- Logs 확인
```

## 11. 제외 범위

다음 기능은 좋은 아이디어이지만 4시간 구현 범위에서는 제외한다.

```text
Yahoo Finance API 자동 연동
Trading Economics API 자동 연동
실시간 주가 데이터 표시
자동 점수 계산 모델
복잡한 차트 시각화
댓글 기능
회원가입 기능
```

대신 기업명, 분석 점수, 대응 전략, 코멘트는 관리자가 직접 입력하는 방식으로 구현한다. 이렇게 하면 MongoDB 활용, CRUD 기능, 배포 안정성을 우선 확보할 수 있다.

## 12. 최종 결론

이 프로젝트는 `myBlog`의 Express/EJS 블로그 구조를 기반으로 하고, `myContacts`의 CRUD 라우팅 개념을 참고해 구현한다.

주제는 교재 예제와 겹치지 않는 실적 발표 영향 분석 블로그로 선정한다. 서비스의 핵심은 사용자가 특정 기업의 실적 발표와 관련된 분석글을 작성하고, 영향을 받는 관련 기업에 대한 예상 영향 점수와 대응 전략을 MongoDB에 저장하고 조회하는 것이다. 마이크론, 삼성전자, SK하이닉스는 예시 사례이며, 기업 입력 기능을 통해 이후 다른 기업의 실적 발표 분석으로 확장할 수 있다.

배포는 `16_Deploy.pdf` 기준에 맞춰 GitHub, Render, MongoDB Atlas 구조로 진행한다. 평가 기준인 Render 배포 안정성과 데이터베이스 활용을 만족시키기 위해 외부 금융 API 연동보다 MongoDB CRUD 완성도를 우선한다.
