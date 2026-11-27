// 키보드로 흉내 내는 가상 센서 보드. 진짜 보드처럼 상태가 바뀔 때마다 "K <16진수>" 한 줄을 보낸다.
// 키보드 키 하나 = 센서 하나 (배치는 keys.js의 code).
//   hold(꾹 누르기): 누르고 있는 동안 덮임 — 진짜 센서와 같은 느낌
//   toggle(토글): 한 번 누르면 덮임, 다시 누르면 열림 — 여러 키를 동시에 누르기 어려울 때
//   Esc: 모두 떼기
import { KEYS } from "./keys.js";
import { formatLine } from "./boardProtocol.js";

const BIT_BY_CODE = Object.fromEntries(KEYS.map((k, i) => [k.code, i]));

export class KeyboardBoard {
  constructor(mode = "hold") {
    this.mode = mode;
    this.mask = 0;
    this.emit = null;
    this._down = (e) => this._handle(e, true);
    this._up = (e) => this._handle(e, false);
    // 꾹 누르기 모드에서 키를 누른 채 창을 벗어나면 keyup이 오지 않는다 → 모두 뗀다
    this._blur = () => { if (this.mode === "hold") this._send(0); };
  }

  start(onLine) {
    this.emit = onLine;
    window.addEventListener("keydown", this._down);
    window.addEventListener("keyup", this._up);
    window.addEventListener("blur", this._blur);
  }

  stop() {
    window.removeEventListener("keydown", this._down);
    window.removeEventListener("keyup", this._up);
    window.removeEventListener("blur", this._blur);
    this.emit = null;
  }

  setMode(mode) {
    this.mode = mode;
    this._send(0); // 모드를 바꿀 때는 모두 떼고 시작
  }

  _handle(e, isDown) {
    if (e.metaKey || e.ctrlKey || e.altKey) return; // Cmd+R 같은 단축키는 건드리지 않는다
    if (e.target.closest?.("input, textarea, select")) return; // 입력창에 글자를 칠 때는 운지로 보지 않는다
    if (e.code === "Escape" && isDown) { this._send(0); return; }
    const bit = BIT_BY_CODE[e.code];
    if (bit === undefined) return;
    e.preventDefault();
    const flag = 1 << bit;
    if (this.mode === "toggle") {
      if (isDown && !e.repeat) this._send(this.mask ^ flag);
    } else {
      this._send(isDown ? this.mask | flag : this.mask & ~flag);
    }
  }

  // 진짜 보드처럼, 상태가 실제로 바뀐 경우에만 한 줄을 보낸다
  _send(mask) {
    if (mask === this.mask) return;
    this.mask = mask;
    this.emit?.(formatLine(mask));
  }
}
