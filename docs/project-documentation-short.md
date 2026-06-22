# 실적 발표 영향 분석 블로그 프로젝트 문서

## 1. 프로젝트 개요

### 1.1 프로젝트명

실적 발표 영향 분석 블로그

### 1.2 개발 배경 및 목적

기업의 실적 발표는 같은 산업, 공급망, 경쟁 관계에 있는 다른 기업의 주가와 투자 판단에 영향을 줄 수 있다. 예를 들어 마이크론의 실적 발표는 DRAM, NAND, HBM 등 메모리 반도체 업황을 확인하는 데 중요한 참고 자료가 되고, 삼성전자와 SK하이닉스 같은 관련 기업의 투자 판단에도 영향을 줄 수 있다. 따라서 실적 발표 기업과 영향을 받는 기업을 구분해 이벤트별 영향과 대응 전략을 체계적으로 기록할 필요가 있다.

본 프로젝트는 특정 기업의 실적 발표가 관련 기업에 미치는 영향을 분석글 형태로 저장하고 관리하는 MongoDB 기반 웹 블로그 서비스이다. 마이크론이 삼성전자와 SK하이닉스에 미치는 영향은 예시 사례로 사용하고, 이후에는 어떤 기업이든 직접 입력하여 다양한 기업 간 영향 관계와 대응 전략을 기록할 수 있도록 설계한다.

### 1.3 주요 기능

- 실적 발표 영향 분석글 목록 조회
- 분석글 상세 조회
- 관리자 로그인
- 분석글 작성, 수정, 삭제
- 실적 발표 기업과 영향을 받는 기업 입력
- 기업별 영향 점수와 대응 전략 저장
- MongoDB Atlas 데이터 저장
- Render를 통한 웹 서비스 배포

## 2. 시스템 설계

### 2.1 전체 구조

이 프로젝트는 Node.js와 Express를 기반으로 한 서버 사이드 렌더링 웹 애플리케이션이다. 화면은 EJS 템플릿 엔진으로 구성하고, 게시글과 기업 정보는 MongoDB Atlas에 저장한다. 배포는 Render Web Service를 사용한다.

```text
사용자 브라우저
  -> Render Web Service
  -> Node.js / Express 서버
  -> Mongoose
  -> MongoDB Atlas
```

### 2.2 참고 프로젝트 활용

기존 `myBlog` 프로젝트는 Express, EJS, layout, routes, views, public 폴더 구조를 가지고 있으므로 최종 프로젝트의 기본 구조로 사용한다. 블로그형 서비스라는 목적에 적합하기 때문에 화면 구성과 라우팅 분리 방식을 주로 참고한다.

기존 `myContacts` 프로젝트는 CRUD 라우팅 흐름을 참고한다. 목록 조회, 상세 조회, 등록, 수정, 삭제 기능을 분석글 관리 기능에 적용한다.

### 2.3 폴더 구조

```text
myBlog/
  app.js
  package.json
  .env
  .gitignore

  config/
    db.js

  models/
    Company.js
    Post.js
    User.js

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
```

`app.js`는 서버 실행과 미들웨어 설정을 담당한다. `config/db.js`는 MongoDB 연결을 담당한다. `models`는 데이터 구조를 정의하고, `routes`는 요청 처리를 담당한다. `views`는 EJS 화면 파일을 관리한다.

## 3. 데이터베이스 및 기능 설계

### 3.1 Company 모델

`Company` 모델은 분석에 사용할 기업 정보를 저장한다. 실적 발표 기업과 영향을 받는 기업을 모두 등록할 수 있으며, 마이크론, 삼성전자, SK하이닉스는 예시 테스트 기업으로 사용할 수 있다.

```js
{
  name: String,
  ticker: String,
  market: String,
  sector: String,
  memo: String
}
```

### 3.2 Post 모델

