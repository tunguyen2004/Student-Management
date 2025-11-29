// src: assets/js/teacher/subject-statistics.js
// Thống kê nhanh môn học (TB, top/bottom,...)
// ================== HELPER: THÔNG BÁO ==================
function setTeacherSubjectMessage(text, type = "info") {
  const box = document.getElementById("teacherSubjectMessage");
  if (!box) return;

  if (!text) {
    box.style.display = "none";
    box.textContent = "";
    box.className = "message";
    return;
  }

  box.style.display = "block";
  box.textContent = text;
  box.className = "message";

  if (type === "success") box.classList.add("success");
  else if (type === "error") box.classList.add("error");
  else box.classList.add("info");
}

// Format điểm: 2 chữ số thập phân
function teacherFormatScore(value) {
  if (value === null || value === undefined || isNaN(Number(value))) return "-";
  return Number(value).toFixed(2);
}

// Format %: 1 chữ số sau dấu phẩy
function teacherFormatPercent(value) {
  if (value === null || value === undefined || isNaN(Number(value))) return "-";
  return Number(value).toFixed(1) + "%";
}

// ================== LOAD MÔN + NĂM HỌC TỪ PHÂN CÔNG ==================
async function loadTeacherSubjectFilters() {
  const subjectSelect = document.getElementById("teacherSubjectSelect");
  const yearSelect = document.getElementById("teacherSubjectYear");

  if (!subjectSelect || !yearSelect) return;

  try {
    // API đã dùng ở các màn khác: /assignments/teacher
    const res = await getTeacherAssignments();
    const assignments = Array.isArray(res) ? res : res.data || [];

    console.log("📌 Teacher assignments (for subject stats):", assignments);

    // ----- Lấy danh sách môn (unique theo subject_id) -----
    const subjectMap = new Map();
    const yearSet = new Set();

    assignments.forEach((a) => {
      if (a.subject_id && a.Subject) {
        const label = `${a.Subject.subject_code || ""} - ${
          a.Subject.subject_name || ""
        }`.trim();
        subjectMap.set(a.subject_id, label);
      }
      if (a.school_year) {
        yearSet.add(a.school_year);
      }
    });

    // Fill select môn
    subjectSelect.innerHTML = `<option value="">-- Chọn môn --</option>`;
    subjectMap.forEach((label, id) => {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = label;
      subjectSelect.appendChild(opt);
    });

    if (subjectMap.size === 0) {
      subjectSelect.innerHTML =
        '<option value="">Bạn chưa được phân công môn nào</option>';
    }

    // Fill select năm học
    yearSelect.innerHTML = `<option value="">-- Chọn năm học --</option>`;
    [...yearSet].sort().forEach((y) => {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      yearSelect.appendChild(opt);
    });

    // Nếu chỉ có 1 năm học → auto chọn luôn
    if (yearSet.size === 1) {
      yearSelect.value = [...yearSet][0];
    }
  } catch (err) {
    console.error("❌ Lỗi load filters cho thống kê môn học GV:", err);
    setTeacherSubjectMessage(
      "Không tải được danh sách môn / năm học.",
      "error"
    );
  }
}

// ================== RENDER SUMMARY ==================
function renderTeacherSubjectSummary(summary) {
  const box = document.getElementById("teacherSubjectSummaryBox");
  const container = document.getElementById("teacherSubjectSummaryContent");
  if (!box || !container) return;

  if (!summary || Object.keys(summary).length === 0) {
    box.style.display = "none";
    container.innerHTML =
      '<p style="color:#6b7280;">Không có dữ liệu tổng quan.</p>';
    return;
  }

  const totalStudents =
    summary.total_students ||
    summary.student_count ||
    summary.total ||
    summary.totalStudents ||
    0;

  const totalClasses =
    summary.total_classes || summary.class_count || summary.totalClasses || 0;

  const avgScore =
    summary.avg_score ||
    summary.average_score ||
    summary.subject_avg ||
    summary.avg ||
    null;

  const passRate =
    summary.pass_rate || summary.pass_percent || summary.passRate || 0;

  box.style.display = "block";
  container.innerHTML = `
    <div>- Tổng số học sinh: <b>${totalStudents}</b></div>
    <div>- Số lớp dạy: <b>${totalClasses}</b></div>
    <div>- Điểm trung bình môn: <b>${teacherFormatScore(avgScore)}</b></div>
    <div>- Tỉ lệ qua môn: <b>${teacherFormatPercent(passRate)}</b></div>
  `;
}

