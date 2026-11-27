// 앱 시작점. 언어를 정하고, 입력을 연결하고, 탭에 따라 화면을 바꿔 붙인다.
import { loadLang, setLang, applyI18n } from "./i18n/index.js";
import { BoardInput } from "./input/boardInput.js";
import { KeyboardBoard } from "./input/keyboardBoard.js";
import { mountKeyTestView } from "./ui/keyTestView.js";
import { mountFingeringPracticeView } from "./ui/fingeringPracticeView.js";

const lang = loadLang();
document.documentElement.lang = lang;
const langSelect = document.getElementById("langSelect");
langSelect.value = lang;
langSelect.addEventListener("change", () => setLang(langSelect.value));

applyI18n();

// ── 입력 ──
// 지금은 키보드가 가상 센서 보드 역할을 한다. 진짜 보드가 준비되면 이 두 줄만 바꾼다:
//   const input = new BoardInput("sensor", new SerialLineSource());
const KEY_MODE_STORAGE = "keyMode";
let keyMode = "hold";
try { if (localStorage.getItem(KEY_MODE_STORAGE) === "toggle") keyMode = "toggle"; } catch (_) {}
const board = new KeyboardBoard(keyMode);
const input = new BoardInput("keyboard", board);
input.start();

const keyModeSelect = document.getElementById("keyModeSelect");
keyModeSelect.value = keyMode;
keyModeSelect.addEventListener("change", () => {
  board.setMode(keyModeSelect.value);
  try { localStorage.setItem(KEY_MODE_STORAGE, keyModeSelect.value); } catch (_) {}
  keyModeSelect.blur(); // 선택 후 바로 키보드로 운지를 칠 수 있게
});

// ── 화면 ──
// 화면마다 mount 함수가 "정리 함수"를 돌려준다. 탭을 바꿀 때 이전 화면의 이벤트를 떼어 낸다.
const VIEWS = {
  keyTest: mountKeyTestView,
  fingering: mountFingeringPracticeView,
};
const viewEl = document.getElementById("view");
let cleanup = null;

function show(name) {
  cleanup?.();
  document.querySelectorAll(".tab[data-view]").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
  cleanup = VIEWS[name](viewEl, input);
}

document.querySelectorAll(".tab[data-view]").forEach((b) => {
  b.addEventListener("click", () => show(b.dataset.view));
});

show("keyTest");
