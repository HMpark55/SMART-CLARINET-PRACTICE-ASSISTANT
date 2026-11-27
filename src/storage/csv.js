// 기록을 CSV로 바꾸고 내려받기 (SPEC.md 5절 CSV 규칙).
// 맨 앞에 BOM(﻿)을 붙여야 Mac Excel이 UTF-8로 읽어 한글·중국어가 깨지지 않는다.

export const SESSION_COLUMNS = [
  "session_id", "anon_code", "started_at", "duration_s", "mode", "input_source", "app_version", "lang",
];

export const ATTEMPT_COLUMNS = [
  "session_id", "attempt_index", "mode", "target_note", "input_fingering", "fingering_correct",
  "wrong_keys", "freq_hz", "cents", "pitch_status", "response_ms", "input_source",
];

// 쉼표·따옴표·줄바꿈이 들어간 값은 따옴표로 감싸고, 안의 따옴표는 두 번 쓴다 (CSV 표준).
function cell(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\n\r]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

export function toCsv(rows, columns) {
  const lines = [columns.join(",")];
  for (const row of rows) lines.push(columns.map((c) => cell(row[c])).join(","));
  return "﻿" + lines.join("\r\n") + "\r\n";
}

export function downloadCsv(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
