// 클라리넷 개념도 (SVG). 키마다 도형 하나, data-key로 keys.js의 ID와 연결된다.
// 실제 비율·위치가 아니라 "대략 어느 쪽에 있는 키인지" 보여주는 그림이다 (확인 필요: 세진의 실물과 비교).
// 색칠은 keyGrid.js의 paintKeys가 격자와 같이 해 준다.
import { KEYS } from "../input/keys.js";

// [키 ID, 모양, x, y] — circle: 중심, rect: 왼쪽 위 (가로 30 × 세로 12)
const LAYOUT = [
  ["a", "rect", 65, 38],
  ["register", "rect", 14, 76],
  ["thumb", "circle", 29, 112],
  ["throat_gs", "rect", 104, 56],
  ["l1", "circle", 80, 96],
  ["l2", "circle", 80, 130],
  ["l3", "circle", 80, 164],
  ["key_eb", "rect", 104, 152],
  ["lp_cs", "rect", 14, 186],
  ["lp_fs", "rect", 14, 202],
  ["lp_e", "rect", 14, 218],
  ["lp_f", "rect", 14, 234],
  ["side1", "rect", 104, 178],
  ["side2", "rect", 104, 194],
  ["side3", "rect", 104, 210],
  ["side4", "rect", 104, 226],
  ["r1", "circle", 80, 272],
  ["r2", "circle", 80, 306],
  ["r3", "circle", 80, 340],
  ["key_b", "rect", 104, 326],
  ["rp_gs", "rect", 104, 360],
  ["rp_fs", "rect", 104, 376],
  ["rp_e", "rect", 104, 392],
  ["rp_f", "rect", 104, 408],
];

const LABEL = Object.fromEntries(KEYS.map((k) => [k.id, k.label.replace(/^(LP|RP) /, "")]));

function shape([id, kind, x, y]) {
  if (kind === "circle") {
    return `<g><circle data-key="${id}" cx="${x}" cy="${y}" r="12"/>
      <text x="${x}" y="${y + 3}">${LABEL[id]}</text></g>`;
  }
  return `<g><rect data-key="${id}" x="${x}" y="${y}" width="30" height="12" rx="4"/>
    <text x="${x + 15}" y="${y + 9}">${LABEL[id]}</text></g>`;
}

export function clarinetDiagramHtml() {
  return `
    <figure class="dia">
      <svg viewBox="0 0 150 450" role="img" aria-label="clarinet">
        <rect class="tube" x="62" y="20" width="36" height="400" rx="6"/>
        <path class="tube" d="M62 418 L44 444 L116 444 L98 418 Z"/>
        <text class="side" x="29" y="136" data-i18n="diagram.back"></text>
        <text class="side" x="29" y="182">L</text>
        <text class="side" x="119" y="440">R</text>
        ${LAYOUT.map(shape).join("")}
      </svg>
      <figcaption class="small muted" data-i18n="diagram.caption"></figcaption>
    </figure>`;
}
