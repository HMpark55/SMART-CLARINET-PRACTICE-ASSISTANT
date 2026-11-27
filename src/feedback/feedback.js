// 피드백 판정 — 세진 작성 부분 (CLAUDE.md). 지금은 빈 틀이다.
// 화면은 이 함수의 결과만 보고 움직인다. 아직 null을 돌려주면 화면에 "판정 준비 중"이 뜨고 기록하지 않는다.
//
// ── judgeFingering(targetMidi, pressedKeys) ─────────────────────────
// 입력
//   targetMidi : 목표 음 (써진 음 MIDI 번호, 예: 62 = 레4)
//   pressedKeys: 지금 눌린 키 ID 목록 (예: ["thumb", "l1", "l2"]), 순서는 정해져 있지 않음
// 출력 (SPEC.md 4절 형식 — 나중에 AI 판정으로 바꿔도 이 형식은 유지)
//   {
//     fingering_correct: true / false,
//     wrong_keys: ["l3"],          // 틀린 키: 더 누른 키 + 덜 누른 키
//     pitch_status: null,          // 운지 연습에서는 소리를 안 보므로 null
//     cents: null,
//     message_key: "feedback.correct" 또는 "feedback.wrongKeys"   // 문구는 src/i18n에 있음
//   }
//
// 쓸 수 있는 도구 (src/feedback/fingerings.js)
//   fingeringFor(midi)   → 그 음의 기본 운지 키 목록
//   lookupMidi(keys)     → 키 목록이 운지표에서 어떤 음인지 (없으면 null)
//
// 같이 생각해 볼 것
//   1. 미3(52)처럼 운지가 두 개(lp_e 또는 rp_e)인 음: 기본 운지만 정답? 다른 운지도 정답?
//      → fingeringFor와 비교하면 기본 운지만, lookupMidi로 비교하면 모든 운지가 정답이 된다.
//   2. 틀렸을 때 wrong_keys는 어느 운지를 기준으로 계산할까?
//   3. 센서를 달지 않은 키가 있다면 그 키는 판정에서 빼야 할까?

export function judgeFingering(targetMidi, pressedKeys) {
  // TODO(세진): 위 설명대로 작성
  return null;
}
