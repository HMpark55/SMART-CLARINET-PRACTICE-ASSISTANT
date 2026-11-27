// 앱 시작점. 언어를 정하고 화면을 붙인다.
import { loadLang, setLang, applyI18n } from "./i18n/index.js";

const lang = loadLang();
document.documentElement.lang = lang;
const langSelect = document.getElementById("langSelect");
langSelect.value = lang;
langSelect.addEventListener("change", () => setLang(langSelect.value));

applyI18n();
