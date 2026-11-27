// 사용법 페이지의 키보드 배치 그림. keys.js의 code에서 자동으로 만든다.
// → 키 배치를 keys.js에서 바꾸면 이 그림도 저절로 바뀐다 (따로 고칠 곳이 없음).
import { KEYS } from "../input/keys.js";

const ROWS = [
  ["Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0"],
  ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP"],
  ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL"],
  ["KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM"],
];

const KEY_BY_CODE = Object.fromEntries(KEYS.map((k) => [k.code, k]));
const capLetter = (code) => code.replace(/^Key|^Digit/, "");

export function keyboardLayoutHtml() {
  const cap = (code) => {
    const k = KEY_BY_CODE[code];
    return k
      ? `<div class="cap ${k.group}"><b>${capLetter(code)}</b><span>${k.label}</span></div>`
      : `<div class="cap empty"><b>${capLetter(code)}</b></div>`;
  };
  return `
    <div class="kb" role="img" aria-label="keyboard layout">
      ${ROWS.map((row, i) => `<div class="kb-row r${i}">${row.map(cap).join("")}</div>`).join("")}
      <div class="kb-row"><div class="cap space"><b>Space</b><span data-i18n="guide.spaceKey"></span></div></div>
    </div>
    <p class="small muted">
      <span class="swatch hole"></span> <span data-i18n="keyGroup.hole"></span>
      &nbsp; <span class="swatch lever"></span> <span data-i18n="keyGroup.lever"></span>
    </p>`;
}
