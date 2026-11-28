// 3D 프린팅 클라리넷 모형 — 5조각 (마우스피스 · 배럴 · 윗관 · 아랫관 · 벨)
// OpenSCAD 파일. 맨 위 숫자만 바꾸면 모든 조각이 다시 계산된다.
// 조각 하나만 내보내기:  openscad -D 'part="upper"' -o upper.stl clarinet.scad
//   part = "mouthpiece" | "barrel" | "upper" | "lower" | "bell" | "fit_test"(결합 시험) | "all"(조립 미리보기)
//
// ⚠ 모든 치수는 첫 시제품용 대략값이다. 학생 클라리넷과 실제 부품(터치 모듈, 버튼, 인서트)을 재서 고친다.
// 단위: mm

part = "all";

// ── 몸통 ──
body_d     = 34;    // 바깥 지름 (실제 악기보다 조금 굵게: 센서 홈 공간)
channel_d  = 14;    // 관 속 전선 통로 지름

// ── 조각 길이 (끼움부 제외 몸통 길이) ── 끼움부 20 + 몸통 ≤ 256 (Bambu X1C·P1S·A1)
mouthpiece_len = 70;
barrel_len     = 60;
upper_len      = 225;
lower_len      = 225;
bell_len       = 120;
bell_bottom_d  = 70;   // 벨 아래 끝 바깥 지름

// ── 끼움 결합 (위 조각의 끼움부가 아래 조각 소켓으로 들어감) ──
tenon_d     = 24;    // 끼움부 지름
tenon_len   = 20;    // 끼움부 길이
fit_gap     = 0.2;   // 소켓 틈새 (한쪽). 시험 출력으로 0.15~0.3 사이에서 맞춘다
screw_d     = 3.4;   // M3 나사가 지나가는 구멍 (소켓 벽)
insert_d    = 4.0;   // M3 열압입 인서트 구멍 (끼움부). 산 인서트 설명서 값으로 바꿀 것
insert_depth = 6;

// ── 센서 홈 ──
touch_w = 12;  touch_h = 16;  touch_depth = 4;    // TTP223 모듈 (약 11×15mm, 실측 필요)
button_w = 6.4;               button_depth = 3.4; // 6×6mm 택트 스위치
wire_hole_d = 5;                                  // 홈 바닥 → 관 속 전선 구멍

$fn = 96;
R = body_d / 2;

// 키 배치: [이름, 종류("touch"|"button"), 몸통 위 끝에서 거리(mm), 각도(도: 0 = 앞, 90 = 오른쪽, 180 = 뒤, -90 = 왼쪽)]
// 앱의 키 ID(src/input/keys.js)와 같은 이름. 위치는 대략값 — 실물 클라리넷을 보고 고친다.
UPPER_KEYS = [
  ["a",         "button", 34,  0],
  ["throat_gs", "button", 46, -35],
  ["register",  "button", 50, 180],
  ["thumb",     "touch",  78, 180],
  ["l1",        "touch",  70,   0],
  ["l2",        "touch", 105,   0],
  ["l3",        "touch", 140,   0],
  ["key_eb",    "button", 128,  60],
  ["side1",     "button", 150,  90],
  ["side2",     "button", 165,  90],
  ["side3",     "button", 180,  90],
  ["side4",     "button", 195,  90],
  ["lp_cs",     "button", 205, -70],
];
LOWER_KEYS = [
  ["lp_fs",     "button", 34, -80],
  ["lp_e",      "button", 49, -80],
  ["lp_f",      "button", 64, -80],
  ["r1",        "touch",  60,   0],
  ["r2",        "touch",  95,   0],
  ["r3",        "touch", 130,   0],
  ["key_b",     "button", 125,  60],
  ["rp_gs",     "button", 165,  75],
  ["rp_fs",     "button", 180,  75],
  ["rp_e",      "button", 195,  75],
  ["rp_f",      "button", 210,  75],
];

// ── 부품 모양 ──

// 센서 홈 하나: 앞(+Y)쪽에 만들고 각도만큼 돌린다. 홈 바닥이 평평해서 모듈·버튼을 붙이기 쉽다.
module pocket(kind, z, angle) {
  w = kind == "touch" ? touch_w : button_w;
  h = kind == "touch" ? touch_h : button_w;
  d = kind == "touch" ? touch_depth : button_depth;
  rotate([0, 0, -angle]) translate([0, 0, z]) {
    translate([-w / 2, R - d, -h / 2]) cube([w, d + 5, h]);              // 홈
    rotate([-90, 0, 0]) cylinder(d = wire_hole_d, h = R);                 // 바닥 → 관 속 전선 구멍
  }
}

