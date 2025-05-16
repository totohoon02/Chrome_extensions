document.getElementById("openPopup").addEventListener("click", () => {
  chrome.windows.create({
    url: "popup.html",
    type: "popup",
    width: 400,
    height: 300,
  });
});

// 서버에서 데이터 가져오기
async function fetchDataFromServer(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);
    return null;
  }
}

// 서버에서 가져온 데이터를 로컬 스토리지에 저장
async function updateDataFromServer(serverUrl) {
  const data = await fetchDataFromServer(serverUrl);
  if (data && data.lastVisit) {
    chrome.storage.local.set({ lastVisit: data.lastVisit });
    return true;
  }
  return false;
}

// 예시 데이터 추가 (테스트용)
function addSampleData() {
  chrome.storage.local.get("lastVisit", (data) => {
    if (!data.lastVisit || Object.keys(data.lastVisit).length === 0) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);

      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const sampleData = {
        연남: formatDate(yesterday),
        사당: formatDate(lastWeek),
        이수: formatDate(today),
        강남: formatDate(nextWeek),
        양재: formatDate(today),
        일산: formatDate(yesterday),
        논현: "NaN",
        문래: "NaN",
      };

      chrome.storage.local.set({ lastVisit: sampleData });
    }
  });
}

// 날짜 포맷 함수
function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

