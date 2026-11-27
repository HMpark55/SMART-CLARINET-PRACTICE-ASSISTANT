// "이 기기의 기록" 패널: 기록 개수, CSV 내려받기, 내 기록 삭제 (SPEC.md 5·6절).
import { getRecords, clearRecords } from "../storage/records.js";
import { toCsv, downloadCsv, SESSION_COLUMNS, ATTEMPT_COLUMNS } from "../storage/csv.js";
import { t, applyI18n } from "../i18n/index.js";

export function mountRecordsPanel(el, onCleared) {
  const render = () => {
    const { sessions, attempts } = getRecords();
    el.innerHTML = `
      <h2 data-i18n="records.title"></h2>
      <p class="muted">${t("records.count", { s: sessions.length, a: attempts.length })}</p>
      <div class="row">
        <button class="btn" id="csvSessions" data-i18n="records.csvSessions"></button>
        <button class="btn" id="csvAttempts" data-i18n="records.csvAttempts"></button>
        <button class="btn danger" id="clearRecords" data-i18n="records.delete"></button>
      </div>`;
    applyI18n(el);
    const stamp = new Date().toISOString().slice(0, 10);
    el.querySelector("#csvSessions").onclick = () =>
      downloadCsv(`sessions_${stamp}.csv`, toCsv(getRecords().sessions, SESSION_COLUMNS));
    el.querySelector("#csvAttempts").onclick = () =>
      downloadCsv(`attempts_${stamp}.csv`, toCsv(getRecords().attempts, ATTEMPT_COLUMNS));
    el.querySelector("#clearRecords").onclick = () => {
      if (!confirm(t("records.confirmDelete"))) return;
      clearRecords();
      render();
      onCleared?.();
    };
  };
  render();
  return render;
}
