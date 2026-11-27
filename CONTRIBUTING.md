# 같이 작업하는 방법

이 저장소는 선생님(현모)과 학생(세진)이 같이 고친다. 처음이면 1~3을 순서대로 하면 된다.

## 1. 처음 한 번: 내 컴퓨터로 받기

GitHub에서 초대 메일을 수락한 뒤, 터미널에서:

```
git clone https://github.com/HMpark55/smart-clarinet-practice-assistant.git
cd smart-clarinet-practice-assistant
python3 -m http.server 8000
```

크롬에서 http://localhost:8000 을 열어 화면이 나오면 준비 끝.

## 2. 고칠 때마다: 브랜치 → 커밋 → PR

`main`은 "지금 잘 돌아가는 버전"이다. `main`에 바로 올리지 않고, 내 브랜치에서 고친 뒤 PR(Pull Request)로 합친다.

```
git checkout main
git pull                                  # 최신 버전 받기
git checkout -b sejin/judge-fingering     # 새 브랜치 (이름/하는일)
# ... 코드 고치기 ...
git add src/feedback/feedback.js
git commit -m "운지 판정: 기본 운지와 비교해 틀린 키 찾기"
git push -u origin sejin/judge-fingering
```

그다음 GitHub 저장소 페이지에 뜨는 **Compare & pull request** 버튼으로 PR을 연다.
PR에서는 자동 시험(초록 ✓ / 빨강 ✗)이 돌고, 서로 코드에 댓글을 달 수 있다. 확인이 끝나면 **Merge**.

- 커밋은 작게, 자주. 메시지는 "무엇을 했는지" 알 수 있게 쓴다. 이 기록이 개발 과정의 증거가 된다.
- 한 PR에는 한 가지 일만.

## 3. 누가 무엇을 맡나

| 부분 | 파일 | 담당 |
|---|---|---|
| 운지 판정 | `src/feedback/feedback.js` | 세진 |
| 연습할 음 목록 | `src/feedback/noteSets.js` | 세진 |
| 운지표 | `src/feedback/fingerings.js` | 세진 (이전 데모에서 옮겨 옴) |
| 마이크 음높이 분석 | `src/audio/` (아직 없음) | 세진 |
| 뼈대·입력·기록·화면·문구 | 나머지 | 현모 (+ Claude Code) |

### 세진의 첫 과제: 운지 판정

`src/feedback/feedback.js`의 `judgeFingering`을 채운다. 파일 안에 입력·출력 형식과 생각해 볼 질문 3개가 있다.
다 쓰면 "운지 연습" 탭에서 실제로 채점된다. 시험도 하나 만들어 보자 (`docs/test-fingerings.mjs`를 참고해 `docs/test-feedback.mjs`).

## 4. 지켜야 할 규칙 (요약 — 전체는 CLAUDE.md)

- **외부 CDN·폰트·API 금지.** 중국에서 VPN 없이 열려야 한다. 라이브러리가 필요하면 먼저 상의.
- **소리·영상·이름·학교·연락처는 저장하지 않는다.** 기록에는 익명 코드와 숫자만.
- **화면 문구는 코드에 직접 쓰지 않는다.** `src/i18n/ko.js`, `en.js`, `zh.js`에 키를 추가하고 `t("키")`로 쓴다. 세 파일 모두에.
- **안 만든 기능은 "준비 중".** 된 것처럼 쓰지 않는다.
- 이 저장소는 **공개**다. 누구나 볼 수 있으니 개인정보·비밀번호를 올리지 않는다.

## 5. Claude Code를 쓸 때

Claude Code는 `CLAUDE.md`를 읽고 그 규칙을 따른다. 세진 담당 파일에서는 완성 코드를 한 번에 써 주지 않고, 설명하고 같이 작은 단위로 쓰고 리뷰해 준다. 내가 쓴 코드를 설명할 수 있어야 한다.
