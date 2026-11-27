// 센서 보드 어댑터 — 준비 중. 하드웨어가 정해지면 구현한다 (SPEC.md 2절).
// 계획: Web Serial로 "K <16진수>" 한 줄씩 받아 stateFromMask()로 바꾼 뒤, 바뀐 키마다 this.set() 호출.
// 화면에는 구현되기 전까지 "준비 중"으로만 보여준다 (CLAUDE.md 규칙 8).
import { InputAdapter } from "./inputAdapter.js";

export const SENSOR_READY = false;

export class SerialInput extends InputAdapter {
  constructor() {
    super("sensor");
  }

  start() {
    throw new Error("SerialInput: not implemented yet");
  }
}
