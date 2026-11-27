// 클라리넷 그림 (SVG). 실제 악기처럼 위에서부터 마우스피스 → 배럴 → 윗관 → 가운데 링 → 아랫관 → 벨.
// 키마다 도형 하나에 data-key(keys.js의 ID)가 붙어 있어서
//   - paintKeys(keyGrid.js)가 눌린 키·힌트·틀린 키를 칠하고
//   - enablePointerKeys(keyGrid.js)가 마우스 클릭·터치를 받는다.
// 키 위치는 대략적인 배치다 (확인 필요: 세진의 실물과 비교).
import { KEYS } from "../input/keys.js";

const LABEL = Object.fromEntries(KEYS.map((k) => [k.id, k.label.replace(/^(LP|RP) /, "")]));

// 손가락으로 막는 구멍: 링 키 모양 (바깥 링은 장식, 안쪽 원이 누르는 곳)
const HOLES = [
  ["l1", 100, 196], ["l2", 100, 238], ["l3", 100, 280],
  ["r1", 100, 410], ["r2", 100, 452], ["r3", 100, 494],
];

// 레버 키: [ID, 가운데 x, 가운데 y, 가로, 세로, 기울기(도)]
const LEVERS = [
  ["throat_gs", 72, 140, 26, 12, -30],
  ["a", 100, 158, 16, 24, 0],
  ["register", 44, 196, 14, 34, 0],
  ["key_eb", 130, 268, 26, 12, -25],
  ["side1", 140, 296, 26, 11, 0],
  ["side2", 140, 312, 26, 11, 0],
  ["side3", 140, 328, 26, 11, 0],
  ["side4", 140, 344, 26, 11, 0],
  ["lp_cs", 62, 320, 28, 12, 20],
  ["lp_fs", 74, 384, 26, 12, -15],
  ["lp_e", 52, 396, 26, 12, -15],
  ["lp_f", 66, 414, 26, 12, -15],
  ["key_b", 130, 480, 26, 12, -25],
  ["rp_gs", 124, 528, 26, 12, -15],
  ["rp_fs", 152, 524, 26, 12, -15],
  ["rp_f", 126, 548, 26, 12, -15],
  ["rp_e", 154, 544, 26, 12, -15],
];

const hole = ([id, x, y]) => `
  <g class="k">
    <circle class="ring" cx="${x}" cy="${y}" r="15"/>
    <circle data-key="${id}" cx="${x}" cy="${y}" r="11"/>
    <text x="${x}" y="${y + 3}">${LABEL[id]}</text>
  </g>`;

const lever = ([id, x, y, w, h, deg]) => `
  <g class="k" transform="rotate(${deg} ${x} ${y})">
    <rect data-key="${id}" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${Math.min(w, h) / 2}"/>
    <text x="${x}" y="${y + 3}">${LABEL[id]}</text>
  </g>`;

export function clarinetDiagramHtml() {
  return `
    <figure class="dia">
      <svg viewBox="0 0 200 640" role="img" aria-label="clarinet">
        <!-- 마우스피스 -->
        <path class="body" d="M92 14 Q100 8 108 14 L112 74 L88 74 Z"/>
        <line class="trim" x1="90" y1="48" x2="110" y2="48"/><line class="trim" x1="89" y1="58" x2="111" y2="58"/>
        <!-- 배럴 -->
        <rect class="metal" x="84" y="74" width="32" height="6" rx="2"/>
        <path class="body" d="M86 80 Q82 98 86 116 L114 116 Q118 98 114 80 Z"/>
        <rect class="metal" x="84" y="116" width="32" height="6" rx="2"/>
        <!-- 윗관 -->
        <rect class="body" x="86" y="122" width="28" height="234" rx="3"/>
        <line class="trim" x1="124" y1="180" x2="124" y2="350"/>
        <!-- 가운데 링 -->
        <rect class="metal" x="83" y="356" width="34" height="8" rx="2"/>
        <!-- 아랫관 -->
        <rect class="body" x="86" y="364" width="28" height="210" rx="3"/>
        <line class="trim" x1="76" y1="370" x2="76" y2="570"/>
        <circle class="open" cx="100" cy="530" r="7"/><circle class="open" cx="100" cy="552" r="7"/>
        <!-- 벨 -->
        <rect class="metal" x="83" y="574" width="34" height="7" rx="2"/>
        <path class="body" d="M86 581 L114 581 Q120 606 146 626 L54 626 Q80 606 86 581 Z"/>
        <rect class="metal" x="52" y="626" width="96" height="6" rx="3"/>

        <text class="side" x="44" y="170" data-i18n="diagram.back"></text>
        ${LEVERS.map(lever).join("")}
        ${HOLES.map(hole).join("")}
        <!-- 뒷면 엄지 구멍 -->
        ${hole(["thumb", 44, 244]).replace('r="15"', 'r="14"')}
      </svg>
      <figcaption class="small muted" data-i18n="diagram.caption"></figcaption>
    </figure>`;
}
