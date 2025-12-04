// ===================== HELPER =========================
let teacherReportTimeout = null;

function setTeacherReportMessage(text, type = "info", duration = 2500) {
  const box = document.getElementById("teacherReportMessage");
  if (!box) return;

  // Reset timeout cũ (nếu thông báo trước chưa tắt kịp)
  if (teacherReportTimeout) clearTimeout(teacherReportTimeout);

  // Reset class
  box.className = "message";

  // Thêm text
  box.textContent = text;

  // Thêm class loại thông báo
  if (type === "success") box.classList.add("success");
  else if (type === "error") box.classList.add("error");
  else box.classList.add("info");

  // Hiển thị box
  box.classList.add("show");

  // Tự động ẩn sau duration ms
  teacherReportTimeout = setTimeout(() => {
    box.classList.remove("show");
  }, duration);
}

// ===================== FILL SCHOOL YEAR =========================
function fillSchoolYearsFromAssignments(assignments) {
  const select = document.getElementById("teacherSchoolYearSelect");
  select.innerHTML = "";

  const yearSet = new Set();

  assignments.forEach((a) => {
    if (a.school_year) yearSet.add(a.school_year);
  });

  if (yearSet.size === 0) {
    select.innerHTML = `<option value="">Không có năm học</option>`;
    return;
  }

  [...yearSet].forEach((y) => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    select.appendChild(opt);
  });
}

// ===================== LOAD CLASS LIST =========================
async function loadTeacherReportClasses() {
  const select = document.getElementById("teacherClassReportSelect");

  try {
    const res = await getTeacherAssignments();
    const assignments = Array.isArray(res) ? res : res.data || [];

    const classMap = new Map();

    assignments.forEach((a) => {
      if (!a.Class) return;
      classMap.set(a.class_id, `${a.Class.class_code} - ${a.Class.class_name}`);
    });

    select.innerHTML = `<option value="">-- Chọn lớp --</option>`;
    classMap.forEach((label, id) => {
      select.innerHTML += `<option value="${id}">${label}</option>`;
    });

    fillSchoolYearsFromAssignments(assignments);
  } catch (err) {
    console.error("❌ Lỗi load lớp:", err);
    setTeacherReportMessage("Không tải được danh sách lớp", "error");
  }
}

// ===================== LOAD REPORT =========================
async function loadTeacherClassReport() {
  const classId = document.getElementById("teacherClassReportSelect").value;
  const schoolYear = document.getElementById("teacherSchoolYearSelect").value;

  if (!classId || !schoolYear) {
    setTeacherReportMessage("Hãy chọn lớp và năm học!", "error");
    return;
  }

  try {
    setTeacherReportMessage("Đang tải thống kê...", "info");

    const [summary, subjectStats, studentStats] = await Promise.all([
      fetchFromAPI(
        `reports/teacher/class/${classId}/summary?school_year=${schoolYear}`
      ),
      fetchFromAPI(
        `reports/teacher/class/${classId}/subjects?school_year=${schoolYear}`
      ),
      fetchFromAPI(
        `reports/teacher/class/${classId}/students?school_year=${schoolYear}`
      ),
    ]);

    // ===== Summary =====
    document.getElementById("teacherSummaryBox").style.display = "block";
    document.getElementById("teacherSummaryContent").innerHTML = `
      - Tổng số HS: <b>${summary.data.total_students}</b><br>
      - Điểm TB lớp: <b>${summary.data.avg_score.toFixed(2)}</b><br>
      - Giỏi: ${summary.data.gioi_count} | Khá: ${
      summary.data.kha_count
    } | TB: ${summary.data.tb_count} | Yếu: ${summary.data.yeu_count}
    `;

    // ===== Subject stats =====
    const subBody = document.getElementById("teacherSubjectBody");
    document.getElementById("teacherSubjectBox").style.display = "block";

    subBody.innerHTML = subjectStats.data
      .map(
        (s) => `
      <tr>
        <td>${s.subject_name}</td>
        <td>${(+s.avg_score).toFixed(2)}</td>
        <td>${s.highest_score}</td>
        <td>${s.lowest_score}</td>
        <td>${s.pass_rate}%</td>
      </tr>
    `
      )
      .join("");

    // ===== Student stats =====
    const stuBody = document.getElementById("teacherStudentBody");
    document.getElementById("teacherStudentBox").style.display = "block";

    stuBody.innerHTML = studentStats.data
      .map(
        (st) => `
      <tr>
        <td>${st.student_code}</td>
        <td>${st.full_name}</td>
        <td>${(+st.avg_score).toFixed(2)}</td>
        <td>${st.rating}</td>
        <td>${st.weakest_subject_name || "-"}</td>
      </tr>
    `
      )
      .join("");

    setTeacherReportMessage("Tải thống kê thành công!", "success");
  } catch (err) {
    console.error("❌ Lỗi tải báo cáo:", err);
    setTeacherReportMessage("Không tải được thống kê lớp", "error");
  }
}

// ===================== INIT =========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("👉 Teacher Report Page Loaded");

  loadTeacherReportClasses();

  document
    .getElementById("teacherLoadReportBtn")
    .addEventListener("click", loadTeacherClassReport);
});
