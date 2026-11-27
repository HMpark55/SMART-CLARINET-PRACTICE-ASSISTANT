// 키 상태 확인 화면: 24키가 지금 눌렸는지, 그 조합이 운지표에서 어떤 음인지 보여준다.
// 입력 어댑터의 이벤트만 받으므로, 나중에 센서 보드를 연결해도 이 화면은 그대로 배선 확인에 쓸 수 있다.
import { KEYS } from "../input/keys.js";
import { lookupMidi } from "../feedback/fingerings.js";
import { t, applyI18n } from "../i18n/index.js";
import { noteName } from "./noteName.js";
import { keyGridHtml, paintKeys } from "./keyGrid.js";

export function mountKeyTestView(container, input) {
  container.innerHTML = `
    <section class="panel">
      <p class="muted" data-i18n="keyTest.hint"></p>
      <div class="muted" data-i18n="keyTest.note"></div>
      <div class="note-box" id="noteBox"></div>
      <div class="muted"><span data-i18n="keyTest.pressed"></span>: <span id="pressedList"></span></div>
    </section>
    ${keyGridHtml()}`;
  applyI18n(container);

  const render = () => {
    const state = input.getState();
    const pressed = KEYS.filter((k) => state[k.id]);
    paintKeys(container, state);
    const midi = lookupMidi(pressed.map((k) => k.id));
    container.querySelector("#noteBox").textContent = midi === null ? t("keyTest.unknown") : noteName(midi);
    container.querySelector("#pressedList").textContent =
      pressed.length ? pressed.map((k) => k.label).join(" + ") : t("keyTest.allOpen");
  };

  const off = input.onChange(render);
  render();
  // 언어가 바뀌면 다시 그린다 (음 이름이 언어마다 다름)
  document.addEventListener("langchange", render);
  return () => { off(); document.removeEventListener("langchange", render); };
}
