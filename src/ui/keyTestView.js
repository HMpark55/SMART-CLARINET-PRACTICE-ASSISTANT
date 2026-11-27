// 키 상태 확인 화면: 24키가 지금 눌렸는지, 그 조합이 운지표에서 어떤 음인지 보여준다.
// 보드가 보낸 신호 줄(예: "K 7")도 보여준다. 나중에 진짜 센서 보드를 연결하면 이 화면으로 배선을 확인한다.
import { KEYS } from "../input/keys.js";
import { lookupMidi } from "../feedback/fingerings.js";
import { t, applyI18n } from "../i18n/index.js";
import { noteName } from "./noteName.js";
import { keyGridHtml, paintKeys } from "./keyGrid.js";
import { clarinetDiagramHtml } from "./clarinetDiagram.js";

const LOG_LINES = 6;

export function mountKeyTestView(container, input) {
  container.innerHTML = `
    <div class="split">
      <section class="panel">${clarinetDiagramHtml()}</section>
      <div>
        <section class="panel">
          <p class="muted" data-i18n="keyTest.hint"></p>
          <div class="muted" data-i18n="keyTest.note"></div>
          <div class="note-box" id="noteBox"></div>
          <div class="muted"><span data-i18n="keyTest.pressed"></span>: <span id="pressedList"></span></div>
        </section>
        <section class="panel">
          <h2 data-i18n="keyTest.signal"></h2>
          <p class="small muted" data-i18n="keyTest.signalHint"></p>
          <pre class="log" id="signalLog"></pre>
        </section>
      </div>
    </div>
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

  // 신호 기록: 최근 몇 줄만. 형식이 틀린 줄은 "?"를 붙여 보여준다 (진짜 보드 디버깅용).
  const lines = [];
  const logEl = container.querySelector("#signalLog");
  const offLine = input.onLine
    ? input.onLine((line, ok) => {
        lines.push(`${ok ? " " : "?"} ${line}`);
        if (lines.length > LOG_LINES) lines.shift();
        logEl.textContent = lines.join("\n");
      })
    : () => {};

  const off = input.onChange(render);
  render();
  // 언어가 바뀌면 다시 그린다 (음 이름이 언어마다 다름)
  document.addEventListener("langchange", render);
  return () => { off(); offLine(); document.removeEventListener("langchange", render); };
}
