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
// 격자(.key)와 클라리넷 개념도(SVG 도형) 모두 data-key가 있으므로 함께 칠해진다.
export function paintKeys(container, state, { expected = [], wrong = [] } = {}) {
  container.querySelectorAll("[data-key]").forEach((el) => {
    const id = el.dataset.key;
    el.classList.toggle("on", Boolean(state[id]));
    el.classList.toggle("expect", expected.includes(id));
    el.classList.toggle("wrong", wrong.includes(id));
  });
}

// 마우스 클릭·터치로 키 누르기. container 안의 data-key 요소(격자 칸, 클라리넷 그림)를 누르면
// "virtualkey" 이벤트를 보낸다. 입력 쪽(가상 보드)이 이 이벤트를 받아 키보드와 똑같이 처리한다.
// 손가락을 떼면(pointerup) 어디서 떼든 그 키를 뗀다 (꾹 누르기 모드용). 돌려주는 함수로 정리.
export function enablePointerKeys(container) {
  const send = (id, down) => window.dispatchEvent(new CustomEvent("virtualkey", { detail: { id, down } }));
  let held = null;
  const onDown = (e) => {
    const el = e.target.closest?.("[data-key]");
    if (!el || !container.contains(el)) return;
    e.preventDefault(); // 글자 선택·확대 막기
    held = el.dataset.key;
    send(held, true);
  };
  const onUp = () => {
    if (held === null) return;
    send(held, false);
    held = null;
  };
  container.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
  return () => {
    onUp();
    container.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
  };
}

export function labelsOf(ids) {
  return KEYS.filter((k) => ids.includes(k.id)).map((k) => k.label);
}
