// 연습할 음 목록 — 세진이 정하는 부분 (SPEC.md 9절 "아직 정하지 않은 것").
// 아래는 화면을 시험하려고 넣은 임시 목록: 샬뤼모 음역의 샵 없는 음 (써진 음).
// 세진이 실제 연습 순서와 범위를 정하면 이 목록을 바꾸고, 근거를 docs/에 적는다.

export const FINGERING_PRACTICE_NOTES = [
  52, // 미3
  53, // 파3
  55, // 솔3
  57, // 라3
  59, // 시3
  60, // 도4
  62, // 레4
  64, // 미4
  65, // 파4
  67, // 솔4
];

export const ROUND_LENGTH = 8; // 한 번 연습할 때 문제 수

// 목록에서 무작위로 count개. 바로 앞 음과 같은 음이 연달아 나오지 않게 한다.
export function pickNotes(count, pool = FINGERING_PRACTICE_NOTES) {
  const picked = [];
  while (picked.length < count) {
    const midi = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && midi === picked[picked.length - 1]) continue;
    picked.push(midi);
  }
  return picked;
}
