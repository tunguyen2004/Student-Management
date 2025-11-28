// assets/js/admin/attendance.js

// ================== COMMON HELPERS ==================

// Set ngày mặc định = hôm nay
function setTodayForAdminDate() {
  const dateInput = document.getElementById("adminAttendanceDate");
  if (!dateInput) return;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateInput.value = `${yyyy}-${mm}-${dd}`;
}

// Hiển thị thông báo dưới bảng
// type: "success" | "error" | "info"
function setAttendanceMessage(text, type = "info") {
  const messageBox = document.getElementById("adminAttendanceMessage");
  if (!messageBox) return;

  messageBox.textContent = text || "";

  // clear class
  messageBox.className = "";
  if (!text) return;

  // thêm class theo type (CSS tuỳ em định nghĩa)
  if (type === "success") {
    messageBox.classList.add("success");
  } else if (type === "error") {
    messageBox.classList.add("error");
  } else {
    messageBox.classList.add("info");
  }
}

// Helper: label trạng thái
function labelStatus(value) {
  switch (value) {
    case "present":
      return "Có mặt";
    case "absent":
      return "Vắng";
    case "late":
      return "Đi muộn";
    case "excused":
      return "Có phép";
    default:
      return value;
  }
}

// Helper: label buổi
function labelSession(value) {
  if (value === "morning") return "Sáng";
  if (value === "afternoon") return "Chiều";
  if (value === "all_day") return "Cả ngày";
  return value || "";
}

// ================== LOAD FILTER DATA ==================

