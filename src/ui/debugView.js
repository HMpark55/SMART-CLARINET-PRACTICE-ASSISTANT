// 디버그 페이지 (개발용): 하드웨어를 USB-C로 연결했을 때 신호가 실제로 들어오는지 키 하나씩 확인한다.
//
// 입력 출처 2가지 중 고른다.
//   - 가상 보드: 앱 전체가 쓰는 키보드·마우스 입력 (하드웨어 없이 이 페이지 자체를 시험)
//   - USB 보드: 이 페이지에서만 만드는 BoardInput("sensor", SerialLineSource)
//     + "신호 줄 직접 넣기"로 보드 없이 "K 7" 같은 줄을 넣어 볼 수 있다.
// 어느 쪽이든 같은 BoardInput을 거치므로, 여기서 보이는 것이 앱이 받는 것과 같다.
import { KEYS } from "../input/keys.js";
import { BoardInput } from "../input/boardInput.js";
import { SerialLineSource, serialSupported } from "../input/serialInput.js";
import { t, applyI18n } from "../i18n/index.js";
import { clarinetDiagramHtml } from "./clarinetDiagram.js";
import { paintKeys, enablePointerKeys } from "./keyGrid.js";

const LOG_LINES = 14;

export function mountDebugView(container, virtualInput) {
  // ── USB 보드 쪽 입력 (이 페이지 안에서만) ──
  const serial = new SerialLineSource({ onStatus: (status, detail) => setStatus(status, detail) });
  const usbInput = new BoardInput("sensor", serial);
  usbInput.start();

  let source = "virtual"; // "virtual" | "usb"
  let current = virtualInput;
  let offs = [];

  // 키별 점검: presses = 눌림 횟수, released = 눌린 뒤 뗀 적이 있는지
  let check = {};
  const resetCheck = () => {
    check = Object.fromEntries(KEYS.map((k) => [k.id, { presses: 0, released: false }]));
  };
  resetCheck();
  let stats = { lines: 0, bad: 0 };
  const log = [];

  container.innerHTML = `
    <h2><span data-i18n="debug.title"></span> <span class="badge" data-i18n="debug.devOnly"></span></h2>
    <p class="muted" data-i18n="debug.intro"></p>

    <section class="panel">
      <h3 data-i18n="debug.source.title"></h3>
      <div class="row">
        <label class="field"><input type="radio" name="src" value="virtual" checked> <span data-i18n="debug.source.virtual"></span></label>
        <label class="field"><input type="radio" name="src" value="usb"> <span data-i18n="debug.source.usb"></span></label>
      </div>
      <div id="usbBox" hidden>
        <p class="warn" id="noSerial" hidden data-i18n="debug.noSerial"></p>
        <div class="row">
          <button class="btn primary" id="connect" data-i18n="debug.connect"></button>
          <button class="btn" id="disconnect" data-i18n="debug.disconnect"></button>
          <span class="status" id="status"></span>
        </div>
        <p class="small muted" data-i18n="debug.firmwareNote"></p>
        <div class="row">
          <input id="manualLine" class="mono" placeholder="K 7" autocomplete="off" spellcheck="false">
          <button class="btn" id="sendLine" data-i18n="debug.sendLine"></button>
        </div>
        <p class="small muted" data-i18n="debug.manualNote"></p>
      </div>
    </section>

    <div class="split">
      <section class="panel">${clarinetDiagramHtml()}</section>
      <div>
        <section class="panel">
          <h3 data-i18n="debug.state.title"></h3>
          <div class="mono big" id="maskHex"></div>
          <div class="mono small" id="maskBits"></div>
          <p class="small muted" data-i18n="debug.state.bitsNote"></p>
        </section>
        <section class="panel">
          <h3 data-i18n="debug.log.title"></h3>
          <p class="small muted" id="logStats"></p>
          <pre class="log tall" id="rawLog"></pre>
        </section>
      </div>
    </div>

    <section class="panel">
      <div class="row spread">
        <h3 data-i18n="debug.check.title"></h3>
        <button class="btn" id="resetCheck" data-i18n="debug.check.reset"></button>
      </div>
      <p class="muted" data-i18n="debug.check.howto"></p>
      <p><b id="progress"></b></p>
      <div class="table-wrap">
        <table class="check">
          <thead><tr>
            <th data-i18n="debug.col.bit"></th><th data-i18n="debug.col.key"></th><th>ID</th>
            <th data-i18n="debug.col.kbd"></th><th data-i18n="debug.col.now"></th>
            <th data-i18n="debug.col.presses"></th><th data-i18n="debug.col.result"></th>
          </tr></thead>
          <tbody>${KEYS.map((k, i) => `
            <tr data-row="${k.id}">
              <td class="mono">${i}</td><td><b>${k.label}</b></td><td class="mono small">${k.id}</td>
              <td class="mono">${k.code.replace(/^Key|^Digit/, "")}</td>
              <td class="now"></td><td class="presses mono"></td><td class="result"></td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>`;
  applyI18n(container);
  const $ = (sel) => container.querySelector(sel);

  // ── 화면 그리기 ──
  function renderState() {
    const state = current.getState();
    paintKeys(container, state);
    const mask = KEYS.reduce((m, k, i) => (state[k.id] ? m | (1 << i) : m), 0);
    $("#maskHex").textContent = `K ${mask.toString(16).toUpperCase()}`;
    // 비트 23 → 0 순서, 4자리씩 끊어 보기 쉽게
    $("#maskBits").textContent = mask.toString(2).padStart(KEYS.length, "0").replace(/(.{4})(?=.)/g, "$1 ");
    renderCheck(state);
  }

  function renderCheck(state = current.getState()) {
    let done = 0;
    for (const k of KEYS) {
      const row = container.querySelector(`tr[data-row="${k.id}"]`);
      const c = check[k.id];
      const ok = c.presses > 0 && c.released;
      if (ok) done++;
      row.classList.toggle("on", Boolean(state[k.id]));
      row.classList.toggle("ok", ok);
      row.querySelector(".now").textContent = state[k.id] ? "●" : "○";
      row.querySelector(".presses").textContent = c.presses;
      row.querySelector(".result").textContent =
        ok ? t("debug.result.ok") : c.presses > 0 ? t("debug.result.pressed") : t("debug.result.none");
    }
    $("#progress").textContent = t("debug.check.progress", { done, total: KEYS.length });
  }

  function renderLog() {
    $("#rawLog").textContent = log.join("\n");
    $("#logStats").textContent = t("debug.log.stats", { lines: stats.lines, bad: stats.bad });
  }

  function setStatus(status, detail) {
    const el = $("#status");
    if (!el) return;
    el.className = `status ${status}`;
    el.textContent = t(`debug.status.${status}`) + (typeof detail === "string" && detail ? ` (${detail})` : "");
    $("#connect").disabled = !serialSupported || status === "connected";
    $("#disconnect").disabled = status !== "connected";
  }

  // ── 출처 연결 ──
  function attach(input) {
    offs.forEach((f) => f());
    current = input;
    offs = [
      input.onChange((e) => {
        if (e.covered) check[e.hole].presses++;
        else if (check[e.hole].presses > 0) check[e.hole].released = true;
        renderState();
      }),
      input.onLine((line, ok) => {
        stats.lines++;
        if (!ok) stats.bad++;
        const time = (performance.now() / 1000).toFixed(2).padStart(8);
        log.push(`${time}s ${ok ? " " : "?"} ${line}`);
        if (log.length > LOG_LINES) log.shift();
        renderLog();
      }),
    ];
    renderState();
    renderLog();
  }

  container.querySelectorAll('input[name="src"]').forEach((r) =>
    r.addEventListener("change", () => {
      source = r.value;
      $("#usbBox").hidden = source !== "usb";
      container.classList.toggle("usb-src", source === "usb"); // USB일 때는 그림 클릭 입력 끄기
      resetAll(); // 출처가 바뀌면 점검표·기록을 새로 시작 (섞이지 않게)
      attach(source === "usb" ? usbInput : virtualInput);
    }),
  );

  $("#noSerial").hidden = serialSupported;
  $("#connect").disabled = !serialSupported;
  $("#disconnect").disabled = true;
  setStatus("disconnected");

  $("#connect").onclick = async () => {
    try {
      await serial.connect();
    } catch (err) {
      // 포트 선택 창에서 취소한 경우(NotFoundError)는 오류로 보지 않는다
      if (err?.name !== "NotFoundError") setStatus("error", err?.message ?? String(err));
    }
  };
  $("#disconnect").onclick = () => serial.disconnect();

  const sendManual = () => {
    const line = $("#manualLine").value.trim();
    if (line) usbInput.receive(line);
  };
  $("#sendLine").onclick = sendManual;
  $("#manualLine").addEventListener("keydown", (e) => { if (e.key === "Enter") sendManual(); });

  function resetAll() {
    resetCheck();
    stats = { lines: 0, bad: 0 };
    log.length = 0;
    renderLog();
    renderCheck();
  }
  $("#resetCheck").onclick = resetAll;

  const offPointer = enablePointerKeys(container); // 가상 보드일 때 그림을 눌러도 입력
  const onLang = () => { renderCheck(); renderLog(); setStatus(serial.connected ? "connected" : "disconnected"); };
  document.addEventListener("langchange", onLang);

  attach(virtualInput);

  return () => {
    offs.forEach((f) => f());
    offPointer();
    document.removeEventListener("langchange", onLang);
    container.classList.remove("usb-src");
    usbInput.stop(); // 페이지를 떠나면 USB 연결도 닫는다
  };
}
