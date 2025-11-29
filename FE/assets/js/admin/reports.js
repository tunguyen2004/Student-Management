// =========================================
// ADMIN REPORT PAGE (CLASS + SUBJECT)
// =========================================

// ================== COMMON MESSAGE ==================
function setAdminMessage(id, text, type = "info") {
  const box = document.getElementById(id);
  if (!box) return;

  if (!text) {
    box.style.display = "none";
    box.textContent = "";
    box.className = "message";
    return;
  }

  box.style.display = "block";
  box.textContent = text;
  box.className = `message ${type}`; // success | error | info
}

// ================== FORMAT HELPERS ==================
function formatScore(value) {
  if (value === null || value === undefined || isNaN(Number(value))) return "-";
  return Number(value).toFixed(2);
}

function formatPercent(value) {
  if (value === null || value === undefined || isNaN(Number(value))) return "-";
  return Number(value).toFixed(1) + "%";
}

// ================== LOAD CLASSES + SCHOOL YEARS ==================
let ALL_CLASSES = [];

async function loadAdminClasses() {
  const classSelect = document.getElementById("adminClassSelect");
  const yearSelect = document.getElementById("adminClassYear");

  try {
    const res = await getClasses();
    const classes = Array.isArray(res) ? res : res.data || [];
    ALL_CLASSES = classes;

    // Fill class select
    classSelect.innerHTML = `<option value="">-- Chọn lớp --</option>`;
    classes.forEach((c) => {
      classSelect.innerHTML += `
                <option value="${c.id}">
                    ${c.class_code} - ${c.class_name}
                </option>`;
    });

    // Fill year select
    const years = [...new Set(classes.map((c) => c.school_year))];
    yearSelect.innerHTML = `<option value="">-- Chọn năm học --</option>`;
    years.forEach((y) => {
      yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
    });
  } catch (err) {
    console.error("❌ Lỗi load classes:", err);
    setAdminMessage(
      "adminReportMessage",
      "Không tải được danh sách lớp!",
      "error"
    );
  }
}

// ================== LOAD SUBJECTS + YEARS ==================
async function loadAdminSubjects() {
  const subSelect = document.getElementById("adminSubjectSelect");
  const yearSelect = document.getElementById("adminSubjectYear");

  try {
    const res = await getSubjects();
    const subjects = Array.isArray(res) ? res : res.data || [];

    subSelect.innerHTML = `<option value="">-- Chọn môn --</option>`;
    subjects.forEach((s) => {
      subSelect.innerHTML += `
                <option value="${s.id}">${s.subject_code} - ${s.subject_name}</option>`;
    });

    // Load school years from classes
    const clsRes = await getClasses();
    const classes = Array.isArray(clsRes) ? clsRes : clsRes.data || [];
    const years = [...new Set(classes.map((c) => c.school_year))];

    yearSelect.innerHTML = `<option value="">-- Chọn năm học --</option>`;
    years.forEach((y) => {
      yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
    });
  } catch (err) {
    console.error("❌ Lỗi load subjects:", err);
  }
}

// =====================================================
//                REPORT: CLASS
// =====================================================
async function loadAdminClassReport() {
  const classId = document.getElementById("adminClassSelect").value;
  const year = document.getElementById("adminClassYear").value;

  if (!classId || !year) {
    setAdminMessage(
      "adminReportMessage",
      "Vui lòng chọn lớp và năm học!",
      "error"
    );
    return;
  }

  setAdminMessage("adminReportMessage", "Đang tải báo cáo...", "info");

  try {
    const [summary, subjects, students] = await Promise.all([
      fetchFromAPI(`reports/class/${classId}/summary?school_year=${year}`),
      fetchFromAPI(`reports/class/${classId}/subjects?school_year=${year}`),
      fetchFromAPI(`reports/class/${classId}/students?school_year=${year}`),
    ]);

    renderClassSummary(summary.data);
    renderClassSubjects(subjects.data);
    renderClassStudents(students.data);

    setAdminMessage("adminReportMessage", "Tải báo cáo thành công!", "success");
  } catch (err) {
    console.error("❌ loadAdminClassReport:", err);
    setAdminMessage(
      "adminReportMessage",
      "Không tải được báo cáo lớp!",
      "error"
    );
  }
}

// --------- RENDER: SUMMARY ---------
function renderClassSummary(data) {
  const box = document.getElementById("classSummary");
  const container = document.getElementById("classSummaryContent");

  box.style.display = "block";
  container.innerHTML = `
        <div class="summary-grid">
            <div class="summary-card">
                <div class="summary-card-title">Sĩ số lớp</div>
                <div class="summary-card-value">${data.total_students}</div>
            </div>

            <div class="summary-card">
                <div class="summary-card-title">Điểm TB lớp</div>
                <div class="summary-card-value">${formatScore(
                  data.avg_score
                )}</div>
            </div>

            <div class="summary-card">
                <div class="summary-card-title">Giỏi / Khá</div>
                <div class="summary-card-value">${data.gioi_count} / ${
    data.kha_count
  }</div>
            </div>

            <div class="summary-card">
                <div class="summary-card-title">Trung bình / Yếu</div>
                <div class="summary-card-value">${data.tb_count} / ${
    data.yeu_count
  }</div>
            </div>
        </div>
    `;
}

