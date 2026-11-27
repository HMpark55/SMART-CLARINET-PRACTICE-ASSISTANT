// 운지 연습 화면 (SPEC.md 1절). 소리 없이 손가락 조합만 연습한다.
// 흐름: 준비(안내·동의·익명 코드) → 문제 8개 → 결과(요약·CSV).
// 판정은 feedback.js(세진 작성)에 맡긴다. 이 화면은 결과를 보여주고 기록할 뿐이다.
// 제출: 키보드는 Space, 화면은 "확인" 버튼. (솔4는 아무 키도 안 누르는 운지라서, 키 변화만으로는 제출 시점을 알 수 없다.)
import { KEYS } from "../input/keys.js";
import { fingeringFor } from "../feedback/fingerings.js";
import { judgeFingering } from "../feedback/feedback.js";
import { pickNotes, ROUND_LENGTH } from "../feedback/noteSets.js";
import {
  startSession, addAttempt, endSession, getAnonCode, setAnonCode, ANON_CODE_PATTERN, storageAvailable,
} from "../storage/records.js";
import { t, getLang, applyI18n } from "../i18n/index.js";
import { noteName, noteLetter } from "./noteName.js";
import { keyGridHtml, paintKeys, labelsOf } from "./keyGrid.js";
import { mountRecordsPanel } from "./recordsPanel.js";

const NEXT_DELAY_MS = 700; // 정답을 보여준 뒤 다음 음으로 넘어가기까지

