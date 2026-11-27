// 운지표 페이지: 운지표(src/feedback/fingerings.js)에 있는 모든 음을 카드로 보여준다.
// 카드마다 작은 클라리넷 그림에 눌러야 할 키를 칠하고, 키 이름과 키보드 키를 적는다.
// 표의 내용을 그대로 보여줄 뿐이므로, 표를 고치면 이 페이지도 저절로 바뀐다.
import { KEYS } from "../input/keys.js";
import { allFingeringsFor } from "../feedback/fingerings.js";
import { t, applyI18n } from "../i18n/index.js";
import { noteName } from "./noteName.js";
import { clarinetDiagramHtml } from "./clarinetDiagram.js";
import { paintKeys } from "./keyGrid.js";

// 음역 묶음 (써진 음 MIDI 범위)
const RANGES = [
  ["chart.range.low", 52, 66],
  ["chart.range.throat", 67, 70],
  ["chart.range.clarion", 71, 84],
  ["chart.range.altissimo", 85, 91],
];

const ORDER = KEYS.map((k) => k.id);
const sortKeys = (ids) => [...ids].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
const label = (ids) => KEYS.filter((k) => ids.includes(k.id)).map((k) => k.label).join(" + ");
const keyboard = (ids) =>
  KEYS.filter((k) => ids.includes(k.id)).map((k) => k.code.replace(/^Key|^Digit/, "")).join(" ");

export function mountChartView(container) {
  const card = (midi) => {
    const [main, ...alts] = allFingeringsFor(midi).map(sortKeys);
    return `
      <div class="chart-card" data-midi="${midi}">
        <div class="chart-note" data-note="${midi}"></div>
        <div class="chart-dia">${clarinetDiagramHtml()}</div>
        <div class="chart-keys">${main.length ? label(main) : `<span data-i18n="keyTest.allOpen"></span>`}</div>
        <div class="small muted mono">${keyboard(main) || "—"}</div>
        ${alts.map((a) => `<div class="small muted"><span data-i18n="chart.alt"></span>: ${label(a)}</div>`).join("")}
      </div>`;
  };

  const section = ([key, lo, hi]) => {
    const notes = [];
    for (let m = lo; m <= hi; m++) if (allFingeringsFor(m).length) notes.push(m);
    return `
      <section class="panel">
        <h3 data-i18n="${key}"></h3>
        <div class="chart-grid">${notes.map(card).join("")}</div>
      </section>`;
  };

  container.innerHTML = `
    <h2 data-i18n="chart.title"></h2>
    <p data-i18n="chart.lead"></p>
    <p class="small warn" data-i18n="chart.verify"></p>
    ${RANGES.map(section).join("")}`;
  applyI18n(container);

  // 카드마다 그림 칠하기 (기본 운지)
  container.querySelectorAll(".chart-card").forEach((el) => {
    const [main] = allFingeringsFor(Number(el.dataset.midi));
    paintKeys(el, Object.fromEntries(main.map((id) => [id, true])));
  });

  const renderNames = () =>
    container.querySelectorAll("[data-note]").forEach((el) => { el.textContent = noteName(Number(el.dataset.note)); });
  renderNames();
  document.addEventListener("langchange", renderNames);
  return () => document.removeEventListener("langchange", renderNames);
}
