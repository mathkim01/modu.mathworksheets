/*
  ===== 활동지 추가/수정은 여기서 합니다 =====
  - 새 대단원: worksheetMenu 배열에 { title: "대단원 이름", items: [...] }를 추가합니다.
  - 하위 활동지: 해당 items 배열에 { title: "표시 이름", file: "activities/파일명.html" }를 추가합니다.
  - 파일 경로는 이 index.html을 기준으로 작성합니다.
*/
const worksheetMenu = [
{
    title: "선생님의 수업 노트",
    items: [
      { title: "명제 첫번째 시간", file: "activities/proposition-truth-84p.html" },
      { title: "명제 두번째 시간", file: "activities/proposition-truth-p91.html" },
      { title: "명제 세번째 시간", file: "activities/proposition-proof-p95.html" }
    ]
 },  
{
    title: "차근차근 읽고 묻는 활동지",
    items: [
      { title: "1. 집합",
        items: [
      	  { title: "집합과 원소", file: "activities/set-element-listing-worksheet.html" },
      	  { title: "합집합과 교집합", file: "activities/hapjiphab_gyojiphab_activity.html" },
      	  { title: "벤다이어그램", file: "activities/vendiagram_interactive_worksheet.html" }
    	]
      },
      { title: "2. 명제",
    	items: [
      	  { title: "명제의 뜻", file: "activities/proposition-truth-set-worksheet.html" },
      	  { title: "조건과 진리집합", file: "activities/truth-set-steps-6-10-worksheet.html" },
      	  { title: "명제의 참/거짓", file: "activities/proposition-converse-worksheet.html" }
      	]
      },
      { title: "3. 함수",
    	items: [
      	  { title: "명제의 뜻", file: "activities/proposition-truth-set-worksheet.html" },
      	  { title: "조건과 진리집합", file: "activities/truth-set-steps-6-10-worksheet.html" },
      	  { title: "합성함수", file: "activities/function_boxes.html" }
      	]
      }
    ]
  },
  {
    title: "스스로 풀어보는 활동지",
    items: [
      { title: "명제의 뜻", file: "activities/proposition-individual-worksheet.html" },
      { title: "조건과 진리집합", file: "activities/truth-set-individual-worksheet.html" }
    ]
  }
];

const nav = document.querySelector("#worksheet-nav");
const viewer = document.querySelector("#worksheet-viewer");
const currentTitle = document.querySelector("#current-title");
const sidebar = document.querySelector("#sidebar");
const menuButton = document.querySelector("#menu-button");
const welcomePanel = document.querySelector("#welcome-panel");

let worksheetResizeObserver;

function resizeViewer() {
  const documentElement = viewer.contentDocument?.documentElement;
  const body = viewer.contentDocument?.body;
  if (!documentElement || !body) return;

  const contentHeight = Math.max(
    documentElement.scrollHeight,
    documentElement.offsetHeight,
    body.scrollHeight,
    body.offsetHeight
  );
  viewer.style.height = `${contentHeight}px`;
}

function watchWorksheetHeight() {
  worksheetResizeObserver?.disconnect();
  const documentElement = viewer.contentDocument?.documentElement;
  const body = viewer.contentDocument?.body;
  if (!documentElement || !body) return;

  resizeViewer();
  requestAnimationFrame(resizeViewer);
  worksheetResizeObserver = new ResizeObserver(resizeViewer);
  worksheetResizeObserver.observe(documentElement);
  worksheetResizeObserver.observe(body);
}

viewer.addEventListener("load", watchWorksheetHeight);

function showWorksheet(item, button) {
  welcomePanel.hidden = true;
  viewer.hidden = false;
  viewer.style.height = "640px";
  viewer.src = item.file;
  viewer.title = item.title;
  currentTitle.textContent = item.title;
  document.querySelectorAll(".worksheet-link").forEach(link => link.classList.remove("is-active"));
  button.classList.add("is-active");
  sidebar.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
}

function createMenuGroup(group) {
    const groupElement = document.createElement("section");
    groupElement.className = "group is-collapsed";
    const groupButton = document.createElement("button");
    groupButton.className = "group-toggle";
    groupButton.type = "button";
    groupButton.setAttribute("aria-expanded", "false");
    groupButton.innerHTML = `<span class="chevron" aria-hidden="true">⌄</span><span>${group.title}</span>`;
    const itemsElement = document.createElement("div");
    itemsElement.className = "group-items";

    group.items.forEach(item => {
      if (item.items) {
        itemsElement.append(createMenuGroup(item));
        return;
      }

      const link = document.createElement("button");
      link.className = "worksheet-link";
      link.type = "button";
      link.textContent = item.title;
      link.addEventListener("click", () => showWorksheet(item, link));
      itemsElement.append(link);
    });

    groupButton.addEventListener("click", () => {
      const collapsed = groupElement.classList.toggle("is-collapsed");
      groupButton.setAttribute("aria-expanded", String(!collapsed));
    });
    groupElement.append(groupButton, itemsElement);
    return groupElement;
}

function buildMenu() {
  worksheetMenu.forEach(group => nav.append(createMenuGroup(group)));
}

menuButton.addEventListener("click", () => {
  const open = sidebar.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

buildMenu();
