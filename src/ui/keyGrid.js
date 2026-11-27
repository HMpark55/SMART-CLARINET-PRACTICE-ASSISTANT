// 24키 격자 (구멍 / 레버 키). 키 상태 확인 화면과 운지 연습 화면이 같이 쓴다.
// 색 의미: 채움 = 지금 눌림, 점선 = 눌러야 할 키(힌트), 빨간 테두리 = 틀린 키.
import { KEYS } from "../input/keys.js";

const cell = (k) => `
  <div class="key" data-key="${k.id}">
    <b>${k.label}</b><span class="kbd">${k.code.replace(/^Key|^Digit/, "")}</span>
  </div>`;

export function keyGridHtml() {
  const grid = (group) => KEYS.filter((k) => k.group === group).map(cell).join("");
  return `
    <section class="panel">
      <h2 data-i18n="keyGroup.hole"></h2>
      <div class="key-grid">${grid("hole")}</div>
    </section>
    <section class="panel">
      <h2 data-i18n="keyGroup.lever"></h2>
      <div class="key-grid">${grid("lever")}</div>
    </section>`;
}

// state: { 키ID: true/false }, expected / wrong: 키 ID 목록 (없으면 표시 안 함)
export function paintKeys(container, state, { expected = [], wrong = [] } = {}) {
  container.querySelectorAll(".key").forEach((el) => {
    const id = el.dataset.key;
    el.classList.toggle("on", Boolean(state[id]));
    el.classList.toggle("expect", expected.includes(id));
    el.classList.toggle("wrong", wrong.includes(id));
  });
}

export function labelsOf(ids) {
  return KEYS.filter((k) => ids.includes(k.id)).map((k) => k.label);
}
