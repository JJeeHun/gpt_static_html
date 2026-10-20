const datasets = {
  seoul: {
    center: "서울물류센터",
    kpis: [
      ["현재고", "128,420", "EA", "▲ 전일 대비 2,184", "good", "boxes"],
      ["금일 입고", "3,284", "EA", "예정 3,640 · 완료율 90.2%", "", "package-plus"],
      ["금일 출고", "2,917", "EA", "지시 3,120 · 완료율 93.5%", "", "package-check"],
      ["출고 대기", "186", "건", "피킹 지연 24건 포함", "warn", "timer-reset"],
      ["재고 이상", "24", "건", "보류 9 · 부족 8 · 유통기한 7", "danger", "triangle-alert"]
    ],
    flow: { labels: ["09/13","09/14","09/15","09/16","09/17","09/18","09/19"], inbound: [1860, 2520, 2110, 3030, 2760, 3310, 3284], outbound: [1420, 1880, 2320, 2410, 2940, 2660, 2917] },
    capacity: [["A창고",72],["B창고",88],["C창고",64],["냉장창고",94],["반품창고",41]],
    stock: [["정상",3470,"가용 재고 정상","good"],["주의",820,"안전재고 이하 / 임박","warn"],["보류",530,"검수·품질·재고 잠금","danger"]],
    work: [["입고검수",412,452],["적치",358,426],["피킹",504,646],["패킹",468,543],["출고확정",390,415]],
    alerts: [
      ["긴급","danger","ITEM-000126","안전재고 미만으로 출고 가능 수량 확인 필요","B창고","09:42","미처리","open"],
      ["주의","warn","LOT26091408","유통기한 30일 이내 재고 존재","A창고","09:28","확인 필요","check"],
      ["주의","warn","LOC-COLD-02","냉장창고 적재율 94% 초과","냉장창고","09:10","확인 필요","check"],
      ["정보","info","OUT-260919-041","피킹 완료 후 패킹 대기 35분 경과","A창고","08:55","진행중",""]
    ]
  },
  incheon: {
    center: "인천물류센터",
    kpis: [
      ["현재고", "94,860", "EA", "▼ 전일 대비 1,126", "warn", "boxes"],
      ["금일 입고", "2,742", "EA", "예정 2,980 · 완료율 92.0%", "", "package-plus"],
      ["금일 출고", "3,018", "EA", "지시 3,140 · 완료율 96.1%", "good", "package-check"],
      ["출고 대기", "121", "건", "피킹 지연 11건 포함", "warn", "timer-reset"],
      ["재고 이상", "13", "건", "보류 4 · 부족 6 · 유통기한 3", "danger", "triangle-alert"]
    ],
    flow: { labels: ["09/13","09/14","09/15","09/16","09/17","09/18","09/19"], inbound: [2390, 2110, 2850, 2630, 3040, 2870, 2742], outbound: [2180, 2440, 2530, 2890, 2710, 3210, 3018] },
    capacity: [["1창고",67],["2창고",79],["보세창고",86],["냉장창고",71],["반품창고",36]],
    stock: [["정상",3012,"가용 재고 정상","good"],["주의",566,"안전재고 이하 / 임박","warn"],["보류",322,"검수·품질·재고 잠금","danger"]],
    work: [["입고검수",365,392],["적치",322,368],["피킹",461,538],["패킹",432,486],["출고확정",405,421]],
    alerts: [
      ["주의","warn","ITEM-002102","안전재고 기준 이하 품목 6건 확인 필요","2창고","09:35","확인 필요","check"],
      ["주의","warn","LOC-BOND-07","보세창고 적재율 86% 도달","보세창고","09:11","확인 필요","check"],
      ["정보","info","IN-260919-024","입고 검수 대기 팔레트 8건","1창고","08:48","진행중",""]
    ]
  },
  daejeon: {
    center: "대전물류센터",
    kpis: [
      ["현재고", "76,540", "EA", "▲ 전일 대비 842", "good", "boxes"],
      ["금일 입고", "1,928", "EA", "예정 2,120 · 완료율 90.9%", "", "package-plus"],
      ["금일 출고", "1,744", "EA", "지시 1,880 · 완료율 92.8%", "", "package-check"],
      ["출고 대기", "84", "건", "피킹 지연 7건 포함", "warn", "timer-reset"],
      ["재고 이상", "9", "건", "보류 3 · 부족 4 · 유통기한 2", "danger", "triangle-alert"]
    ],
    flow: { labels: ["09/13","09/14","09/15","09/16","09/17","09/18","09/19"], inbound: [1410, 1680, 1550, 2010, 1810, 2120, 1928], outbound: [1320, 1490, 1710, 1660, 1880, 1790, 1744] },
    capacity: [["A동",58],["B동",74],["C동",82],["냉장동",69],["반품동",32]],
    stock: [["정상",2488,"가용 재고 정상","good"],["주의",432,"안전재고 이하 / 임박","warn"],["보류",180,"검수·품질·재고 잠금","danger"]],
    work: [["입고검수",244,276],["적치",211,249],["피킹",302,355],["패킹",288,326],["출고확정",257,274]],
    alerts: [
      ["긴급","danger","ITEM-003881","가용 재고 부족으로 출고 지시 확인 필요","B동","09:31","미처리","open"],
      ["주의","warn","LOT26090511","유통기한 30일 이내 재고 존재","A동","09:02","확인 필요","check"],
      ["정보","info","MOVE-260919-008","재고 이동 작업 20분 경과","C동","08:40","진행중",""]
    ]
  }
};

