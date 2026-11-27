// CSV 변환 시험. 실행: node docs/test-csv.mjs
import { toCsv } from "../src/storage/csv.js";

const text = toCsv(
  [
    { a: "thumb,l1", b: 'say "hi"', c: null },
    { a: "레4", b: 12.5, c: false },
  ],
  ["a", "b", "c"],
);

const expected = '﻿a,b,c\r\n"thumb,l1","say ""hi""",\r\n레4,12.5,false\r\n';
const ok = text === expected;
console.log(ok ? "all passed" : `FAIL\n${JSON.stringify(text)}\n${JSON.stringify(expected)}`);
process.exit(ok ? 0 : 1);
