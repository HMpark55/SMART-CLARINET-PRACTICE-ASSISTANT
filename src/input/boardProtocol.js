// 센서 보드 ↔ 앱 신호 형식 (SPEC.md 2절). 진짜 보드와 키보드 가상 보드가 같은 형식을 쓴다.
// 한 줄 = "K <16진수>". 비트 n이 1이면 keys.js의 n번 키가 눌림(덮임).
// 예) 비트 0,1,2 = thumb, l1, l2 → 0b111 = 7 → "K 7"
import { KEYS } from "./keys.js";

const MAX_MASK = 2 ** KEYS.length - 1; // 24키 → 0xFFFFFF

// 눌림 상태 숫자 → 신호 줄
export function formatLine(mask) {
  return `K ${(mask >>> 0).toString(16).toUpperCase()}`;
}

// 신호 줄 → 눌림 상태 숫자. 형식이 틀리거나 범위를 넘으면 null (보드의 도움말·로그 줄은 무시).
export function parseLine(line) {
  const m = /^K ([0-9A-Fa-f]{1,8})$/.exec(String(line).trim());
  if (!m) return null;
  const mask = parseInt(m[1], 16);
  return mask <= MAX_MASK ? mask : null;
}