`Post` 모델은 실적 발표 영향 분석글을 저장하는 핵심 모델이다. `influencing_company`는 실적 발표나 가이던스 이벤트를 발생시킨 기업이고, `affected_companies`는 그 이벤트로 영향을 받는 관련 기업 목록이다.

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
  sourceUrl: String
}
```

예를 들어 마이크론 실적 발표를 `influencing_company`로 입력하고, 삼성전자와 SK하이닉스를 `affected_companies`에 등록할 수 있다. 같은 방식으로 엔비디아, TSMC, 애플 등 다른 기업의 실적 발표도 분석할 수 있다. 각 기업에는 영향 점수, 대응 전략, 코멘트를 함께 저장한다.

### 3.3 User 모델

`User` 모델은 관리자 로그인을 위해 사용한다.

```js
{
  username: String,
  password: String
}
```

비밀번호는 bcrypt로 암호화하여 저장한다.

### 3.4 주요 라우트

```text
GET  /                    메인 페이지
GET  /posts               분석글 목록
GET  /posts/:id           분석글 상세

GET  /admin/login         관리자 로그인
POST /admin/login         로그인 처리
GET  /admin               관리자 대시보드

GET  /admin/posts/new     분석글 작성 화면
POST /admin/posts         분석글 저장
GET  /admin/posts/:id/edit 분석글 수정 화면
POST /admin/posts/:id/edit 분석글 수정 처리
POST /admin/posts/:id/delete 분석글 삭제 처리

GET  /admin/companies     기업 관리 화면
POST /admin/companies     기업 추가
```

## 4. 배포 및 구현 계획

### 4.1 배포 방식

배포는 수업 자료의 흐름에 맞춰 GitHub, Render, MongoDB Atlas를 사용한다. 로컬에서 개발한 코드를 GitHub에 push하면 Render가 이를 감지하여 자동으로 배포한다. 데이터는 MongoDB Atlas에 저장되므로 서버가 재시작되어도 유지된다.

Render 배포를 위해 `app.js`에서는 환경변수 기반 포트를 사용한다.

```js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

환경변수는 로컬 `.env`와 Render Environment Variables에 등록한다.

```text
MONGODB_URI=mongodb+srv://...
SESSION_SECRET=your-session-secret
```

`.gitignore`에는 다음 항목을 포함한다.

```text
node_modules
.env
npm-debug.log*
```

`package.json`에는 Render 실행을 위한 start script를 추가한다.

```json
{
  "scripts": {
    "start": "node app.js"
  }
}
```

Render 설정은 다음과 같다.

```text
Build Command: npm install
Start Command: npm start
```

### 4.2 구현 우선순위

개발 시간이 제한되어 있으므로 외부 금융 API 연동보다 MongoDB CRUD와 배포 안정성을 우선한다.

```text
1. MongoDB 연결
2. Company, Post, User 모델 생성
3. 분석글 목록/상세 조회
4. 관리자 로그인
5. 기업 입력 기능
6. 분석글 작성/수정/삭제
7. EJS 화면 및 CSS 정리
8. Render 배포
```

Yahoo Finance API, Trading Economics API, 실시간 주가 데이터, 자동 점수 계산 기능은 이번 구현 범위에서는 제외한다. 대신 기업명, 영향 점수, 대응 전략, 코멘트를 관리자가 직접 입력하는 방식으로 구현하여 데이터베이스 활용과 CRUD 기능을 명확히 보여준다.

## 5. 결론

실적 발표 영향 분석 블로그는 특정 기업의 실적 발표가 관련 기업에 미치는 영향을 기록하고 관리하는 MongoDB 기반 웹 서비스이다. 초기 테스트는 마이크론이 삼성전자와 SK하이닉스에 미치는 영향을 예시로 진행하지만, 기업 입력 기능을 통해 이후 다른 기업의 실적 발표와 관련 기업 분석으로 확장할 수 있다.

이 프로젝트는 `myBlog`의 Express/EJS 블로그 구조와 `myContacts`의 CRUD 라우팅 개념을 참고하여 설계한다. 최종적으로 MongoDB Atlas와 Render를 활용해 데이터베이스 기반 웹 서비스를 실제로 배포하는 것을 목표로 한다.