// Load tất cả lớp cho dropdown "Lọc theo lớp"
async function loadAllClassesForAttendance() {
  const classSelect = document.getElementById("adminClassSelect");
  if (!classSelect) return;

  try {
    const response = await getClasses(); // từ api.js
    const classList = Array.isArray(response) ? response : response.data;

    classSelect.innerHTML = '<option value="">Tất cả lớp</option>';

    if (Array.isArray(classList)) {
      classList.forEach((cls) => {
        const option = document.createElement("option");
        option.value = cls.id;
        option.textContent = `${cls.class_code || ""} - ${
          cls.class_name || ""
        }`;
        classSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Lỗi khi tải danh sách lớp cho điểm danh:", error);
    setAttendanceMessage("Lỗi khi tải danh sách lớp.", "error");
  }
}

// ================== LOAD ATTENDANCE LIST ==================

// Tải dữ liệu điểm danh theo bộ lọc
async function loadAdminAttendance() {
  console.log("👉 loadAdminAttendance() called");
  const dateInput = document.getElementById("adminAttendanceDate");
  const sessionSelect = document.getElementById("adminSessionSelect");
  const classSelect = document.getElementById("adminClassSelect");
  const tbody = document.getElementById("adminAttendanceTableBody");

  if (!dateInput || !sessionSelect || !classSelect || !tbody) {
    console.warn("Thiếu element trong DOM cho attendance admin");
    return;
  }

  const date = dateInput.value;
  const session = sessionSelect.value; // "", "morning", "afternoon" (hoặc "all_day" nếu em vẫn để)
  const classId = classSelect.value;

  if (!date) {
    setAttendanceMessage("Vui lòng chọn ngày", "error");
    return;
  }

  setAttendanceMessage("Đang tải dữ liệu...", "info");

  try {
    let endpoint = "";
    const params = new URLSearchParams();
    params.set("date", date);
    if (session) params.set("session", session);

    // Có chọn lớp -> xem theo lớp
    if (classId) {
      endpoint = `attendance/admin/class/${classId}?${params.toString()}`;
    } else {
      // Không chọn lớp -> xem toàn trường
      endpoint = `attendance/admin/date?${params.toString()}`;
    }

    console.log("Gọi API:", endpoint);
    const response = await fetchFromAPI(endpoint);

    // /admin/date: { date, session, records }
    // /admin/class: { class_id, date, session, students }
    const list = response.records || response.students || response.data || [];

    if (!Array.isArray(list) || list.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="8" style="text-align:center;">Không có bản ghi nào.</td></tr>';
      setAttendanceMessage("", "info");
      return;
    }

    // Lấy label lớp nếu đang lọc theo lớp
    let selectedClassLabel = "";
    if (classId) {
      const opt = classSelect.options[classSelect.selectedIndex];
      selectedClassLabel = opt ? opt.textContent : "";
    }

    const rowsHtml = list
      .map((r) => {
        const attendanceId = r.id || r.attendance_id || "";
        const status = r.status || "present";
        const notes = r.notes || "";
        const attDate = r.attendance_date || date;
        const sessionValue = r.session || session || "morning"; // default an toàn

        const classLabel =
          r.class_code || r.class_name
            ? `${r.class_code || ""}${r.class_name ? ` - ${r.class_name}` : ""}`
            : selectedClassLabel || "";

        const sessionText = labelSession(sessionValue);

        return `
          <tr
            data-attendance-id="${attendanceId}"
            data-student-id="${r.student_id}"
            data-class-id="${r.class_id || classId || ""}"
            data-date="${attDate}"
            data-session="${sessionValue}"
          >
            <td>${classLabel}</td>
            <td>${r.student_code || ""}</td>
            <td>${r.full_name || ""}</td>
            <td>${attDate}</td>
            <td>${sessionText}</td>
            <td>
              <select class="admin-attendance-status">
                <option value="present" ${
                  status === "present" ? "selected" : ""
                }>Có mặt</option>
                <option value="absent" ${
                  status === "absent" ? "selected" : ""
                }>Vắng</option>
                <option value="late" ${
                  status === "late" ? "selected" : ""
                }>Đi muộn</option>
                <option value="excused" ${
                  status === "excused" ? "selected" : ""
                }>Có phép</option>
              </select>
            </td>
            <td>
              <input
                type="text"
                class="admin-attendance-notes"
                value="${(notes || "").replace(/"/g, "&quot;")}"
              />
            </td>
            <td class="actions">
              <button class="save-btn" onclick="handleSaveAttendance(${
                attendanceId || 0
              }, this)">💾 Lưu</button>
              <button class="delete-btn" onclick="handleDeleteAttendance(${
                attendanceId || 0
              })">🗑️ Xóa</button>
            </td>
          </tr>
        `;
      })
      .join("");

    tbody.innerHTML = rowsHtml;
    setAttendanceMessage("", "info");
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu điểm danh (admin):", error);
    if (tbody) {
      tbody.innerHTML =
        '<tr><td colspan="8" style="text-align:center;">Lỗi khi tải dữ liệu. Vui lòng thử lại.</td></tr>';
    }
    setAttendanceMessage(
      error.message || "Lỗi khi tải dữ liệu điểm danh",
      "error"
    );
  }
}

// ================== ROW ACTIONS ==================

// Lưu 1 dòng (upsert 1 phần tử, không phụ thuộc id)
async function handleSaveAttendance(_attendanceId, buttonEl) {
  console.log("👉 handleSaveAttendance (upsert 1 dòng) called");
  const row = buttonEl.closest("tr");
  if (!row) return;

  const studentId = Number(row.getAttribute("data-student-id"));
  const classId = Number(row.getAttribute("data-class-id"));
  const attendanceDate = row.getAttribute("data-date");
  const session = row.getAttribute("data-session") || "morning";

  if (!studentId || !classId || !attendanceDate) {
    setAttendanceMessage(
      "Thiếu thông tin học sinh / lớp / ngày để lưu điểm danh.",
      "error"
    );
    return;
  }

  const statusEl = row.querySelector(".admin-attendance-status");
  const notesEl = row.querySelector(".admin-attendance-notes");

  const status = statusEl ? statusEl.value : "present";
  const notes = notesEl ? notesEl.value.trim() : "";

  const payload = {
    items: [
      {
        student_id: studentId,
        class_id: classId,
        attendance_date: attendanceDate,
        session,
        status,
        notes,
      },
    ],
  };

  try {
    setAttendanceMessage("Đang lưu điểm danh...", "info");

    await fetchFromAPI("attendance/admin/bulk", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    setAttendanceMessage("Lưu điểm danh thành công", "success");
  } catch (error) {
    console.error("Lỗi khi lưu điểm danh:", error);
    setAttendanceMessage(error.message || "Lưu điểm danh thất bại", "error");
  }
}

// Xóa 1 bản ghi điểm danh (theo id)
async function handleDeleteAttendance(attendanceId) {
  console.log("👉 handleDeleteAttendance called with id =", attendanceId);
  if (!attendanceId) return;

  const confirmDelete = confirm(
    "Bạn có chắc muốn xóa bản ghi điểm danh này không?"
  );
  if (!confirmDelete) return;

  try {
    setAttendanceMessage("Đang xóa...", "info");

    await fetchFromAPI(`attendance/admin/${attendanceId}`, {
      method: "DELETE",
    });

    // Xóa dòng trên UI
    const row = document.querySelector(
      `tr[data-attendance-id="${attendanceId}"]`
    );
    if (row) row.remove();

    setAttendanceMessage("Xóa bản ghi điểm danh thành công", "success");
  } catch (error) {
    console.error("Lỗi khi xóa điểm danh:", error);
    setAttendanceMessage(
      error.message || "Xóa bản ghi điểm danh thất bại",
      "error"
    );
  }
}

// ================== BULK ACTIONS ==================

// Áp dụng 1 trạng thái cho tất cả các dòng trong bảng (chỉ đổi trên UI)
function applyBulkStatusToAll() {
  console.log("👉 applyBulkStatusToAll() called");
  const bulkSelect = document.getElementById("bulkStatusSelect");
  const tbody = document.getElementById("adminAttendanceTableBody");

  if (!bulkSelect || !tbody) return;

  const value = bulkSelect.value;
  if (!value) {
    setAttendanceMessage("Vui lòng chọn trạng thái trước", "error");
    return;
  }

  const selects = tbody.querySelectorAll(".admin-attendance-status");
  if (!selects.length) {
    setAttendanceMessage("Không có bản ghi nào để áp dụng", "error");
    return;
  }

  selects.forEach((sel) => {
    sel.value = value;
  });

  setAttendanceMessage(
    `Đã áp dụng trạng thái "${labelStatus(
      value
    )}" cho tất cả các dòng (chưa lưu vào DB).`,
    "info"
  );
}

// Lưu tất cả bản ghi đang hiển thị trong bảng (bulk upsert)
async function saveAllAttendance() {
  console.log("👉 saveAllAttendance() called");
  const tbody = document.getElementById("adminAttendanceTableBody");
  if (!tbody) return;

  const rows = tbody.querySelectorAll("tr[data-student-id]");
  if (!rows.length) {
    setAttendanceMessage("Không có bản ghi nào để lưu", "error");
    return;
  }

  const items = Array.from(rows).map((row) => {
    const studentId = Number(row.getAttribute("data-student-id"));
    const classId = Number(row.getAttribute("data-class-id"));
    const attendanceDate = row.getAttribute("data-date");
    const session = row.getAttribute("data-session") || "morning";

    const statusEl = row.querySelector(".admin-attendance-status");
    const notesEl = row.querySelector(".admin-attendance-notes");

    return {
      student_id: studentId,
      class_id: classId,
      attendance_date: attendanceDate,
      session,
      status: statusEl ? statusEl.value : "present",
      notes: notesEl ? notesEl.value.trim() : "",
    };
  });

  try {
    setAttendanceMessage("Đang lưu tất cả bản ghi...", "info");

    await fetchFromAPI("attendance/admin/bulk", {
      method: "PATCH",
      body: JSON.stringify({ items }),
    });

    setAttendanceMessage("Lưu tất cả điểm danh thành công", "success");
  } catch (error) {
    console.error("Lỗi khi lưu tất cả điểm danh:", error);
    setAttendanceMessage(
      error.message || "Lưu tất cả điểm danh thất bại",
      "error"
    );
  }
}

// ================== INIT ==================

function initializeAttendanceManagement() {
  console.log("👉 initializeAttendanceManagement() called");
  setTodayForAdminDate();
  loadAllClassesForAttendance();

  const loadBtn = document.getElementById("adminLoadAttendanceBtn");
  if (loadBtn) {
    loadBtn.addEventListener("click", loadAdminAttendance);
  }

  const bulkBtn = document.getElementById("applyBulkStatusBtn");
  if (bulkBtn) {
    bulkBtn.addEventListener("click", applyBulkStatusToAll);
  }

  const saveAllBtn = document.getElementById("saveAllAttendanceBtn");
  if (saveAllBtn) {
    saveAllBtn.addEventListener("click", saveAllAttendance);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    initializeAttendanceManagement();
  } catch (e) {
    console.error("Lỗi khi init attendance admin:", e);
  }
});
