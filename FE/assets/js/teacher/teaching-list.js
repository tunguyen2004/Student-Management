document.addEventListener("DOMContentLoaded", () => {
  loadTeacherAssignments();
});

// =====================================
// Gọi API lấy danh sách phân công của giáo viên
// =====================================
async function loadTeacherAssignments() {
  try {
    const response = await fetch(
      `http://localhost:5000/api/assignments/teacher`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    if (!response.ok) throw new Error("Không thể tải phân công.");

    const data = await response.json();

    renderAssignments(data);
    populateSchoolYears(data);
  } catch (err) {
    console.error(err);
    document.getElementById(
      "teachingTableBody"
    ).innerHTML = `<tr><td colspan="5">Không có dữ liệu phân công.</td></tr>`;
  }
}

// =====================================
// Render danh sách ra bảng
// =====================================
function renderAssignments(assignments) {
  const tbody = document.getElementById("teachingTableBody");
  const semesterFilter = document.getElementById("filterSemester").value;
  const schoolYearFilter = document.getElementById("filterSchoolYear").value;

  tbody.innerHTML = "";

  const filtered = assignments.filter((item) => {
    return (
      (semesterFilter === "" || `${item.semester}` === semesterFilter) &&
      (schoolYearFilter === "" || item.school_year === schoolYearFilter)
    );
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">✖ Không có dữ liệu phù hợp.</td></tr>`;
    document.getElementById("assignmentCount").innerText = 0;
    return;
  }

  filtered.forEach((a) => {
    const schedule = a.teaching_schedule
      ? formatSchedule(JSON.parse(a.teaching_schedule))
      : "Chưa có lịch";

    tbody.innerHTML += `
      <tr>
        <td>${a.Class.class_name}</td>
        <td>${a.Subject.subject_name}</td>
        <td>Học kỳ ${a.semester}</td>
        <td>${a.school_year}</td>
        <td>${schedule}</td>
      </tr>
    `;
  });

  document.getElementById("assignmentCount").innerText = filtered.length;
}

// =============================
// Format JSON schedule → text
// =============================
function formatSchedule(scheduleObj) {
  return Object.entries(scheduleObj)
    .map(([day, periods]) => `${day.toUpperCase()}: ${periods.join(", ")}`)
    .join("<br>");
}

// =============================
// Populate danh sách năm học lọc
// =============================
function populateSchoolYears(assignments) {
  const schoolYearSelect = document.getElementById("filterSchoolYear");

  const years = [...new Set(assignments.map((a) => a.school_year))];

  schoolYearSelect.innerHTML = `<option value="">-- Tất cả --</option>`;
  years.forEach((y) => {
    schoolYearSelect.innerHTML += `<option value="${y}">${y}</option>`;
  });

  // event filter change
  schoolYearSelect.addEventListener("change", () =>
    renderAssignments(assignments)
  );
  document
    .getElementById("filterSemester")
    .addEventListener("change", () => renderAssignments(assignments));
}