// 위쪽 소켓: 위 조각의 끼움부가 들어오는 자리 + 나사 구멍(뒤쪽)
module socket_cut(top) {
  translate([0, 0, top - tenon_len - 1]) cylinder(d = tenon_d + 2 * fit_gap, h = tenon_len + 2);
  translate([0, 0, top - tenon_len / 2]) rotate([90, 0, 0]) cylinder(d = screw_d, h = R + 2);
}

// 아래쪽 끼움부: 몸통 아래로 튀어나온 짧은 관 + 인서트 구멍(뒤쪽, 소켓 나사 구멍과 같은 높이)
module tenon() {
  difference() {
    translate([0, 0, -tenon_len]) cylinder(d = tenon_d, h = tenon_len + 0.01);
    translate([0, 0, -tenon_len / 2]) rotate([90, 0, 0]) cylinder(d = insert_d, h = tenon_d / 2 + 1);
  }
}

// 가운데 관 조각 (배럴, 윗관, 아랫관): 위에 소켓, 아래에 끼움부, 속은 전선 통로
module joint(len, keys, d = body_d) {
  difference() {
    union() {
      cylinder(d = d, h = len);
      tenon();
    }
    translate([0, 0, -tenon_len - 1]) cylinder(d = channel_d, h = len + tenon_len + 2);
    socket_cut(len);
    for (k = keys) pocket(k[1], len - k[2], k[3]);
  }
}

module mouthpiece() {
  difference() {
    union() {
      cylinder(d = body_d - 4, h = mouthpiece_len - 25);
      // 부리 모양: 끝으로 갈수록 납작하게
      hull() {
        translate([0, 0, mouthpiece_len - 25]) cylinder(d = body_d - 4, h = 1);
        translate([0, 2, mouthpiece_len]) scale([1, 0.35, 1]) cylinder(d = body_d - 10, h = 1);
      }
      tenon();
    }
    translate([0, 0, -tenon_len - 1]) cylinder(d = channel_d, h = mouthpiece_len - 20);
  }
}

module barrel() {
  // 배럴은 가운데가 살짝 불룩: 두 원통을 hull로 이어 붙임
  difference() {
    union() {
      hull() {
        cylinder(d = body_d, h = 1);
        translate([0, 0, barrel_len / 2]) cylinder(d = body_d + 3, h = 1);
        translate([0, 0, barrel_len - 1]) cylinder(d = body_d, h = 1);
      }
      tenon();
    }
    translate([0, 0, -tenon_len - 1]) cylinder(d = channel_d, h = barrel_len + tenon_len + 2);
    socket_cut(barrel_len);
  }
}

module bell() {
  // 벨: 위에 소켓, 아래는 넓게 벌어진 입구. 속이 비어 전선 출구(나중엔 Pico 수납)
  difference() {
    cylinder(d1 = bell_bottom_d, d2 = body_d, h = bell_len);
    translate([0, 0, -0.01]) cylinder(d1 = bell_bottom_d - 6, d2 = channel_d, h = bell_len - tenon_len);
    translate([0, 0, bell_len - tenon_len - 2]) cylinder(d = channel_d, h = 4);
    socket_cut(bell_len);
  }
}

// 출력 방향으로 놓기: 소켓 쪽을 바닥에(평평한 링), 끼움부는 위로
module print_flip(len) { translate([0, 0, len]) rotate([180, 0, 0]) children(); }

if (part == "mouthpiece") mouthpiece_print();
if (part == "barrel")     print_flip(barrel_len) barrel();
if (part == "upper")      print_flip(upper_len) joint(upper_len, UPPER_KEYS);
if (part == "lower")      print_flip(lower_len) joint(lower_len, LOWER_KEYS);
if (part == "bell")       bell();
if (part == "all")        assembled();
// 결합 시험 조각: 큰 조각을 뽑기 전에 끼움 틈새(fit_gap)를 확인. 같은 것을 2개 뽑아 서로 끼워 본다.
if (part == "fit_test")   print_flip(25) joint(25, []);

// 마우스피스는 끼움부를 바닥에 두고 부리를 위로 (그대로 올림)
module mouthpiece_print() { translate([0, 0, tenon_len]) mouthpiece(); }

// 조립 미리보기: 위에서부터 끼워진 모습 (출력용 아님)
module assembled() {
  bz = 0;
  lz = bell_len;
  uz = lz + lower_len;
  brz = uz + upper_len;
  mz = brz + barrel_len;
  color("#3b2f52") translate([0, 0, bz]) bell();
  color("#2b2536") translate([0, 0, lz]) joint(lower_len, LOWER_KEYS);
  color("#3b2f52") translate([0, 0, uz]) joint(upper_len, UPPER_KEYS);
  color("#2b2536") translate([0, 0, brz]) barrel();
  color("#3b2f52") translate([0, 0, mz]) mouthpiece();
}
