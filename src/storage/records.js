// 연습 기록 저장 (SPEC.md 5절). 이 기기의 localStorage에만 저장하고 서버로 보내지 않는다.
// 저장하는 것은 숫자와 키 이름뿐. 이름·학교·연락처·소리는 저장하지 않는다.
import { APP_VERSION } from "../version.js";

const STORAGE_KEY = "records_v1";
const ANON_KEY = "anon_code";

// localStorage가 막힌 환경(사생활 보호 모드 등)에서도 앱이 멈추지 않도록, 실패하면 메모리에만 둔다.
let memory = { sessions: [], attempts: [] };
export let storageAvailable = true;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) memory = JSON.parse(raw);
  } catch (_) {
    storageAvailable = false;
  }
  return memory;
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch (_) {
    storageAvailable = false;
  }
}

load();

// 익명 코드: 영문·숫자·-·_ 2~16자. 이름을 막을 수는 없으니 화면 안내로 대신한다.
export const ANON_CODE_PATTERN = /^[A-Za-z0-9_-]{2,16}$/;

export function getAnonCode() {
  try { return localStorage.getItem(ANON_KEY) || ""; } catch (_) { return ""; }
}

export function setAnonCode(code) {
  try { localStorage.setItem(ANON_KEY, code); } catch (_) {}
}

function randomId() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// 연습 1회 시작. mode: "fingering" | "playing", input_source: "keyboard" | "sensor"
export function startSession({ anon_code, mode, input_source, lang }) {
  const session = {
    session_id: randomId(),
    anon_code,
    started_at: new Date().toISOString(),
    duration_s: 0,
    mode,
    input_source,
    app_version: APP_VERSION,
    lang,
  };
  memory.sessions.push(session);
  save();
  return session;
}

// 시도 1개 저장. attempt_index와 공통 필드는 여기서 채운다.
export function addAttempt(session, fields) {
  const attempt_index = memory.attempts.filter((a) => a.session_id === session.session_id).length + 1;
  memory.attempts.push({
    session_id: session.session_id,
    attempt_index,
    mode: session.mode,
    input_source: session.input_source,
    ...fields,
  });
  save();
}

export function endSession(session) {
  const found = memory.sessions.find((s) => s.session_id === session.session_id);
  if (found) {
    found.duration_s = Math.round((Date.now() - Date.parse(found.started_at)) / 1000);
    save();
  }
}

export function getRecords() {
  return { sessions: [...memory.sessions], attempts: [...memory.attempts] };
}

// 사용자가 자기 기록을 지우는 버튼용 (SPEC.md 6절). 익명 코드도 함께 지운다.
export function clearRecords() {
  memory = { sessions: [], attempts: [] };
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ANON_KEY);
  } catch (_) {}
}