// ================== RENDER THEO LỚP ==================
function renderTeacherSubjectClasses(classes) {
  const box = document.getElementById("teacherSubjectClassBox");
  const tbody = document.getElementById("teacherSubjectClassBody");
  if (!box || !tbody) return;

  if (!Array.isArray(classes) || !classes.length) {
    box.style.display = "block";
    tbody.innerHTML =
      '<tr><td colspan="4" style="text-align:center;color:#6b7280;">Không có dữ liệu theo lớp.</td></tr>';
    return;
  }

  box.style.display = "block";

  const html = classes
    .map((c) => {
      const classLabel =
        c.class_name ||
        c.class_label ||
        `${c.class_code || ""}`.trim() ||
        "Chưa rõ";

      const studentCount =
        c.student_count || c.total_students || c.count || c.size || 0;
      const avgScore =
        c.avg_score || c.average_score || c.class_avg || c.avg || null;
      const passRate = c.pass_rate || c.pass_percent || 0;

      return `
        <tr>
          <td>${classLabel}</td>
          <td>${studentCount}</td>
          <td>${teacherFormatScore(avgScore)}</td>
          <td>${teacherFormatPercent(passRate)}</td>
        </tr>
      `;
    })
    .join("");

  tbody.innerHTML = html;
}

// ================== RENDER THEO HỌC SINH ==================
function renderTeacherSubjectStudents(students) {
  const box = document.getElementById("teacherSubjectStudentBox");
  const tbody = document.getElementById("teacherSubjectStudentBody");
  if (!box || !tbody) return;

  if (!Array.isArray(students) || !students.length) {
    box.style.display = "block";
    tbody.innerHTML =
      '<tr><td colspan="4" style="text-align:center;color:#6b7280;">Không có dữ liệu học sinh.</td></tr>';
    return;
  }

  box.style.display = "block";

  const html = students
    .map((s) => {
      const code = s.student_code || s.code || "";
      const name = s.full_name || s.name || "";
      const avgScore =
        s.avg_score || s.average_score || s.subject_avg || s.avg || null;
      const rating = s.rating || s.rank || s.rank_name || "";

      return `
        <tr>
          <td>${code}</td>
          <td>${name}</td>
          <td>${teacherFormatScore(avgScore)}</td>
          <td>${rating}</td>
        </tr>
      `;
    })
    .join("");

  tbody.innerHTML = html;
}

// ================== LOAD BÁO CÁO MÔN (GV) ==================
async function loadTeacherSubjectReport() {
  const subjectSelect = document.getElementById("teacherSubjectSelect");
  const yearSelect = document.getElementById("teacherSubjectYear");

  if (!subjectSelect || !yearSelect) return;

  const subjectId = subjectSelect.value;
  const year = yearSelect.value;

  if (!subjectId || !year) {
    setTeacherSubjectMessage(
      "Vui lòng chọn đầy đủ Môn giảng dạy và Năm học.",
      "error"
    );
    return;
  }

  // Ẩn tạm các box để tránh nháy dữ liệu cũ
  document.getElementById("teacherSubjectSummaryBox").style.display = "none";
  document.getElementById("teacherSubjectClassBox").style.display = "none";
  document.getElementById("teacherSubjectStudentBox").style.display = "none";

  setTeacherSubjectMessage("Đang tải thống kê môn học...", "info");

  try {
    // ⚠️ BACKEND cần có các API:
    // GET /reports/teacher/subject/:subjectId/summary?school_year=...
    // GET /reports/teacher/subject/:subjectId/classes?school_year=...
    // GET /reports/teacher/subject/:subjectId/students?school_year=...
    const base = `reports/teacher/subject/${subjectId}`;
    const qs = `?school_year=${encodeURIComponent(year)}`;

    const [summaryRes, classesRes, studentsRes] = await Promise.all([
      fetchFromAPI(`${base}/summary${qs}`),
      fetchFromAPI(`${base}/classes${qs}`),
      fetchFromAPI(`${base}/students${qs}`),
    ]);

    const summary = summaryRes.data || summaryRes || {};
    const classes = classesRes.data || classesRes || [];
    const students = studentsRes.data || studentsRes || [];

    renderTeacherSubjectSummary(summary);
    renderTeacherSubjectClasses(Array.isArray(classes) ? classes : []);
    renderTeacherSubjectStudents(Array.isArray(students) ? students : []);

    setTeacherSubjectMessage("Tải thống kê môn học thành công!", "success");
  } catch (err) {
    console.error("❌ Lỗi loadTeacherSubjectReport:", err);
    setTeacherSubjectMessage(
      err.message || "Không tải được thống kê môn học.",
      "error"
    );
  }
}

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  console.log("👉 Teacher Subject Statistics Page Loaded");

  // Load filters (môn + năm học) từ assignments
  loadTeacherSubjectFilters();

  const btn = document.getElementById("teacherLoadSubjectBtn");
  if (btn) {
    btn.addEventListener("click", loadTeacherSubjectReport);
  }
});
