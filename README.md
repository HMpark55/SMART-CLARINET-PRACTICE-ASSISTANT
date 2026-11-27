# Smart Clarinet Practice Assistant

혼자 클라리넷을 연습하는 학생이 운지와 음정에 대한 피드백을 바로 받도록 돕는 크롬 웹앱.
명세는 [SPEC.md](SPEC.md), 작업 규칙은 [CLAUDE.md](CLAUDE.md), 부품 안내는 [docs/hardware.md](docs/hardware.md).

## 실행

```
python3 -m http.server 8000
```

크롬에서 http://localhost:8000 을 연다. (`file://`로 열면 ES 모듈·마이크·Web Serial이 동작하지 않는다.)

## 현재 상태

- 키 상태 확인 화면 (키보드 입력) — 동작
- 운지 연습, 음정 연주 연습, 센서 보드 연결, 기록·CSV — 준비 중
