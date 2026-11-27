// 진짜 센서 보드에서 USB(Web Serial)로 신호 줄을 받는 곳.
// BoardInput("sensor", new SerialLineSource())로 쓰면 키보드 가상 보드와 똑같이 동작한다.
//   1) connect(): 크롬이 포트 선택 창을 띄운다 (버튼 클릭 안에서만 부를 수 있음 — 브라우저 규칙)
//   2) 받은 글자를 줄바꿈(\n) 단위로 잘라 onLine(줄)을 부른다. 한 줄이 두 번에 나눠 와도 이어 붙인다.
// 지금은 디버그 페이지에서만 쓴다. 운지 연습 등 앱 전체를 센서로 바꾸는 것은 보드 시험이 끝난 뒤.
// Web Serial은 컴퓨터용 크롬·엣지에서, https 또는 localhost 주소에서만 동작한다.

export const serialSupported = typeof navigator !== "undefined" && "serial" in navigator && window.isSecureContext;

const BAUD_RATE = 115200; // Pico의 USB 시리얼은 속도 설정과 상관없이 동작하지만, 보드 펌웨어와 맞춰 둔다

export class SerialLineSource {
  constructor({ onStatus } = {}) {
    this.onStatus = onStatus ?? (() => {}); // ("connected" | "disconnected" | "error", 자세한 내용)
    this.onLine = null;
    this.port = null;
    this.reader = null;
  }

  // BoardInput.start()가 부른다. 연결은 connect()로 따로 한다.
  start(onLine) {
    this.onLine = onLine;
  }

  stop() {
    this.disconnect();
    this.onLine = null;
  }

  get connected() {
    return this.port !== null;
  }

  async connect() {
    if (!serialSupported) throw new Error("Web Serial not supported");
    const port = await navigator.serial.requestPort(); // 사용자가 창을 닫으면 여기서 오류(NotFoundError)
    await port.open({ baudRate: BAUD_RATE });
    this.port = port;
    this.onStatus("connected", port.getInfo?.() ?? {});
    this._readLoop(); // 기다리지 않는다: 연결이 끊길 때까지 계속 읽는다
  }

  async disconnect() {
    try { await this.reader?.cancel(); } catch (_) {}
  }

  async _readLoop() {
    const decoder = new TextDecoder();
    let buffer = "";
    let lostReason = "";
    try {
      this.reader = this.port.readable.getReader();
      for (;;) {
        const { value, done } = await this.reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // 마지막 조각은 아직 줄이 안 끝났으니 남겨 둔다
        for (const line of lines) {
          const clean = line.replace(/\r$/, "");
          if (clean) this.onLine?.(clean);
        }
      }
    } catch (err) {
      lostReason = err?.message ?? String(err); // 케이블이 뽑힌 경우 등 → 끊긴 이유로 함께 알린다
    }
    try { this.reader?.releaseLock(); } catch (_) {}
    try { await this.port?.close(); } catch (_) {}
    this.reader = null;
    this.port = null;
    this.onStatus("disconnected", lostReason);
  }
}
