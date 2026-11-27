// 앱 시작점. 언어를 정하고, 입력 어댑터를 고르고, 탭에 따라 화면을 바꿔 붙인다.
import { loadLang, setLang, applyI18n } from "./i18n/index.js";
import { KeyboardInput } from "./input/keyboardInput.js";
import { mountKeyTestView } from "./ui/keyTestView.js";
import { mountFingeringPracticeView } from "./ui/fingeringPracticeView.js";

const lang = loadLang();
document.documentElement.lang = lang;
const langSelect = document.getElementById("langSelect");
langSelect.value = lang;
langSelect.addEventListener("change", () => setLang(langSelect.value));

applyI18n();

// 지금은 키보드 입력만. 센서 보드가 준비되면 여기서 SerialInput으로 바꿔 끼운다.
const input = new KeyboardInput();
input.start();

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
