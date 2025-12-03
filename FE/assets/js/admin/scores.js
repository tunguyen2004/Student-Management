document.addEventListener("DOMContentLoaded", () => {
  loadAdminFilters();
  createEditModal();
});
document
  .getElementById("scoreSearchInput")
  ?.addEventListener("input", filterScores);

document
  .getElementById("scoreSearchInput")
  ?.addEventListener("input", filterAdvanced);
document
  .getElementById("avgFilter")
  ?.addEventListener("change", filterAdvanced);
document
  .getElementById("rankFilter")
  ?.addEventListener("change", filterAdvanced);
document
  .getElementById("sortFilter")
  ?.addEventListener("change", filterAdvanced);

// =========================
// SELECT DOM
// =========================
const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const semesterSelect = document.getElementById("semesterSelect");
let adminScoreData = [];

//tính điểm trung bình
function calcAvg(st) {
  return (
    avgOf(st["15ph"]) * 0.3 +
      avgOf(st["45ph"]) * 0.3 +
      avgOf(st["thi"]) * 0.4 || 0
  );
}

// Tạo chọn năm học nếu chưa có
function ensureSchoolYearSelect() {
  if (!document.getElementById("schoolYearSelect")) {
    const panel = document.querySelector(".filter-panel");
    const sy = document.createElement("select");
    sy.id = "schoolYearSelect";
    sy.innerHTML = `
      <option value="2024-2025">2024-2025</option>
      <option value="2025-2026">2025-2026</option>
    `;
    panel.insertBefore(sy, panel.children[3]);
  }
}
ensureSchoolYearSelect();

// =========================
// LOAD FILTER
// =========================
async function loadAdminFilters() {
  try {
    const classes = await fetchFromAPI("admin/scores/classes");
    const subjects = await fetchFromAPI("admin/scores/subjects");

    classSelect.innerHTML = `<option value="">-- Lớp --</option>`;
    subjectSelect.innerHTML = `<option value="">-- Môn --</option>`;

    classes.forEach((c) => {
      classSelect.innerHTML += `<option value="${c.id}">${c.class_name}</option>`;
    });

    subjects.forEach((s) => {
      subjectSelect.innerHTML += `<option value="${s.id}">${s.subject_name}</option>`;
    });
  } catch (err) {
    alert("❌ Lỗi tải danh sách lớp/môn");
    console.error(err);
  }
}

