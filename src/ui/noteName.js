// MIDI 번호 → 화면용 음 이름 (예: 62 → "레4" / "D4"). 음 이름은 i18n의 "notes"에서 가져온다.
import { t } from "../i18n/index.js";

export function noteName(midi) {
  const names = t("notes").split(",");
  const octave = Math.floor(midi / 12) - 1; // MIDI 60 = 4옥타브 도
  return `${names[midi % 12]}${octave}`;
}
