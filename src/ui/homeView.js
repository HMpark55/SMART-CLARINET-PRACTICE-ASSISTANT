// 홈(첫 화면): 이 앱이 무엇인지, 무엇을 할 수 있는지(기능별 상태), 개인정보 안내.
// 기능 상태는 사실대로 표시한다 (CLAUDE.md 규칙 8).
// 운지 판정은 judgeFingering이 아직 null을 돌려주면 "판정 준비 중" — 세진이 채우면 자동으로 사라진다.
import { judgeFingering } from "../feedback/feedback.js";
import { SENSOR_READY } from "../input/serialInput.js";
import { t, applyI18n } from "../i18n/index.js";

const judgeReady = () => {
  try { return judgeFingering(60, []) !== null; } catch (_) { return false; }
};

export function mountHomeView(container) {
  // [제목 키, 설명 키, 링크(없으면 준비 중), 덧붙일 상태 키]
  const cards = [
    ["home.card.fingering", "#/fingering", judgeReady() ? null : "home.judgeNotReady"],
    ["home.card.keys", "#/keys", null],
    ["home.card.playing", null, null],
    ["home.card.sensor", SENSOR_READY ? "#/keys" : null, null],
  ];

  const card = ([key, href, note]) => {
    const badge = href
      ? `<span class="badge ok" data-i18n="status.available"></span>`
      : `<span class="badge" data-i18n="common.comingSoon"></span>`;
    const body = `
      <h3><span data-i18n="${key}.title"></span> ${badge}</h3>
      <p class="muted" data-i18n="${key}.desc"></p>
      ${note ? `<p class="small warn" data-i18n="${note}"></p>` : ""}`;
    return href ? `<a class="card link" href="${href}">${body}</a>` : `<div class="card off">${body}</div>`;
  };

  container.innerHTML = `
    <section class="hero">
      <h2 data-i18n="home.hero"></h2>
      <p data-i18n="home.lead"></p>
      <div class="row">
        <a class="btn primary" href="#/fingering" data-i18n="home.start"></a>
        <a class="btn" href="#/guide" data-i18n="home.guide"></a>
      </div>
    </section>

    <h2 class="section-title" data-i18n="home.cardsTitle"></h2>
    <div class="cards">${cards.map(card).join("")}</div>

    <section class="panel">
      <h2 data-i18n="home.privacyTitle"></h2>
      <p class="muted" data-i18n="home.privacy"></p>
    </section>`;
  applyI18n(container);
}