// --------- RENDER: SUBJECT STATS ---------
function renderClassSubjects(subjects) {
  const box = document.getElementById("classSubjectBox");
  const body = document.getElementById("classSubjectBody");

  box.style.display = "block";

  if (!subjects.length) {
    body.innerHTML = `<tr><td colspan="5">Không có dữ liệu</td></tr>`;
    return;
  }

  body.innerHTML = subjects
    .map(
      (s) => `
            <tr>
                <td>${s.subject_name}</td>
                <td>${formatScore(s.avg_score)}</td>
                <td>${formatScore(s.highest_score)}</td>
                <td>${formatScore(s.lowest_score)}</td>
                <td>${formatPercent(s.pass_rate)}</td>
            </tr>
        `
    )
    .join("");
}

// --------- RENDER: STUDENT STATS ---------
function renderClassStudents(students) {
  const box = document.getElementById("classStudentBox");
  const body = document.getElementById("classStudentBody");

  box.style.display = "block";

  if (!students.length) {
    body.innerHTML = `<tr><td colspan="5">Không có dữ liệu</td></tr>`;
    return;
  }

  body.innerHTML = students
    .map(
      (s) => `
            <tr>
                <td>${s.student_code}</td>
                <td>${s.full_name}</td>
                <td>${formatScore(s.avg_score)}</td>
                <td>${s.rating}</td>
                <td>${s.weakest_subject_name || "-"}</td>
            </tr>
        `
    )
    .join("");
}

// =====================================================
//                REPORT: SUBJECT
// =====================================================
async function loadAdminSubjectReport() {
  const subjectId = document.getElementById("adminSubjectSelect").value;
  const year = document.getElementById("adminSubjectYear").value;

  if (!subjectId || !year) {
    setAdminMessage("adminReportMessage", "Hãy chọn môn và năm học!", "error");
    return;
  }

  setAdminMessage("adminReportMessage", "Đang tải thống kê môn...", "info");

  try {
    const [summary, classes, students] = await Promise.all([
      fetchFromAPI(`reports/subjects/${subjectId}/summary?school_year=${year}`),
      fetchFromAPI(`reports/subjects/${subjectId}/classes?school_year=${year}`),
      fetchFromAPI(
        `reports/subjects/${subjectId}/students?school_year=${year}`
      ),
    ]);

    renderSubjectSummary(summary.data);
    renderSubjectClasses(classes.data);
    renderSubjectStudents(students.data);

    setAdminMessage(
      "adminReportMessage",
      "Tải báo cáo môn học thành công!",
      "success"
    );
  } catch (err) {
    console.error("❌ loadAdminSubjectReport:", err);
    setAdminMessage(
      "adminReportMessage",
      "Không tải được báo cáo môn!",
      "error"
    );
  }
}

// ---------- RENDER SUBJECT SUMMARY ----------
function renderSubjectSummary(data) {
  const box = document.getElementById("subjectSummary");
  const container = document.getElementById("subjectSummaryContent");

  box.style.display = "block";
  container.innerHTML = `
        - Tổng số HS: <b>${data.total_students}</b><br>
        - Số lớp dạy: <b>${data.total_classes}</b><br>
        - Điểm TB môn: <b>${formatScore(data.avg_score)}</b><br>
        - Tỉ lệ qua môn: <b>${formatPercent(data.pass_rate)}</b>
    `;
}

// ---------- RENDER CLASS LIST ----------
function renderSubjectClasses(rows) {
  const box = document.getElementById("subjectClassBox");
  const body = document.getElementById("subjectClassBody");

  box.style.display = "block";

  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="4">Không có dữ liệu</td></tr>`;
    return;
  }

  body.innerHTML = rows
    .map(
      (c) => `
            <tr>
                <td>${c.class_code}</td>
                <td>${formatScore(c.avg_score)}</td>
                <td>${c.student_count}</td>
                <td>${formatPercent(c.pass_rate)}</td>
            </tr>
        `
    )
    .join("");
}

// ---------- RENDER STUDENT LIST ----------
function renderSubjectStudents(rows) {
  const box = document.getElementById("subjectStudentBox");
  const body = document.getElementById("subjectStudentBody");

  box.style.display = "block";

  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="4">Không có dữ liệu</td></tr>`;
    return;
  }

  body.innerHTML = rows
    .map(
      (s) => `
            <tr>
                <td>${s.student_code}</td>
                <td>${s.full_name}</td>
                <td>${formatScore(s.avg_score)}</td>
                <td>${s.rating}</td>
            </tr>
        `
    )
    .join("");
}

// =====================================================
// INIT PAGE
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("👉 Admin Report Page Loaded");

  loadAdminClasses();
  loadAdminSubjects();

  // Switch report types
  document.getElementById("reportType").addEventListener("change", (e) => {
    const type = e.target.value;

    document.getElementById("classReportSection").style.display =
      type === "class" ? "block" : "none";

    document.getElementById("subjectReportSection").style.display =
      type === "subject" ? "block" : "none";
  });

  document
    .getElementById("loadClassBtn")
    .addEventListener("click", loadAdminClassReport);

  document
    .getElementById("loadSubjectBtn")
    .addEventListener("click", loadAdminSubjectReport);
});
