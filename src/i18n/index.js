// 다국어 문구를 가져오는 곳. 화면 코드는 문구를 직접 쓰지 않고 t("키")로 가져온다.
// HTML에는 data-i18n="키"를 붙여 두면 applyI18n()이 채워 준다.
import ko from "./ko.js";
import en from "./en.js";
import zh from "./zh.js";

const DICTS = { ko, en, zh };
export const LANGS = ["ko", "en", "zh"];
const STORAGE_KEY = "lang";

let current = "ko";

// 저장된 언어 불러오기. 사생활 보호 모드 등에서 localStorage가 막혀도 앱은 동작해야 한다.
export function loadLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) current = saved;
  } catch (_) {}
  return current;
}

export function setLang(lang) {
  if (!LANGS.includes(lang)) return;
  current = lang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
  document.documentElement.lang = lang;
  applyI18n();
  // 직접 그리는 화면(음 이름 등)도 다시 그리도록 알린다.
  document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
}

export function getLang() {
  return current;
}

// 키가 없으면 한국어 → 키 이름 순으로 대신 보여준다 (빠진 번역을 화면에서 바로 알아보도록).
export function t(key, params = {}) {
  let s = DICTS[current][key] ?? DICTS.ko[key] ?? key;
  for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, v);
  return s;
}

export function applyI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
}