// =========================
// LOAD ĐIỂM (FULL LIST HS)
// =========================
async function loadAdminScores() {
  const class_id = classSelect.value;
  const subject_id = subjectSelect.value;
  const semester = semesterSelect.value;
  const school_year = document.getElementById("schoolYearSelect").value;

  if (!class_id || !subject_id) {
    alert("⚠ Vui lòng chọn lớp và môn!");
    return;
  }

  const tbody = document.getElementById("adminScoreBody");
  tbody.innerHTML = `<tr><td colspan="9">⏳ Đang tải...</td></tr>`;

  try {
    const query = new URLSearchParams({
      class_id,
      subject_id,
      semester,
      school_year,
    });

    const rows = await fetchFromAPI(`admin/scores?${query.toString()}`);

    tbody.innerHTML = "";
    adminScoreData = rows; // LƯU TẤT CẢ ĐỂ TÌM KIẾM

    rows.forEach((st) => {
      const avg =
        (
          avgOf(st["15ph"]) * 0.3 +
          avgOf(st["45ph"]) * 0.3 +
          avgOf(st["thi"]) * 0.4
        ).toFixed(2) || "-";

      tbody.innerHTML += `
        <tr data-student="${st.student_id}">
            <td>${st.student_code}</td>
            <td>${st.full_name}</td>
            <td>${classSelect.options[classSelect.selectedIndex].text}</td>
            <td>${subjectSelect.options[subjectSelect.selectedIndex].text}</td>

            <td>${renderScoreList(st["15ph"], "15ph", st.student_id)}</td>
            <td>${renderScoreList(st["45ph"], "45ph", st.student_id)}</td>
            <td>${renderScoreList(st["thi"], "thi", st.student_id)}</td>

            <td>${isNaN(avg) ? "-" : avg}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("❌ LOAD ERROR:", err);
    tbody.innerHTML = `<tr><td colspan="9">Lỗi tải dữ liệu!</td></tr>`;
  }
}

// Tạo danh sách điểm clickable
function renderScoreList(arr, type, studentId) {
  if (!arr || arr.length === 0)
    return `<span class="add-score-btn" onclick="openEditModal(null,'${type}',${studentId})">+</span>`;

  return arr
    .map(
      (sc) => `
      <span class="score-pill" onclick="openEditModal(null,'${type}',${studentId})">${sc}</span>
    `
    )
    .join(", ");
}

// =========================
// MODAL EDIT
// =========================
let currentEditing = null;

function createEditModal() {
  if (document.getElementById("adminEditModal")) return;

  const html = `
    <div id="adminEditModal" style="
        display:none; position:fixed; inset:0;
        background:rgba(0,0,0,0.5);
        align-items:center; justify-content:center; z-index:9999;">
      <div style="background:#fff;padding:20px;border-radius:8px;width:350px;">
        <h3>Sửa điểm</h3>
        <div><b>Học sinh:</b> <span id="modalStudent"></span></div>
        <div><b>Loại điểm:</b> <span id="modalType"></span></div>
        <input id="modalScoreInput" type="number" min="0" max="10" step="0.25"
          style="width:100%;padding:8px;margin-top:10px;border-radius:6px;border:1px solid #ccc;">
        <div style="margin-top:12px;text-align:right;">
          <button onclick="closeEditModal()">Hủy</button>
          <button onclick="saveModalScore()" style="background:#2563eb;color:#fff;padding:8px 12px;border-radius:6px;">Lưu</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);
}

function openEditModal(scoreId, type, studentId) {
  currentEditing = { scoreId, type, studentId };

  const row = document.querySelector(`tr[data-student="${studentId}"]`);
  document.getElementById("modalStudent").textContent =
    row.children[1].textContent;
  document.getElementById("modalType").textContent = type;
  document.getElementById("modalScoreInput").value = "";

  document.getElementById("adminEditModal").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("adminEditModal").style.display = "none";
}

async function saveModalScore() {
  const scoreVal = parseFloat(document.getElementById("modalScoreInput").value);
  if (isNaN(scoreVal)) return alert("Nhập điểm hợp lệ!");

  const class_id = document.getElementById("classSelect").value;
  const subject_id = document.getElementById("subjectSelect").value;
  const semester = document.getElementById("semesterSelect").value;
  const school_year = document.getElementById("schoolYearSelect").value;

  const payload = {
    id: currentEditing.scoreId, // id bản ghi (nếu có)
    student_id: currentEditing.studentId,
    subject_id,
    class_id,
    score_type: currentEditing.type,
    score: scoreVal,
    semester,
    school_year,
  };

  try {
    await fetchFromAPI("admin/scores/update", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    closeEditModal();
    await loadAdminScores();
    alert("Lưu thành công!");
  } catch (err) {
    console.error(err);
    alert("Lỗi lưu điểm!");
  }
}

// =========================
// EXPORT CSV
// =========================
async function exportAdminCSV() {
  const class_id = classSelect.value;
  const subject_id = subjectSelect.value;
  const semester = semesterSelect.value;
  const school_year = document.getElementById("schoolYearSelect").value;

  const url = `${API_URL}/admin/scores/export?class_id=${class_id}&subject_id=${subject_id}&semester=${semester}&school_year=${school_year}`;

  const TOKEN = localStorage.getItem("token");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) return alert("Xuất thất bại!");

  const blob = await res.blob();
  const link = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = link;
  a.download = `scores_${class_id}_${subject_id}_${semester}_${school_year}.csv`;
  a.click();

  URL.revokeObjectURL(link);
}

function avgOf(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + parseFloat(b), 0) / arr.length;
}

let ADMIN_EDIT_MODE = false;

function toggleEdit() {
  ADMIN_EDIT_MODE = !ADMIN_EDIT_MODE;

  const table = document.getElementById("adminScoreTable");
  const btn = document.querySelector('button[onclick="toggleEdit()"]');

  if (ADMIN_EDIT_MODE) {
    btn.textContent = "🔒 Tắt sửa điểm";
    table.classList.add("editing");
    alert("Chế độ sửa đã bật: Click vào điểm để sửa!");
  } else {
    btn.textContent = "✏️ Sửa điểm";
    table.classList.remove("editing");
  }
}
function filterScores() {
  const keyword = document
    .getElementById("scoreSearchInput")
    .value.toLowerCase();
  const tbody = document.getElementById("adminScoreBody");

  let filtered = adminScoreData.filter(
    (st) =>
      st.student_code.toLowerCase().includes(keyword) ||
      st.full_name.toLowerCase().includes(keyword)
  );

  renderFilteredScores(filtered);
}
function renderFilteredScores(rows) {
  const tbody = document.getElementById("adminScoreBody");
  tbody.innerHTML = "";

  rows.forEach((st) => {
    let avg = isNaN(st.avg) ? "-" : st.avg.toFixed(2);
    let color = "";

    if (st.avg >= 8) color = "#dcfce7";
    else if (st.avg >= 6.5) color = "#fef9c3";
    else if (st.avg >= 5) color = "#fde68a";
    else color = "#fee2e2";

    tbody.innerHTML += `
        <tr data-student="${st.student_id}">
            <td>${st.student_code}</td>
            <td>${st.full_name}</td>
            <td>${classSelect.options[classSelect.selectedIndex].text}</td>
            <td>${subjectSelect.options[subjectSelect.selectedIndex].text}</td>

            <td>${renderScoreList(st["15ph"], "15ph", st.student_id)}</td>
            <td>${renderScoreList(st["45ph"], "45ph", st.student_id)}</td>
            <td>${renderScoreList(st["thi"], "thi", st.student_id)}</td>

            <td style="background:${color}; font-weight:600">${avg}</td>
        </tr>
        `;
  });
}

function filterAdvanced() {
  const keyword = document
    .getElementById("scoreSearchInput")
    .value.toLowerCase();
  const avgFilter = document.getElementById("avgFilter").value;
  const rankFilter = document.getElementById("rankFilter").value;
  const sortType = document.getElementById("sortFilter").value;

  // Clone và thêm avg vào từng học sinh
  let result = adminScoreData.map((st) => ({
    ...st,
    avg: calcAvg(st),
  }));

  // 🔍 Tìm kiếm theo tên/mã
  if (keyword) {
    result = result.filter(
      (st) =>
        st.student_code.toLowerCase().includes(keyword) ||
        st.full_name.toLowerCase().includes(keyword)
    );
  }

  // 🎯 Lọc theo điểm TB
  if (avgFilter) {
    result = result.filter((st) => st.avg >= parseFloat(avgFilter));
  }

  // 🏅 Lọc theo học lực
  if (rankFilter) {
    result = result.filter((st) => {
      if (rankFilter === "gioi") return st.avg >= 8.0;
      if (rankFilter === "kha") return st.avg >= 6.5 && st.avg < 8.0;
      if (rankFilter === "tb") return st.avg >= 5.0 && st.avg < 6.5;
      if (rankFilter === "yeu") return st.avg < 5.0;
    });
  }

  // ↕️ Sắp xếp
  if (sortType === "asc") result.sort((a, b) => a.avg - b.avg);
  if (sortType === "desc") result.sort((a, b) => b.avg - a.avg);

  // Render lại
  renderFilteredScores(result);
}

function exportAdminExcel() {
  if (!adminScoreData || adminScoreData.length === 0) {
    return alert("⚠ Không có dữ liệu để xuất!");
  }

  const className = classSelect.options[classSelect.selectedIndex].text;
  const subjectName = subjectSelect.options[subjectSelect.selectedIndex].text;
  const semester = semesterSelect.value;
  const schoolYear = document.getElementById("schoolYearSelect").value;

  const rows = adminScoreData.map((st) => {
    const avg = calcAvg(st).toFixed(2);

    return {
      "Mã HS": st.student_code,
      "Họ tên": st.full_name,
      Lớp: className,
      Môn: subjectName,
      "Điểm 15'": st["15ph"]?.join(", ") || "",
      "Điểm 45'": st["45ph"]?.join(", ") || "",
      "Điểm Thi": st["thi"]?.join(", ") || "",
      "Trung bình": avg,
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "BangDiem");

  XLSX.writeFile(
    wb,
    `Bang_diem_${className}_${subjectName}_HK${semester}_${schoolYear}.xlsx`
  );
}
