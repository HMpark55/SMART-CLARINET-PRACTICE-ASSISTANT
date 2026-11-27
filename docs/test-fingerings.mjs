// 운지표 시험: 이식한 표가 이전 데모와 같은 결과를 내는지 확인한다.
// 실행: node docs/test-fingerings.mjs  (브라우저 없이 Node로 실행)
import { lookupMidi, fingeringFor } from "../src/feedback/fingerings.js";

const cases = [
  [["thumb", "l1", "l2"], 62],                 // 레4
  [["l2", "thumb", "l1"], 62],                 // 순서가 달라도 같은 음
  [[], 67],                                     // 솔4: 모두 열림
  [["thumb", "l1", "l2", "l3", "r1", "r2", "r3", "lp_e"], 52], // 미3
  [["thumb", "l1", "l2", "l3", "r1", "r2", "r3", "lp_e", "register"], 71], // 시4 (클라리온, 52+19)
  [["thumb", "register"], 84],                 // 도6 (파4 65 + 19)
  [["l3"], null],                               // 운지표에 없는 조합
];

let failed = 0;
for (const [keys, expected] of cases) {
  const got = lookupMidi(keys);
  const ok = got === expected;
  if (!ok) failed++;
  console.log(`${ok ? "OK  " : "FAIL"} [${keys.join(",")}] -> ${got} (expected ${expected})`);
}

// 기본 운지 → 음 → 다시 운지가 왕복되는지 (E3~G6 전체)
for (let midi = 52; midi <= 91; midi++) {
  const keys = fingeringFor(midi);
  if (keys && lookupMidi(keys) !== midi) {
    failed++;
    console.log(`FAIL round trip ${midi}: [${keys}] -> ${lookupMidi(keys)}`);
  }
}

console.log(failed ? `${failed} failed` : "all passed");
process.exit(failed ? 1 : 0);