const state = { center: "seoul", problemOnly: false };
const $ = (selector) => document.querySelector(selector);
const number = (value) => new Intl.NumberFormat("ko-KR").format(value);
let toastTimer;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderKpis(data) {
  $("#kpiGrid").innerHTML = data.kpis.map(([label, value, unit, sub, tone, icon]) => `
    <article class="kpi-card">
      <div class="kpi-top"><span>${label}</span><span class="kpi-icon"><i data-lucide="${icon}"></i></span></div>
      <div><div class="kpi-value">${value}<small>${unit}</small></div><div class="kpi-sub ${tone}">${sub}</div></div>
    </article>`).join("");
}

function renderCapacity(data) {
  $("#capacityList").innerHTML = data.capacity.map(([name, value]) => {
    const tone = value >= 92 ? "danger" : value >= 85 ? "warn" : "";
    return `<div class="capacity-row"><span>${name}</span><div class="progress-track" aria-label="${name} 적재율 ${value}%"><div class="progress-fill ${tone}" style="width:${value}%"></div></div><strong>${value}%</strong></div>`;
  }).join("");
}

function renderStock(data) {
  const total = data.stock.reduce((sum, [, value]) => sum + value, 0);
  const percentages = data.stock.map(([, value]) => value / total * 100);
  const first = percentages[0];
  const second = first + percentages[1];
  $("#stockTotal").textContent = number(total);
  $("#stockDonut").style.background = `conic-gradient(var(--success) 0 ${first}%, #d5982d ${first}% ${second}%, var(--danger) ${second}% 100%)`;
  $("#stockLegend").innerHTML = data.stock.map(([label, value, desc, tone]) => `
    <div class="stock-item"><span class="stock-swatch ${tone}"></span><span>${label}<small>${desc}</small></span><strong>${number(value)}</strong></div>`).join("");
}

function renderWork(data) {
  $("#workList").innerHTML = data.work.map(([label, done, total]) => {
    const percent = Math.round(done / total * 100);
    return `<div class="work-row"><span>${label}</span><div class="work-track" aria-label="${label} ${percent}% 완료"><div class="work-fill" style="width:${percent}%">${percent}%</div></div><strong>${done}/${total}</strong></div>`;
  }).join("");
}

function renderAlerts(data) {
  const alerts = state.problemOnly ? data.alerts.filter(([, tone]) => tone !== "info") : data.alerts;
  $("#alertTableBody").innerHTML = alerts.map(([priority, tone, code, message, warehouse, time, status, statusTone]) => `
    <tr><td><span class="alert-badge ${tone}">${priority}</span></td><td><strong>${code}</strong></td><td>${message}</td><td>${warehouse}</td><td>${time}</td><td><span class="state-badge ${statusTone}">${status}</span></td></tr>`).join("");
  $("#mobileAlerts").innerHTML = alerts.map(([priority, tone, code, message, warehouse, time, status, statusTone]) => `
    <article class="mobile-alert-card"><div class="mobile-alert-top"><span class="alert-badge ${tone}">${priority}</span><span class="state-badge ${statusTone}">${status}</span></div><strong>${code}</strong><p>${message}</p><div class="mobile-alert-meta"><span>${warehouse}</span><span>${time}</span></div></article>`).join("");
}

