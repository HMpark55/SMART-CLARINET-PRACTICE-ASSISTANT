# Smart Clarinet Practice Assistant

혼자 클라리넷을 연습하는 학생이 운지와 음정에 대한 피드백을 바로 받도록 돕는 크롬 웹앱.
명세는 [SPEC.md](SPEC.md), 작업 규칙은 [CLAUDE.md](CLAUDE.md), 부품 안내는 [docs/hardware.md](docs/hardware.md).

## 실행

```
python3 -m http.server 8000
```

크롬에서 http://localhost:8000 을 연다. (`file://`로 열면 ES 모듈·마이크·Web Serial이 동작하지 않는다.)

## 현재 상태

- 키보드 = 가상 센서 보드 (꾹 누르기 / 토글, Esc = 모두 떼기) — 동작. 진짜 보드와 같은 신호 줄(`K <16진수>`)을 쓰므로 나중에 입력 출처만 바꾸면 된다 (SPEC.md 2절)
- 키 상태 확인 화면 (클라리넷 개념도, 신호 기록) — 동작
- 운지 연습 화면, 기록·CSV·내 기록 삭제 — 동작. **판정 함수(`src/feedback/feedback.js`)는 세진이 작성 예정**이라 지금은 "판정 준비 중"으로 표시되고 기록하지 않음
- 음정 연주 연습, 센서 보드 연결 — 준비 중

## 시험

```
node docs/test-fingerings.mjs
node docs/test-csv.mjs
node docs/test-board.mjs
```
