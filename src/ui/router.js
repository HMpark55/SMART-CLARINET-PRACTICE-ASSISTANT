// 주소(#/guide 같은 해시)로 페이지를 고른다.
// 해시를 쓰면 서버는 index.html 하나만 내보내면 되고(서버 설정 불필요), 새로고침해도 같은 페이지가 유지된다.
// routes: { "guide": { mount, titleKey }, ... }
// 주소가 없거나 모르는 주소면 defaultRoute로 보낸다 (지금은 홈 화면이 없어서 키 상태 확인).
import { t } from "../i18n/index.js";

export function startRouter({ routes, viewEl, input, defaultRoute }) {
  let cleanup = null;
  let current = null;

  const routeName = () => location.hash.replace(/^#\/?/, "");

  function render() {
    const name = routeName();
    if (!(name in routes)) {
      location.replace(`#/${defaultRoute}`); // 기록(뒤로가기)에 남기지 않고 이동 → hashchange로 다시 render
      return;
    }
    if (name === current) return;
    current = name;
    cleanup?.();
    viewEl.innerHTML = "";
    document.querySelectorAll("[data-route]").forEach((a) => {
      a.classList.toggle("active", a.dataset.route === name);
      if (a.dataset.route === name) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    cleanup = routes[name].mount(viewEl, input) ?? null;
    setTitle();
    window.scrollTo(0, 0);
  }

  function setTitle() {
    const page = routes[current]?.titleKey;
    document.title = page ? `${t(page)} · ${t("app.title")}` : t("app.title");
  }

  window.addEventListener("hashchange", render);
  document.addEventListener("langchange", setTitle);
  render();
}