function renderChart(data) {
  const svg = $("#flowChart");
  const width = 760, height = 260, left = 48, right = 18, top = 18, bottom = 34;
  const innerWidth = width - left - right, innerHeight = height - top - bottom;
  const maxValue = Math.ceil(Math.max(...data.flow.inbound, ...data.flow.outbound) / 1000) * 1000;
  const steps = 4;
  const x = (index) => left + innerWidth * index / (data.flow.labels.length - 1);
  const y = (value) => top + innerHeight * (1 - value / maxValue);
  const line = (values) => values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
  let html = "";
  for (let i = 0; i <= steps; i++) {
    const value = maxValue - (maxValue / steps * i);
    const yy = top + innerHeight / steps * i;
    html += `<line class="chart-grid-line" x1="${left}" y1="${yy}" x2="${width-right}" y2="${yy}"></line>`;
    html += `<text class="chart-axis" x="0" y="${yy+3}">${number(Math.round(value))}</text>`;
  }
  html += `<polyline class="chart-line-in" points="${line(data.flow.inbound)}"></polyline>`;
  html += `<polyline class="chart-line-out" points="${line(data.flow.outbound)}"></polyline>`;
  data.flow.labels.forEach((label, index) => {
    html += `<text class="chart-axis" text-anchor="middle" x="${x(index)}" y="${height-7}">${label}</text>`;
    html += `<circle class="chart-dot-in" cx="${x(index)}" cy="${y(data.flow.inbound[index])}" r="4"></circle>`;
    html += `<circle class="chart-dot-out" cx="${x(index)}" cy="${y(data.flow.outbound[index])}" r="4"></circle>`;
  });
  svg.innerHTML = html;
}

function renderAll() {
  const data = datasets[state.center];
  $("#headerCenter").textContent = data.center;
  renderKpis(data);
  renderCapacity(data);
  renderStock(data);
  renderWork(data);
  renderAlerts(data);
  renderChart(data);
  if (window.lucide) window.lucide.createIcons();
}

function closeSidebar() {
  $("#sidebar").classList.remove("open");
  $("#sidebarBackdrop").hidden = true;
  $("#menuButton").setAttribute("aria-expanded", "false");
}

function bindEvents() {
  $("#centerSelect").addEventListener("change", (event) => {
    state.center = event.target.value;
    state.problemOnly = false;
    $("#alertFilter").setAttribute("aria-pressed", "false");
    renderAll();
    showToast(`${datasets[state.center].center} 기준으로 화면을 갱신했습니다.`);
  });

  $("#dateInput").addEventListener("change", (event) => {
    showToast(`${event.target.value} 기준 샘플 화면입니다. 데이터 값은 데모 값으로 유지됩니다.`);
  });

  $("#refreshButton").addEventListener("click", () => {
    const button = $("#refreshButton");
    button.classList.add("loading");
    button.disabled = true;
    setTimeout(() => {
      const now = new Date();
      $("#lastUpdated").textContent = `마지막 갱신 ${now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}`;
      button.classList.remove("loading");
      button.disabled = false;
      showToast("샘플 데이터를 새로고침했습니다.");
    }, 450);
  });

  $("#alertFilter").addEventListener("click", (event) => {
    state.problemOnly = !state.problemOnly;
    event.currentTarget.setAttribute("aria-pressed", String(state.problemOnly));
    renderAlerts(datasets[state.center]);
  });

  $("#menuButton").addEventListener("click", () => {
    $("#sidebar").classList.add("open");
    $("#sidebarBackdrop").hidden = false;
    $("#menuButton").setAttribute("aria-expanded", "true");
  });
  $("#closeSidebar").addEventListener("click", closeSidebar);
  $("#sidebarBackdrop").addEventListener("click", closeSidebar);

  document.querySelectorAll("[data-demo-message]").forEach((element) => {
    element.addEventListener("click", () => showToast(element.dataset.demoMessage));
  });
  document.querySelectorAll(".topnav [data-module]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!button.classList.contains("active")) showToast(`${button.dataset.module} 화면은 이 샘플에서 제공하지 않습니다.`);
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 928) closeSidebar();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  bindEvents();
  if (window.lucide) window.lucide.createIcons();
});
