# Smart Clarinet Practice Assistant

혼자 클라리넷을 연습하는 학생이 **운지**와 **음정**에 대한 피드백을 바로 받도록 돕는 크롬 웹앱.
지금은 키보드로 운지를 흉내 내고, 나중에는 클라리넷 모형의 키마다 센서를 달아 같은 앱에 연결한다.

| 문서 | 내용 |
|---|---|
| [CONTRIBUTING.md](CONTRIBUTING.md) | **같이 작업하는 방법** (처음이면 여기부터) |
| [SPEC.md](SPEC.md) | 명세: 키 목록, 신호 형식, 기록 필드 |
| [CLAUDE.md](CLAUDE.md) | 지켜야 할 규칙 (Claude Code도 이 파일을 읽는다) |
| [docs/hardware.md](docs/hardware.md) | 센서·보드 부품 안내 |

## 실행 (내 컴퓨터에서)

```
python3 -m http.server 8000
```

크롬에서 http://localhost:8000 을 연다. `file://`로 열면 동작하지 않는다 (ES 모듈·마이크·Web Serial 제한).

## 배포 (Railway)

`main` 브랜치가 Railway로 배포된다. 저장소의 `Dockerfile`이 Caddy 웹서버로 `index.html`과 `src/`만 내보낸다 (`docs/`, 명세 문서는 배포하지 않음).
`Caddyfile`의 보안 헤더(CSP)가 외부 파일 로드를 막아, "외부 CDN·폰트 금지" 규칙을 브라우저에서도 강제한다.

## 현재 상태

| 기능 | 상태 |
|---|---|
| 키 상태 확인 (`#/keys`, 첫 화면): 클라리넷 그림, 키보드·마우스 입력, 센서 신호 기록 | 동작 |
| 키보드·마우스 = 가상 센서 보드 (꾹 누르기 / 토글, Esc = 모두 떼기) | 동작 |
| 운지 연습 (`#/fingering`), 기록·CSV·내 기록 삭제 | 동작 — **판정 함수는 아직 비어 있음** (세진 작성 예정, 지금은 "판정 준비 중") |
| 운지표 (`#/chart`): 음역별 카드, 클라리넷 그림에 눌러야 할 키 표시, 대체 운지 | 동작 — 표 내용은 실제 운지표와 대조 필요 |
| 사용법 (`#/guide`) | 동작 |
| 디버그 (`#/debug`, 개발용): USB 보드 연결(Web Serial), 받은 신호 줄, 24키 점검표 | 동작 — 실제 보드로는 아직 시험 안 함 |
| 음정 연주 연습 (마이크) | 준비 중 |
| 앱 전체를 진짜 센서 보드 입력으로 전환 | 준비 중 (디버그 페이지에서 보드 확인 후) |

## 폴더 구조

```
index.html              화면 틀
src/
  main.js               시작점: 입력 연결, 탭 전환
  input/                입력 (키 정의, 가상 보드, 신호 해석)
  feedback/             운지표, 판정, 연습 음 목록      ← 세진 담당
  audio/                마이크 음높이 분석 (아직 없음)  ← 세진 담당
  storage/              기록 저장, CSV
  ui/                   화면 (router.js: 주소 #/... → 페이지)
  i18n/                 화면 문구 (ko / en / zh)
docs/                   명세 외 문서, 시험 코드, 테스트 기록
```

## 시험

```
node docs/test-fingerings.mjs
node docs/test-csv.mjs
node docs/test-board.mjs
```

GitHub에 올리면 같은 시험이 자동으로 돈다 (`.github/workflows/test.yml`).
