// 보드 신호 형식 시험. 실행: node docs/test-board.mjs
import { formatLine, parseLine } from "../src/input/boardProtocol.js";
import { stateFromMask, KEYS } from "../src/input/keys.js";

let failed = 0;
const check = (name, got, expected) => {
  const ok = JSON.stringify(got) === JSON.stringify(expected);
  if (!ok) failed++;
  console.log(`${ok ? "OK  " : "FAIL"} ${name}: ${JSON.stringify(got)}`);
};

check("format 7", formatLine(7), "K 7");
check("format 0", formatLine(0), "K 0");
check("format all 24", formatLine(2 ** 24 - 1), "K FFFFFF");
check("parse K 7", parseLine("K 7"), 7);
check("parse lower + 줄끝 공백", parseLine("K ff\r"), 255);
check("parse 도움말 줄", parseLine("ready, 24 keys"), null);
check("parse 범위 초과(25번째 비트)", parseLine("K 1000000"), null);
check("K 7 = thumb,l1,l2", KEYS.filter((k) => stateFromMask(7)[k.id]).map((k) => k.id), ["thumb", "l1", "l2"]);

// 0 ~ 2^24-1 중 몇 개를 골라 format → parse 왕복
for (const mask of [1, 2 ** 23, 0x123456, 0xabcdef]) {
  if (parseLine(formatLine(mask)) !== mask) { failed++; console.log("FAIL round trip", mask); }
}

console.log(failed ? `${failed} failed` : "all passed");
process.exit(failed ? 1 : 0);