// 벽 정보 데이터
const wallInfo = {
  연남: {
    walls: ["연남", "신촌", "툇마루"],
    status: ["online", "online", "online"],
    settings: {
      연남: { date: "2025-05-10" },
      신촌: { date: "2025-05-15" },
      툇마루: { date: "2025-05-12" },
    },
  },
  사당: {
    walls: ["관악1", "관악2", "동작1", "동작2", "서초"],
    status: ["online", "online", "online", "online", "online"],
    settings: {
      관악1: { date: "2025-05-10" },
      관악2: { date: "2025-05-15" },
      동작1: { date: "2025-05-12" },
      동작2: { date: "2025-05-14" },
      서초: { date: "2025-05-16" },
    },
  },
  이수: {
    walls: ["배1", "배2", "사과", "포도"],
    status: ["online", "online", "online", "online"],
    settings: {
      배1: { date: "2025-05-10" },
      배2: { date: "2025-05-15" },
      사과: { date: "2025-05-12" },
      포도: { date: "2025-05-14" },
    },
  },
  성수: {
    walls: ["생각", "성수1", "성수2", "공장1", "공장2"],
    status: ["online", "online", "online", "online", "online"],
    settings: {
      생각: { date: "2025-05-10" },
      성수1: { date: "2025-05-15" },
      성수2: { date: "2025-05-12" },
      공장1: { date: "2025-05-14" },
      공장2: { date: "2025-05-16" },
    },
  },
  강남: {
    walls: ["1", "2", "3", "4", "5", "6", "7", "8"],
    status: [
      "online",
      "online",
      "online",
      "online",
      "online",
      "online",
      "online",
      "online",
    ],
    settings: {
      1: { date: "2025-05-10" },
      2: { date: "2025-05-15" },
      3: { date: "2025-05-12" },
      4: { date: "2025-05-14" },
      5: { date: "2025-05-16" },
      6: { date: "2025-05-18" },
      7: { date: "2025-05-20" },
      8: { date: "2025-05-22" },
    },
  },
  양재: {
    walls: ["ARCH", "FLAT", "CAVE", "ISLAND", "PROW", "SLAB", "DUNGEON"],
    status: [
      "online",
      "online",
      "online",
      "online",
      "online",
      "online",
      "online",
    ],
    settings: {
      ARCH: { date: "2025-05-10" },
      FLAT: { date: "2025-05-15" },
      CAVE: { date: "2025-05-12" },
      ISLAND: { date: "2025-05-14" },
      PROW: { date: "2025-05-16" },
      SLAB: { date: "2025-05-18" },
      DUNGEON: { date: "2025-05-20" },
    },
  },
  일산: {
    walls: [
      "NEW WAVE",
      "WHITE WALL",
      "ISLAND A",
      "ISLAND B",
      "COMPETION WALL",
      "ENDURANCE",
    ],
    status: ["online", "online", "online", "online", "online", "online"],
    settings: {
      "NEW WAVE": { date: "2025-05-10" },
      "WHITE WALL": { date: "2025-05-15" },
      "ISLAND A": { date: "2025-05-12" },
      "ISLAND B": { date: "2025-05-14" },
      "COMPETION WALL": { date: "2025-05-16" },
      ENDURANCE: { date: "2025-05-18" },
    },
  },
  논현: {
    walls: ["논", "밭", "고개1", "고개2", "작은밭"],
    status: ["online", "online", "online", "online", "online"],
    settings: {
      논: { date: "2025-05-10" },
      밭: { date: "2025-05-15" },
      고개1: { date: "2025-05-12" },
      고개2: { date: "2025-05-14" },
      작은밭: { date: "2025-05-16" },
    },
  },
  문래: {
    walls: ["집게", "망치", "도가니", "강철", "모루"],
    status: ["online", "online", "online", "online", "online"],
    settings: {
      집게: { date: "2025-05-10" },
      망치: { date: "2025-05-15" },
      도가니: { date: "2025-05-12" },
      강철: { date: "2025-05-14" },
      모루: { date: "2025-05-16" },
    },
  },
  홍대: {
    walls: ["1-1", "1-2", "2-1", "2-2"],
    status: ["online", "online", "online", "online"],
    settings: {
      "1-1": { date: "2025-05-10" },
      "1-2": { date: "2025-05-15" },
      "2-1": { date: "2025-05-12" },
      "2-2": { date: "2025-05-14" },
    },
  },
  마곡: {
    walls: ["1", "2", "3", "4", "5", "6", "7", "8"],
    status: [
      "online",
      "online",
      "online",
      "online",
      "online",
      "online",
      "online",
      "online",
    ],
    settings: {
      1: { date: "2025-05-10" },
      2: { date: "2025-05-15" },
      3: { date: "2025-05-12" },
      4: { date: "2025-05-14" },
      5: { date: "2025-05-16" },
      6: { date: "2025-05-18" },
      7: { date: "2025-05-20" },
      8: { date: "2025-05-22" },
    },
  },
  신사: {
    walls: ["가로수", "나로수", "다로수", "세로수"],
    status: ["online", "online", "online", "online"],
    settings: {
      가로수: { date: "2025-05-10" },
      나로수: { date: "2025-05-15" },
      다로수: { date: "2025-05-12" },
      세로수: { date: "2025-05-14" },
    },
  },
  신림: {
    walls: ["MILKYWAY", "GALAXY", "BALANCE", "OVERHANG", "ANDROMEDA"],
    status: ["online", "online", "online", "online", "online"],
    settings: {
      MILKYWAY: { date: "2025-05-10" },
      GALAXY: { date: "2025-05-15" },
      BALANCE: { date: "2025-05-12" },
      OVERHANG: { date: "2025-05-14" },
      ANDROMEDA: { date: "2025-05-16" },
    },
  },
  서울대: {
    walls: ["VERTICAL", "MARGALEF", "ARHI", "CONE", "HEXAGON"],
    status: ["online", "online", "online", "online", "online"],
    settings: {
      VERTICAL: { date: "2025-05-10" },
      MARGALEF: { date: "2025-05-15" },
      ARHI: { date: "2025-05-12" },
      CONE: { date: "2025-05-14" },
      HEXAGON: { date: "2025-05-16" },
    },
  },
};