export function mountFingeringPracticeView(container, input) {
  let phase = "setup"; // "setup" | "run" | "done"
  let session = null;    // 첫 시도를 기록할 때 만든다 (시도 0개짜리 빈 세션이 남지 않도록)
  let anonCode = "";
  let notes = [];
  let index = 0;
  let shownAt = 0;       // 지금 음(또는 재시도)을 보여준 시각 → response_ms 계산
  let wrong = [];        // 마지막 판정에서 틀린 키
  let locked = false;    // 정답 후 다음 음으로 넘어가는 동안 제출 막기
  let showHint = true;
  let stats = { attempts: 0, solved: 0, judged: true, solvedTimes: [] };
  const timers = [];

  const pressedIds = () => KEYS.filter((k) => input.getState()[k.id]).map((k) => k.id);

  // ── 준비 화면 ──
  function renderSetup() {
    phase = "setup";
    container.innerHTML = `
      <section class="panel">
        <h2 data-i18n="nav.fingering"></h2>
        <p data-i18n="practice.notice1"></p>
        <p class="muted" data-i18n="practice.notice2"></p>
        ${storageAvailable ? "" : `<p class="warn" data-i18n="practice.storageOff"></p>`}
        <label class="field"><input type="checkbox" id="agree"> <span data-i18n="practice.agree"></span></label>
        <label class="field"><span data-i18n="practice.anonLabel"></span>
          <input id="anon" maxlength="16" autocomplete="off">
          <span class="muted small" data-i18n="practice.anonHint"></span></label>
        <label class="field"><input type="checkbox" id="hint" ${showHint ? "checked" : ""}>
          <span data-i18n="practice.hintToggle"></span></label>
        <p class="warn" id="setupError" hidden data-i18n="practice.anonInvalid"></p>
        <button class="btn primary" id="start" disabled data-i18n="practice.start"></button>
      </section>
      <section class="panel" id="records"></section>`;
    applyI18n(container);
    container.querySelector("#anon").value = getAnonCode();
    mountRecordsPanel(container.querySelector("#records"), () => { container.querySelector("#anon").value = ""; });

    const agree = container.querySelector("#agree");
    const start = container.querySelector("#start");
    agree.onchange = () => { start.disabled = !agree.checked; };
    start.onclick = () => {
      const code = container.querySelector("#anon").value.trim();
      if (!ANON_CODE_PATTERN.test(code)) {
        container.querySelector("#setupError").hidden = false;
        return;
      }
      setAnonCode(code);
      showHint = container.querySelector("#hint").checked;
      beginRound(code);
    };
  }

  // ── 연습 화면 ──
  function beginRound(code) {
    session = null;
    anonCode = code;
    notes = pickNotes(ROUND_LENGTH);
    index = 0;
    stats = { attempts: 0, solved: 0, judged: true, solvedTimes: [] };
    phase = "run";
    container.innerHTML = `
      <section class="panel center">
        <div class="muted" id="progress"></div>
        <div class="note-box" id="target"></div>
        <p class="muted" data-i18n="practice.instruction"></p>
        <p class="result" id="result"></p>
        <div class="row center">
          <button class="btn primary" id="submit" data-i18n="practice.submit"></button>
          <button class="btn" id="skip" data-i18n="practice.skip"></button>
          <button class="btn" id="stop" data-i18n="practice.stop"></button>
        </div>
      </section>
      ${keyGridHtml()}`;
    applyI18n(container);
    container.querySelector("#submit").onclick = submit;
    container.querySelector("#skip").onclick = nextNote;
    container.querySelector("#stop").onclick = finish;
    showNote();
  }

  function showNote() {
    wrong = [];
    locked = false;
    shownAt = performance.now();
    container.querySelector("#progress").textContent = t("practice.progress", { n: index + 1, total: notes.length });
    container.querySelector("#target").textContent = noteName(notes[index]);
    setResult("", "");
    paint();
  }

  function paint() {
    if (phase !== "run") return;
    const expected = showHint ? fingeringFor(notes[index]) ?? [] : [];
    paintKeys(container, input.getState(), { expected, wrong });
  }

  function setResult(text, kind) {
    const el = container.querySelector("#result");
    el.textContent = text;
    el.className = `result ${kind}`;
  }

  function submit() {
    if (phase !== "run" || locked) return;
    const target = notes[index];
    const pressed = pressedIds();
    const result = judgeFingering(target, pressed);

    // 판정 함수가 아직 없으면(null) 기록하지 않고 다음 음으로
    if (result === null) {
      stats.judged = false;
      setResult(t("feedback.notReady"), "muted");
      locked = true;
      timers.push(setTimeout(nextNote, NEXT_DELAY_MS));
      return;
    }

    const responseMs = Math.round(performance.now() - shownAt);
    stats.attempts++;
    session ??= startSession({ anon_code: anonCode, mode: "fingering", input_source: input.source, lang: getLang() });
    addAttempt(session, {
      target_note: noteLetter(target),
      input_fingering: pressed.join(","),
      fingering_correct: result.fingering_correct,
      wrong_keys: (result.wrong_keys ?? []).join(","),
      freq_hz: "",
      cents: "",
      pitch_status: "",
      response_ms: responseMs,
    });

    if (result.fingering_correct) {
      stats.solved++;
      stats.solvedTimes.push(responseMs);
      wrong = [];
      setResult(t(result.message_key), "good");
      locked = true;
      timers.push(setTimeout(nextNote, NEXT_DELAY_MS));
    } else {
      wrong = result.wrong_keys ?? [];
      setResult(t(result.message_key, { keys: labelsOf(wrong).join(", ") }), "bad");
      shownAt = performance.now(); // 다시 시도하는 시간은 지금부터 잰다
    }
    paint();
  }

  function nextNote() {
    if (phase !== "run") return;
    index++;
    if (index >= notes.length) finish();
    else showNote();
  }

  // ── 결과 화면 ──
  function finish() {
    if (phase !== "run") return;
    if (session) endSession(session);
    phase = "done";
    const avg = stats.solvedTimes.length
      ? (stats.solvedTimes.reduce((a, b) => a + b, 0) / stats.solvedTimes.length / 1000).toFixed(1)
      : "–";
    container.innerHTML = `
      <section class="panel center">
        <h2 data-i18n="practice.doneTitle"></h2>
        ${stats.judged
          ? `<p>${t("practice.summary", { solved: stats.solved, total: notes.length, attempts: stats.attempts })}</p>
             <p class="muted">${t("practice.avgTime", { s: avg })}</p>`
          : `<p class="muted" data-i18n="feedback.notReady"></p>`}
        <button class="btn primary" id="again" data-i18n="practice.again"></button>
      </section>
      <section class="panel" id="records"></section>`;
    applyI18n(container);
    mountRecordsPanel(container.querySelector("#records"));
    container.querySelector("#again").onclick = renderSetup;
  }

  // ── 입력 연결 ──
  const off = input.onChange(paint);
  // 버튼에 포커스가 남아 있으면 Space가 그 버튼도 누르므로(keyup 때), keydown·keyup 모두 막는다.
  const onKey = (e) => {
    if (e.code !== "Space" || phase !== "run") return;
    e.preventDefault();
    if (e.type === "keydown" && !e.repeat) submit();
  };
  const onLang = () => { if (phase === "run") container.querySelector("#target").textContent = noteName(notes[index]); };
  window.addEventListener("keydown", onKey);
  window.addEventListener("keyup", onKey);
  document.addEventListener("langchange", onLang);

  renderSetup();

  return () => {
    if (phase === "run" && session) endSession(session);
    phase = "closed";
    timers.forEach(clearTimeout);
    off();
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("keyup", onKey);
    document.removeEventListener("langchange", onLang);
  };
}
