// 클라리넷 운지표 — 세진이 이전 데모(fingering.js)에 쓴 표를 그대로 옮겼다.
// 바뀐 것은 표기 방식뿐: 비트마스크 대신 키 이름 목록으로 써서 읽기 쉽게 했다. 음과 운지는 같다.
// 음은 MIDI 번호, "써진 음" 기준이다 (60 = 가운데 도 C4). 기본 운지 E3(52) ~ G6(91).
// 이 파일은 세진 담당 (CLAUDE.md). 고칠 때는 SPEC.md 2절 키 표와 맞는지 같이 본다.

const HOLES = ["thumb", "l1", "l2", "l3", "r1", "r2", "r3"]; // 구멍 7개 모두 막음
const LEFT3 = ["thumb", "l1", "l2", "l3"];                    // 왼손 + 엄지

// [누른 키 목록, MIDI]. 같은 음에 운지가 여러 개면 위에 있는 것이 기본 운지(연습 힌트용).
const TABLE = [
  // 샬뤼모 음역 (낮은 음)
  [[...HOLES, "lp_e"], 52],  // 미3 (E3)
  [[...HOLES, "rp_e"], 52],
  [[...HOLES, "lp_f"], 53],  // 파3
  [[...HOLES, "rp_f"], 53],
  [[...HOLES, "lp_fs"], 54], // 파#3
  [[...HOLES, "rp_fs"], 54],
  [[...HOLES], 55],          // 솔3
  [[...HOLES, "rp_gs"], 56], // 솔#3
  [[...HOLES, "lp_cs"], 56],
  [[...LEFT3, "r1", "r2"], 57], // 라3
  [[...LEFT3, "r1"], 58],    // 라#3
  [[...LEFT3, "r2"], 59],    // 시3
  [[...LEFT3], 60],          // 도4
  [[...LEFT3, "lp_cs"], 61], // 도#4
  [["thumb", "l1", "l2"], 62],          // 레4
  [["thumb", "l1", "l2", "side4"], 63], // 레#4
  [["thumb", "l1"], 64],     // 미4
  [["thumb"], 65],           // 파4
  [["l1"], 66],              // 파#4
  // 목(throat) 음역
  [[], 67],                  // 솔4: 모두 열림
  [["throat_gs"], 68],       // 솔#4: 목 G# 키 하나
  [["a"], 69],               // 라4
  [["register", "a"], 70],   // 라#4
  // 하부 알티시모 (높은 음)
  [["register", "thumb", "l2", "l3", "r1", "r2"], 85],
  [["register", "thumb", "l2", "l3", "r1", "rp_gs"], 86],
  [["register", "thumb", "l2", "l3", "rp_gs"], 88],
  [["register", "thumb", "l2", "l3", "lp_cs", "rp_gs"], 89],
  [["register", "thumb", "l2", "rp_gs"], 90],
  [["register", "thumb", "l2", "r1", "r2", "rp_gs"], 91],
];

// 클라리온 음역: 샬뤼모 운지(E3~F4)에 레지스터 키를 더하면 19반음(12도) 위.
// 클라리넷은 레지스터 키로 옥타브(12반음)가 아니라 12도가 올라간다.
const REGISTER_OFFSET = 19;
const CLARION_BASE_MIN = 52;
const CLARION_BASE_MAX = 65;

// 키 목록을 순서와 상관없이 비교하려고 정렬한 문자열로 바꾼다.
const keyOf = (keys) => [...keys].sort().join(",");
const MIDI_BY_KEYS = new Map();
for (const [keys, midi] of TABLE) {
  if (!MIDI_BY_KEYS.has(keyOf(keys))) MIDI_BY_KEYS.set(keyOf(keys), midi);
}

// 눌린 키 목록 → 써진 음 MIDI. 운지표에 없으면 null.
export function lookupMidi(pressedKeys) {
  const exact = MIDI_BY_KEYS.get(keyOf(pressedKeys));
  if (exact !== undefined) return exact;
  if (pressedKeys.includes("register")) {
    const base = MIDI_BY_KEYS.get(keyOf(pressedKeys.filter((k) => k !== "register")));
    if (base !== undefined && base >= CLARION_BASE_MIN && base <= CLARION_BASE_MAX) {
      return base + REGISTER_OFFSET;
    }
  }
  return null;
}

// 써진 음 MIDI → 기본 운지(키 목록). 없으면 null. (연습 화면의 힌트용)
export function fingeringFor(midi) {
  const found = TABLE.find(([, m]) => m === midi);
  if (found) return [...found[0]];
  const base = midi - REGISTER_OFFSET;
  if (base >= CLARION_BASE_MIN && base <= CLARION_BASE_MAX) {
    const baseKeys = fingeringFor(base);
    if (baseKeys) return [...baseKeys, "register"];
  }
  return null;
}
