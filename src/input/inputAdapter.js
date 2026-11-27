// 입력 어댑터 공통 틀 (SPEC.md 2절).
// 키보드·센서 어댑터는 이 클래스를 상속하고, 상태가 바뀌면 this.set(id, covered)만 부른다.
// 앱의 다른 부분은 onChange 이벤트와 getState()만 보므로, 입력 출처가 바뀌어도 고칠 필요가 없다.
import { KEY_IDS, emptyState } from "./keys.js";

export class InputAdapter {
  constructor(source) {
    this.source = source; // "keyboard" | "sensor"
    this.state = emptyState();
    this.listeners = [];
  }

  start() {}
  stop() {}

  onChange(callback) {
    this.listeners.push(callback);
    return () => { this.listeners = this.listeners.filter((f) => f !== callback); };
  }

  getState() {
    return { ...this.state };
  }

  // 실제로 상태가 바뀐 경우에만 hole_change 이벤트를 보낸다 (키를 꾹 누를 때 반복 입력 무시).
  set(id, covered) {
    if (!KEY_IDS.includes(id) || this.state[id] === covered) return;
    this.state[id] = covered;
    const event = { type: "hole_change", hole: id, covered, t: performance.now(), source: this.source };
    this.listeners.forEach((f) => f(event));
  }

  // 모두 열린 상태로 되돌린다 (창을 벗어날 때 등).
  releaseAll() {
    KEY_IDS.forEach((id) => this.set(id, false));
  }
}