function render() {
  chrome.storage.local.get("lastVisit", (data) => {
    const container = document.getElementById("log");
    const records = data.lastVisit || {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 방문일 기준으로 정렬 (최신순)
    const sortedRecords = Object.entries(records).sort((a, b) => {
      const dateA = new Date(a[1]);
      const dateB = new Date(b[1]);
      return dateA - dateB; // 역순 정렬 (최신순)
    });

    container.innerHTML = sortedRecords
      .map(([gym, dateStr]) => {
        // 해당 체육관의 벽 정보 가져오기
        const gymWalls = wallInfo[gym] || { walls: [], status: [] };

        // 날짜 비교
        const visitDate = new Date(dateStr);
        visitDate.setHours(0, 0, 0, 0);
        const isRecent = visitDate >= today;
        const daysDiff = Math.floor(
          (visitDate - today) / (1000 * 60 * 60 * 24)
        );

        // 날짜 상태 메시지
        let dateStatus = "";
        if (daysDiff === 0) {
          dateStatus = "오늘";
        } else if (daysDiff === 1) {
          dateStatus = "내일";
        } else if (daysDiff > 1) {
          dateStatus = `${daysDiff}일 후`;
        } else if (daysDiff === -1) {
          dateStatus = "어제";
        } else {
          dateStatus = `${Math.abs(daysDiff)}일 전`;
        }

        // 세팅 정보 생성
        let settingTags = "";
        if (gymWalls.settings) {
          settingTags = gymWalls.walls
            .map((wall) => {
              if (!gymWalls.settings[wall]) return "";

              const setting = gymWalls.settings[wall];
              const settingDate = setting.date ? new Date(setting.date) : "NaN";

              // 마지막 방문일과 세팅일자 비교
              let isNewSetting = false;
              if (settingDate !== "NaN" && dateStr !== "NaN") {
                // 세팅일자가 방문일보다 최근인지 확인 (방문 후 세팅되었는지)
                isNewSetting = new Date(setting.date) > new Date(dateStr);
              }

              return `
		      <div class="wall-settings">
		        <strong>${wall}</strong>: 
		        <span class="setting-tag ${
              isNewSetting ? "setting-new" : "setting-old"
            }">
		          ${setting.date || "NaN"} 세팅
		        </span>
		      </div>
		    `;
            })
            .join("");
        }

        return `
		<div class="card card-recent" data-gym="${gym}">
		  <h3>
		    <span>📍 ${gym}</span>
		    <button class="delete-btn" data-gym="${gym}">✕</button>
		  </h3>
		  <p>마지막 방문일: <span class="${
        isRecent ? "date-recent" : "date-old"
      }">${dateStr} (${dateStatus})</span></p>
		  <div class="setting-info">${settingTags}</div>
		</div>
	  `;
      })
      .join("");
  });
}

// 방문 기록 삭제 기능
function deleteRecord(gym) {
  chrome.storage.local.get("lastVisit", (data) => {
    const records = data.lastVisit || {};

    // 해당 체육관 기록 삭제
    if (records[gym]) {
      delete records[gym];
      chrome.storage.local.set({ lastVisit: records }, () => {
        render();
      });
    }
  });
}

// 삭제 버튼 클릭 이벤트 처리
function setupDeleteButtons() {
  document.getElementById("log").addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const gym = e.target.getAttribute("data-gym");
      if (confirm(`'${gym}' 방문 기록을 삭제하시겠습니까?`)) {
        deleteRecord(gym);
      }
    }
  });
}

// 초기 데이터 로드 및 렌더링
setTimeout(() => {
  // 예시 데이터 추가 (테스트용)
  addSampleData();

  // 서버 URL 설정 (실제 서버 URL로 변경 필요)
  // const serverUrl = 'https://your-api-server.com/data';
  // updateDataFromServer(serverUrl).then(success => {
  //   if (!success) {
  //     console.log('서버에서 데이터를 가져오지 못했습니다. 로컬 데이터를 사용합니다.');
  //   }
  //   render();
  //   setupDeleteButtons();
  // });

  render();
  setupDeleteButtons();
}, 100);

// 스토리지 변경 감지하여 자동 업데이트
chrome.storage.onChanged.addListener((changes) => {
  if (changes.lastVisit) {
    render();
  }
});

// 매일 자정에 화면 업데이트 (날짜 상태 변경을 위해)
function scheduleNextUpdate() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const timeUntilMidnight = tomorrow - now;
  setTimeout(() => {
    render();
    scheduleNextUpdate();
  }, timeUntilMidnight);
}

scheduleNextUpdate();
