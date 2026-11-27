// 보드 입력 어댑터: "신호 줄"을 받아 키 상태로 바꾼다.
// 줄을 어디서 받는지(lineSource)만 바꾸면 된다:
//   지금  — KeyboardBoard (키보드로 흉내 내는 가상 보드)
//   나중  — SerialLineSource (USB로 연결한 진짜 센서 보드)
// lineSource는 start(onLine) / stop() 두 함수만 있으면 된다.
import { InputAdapter } from "./inputAdapter.js";
import { KEYS, stateFromMask } from "./keys.js";
import { parseLine } from "./boardProtocol.js";

export class BoardInput extends InputAdapter {
  constructor(source, lineSource) {
    super(source); // "keyboard" | "sensor" — 기록에서 시험 데이터와 센서 데이터를 구분한다
    this.lineSource = lineSource;
    this.lineListeners = [];
  }

  start() {
    this.lineSource.start((line) => this.receive(line));
  }

  stop() {
    this.lineSource.stop();
    this.releaseAll();
  }

  // 신호 기록창 같은 곳에서 원래 신호 줄을 보고 싶을 때
  onLine(callback) {
    this.lineListeners.push(callback);
    return () => { this.lineListeners = this.lineListeners.filter((f) => f !== callback); };
  }

  receive(line) {
    const mask = parseLine(line);
    this.lineListeners.forEach((f) => f(line, mask !== null));
    if (mask === null) return;
    const next = stateFromMask(mask);
    KEYS.forEach((k) => this.set(k.id, next[k.id])); // 바뀐 키만 hole_change 이벤트가 나간다
  }
}
