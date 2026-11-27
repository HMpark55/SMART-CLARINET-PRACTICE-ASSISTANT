// 진짜 센서 보드에서 신호 줄을 받는 곳 — 준비 중. 하드웨어가 정해지면 구현한다 (SPEC.md 2절).
// 계획: Web Serial로 포트를 열고, 받은 글자를 줄 단위로 잘라 onLine(줄)을 부른다.
// 그러면 BoardInput("sensor", new SerialLineSource())로 키보드 가상 보드와 똑같이 쓸 수 있다.
// 화면에는 구현되기 전까지 "준비 중"으로만 보여준다 (CLAUDE.md 규칙 8).

export const SENSOR_READY = false;

export class SerialLineSource {
  start() {
    throw new Error("SerialLineSource: not implemented yet");
  }

  stop() {}
}
