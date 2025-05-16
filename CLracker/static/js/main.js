document.getElementById("openPopup").addEventListener("click", () => {
  chrome.windows.create({
    url: "popup.html",
    type: "popup",
    width: 400,
    height: 300,
  });
});

// 예시 데이터 추가 (처음 로드할 때만)
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
        "더클라임 강남점": formatDate(yesterday),
        "더클라임 홍대점": formatDate(lastWeek),
        "더클라임 일산점": formatDate(today),
        "더클라임 분당점": formatDate(nextWeek),
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
  "더클라임 강남점": {
    walls: ["메인벽", "볼더링벽", "스피드벽", "연습벽"],
    status: ["online", "online", "offline", "online"],
    settings: {
      메인벽: {
        date: "2025-05-10",
        date: "2025-05-10"
      },
      볼더링벽: {
        date: "2025-05-15",
        date: "2025-05-15"
      },
      스피드벽: {
        date: "2025-04-20",
        date: "2025-04-20"
      },
      연습벽: {
        date: "2025-05-12",
        date: "2025-05-12"
      },
    },
  },
  "더클라임 홍대점": {
    walls: ["메인벽", "볼더링벽", "스피드벽"],
    status: ["online", "online", "offline"],
    settings: {
      메인벽: {
        date: "2025-05-05",
        date: "2025-05-05"
      },
      볼더링벽: {
        date: "2025-05-16",
        date: "2025-05-16"
      },
      스피드벽: {
        date: "2025-04-10",
        date: "2025-04-10"
      },
    },
  },
  "더클라임 일산점": {
    walls: ["메인벽", "볼더링벽"],
    status: ["online", "offline"],
    settings: {
      메인벽: {
        date: "2025-05-16",
        date: "2025-05-16"
      },
      볼더링벽: {
        date: "2025-04-25",
        date: "2025-04-25"
      },
    },
  },
  "더클라임 분당점": {
    walls: ["메인벽", "볼더링벽", "연습벽"],
    status: ["online", "online", "online"],
    settings: {
      메인벽: {
        date: "2025-05-20",
        date: "2025-05-20"
      },
      볼더링벽: {
        date: "2025-05-22",
        date: "2025-05-22"
      },
      연습벽: {
        date: "2025-05-21",
        date: "2025-05-21"
      },
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

        // 벽 태그 생성
        const wallTags = gymWalls.walls
          .map((wall, index) => {
            const status = gymWalls.status[index];
            return `<span class="wall-tag wall-${status}">${wall} ${
              status === "online" ? "✓" : "✗"
            }</span>`;
          })
          .join("");

        // 세팅 정보 생성
        let settingTags = "";
        if (gymWalls.settings) {
          settingTags = gymWalls.walls
            .map((wall) => {
              if (!gymWalls.settings[wall]) return "";

              const setting = gymWalls.settings[wall];
              const settingDate = new Date(setting.date);
              const isNewSetting =
                (new Date() - settingDate) / (1000 * 60 * 60 * 24) < 7; // 일주일 이내 세팅

              return `
		      <div class="wall-settings">
		        <strong>${wall}</strong>: 
		        <span class="setting-tag ${
              isNewSetting ? "setting-new" : "setting-old"
            }">
		          ${setting.date} 세팅
		        </span>
		      </div>
		    `;
            })
            .join("");
        }



        return `
		<div class="card ${isRecent ? "card-recent" : "card-old"}" data-gym="${gym}">
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

// 초기 데이터 추가 및 렌더링
addSampleData();
setTimeout(() => {
  render();
  setupDeleteButtons();
}, 100); // 예시 데이터가 추가된 후 렌더링

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
