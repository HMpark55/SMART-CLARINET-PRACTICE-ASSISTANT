// 중국어 문구: 원어민 확인 전 초안. 확신이 없는 표현은 줄 끝에 "확인 필요"를 붙였다.
export default {
  "app.title": "单簧管练习",
  "app.subtitle": "自己也能检查指法和音准", // 확인 필요
  "common.comingSoon": "即将推出", // 확인 필요: "准备中"이 더 자연스러운지

  "nav.guide": "使用说明",
  "footer.privacy": "不保存声音 · 记录只保存在这台设备上", // 확인 필요

  "guide.title": "使用说明",
  "guide.ready.title": "1. 准备",
  "guide.ready.body": "只需要 Chrome 浏览器和键盘。可以在右上角选择语言和键盘输入方式。", // 확인 필요
  "guide.keys.title": "2. 键盘 = 单簧管按键", // 확인 필요
  "guide.keys.body": "每个键盘按键对应单簧管的一个音孔或按键。左手音孔是 F D S，右手音孔是 J K L，背面拇指孔是 V。只有彩色边框的其余按键是杠杆键。也可以用鼠标点击图中的按键。", // 확인 필요
  "guide.keys.try": "在按键检查里试试 →", // 확인 필요
  "guide.spaceKey": "确认（指法练习）",
  "guide.mode.title": "3. 输入方式",
  "guide.mode.1": "按住：按住期间算作盖住，最接近真实手指。", // 확인 필요
  "guide.mode.2": "切换：按一次盖住，再按一次打开。同时按很多键有困难时使用。", // 확인 필요
  "guide.mode.3": "Esc：一次松开所有键。",
  "guide.practice.title": "4. 指法练习步骤",
  "guide.practice.1": "阅读说明，填写老师给你的匿名代码。",
  "guide.practice.2": "按照屏幕上的音按好指法。打开提示后，要按的键会显示为虚线。", // 확인 필요
  "guide.practice.3": "按空格键（或确认按钮）。如果错了，改正红框的键再确认。", // 확인 필요
  "guide.practice.4": "8 个音结束后查看结果，可以把记录下载为 CSV。",
  "guide.startPractice": "开始指法练习",
  "guide.trouble.title": "5. 遇到问题时",
  "guide.trouble.1": "同时按很多键时有些键不亮 → 键盘能同时识别的按键数量可能有限，请试试切换方式。", // 확인 필요
  "guide.trouble.2": "按键没有反应 → 光标在输入框里时按键不算指法，请先点击一下空白处。", // 확인 필요
  "guide.trouble.3": "有键一直处于按下状态 → 请按 Esc。",

  "nav.debug": "调试（开发用）", // 확인 필요
  "debug.title": "硬件调试",
  "debug.devOnly": "开发用",
  "debug.intro": "用 USB-C 连接传感器板后，在这里确认信号是否真的传进来。逐个按下再松开每个键，直到下面的检查表全部显示 ✓。", // 확인 필요
  "debug.source.title": "输入来源",
  "debug.source.virtual": "模拟板（键盘·鼠标）", // 확인 필요
  "debug.source.usb": "USB 电路板", // 확인 필요
  "debug.noSerial": "此浏览器无法使用 USB 连接（Web Serial）。请用电脑版 Chrome 通过 https 地址打开。", // 확인 필요
  "debug.connect": "连接电路板", // 확인 필요
  "debug.disconnect": "断开连接",
  "debug.status.connected": "已连接",
  "debug.status.disconnected": "未连接",
  "debug.status.error": "错误",
  "debug.firmwareNote": "每当按键状态变化时，电路板必须发送一行 \"K <十六进制>\"（SPEC.md 第2节）。其他行会以 ? 显示并被忽略。", // 확인 필요
  "debug.sendLine": "输入信号行", // 확인 필요
  "debug.manualNote": "没有电路板也能测试：直接输入 \"K 7\" 这样的信号行。", // 확인 필요
  "debug.state.title": "当前状态",
  "debug.state.bitsNote": "从左到右为第 23 → 0 位。1 = 按下。位号与下方检查表的“通道”相同。", // 확인 필요
  "debug.log.title": "收到的信号行", // 확인 필요
  "debug.log.stats": "收到 {lines} 行 · 格式错误 {bad} 行", // 확인 필요
  "debug.check.title": "按键检查表", // 확인 필요
  "debug.check.reset": "重新开始",
  "debug.check.howto": "逐个按下再松开每个键。按下和松开都收到后显示 ✓。如果其他键也一起亮了，说明接线接错了。", // 확인 필요
  "debug.check.progress": "已确认 {done} / {total}",
  "debug.col.bit": "通道",
  "debug.col.key": "按键",
  "debug.col.kbd": "键盘",
  "debug.col.now": "当前",
  "debug.col.presses": "按下次数", // 확인 필요
  "debug.col.result": "结果",
  "debug.result.none": "—",
  "debug.result.pressed": "仅确认按下", // 확인 필요
  "debug.result.ok": "✓ 正常",

  "nav.keyTest": "按键检查", // 확인 필요
  "nav.fingering": "指法练习",
  "nav.playing": "音准演奏练习", // 확인 필요

  "input.label": "输入方式",
  "input.keyboard": "键盘（测试用）",
  "input.sensor": "传感器板", // 확인 필요

  "keyTest.hint": "每个键盘按键相当于一个传感器。可以按键盘，也可以用鼠标点击图中的按键。Esc = 全部松开", // 확인 필요
  "keyTest.pressed": "按下的键",
  "keyTest.none": "无",
  "keyTest.note": "指法表中的音（记谱音）", // 확인 필요
  "keyTest.unknown": "指法表中没有这个组合", // 확인 필요
  "keyTest.allOpen": "全部打开", // 확인 필요

  "practice.notice1": "声音不会被保存，只有数字记录保存在这台设备上。", // 확인 필요
  "practice.notice2": "请不要填写姓名、学校或联系方式。请使用老师给你的匿名代码。", // 확인 필요
  "practice.storageOff": "此浏览器无法保存记录，关闭窗口后记录会消失。", // 확인 필요
  "practice.agree": "我已阅读说明",
  "practice.anonLabel": "匿名代码",
  "practice.anonHint": "2~16位英文字母或数字（例：S01）",
  "practice.anonInvalid": "匿名代码请使用2~16位英文字母或数字。",
  "practice.hintToggle": "显示指法提示（虚线 = 要按的键）", // 확인 필요
  "practice.start": "开始练习",
  "practice.instruction": "按好指法后按空格键（或确认按钮）", // 확인 필요
  "practice.submit": "确认",
  "practice.skip": "跳过",
  "practice.stop": "停止",
  "practice.progress": "{n} / {total}",
  "practice.doneTitle": "练习结束！",
  "practice.summary": "答对 {solved} / {total} 个音 · 尝试 {attempts} 次", // 확인 필요
  "practice.avgTime": "答对时的平均反应时间：{s}秒", // 확인 필요
  "practice.again": "再练一次",

  "feedback.correct": "正确！",
  "feedback.wrongKeys": "再试一次。请检查这些键：{keys}", // 확인 필요
  "feedback.notReady": "判定功能准备中（不会记录）", // 확인 필요

  "records.title": "本设备上的记录",
  "records.count": "{s} 次练习 · {a} 次尝试", // 확인 필요
  "records.csvSessions": "练习 CSV", // 확인 필요
  "records.csvAttempts": "尝试 CSV", // 확인 필요
  "records.delete": "删除我的记录",
  "records.confirmDelete": "要删除这台设备上保存的所有练习记录和匿名代码吗？",

  "keyMode.label": "键盘输入",
  "keyMode.hold": "按住", // 확인 필요
  "keyMode.toggle": "切换（按一次 = 盖住）", // 확인 필요
  "keyTest.signal": "传感器信号（目前为键盘模拟板）", // 확인 필요
  "keyTest.signalHint": "电路板发送的行。K 后面十六进制数的每一位对应一个键。连接真实电路板后可在这里检查接线。", // 확인 필요
  "practice.escHint": "Esc = 松开所有键", // 확인 필요
  "diagram.caption": "示意图——不是实际位置和比例", // 확인 필요
  "diagram.back": "（背面）",

  "keyGroup.hole": "音孔",
  "keyGroup.lever": "按键",

  // 확인 필요: 중국 학생에게 음명(C D E)과 唱名(do re mi) 중 어느 쪽이 익숙한지
  "notes": "C,C#,D,D#,E,F,F#,G,G#,A,A#,B",
};
