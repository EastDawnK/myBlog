const demoPosts = [
  {
    _id: "demo-micron-earnings",
    title: "실적 발표 이후 관련 기업 영향 점검",
    summary:
      "실적 발표 기업의 가이던스를 기준으로 영향을 받는 관련 기업들의 단기 투자 판단 포인트를 정리합니다.",
    body:
      "기업의 실적 발표는 같은 공급망, 같은 산업, 경쟁 관계에 있는 기업들의 투자 판단에 영향을 줄 수 있습니다.\n\n이번 예시 분석에서는 마이크론의 매출 성장률, 재고 흐름, 가격 회복 가능성, HBM 수요 코멘트를 기준으로 국내 메모리 기업에 미칠 영향을 정리했습니다. 실적 자체보다 향후 분기 가이던스와 서버/AI 수요 관련 발언이 투자 판단에 더 큰 영향을 줄 수 있습니다.",
    influencing_company: "Micron Technology",
    influencing_ticker: "MU",
    eventType: "Earnings",
    eventDate: new Date("2026-06-20"),
    earningDate: new Date("2026-06-24"),
    earningDateUS: new Date("2026-06-24"),
    earningDateKR: new Date("2026-06-25T05:00:00+09:00"),
    earningWhisper: "EPS 1.85",
    consensus: "EPS 1.72",
    revenue: "$8.9B",
    influencing_score: 82,
    affected_companies: [
      {
        affected_company: "삼성전자",
        affected_ticker: "005930",
        impact_score: 74,
        strategy: "보유",
        comment:
          "DRAM 가격 회복 기대는 긍정적이지만, HBM 경쟁력 확인 전까지는 보수적인 접근이 필요합니다.",
      },
      {
        affected_company: "SK하이닉스",
        affected_ticker: "000660",
        impact_score: 88,
        strategy: "비중확대",
        comment:
          "HBM 수요가 강하게 확인될 경우 SK하이닉스의 프리미엄이 유지될 가능성이 큽니다.",
      },
    ],
    hbmComment: "AI 서버 수요가 유지되면 HBM 공급 기업의 실적 가시성이 높아집니다.",
    dramComment: "일반 DRAM은 가격 회복 속도와 재고 감소 여부가 핵심입니다.",
    nandComment: "NAND는 수요 회복이 확인되기 전까지 영향 점수를 낮게 보는 편이 안전합니다.",
    guidanceComment: "다음 분기 매출과 마진 가이던스가 국내 기업 주가 반응을 좌우합니다.",
    sourceUrl: "",
    createdAt: new Date("2026-06-21"),
  },
];

const demoCompanies = [
  {
    _id: "demo-company-mu",
    name: "Micron Technology",
    ticker: "MU",
    market: "NASDAQ",
    sector: "Memory Semiconductor",
    memo: "실적 발표 이벤트 예시 기업",
  },
  {
    _id: "demo-company-samsung",
    name: "삼성전자",
    ticker: "005930",
    market: "KOSPI",
    sector: "Memory Semiconductor",
    memo: "실적 발표 이벤트의 영향을 받는 국내 대표 기업",
  },
  {
    _id: "demo-company-hynix",
    name: "SK하이닉스",
    ticker: "000660",
    market: "KOSPI",
    sector: "Memory Semiconductor",
    memo: "HBM 수요 변화에 민감한 관련 기업",
  },
];

const findDemoPost = (id) => demoPosts.find((post) => post._id === id);

module.exports = {
  demoPosts,
  demoCompanies,
  findDemoPost,
};
