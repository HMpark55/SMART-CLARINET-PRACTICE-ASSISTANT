// 키보드로 운지를 흉내 내는 시험용 어댑터. 누르고 있는 동안 덮임, 떼면 열림.
import { InputAdapter } from "./inputAdapter.js";
import { KEYS } from "./keys.js";

const ID_BY_CODE = Object.fromEntries(KEYS.map((k) => [k.code, k.id]));

export class KeyboardInput extends InputAdapter {
  constructor() {
    super("keyboard");
    this._down = (e) => this._handle(e, true);
    this._up = (e) => this._handle(e, false);
    // 키를 누른 채 다른 창으로 가면 keyup이 오지 않아 키가 "눌린 채" 남는다 → 모두 뗀다.
    this._blur = () => this.releaseAll();
  }

  start() {
    window.addEventListener("keydown", this._down);
    window.addEventListener("keyup", this._up);
    window.addEventListener("blur", this._blur);
  }

  stop() {
    window.removeEventListener("keydown", this._down);
    window.removeEventListener("keyup", this._up);
    window.removeEventListener("blur", this._blur);
    this.releaseAll();
  }

  _handle(e, covered) {
    const id = ID_BY_CODE[e.code];
    if (!id) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return; // Cmd+R 같은 단축키는 건드리지 않는다
    if (covered && e.target.closest?.("input, textarea, select")) return; // 입력창에 글자를 칠 때는 운지로 보지 않는다
    e.preventDefault();
    this.set(id, covered);
  }
}
