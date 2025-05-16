// 페이지 로드 시 오늘 날짜를 기본값으로 설정
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  document.getElementById('visit-date').value = formattedDate;
});

// 저장 버튼 클릭 이벤트
document.getElementById("save").addEventListener("click", () => {
  const gym = document.getElementById("gym").value;
  const date = document.getElementById("visit-date").value;

  // 날짜 값이 없으면 경고창 표시
  if (!date) {
    alert('방문일을 선택해주세요.');
    return;
  }

  chrome.storage.local.get("lastVisit", (data) => {
    const updated = data.lastVisit || {};
    updated[gym] = date;
    chrome.storage.local.set({ lastVisit: updated }, () => {
      window.close(); // 저장 후 창 닫기
    });
  });
});
