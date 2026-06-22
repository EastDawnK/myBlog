# 실적 발표 영향 분석 블로그 프로젝트 문서

## 1. 프로젝트 개요

### 1.1 프로젝트명

실적 발표 영향 분석 블로그

### 1.2 개발 배경

반도체 기업의 실적 발표는 관련 기업의 주가와 투자 판단에 큰 영향을 준다. 특히 마이크론의 실적 발표는 DRAM, NAND, HBM 같은 메모리 반도체 업황을 확인하는 데 중요한 참고 자료가 된다. 한국 시장에서는 마이크론 실적 발표 이후 삼성전자와 SK하이닉스 주가가 영향을 받는 경우가 많기 때문에, 투자자는 실적 내용과 관련 코멘트를 체계적으로 정리할 필요가 있다.

이 프로젝트는 이러한 투자 분석 과정을 블로그 형태로 기록하고 관리하는 웹 서비스이다. 사용자는 마이크론 실적 발표, HBM 수요, DRAM 가격, NAND 업황, 다음 분기 가이던스 등을 분석글로 작성하고, 삼성전자와 SK하이닉스에 대한 예상 영향 점수를 함께 저장할 수 있다. 초기 버전에서는 마이크론 실적이 삼성전자와 SK하이닉스에 미치는 영향을 테스트 사례로 사용하고, 이후에는 다른 기업도 직접 입력하여 기업별 대응 전략을 기록할 수 있도록 설계한다.

프로젝트 주제는 단순 도서관리나 연락처 관리 같은 교재 예제와 겹치지 않도록 설정하였다. 실제 일상생활과 투자 활동에서 활용 가능한 데이터베이스 기반 서비스라는 점에서 프로젝트 요구사항에 적합하다.

### 1.3 개발 목표

이 프로젝트의 목표는 Node.js, Express, EJS, MongoDB를 활용하여 실적 이벤트 분석글을 저장하고 관리하는 웹 블로그 서비스를 구현하는 것이다. 또한 MongoDB Atlas를 사용하여 데이터를 클라우드에 저장하고, Render를 통해 실제 접속 가능한 웹 서비스로 배포하는 것을 목표로 한다.

주요 개발 목표는 다음과 같다.

- MongoDB 기반 분석글 저장 기능 구현
- 분석글 목록, 상세 조회 기능 구현
- 관리자 로그인 기능 구현
- 분석글 작성, 수정, 삭제 기능 구현
- 실적 발표 기업과 영향을 받는 기업 입력 기능 구현
- 기업별 영향 점수와 대응 전략 표시
- Render 배포가 가능한 Node.js 서버 구조 구성
- GitHub, Render, MongoDB Atlas 연동 흐름 적용

### 1.4 주요 사용자

주요 사용자는 반도체 기업 실적 발표와 주가 영향을 기록하고 싶은 개인 투자자 또는 학습자이다. 관리자는 실적 이벤트 분석글을 작성하고 수정하며, 일반 사용자는 작성된 분석글을 조회할 수 있다.

## 2. 시스템 설계

### 2.1 전체 시스템 구조

이 프로젝트는 Node.js Express 기반의 서버 사이드 렌더링 웹 애플리케이션으로 설계한다. 화면은 EJS 템플릿 엔진을 사용하여 구성하고, 게시글 데이터는 MongoDB Atlas에 저장한다. 배포는 Render Web Service를 이용한다.

전체 흐름은 다음과 같다.

```text
사용자 브라우저
  -> Render Web Service
  -> Node.js / Express 서버
  -> Mongoose
  -> MongoDB Atlas
```

각 도구의 역할은 다음과 같다.

```text
VS Code
- 로컬 개발 환경
- 코드 작성 및 실행 테스트

GitHub
- 프로젝트 소스코드 저장소
- Render와 연동되는 배포 기준 저장소

Render
- Node.js 서버 실행
- GitHub push 이후 자동 배포
- 환경변수 관리

MongoDB Atlas
- 분석글과 관리자 계정 저장
- 클라우드 데이터베이스 역할
```

### 2.2 참고 프로젝트 활용 방식

기존 `myBlog` 프로젝트는 Express, EJS, layout, routes, views, public 폴더 구조를 가지고 있으므로 최종 프로젝트의 기본 구조로 사용한다. 블로그형 서비스라는 목적에도 잘 맞기 때문에 `myBlog`를 중심으로 확장한다.

기존 `myContacts` 프로젝트는 라우팅과 HTTP method 처리 예제로 활용한다. 연락처 관리 기능 자체를 가져오지는 않고, 목록 조회, 상세 조회, 등록, 수정, 삭제라는 CRUD 흐름을 분석글 관리 기능에 적용한다.

따라서 최종 설계는 `myBlog`의 폴더 구조와 화면 구성을 기반으로 하고, `myContacts`의 CRUD 라우팅 개념을 참고하는 방식이다.

