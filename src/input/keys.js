// 24개 키 정의. 앱 전체에서 키 목록은 여기 한 곳에만 둔다 (SPEC.md 2절 표와 같아야 한다).
// 배열 순서 = 센서 채널(비트) 번호. 센서 보드가 "K 7"을 보내면 0,1,2번(thumb, l1, l2)이 눌린 것.
// code: 키보드 시험용 매핑 (KeyboardEvent.code). label: 화면에 보이는 짧은 이름.

export const KEYS = [
  { id: "thumb",     label: "T",     group: "hole",  code: "KeyV" },
  { id: "l1",        label: "L1",    group: "hole",  code: "KeyF" },
  { id: "l2",        label: "L2",    group: "hole",  code: "KeyD" },
  { id: "l3",        label: "L3",    group: "hole",  code: "KeyS" },
  { id: "r1",        label: "R1",    group: "hole",  code: "KeyJ" },
  { id: "r2",        label: "R2",    group: "hole",  code: "KeyK" },
  { id: "r3",        label: "R3",    group: "hole",  code: "KeyL" },
  { id: "register",  label: "REG",   group: "lever", code: "KeyB" },
  { id: "a",         label: "A",     group: "lever", code: "KeyG" },
  { id: "lp_cs",     label: "LP C#", group: "lever", code: "KeyQ" },
  { id: "lp_e",      label: "LP E",  group: "lever", code: "KeyW" },
  { id: "lp_f",      label: "LP F",  group: "lever", code: "KeyE" },
  { id: "lp_fs",     label: "LP F#", group: "lever", code: "KeyR" },
  { id: "rp_e",      label: "RP E",  group: "lever", code: "KeyU" },
  { id: "rp_f",      label: "RP F",  group: "lever", code: "KeyI" },
  { id: "rp_fs",     label: "RP F#", group: "lever", code: "KeyO" },
  { id: "rp_gs",     label: "RP G#", group: "lever", code: "KeyP" },
  { id: "side4",     label: "S4",    group: "lever", code: "KeyH" },
  { id: "side1",     label: "S1",    group: "lever", code: "Digit1" },
  { id: "side2",     label: "S2",    group: "lever", code: "Digit2" },
  { id: "side3",     label: "S3",    group: "lever", code: "Digit3" },
  { id: "key_b",     label: "B",     group: "lever", code: "KeyZ" }, // 확인 필요: 실제 명칭
  { id: "key_eb",    label: "Eb",    group: "lever", code: "KeyX" }, // 확인 필요: 실제 명칭
  { id: "throat_gs", label: "TG#",   group: "lever", code: "KeyC" },
];

export const KEY_IDS = KEYS.map((k) => k.id);

// 모든 키가 열린 상태 { thumb: false, l1: false, ... }
export function emptyState() {
  return Object.fromEntries(KEY_IDS.map((id) => [id, false]));
}

// 센서 보드의 비트마스크(숫자) → 키 상태. 비트 n = KEYS[n].
export function stateFromMask(mask) {
  return Object.fromEntries(KEYS.map((k, i) => [k.id, Boolean(mask & (1 << i))]));
}
