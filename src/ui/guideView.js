// 사용법 페이지: 처음 쓰는 학생이 혼자 읽고 따라 할 수 있게.
// 문구는 모두 i18n에 있다. 목록 항목은 "키.1", "키.2"… 처럼 번호를 붙여 두고 여기서 개수만큼 꺼낸다.
import { applyI18n } from "../i18n/index.js";
import { keyboardLayoutHtml } from "./keyboardLayout.js";

const list = (key, count, tag = "ul") =>
  `<${tag}>${Array.from({ length: count }, (_, i) => `<li data-i18n="${key}.${i + 1}"></li>`).join("")}</${tag}>`;

export function mountGuideView(container) {
  container.innerHTML = `
    <article class="guide">
      <h2 data-i18n="guide.title"></h2>

      <section class="panel">
        <h3 data-i18n="guide.ready.title"></h3>
        <p data-i18n="guide.ready.body"></p>
      </section>

      <section class="panel">
        <h3 data-i18n="guide.keys.title"></h3>
        <p data-i18n="guide.keys.body"></p>
        ${keyboardLayoutHtml()}
        <p class="small"><a href="#/keys" data-i18n="guide.keys.try"></a></p>
      </section>

      <section class="panel">
        <h3 data-i18n="guide.mode.title"></h3>
        ${list("guide.mode", 3)}
      </section>

      <section class="panel">
        <h3 data-i18n="guide.practice.title"></h3>
        ${list("guide.practice", 4, "ol")}
        <a class="btn primary" href="#/fingering" data-i18n="home.start"></a>
      </section>

      <section class="panel">
        <h3 data-i18n="guide.records.title"></h3>
        ${list("guide.records", 3)}
      </section>

      <section class="panel">
        <h3 data-i18n="guide.trouble.title"></h3>
        ${list("guide.trouble", 3)}
      </section>
    </article>`;
  applyI18n(container);
}