### 2.3 폴더 구조

최종 프로젝트의 폴더 구조는 다음과 같이 설계한다.

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

`app.js`는 서버 실행, 미들웨어 등록, 라우터 연결을 담당한다. `config/db.js`는 MongoDB 연결 코드를 분리하여 관리한다. `models` 폴더에는 MongoDB 컬렉션 구조를 정의하는 Mongoose 모델을 작성한다. `routes` 폴더는 공개 페이지와 관리자 페이지의 요청 처리를 담당한다. `views` 폴더는 EJS 화면 파일을 관리하고, `public` 폴더는 CSS와 이미지 같은 정적 파일을 관리한다.

## 3. 데이터베이스 및 기능 설계

### 3.1 Company 모델

`Company` 모델은 분석 대상 기업과 영향받는 기업을 관리하기 위한 모델이다. 초기 테스트에서는 마이크론, 삼성전자, SK하이닉스를 등록하고, 이후 다른 기업도 관리자 화면에서 추가할 수 있다.

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

예시는 다음과 같다.

```text
name: Micron Technology
ticker: MU
market: NASDAQ
sector: Memory Semiconductor

name: 삼성전자
ticker: 005930
market: KRX
sector: Memory / Foundry / Mobile

name: SK하이닉스
ticker: 000660
market: KRX
sector: Memory Semiconductor
```

### 3.2 Post 모델

`Post` 모델은 실적 이벤트 분석글을 저장하는 핵심 모델이다. 일반 블로그 게시글 필드에 반도체 실적 분석에 필요한 점수와 코멘트 필드를 추가한다.

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

주요 필드의 의미는 다음과 같다.

```text
title
- 분석글 제목

summary
- 목록 화면에서 보여줄 짧은 요약

body
- 상세 분석 내용

influencing_company
- 실적이나 이벤트를 통해 다른 기업에 영향을 주는 기업
- 예: Micron Technology

eventType
- Earnings, Guidance, HBM, DRAM, NAND 등 이벤트 유형

influencing_score
- 영향을 주는 기업의 실적이나 이벤트 자체에 대한 평가 점수

affected_companies
- influencing_company의 이벤트로 영향을 받을 수 있는 기업 목록
- 예: 삼성전자, SK하이닉스, 다른 반도체 기업

affected_company
- 영향을 받는 기업명

impact_score
- 영향을 받는 기업에 대한 예상 영향 점수

strategy
- 영향을 받는 기업에 대한 대응 전략
- 예: 관망, 분할매수, 비중축소, 보유

hbmComment, dramComment, nandComment, guidanceComment
- 실적 발표에서 확인한 세부 업황 코멘트
```

이 구조를 사용하면 마이크론을 `influencing_company`로 선택하고 삼성전자와 SK하이닉스를 `affected_company`로 등록할 수 있다. 이후 브로드컴, 엔비디아, TSMC, ASML 등 다른 기업도 같은 방식으로 입력하여 대응 전략을 기록할 수 있다.

### 3.3 User 모델

`User` 모델은 관리자 로그인을 위해 사용한다.

```js
{
  username: String,
  password: String
}
```

비밀번호는 보안을 위해 bcrypt로 암호화하여 저장한다. 시간이 부족한 경우에는 MongoDB Atlas에서 관리자 계정 document를 직접 생성할 수 있다. 이 경우에도 비밀번호는 평문이 아니라 bcrypt 해시값으로 저장한다.

### 3.4 주요 기능

공개 사용자는 분석글 목록과 상세 페이지를 조회할 수 있다. 관리자는 로그인 후 분석글을 작성, 수정, 삭제할 수 있다.

공개 페이지 기능은 다음과 같다.

```text
GET /              메인 페이지, 최신 분석글 표시
GET /about         프로젝트 소개 페이지
GET /posts         전체 분석글 목록
GET /posts/:id     분석글 상세 페이지
```

관리자 페이지 기능은 다음과 같다.

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

HTML form은 기본적으로 `GET`과 `POST`를 안정적으로 지원하므로, 수정과 삭제도 `POST` 방식으로 처리한다. 이는 제한된 개발 시간 안에서 기능을 안정적으로 완성하기 위한 선택이다.

### 3.5 화면 구성

메인 페이지는 프로젝트 목적이 바로 드러나도록 최신 분석글과 주요 영향 점수를 보여준다.

```text
실적 발표 영향 분석 블로그

최근 분석글
- 마이크론 Q3 실적 발표 Preview
  실적 발표 기업: Micron Technology
  영향을 받는 기업: 삼성전자 62 / SK하이닉스 78
  대응 전략: 삼성전자 관망, SK하이닉스 보유
  핵심 키워드: HBM, DRAM, Guidance
```

