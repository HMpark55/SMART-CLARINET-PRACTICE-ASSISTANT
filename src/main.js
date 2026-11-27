// 앱 시작점. 언어를 정하고, 입력 어댑터를 고르고, 화면을 붙인다.
import { loadLang, setLang, applyI18n } from "./i18n/index.js";
import { KeyboardInput } from "./input/keyboardInput.js";
import { mountKeyTestView } from "./ui/keyTestView.js";

const lang = loadLang();
document.documentElement.lang = lang;
const langSelect = document.getElementById("langSelect");
langSelect.value = lang;
langSelect.addEventListener("change", () => setLang(langSelect.value));

applyI18n();

// 지금은 키보드 입력만. 센서 보드가 준비되면 여기서 SerialInput으로 바꿔 끼운다.
const input = new KeyboardInput();
input.start();

mountKeyTestView(document.getElementById("view"), input);
