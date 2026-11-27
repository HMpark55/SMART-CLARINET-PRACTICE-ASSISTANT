// MIDI 번호 → 음 이름. 화면용은 언어별(레4 / D4), 기록(CSV)용은 언어와 상관없이 영문(D4).
import { t } from "../i18n/index.js";

const LETTERS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const octaveOf = (midi) => Math.floor(midi / 12) - 1; // MIDI 60 = 4옥타브 도

export function noteName(midi) {
  const names = t("notes").split(",");
  return `${names[midi % 12]}${octaveOf(midi)}`;
}

// 기록용: 화면 언어가 달라도 분석할 때 같은 값이 되도록 영문으로 고정
export function noteLetter(midi) {
  return `${LETTERS[midi % 12]}${octaveOf(midi)}`;
}