목록 페이지는 제목, 요약, 이벤트 유형, 실적 발표 기업, 영향을 받는 기업별 점수와 대응 전략을 표시한다. 상세 페이지는 분석 본문과 함께 HBM, DRAM, NAND, 가이던스 코멘트를 구분해서 보여준다.

관리자 페이지는 분석글과 기업 목록을 관리하는 기능에 집중한다. 관리자는 로그인 후 대시보드에서 전체 글을 확인하고, 새 글 작성, 기존 글 수정, 삭제를 수행할 수 있다. 또한 기업 관리 화면에서 새로운 기업명, 티커, 시장, 섹터를 입력할 수 있다.

## 4. 배포 및 구현 계획

### 4.1 배포 구조

배포는 수업 자료의 `16_Deploy.pdf` 흐름에 맞춰 GitHub, Render, MongoDB Atlas를 사용한다. 로컬에서 코드를 작성하고 GitHub에 push하면, Render가 GitHub 저장소를 감지하여 자동으로 다시 배포한다. 데이터는 MongoDB Atlas에 저장되므로 Render 서버가 재시작되어도 유지된다.

Render 배포를 위해 `app.js`에서는 고정 포트 대신 환경변수 기반 포트를 사용한다.

```js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

환경변수는 로컬 `.env` 파일과 Render Environment Variables에 각각 설정한다.

```text
MONGODB_URI=mongodb+srv://...
SESSION_SECRET=your-session-secret
```

`.env` 파일은 민감정보를 포함하므로 GitHub에 올리지 않는다. `.gitignore`에는 다음 항목을 포함한다.

```text
node_modules
.env
npm-debug.log*
```

`package.json`에는 Render에서 서버를 실행할 수 있도록 start script를 추가한다.

```json
{
  "scripts": {
    "start": "node app.js"
  }
}
```

Render 설정값은 다음과 같다.

```text
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### 4.2 구현 우선순위

개발 시간이 4시간으로 제한되어 있으므로, 외부 금융 API 연동보다 MongoDB CRUD와 배포 안정성을 우선한다.

구현 순서는 다음과 같다.

```text
1. myBlog 구조 정리
2. package.json start script 추가
3. 필요한 패키지 설치
4. MongoDB 연결 코드 작성
5. Company, Post, User 모델 생성
6. 공개 글 목록/상세 조회 구현
7. 관리자 로그인 구현
8. 기업 입력 기능 구현
9. 분석글 작성/수정/삭제 구현
10. EJS 화면과 CSS 정리
11. MongoDB Atlas 연결 테스트
12. GitHub push
13. Render 배포 및 Logs 확인
```

### 4.3 제외 범위

Yahoo Finance API, Trading Economics API, 실시간 주가 데이터 표시, 자동 점수 계산 모델, 복잡한 차트 시각화는 이번 구현 범위에서 제외한다. 이러한 기능은 서비스 확장 가능성은 있지만, 4시간 안에 안정적으로 구현하고 배포하기에는 범위가 크다.

이번 프로젝트에서는 기업명, 분석 점수, 대응 전략, 코멘트를 관리자가 직접 입력하는 방식으로 구현한다. 이를 통해 데이터베이스 저장, 조회, 수정, 삭제 기능을 명확하게 보여줄 수 있고, Render 배포 안정성도 확보할 수 있다.

### 4.4 기대 효과

이 프로젝트를 통해 Node.js와 Express를 사용한 웹 서버 구성, EJS 기반 화면 렌더링, MongoDB Atlas를 활용한 데이터 저장, 관리자 기능 구현, Render 배포 과정을 종합적으로 학습할 수 있다.

또한 단순 예제형 서비스가 아니라 실제 투자 분석 상황에서 활용할 수 있는 주제를 선택함으로써, 데이터베이스가 실생활 서비스에서 어떻게 활용될 수 있는지 보여줄 수 있다.

## 5. 결론

실적 발표 영향 분석 블로그는 특정 기업의 실적 발표가 관련 기업에 미치는 영향을 분석글 형태로 저장하고 관리하는 MongoDB 기반 웹 서비스이다. 마이크론 실적 발표와 삼성전자, SK하이닉스 영향 분석은 예시 사례로 사용하며, 기업 입력 기능을 통해 이후 다른 기업의 실적 발표와 관련 기업 대응 전략도 추가할 수 있다. `myBlog`의 Express/EJS 블로그 구조를 기반으로 하고, `myContacts`의 CRUD 라우팅 개념을 참고하여 설계한다.

프로젝트의 핵심은 외부 API 자동화보다 MongoDB를 활용한 게시글 관리 기능과 Render 배포 안정성이다. 따라서 분석글 목록, 상세 조회, 관리자 로그인, 작성, 수정, 삭제 기능을 우선 구현한다.

최종적으로 이 서비스는 프로젝트 요구사항인 데이터베이스 활용, 자유 주제 선정, Render 배포를 모두 충족하는 웹 애플리케이션으로 완성하는 것을 목표로 한다.
