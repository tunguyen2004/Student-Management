// assets/js/teacher/attendance.js

// ================== HELPER CHUNG ==================
function setTodayForTeacherDate() {
  const dateInput = document.getElementById("teacherAttendanceDate");
  if (!dateInput) return;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateInput.value = `${yyyy}-${mm}-${dd}`;
}

// label trạng thái
function labelTeacherStatus(value) {
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

// ================== LOAD LỚP GV DẠY ==================
async function loadTeacherClasses() {
  const classSelect = document.getElementById("teacherClassSelect");
  if (!classSelect) return;

  const fillOptions = (classList) => {
    classSelect.innerHTML = '<option value="">-- Chọn lớp --</option>';

    if (!Array.isArray(classList) || classList.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Không có lớp được phân công";
      classSelect.appendChild(opt);
      return;
    }

    classList.forEach((cls) => {
      const opt = document.createElement("option");
      opt.value = cls.id;
      opt.textContent = cls.name ? `${cls.code} - ${cls.name}` : cls.code;
      classSelect.appendChild(opt);
    });
  };

  try {
    const res = await getTeacherAssignments(); // /assignments/teacher
    console.log("👉 getTeacherAssignments:", res);

    const assignments = Array.isArray(res) ? res : res.data || [];

    const classMap = new Map();
    assignments.forEach((a) => {
      const id = a.class_id;
      if (!id) return;
      if (classMap.has(id)) return;

      const clsInfo = a.Class || {};
      classMap.set(id, {
        id,
        code: clsInfo.class_code || `L${id}`,
        name: clsInfo.class_name || "",
      });
    });

    fillOptions(Array.from(classMap.values()));
  } catch (err) {
    console.error("Lỗi khi load lớp của giáo viên:", err);
    classSelect.innerHTML =
      '<option value="">Không tải được danh sách lớp</option>';
    setTeacherAttendanceMessage(
      "Không tải được danh sách lớp được phân công.",
      "error"
    );
  }
}

// ================== LOAD DS HỌC SINH + ĐIỂM DANH ==================
async function loadTeacherAttendance() {
  console.log("👉 loadTeacherAttendance() called");

  const dateInput = document.getElementById("teacherAttendanceDate");
  const sessionSelect = document.getElementById("teacherSessionSelect");
  const classSelect = document.getElementById("teacherClassSelect");
  const tbody = document.getElementById("teacherAttendanceTableBody");

  if (!dateInput || !sessionSelect || !classSelect || !tbody) {
    console.warn("Thiếu element trong DOM (teacher attendance)");
    return;
  }

  const date = dateInput.value;
  const session = sessionSelect.value; // morning | afternoon
  const classId = classSelect.value;

  if (!date || !session || !classId) {
    setTeacherAttendanceMessage(
      "Vui lòng chọn đầy đủ Ngày, Buổi và Lớp.",
      "error"
    );
    return;
  }

  setTeacherAttendanceMessage("Đang tải danh sách học sinh...", "info");

  try {
    const q = new URLSearchParams({ date, session });
    const endpoint = `attendance/class/${classId}?${q.toString()}`;

    console.log("Gọi API:", endpoint);
    const res = await fetchFromAPI(endpoint);

    const students = res.students || res.data || [];
    if (!Array.isArray(students) || students.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" style="text-align:center;">Không có học sinh trong lớp hoặc chưa có dữ liệu.</td></tr>';
      setTeacherAttendanceMessage("", "info");
      return;
    }

    const sessionText = session === "morning" ? "Sáng" : "Chiều";

    const rowsHtml = students
      .map((st) => {
        const status = st.status || "present";
        const notes = st.notes || "";
        const attDate = st.attendance_date || date;
        const sessionValue = st.session || session; // thường = session param

        return `
          <tr
            data-student-id="${st.student_id}"
            data-class-id="${res.class_id || classId}"
            data-date="${attDate}"
            data-session="${sessionValue}"
          >
            <td>${st.student_code || ""}</td>
            <td>${st.full_name || ""}</td>
            <td>${attDate}</td>
            <td>${sessionValue === "morning" ? "Sáng" : "Chiều"}</td>
            <td>
              <select class="teacher-attendance-status">
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
                class="teacher-attendance-notes"
                value="${notes.replace(/"/g, "&quot;")}"
              />
            </td>
          </tr>
        `;
      })
      .join("");

    tbody.innerHTML = rowsHtml;
    setTeacherAttendanceMessage("", "info");
  } catch (err) {
    console.error("Lỗi loadTeacherAttendance:", err);
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align:center;">Lỗi khi tải danh sách. Vui lòng thử lại.</td></tr>';
    setTeacherAttendanceMessage(
      err.message || "Lỗi khi tải danh sách điểm danh",
      "error"
    );
  }
}

// ================== BULK ACTIONS (GV) ==================
function applyTeacherBulkStatus() {
  console.log("👉 applyTeacherBulkStatus() called");

  const bulkSelect = document.getElementById("teacherBulkStatusSelect");
  const tbody = document.getElementById("teacherAttendanceTableBody");
  if (!bulkSelect || !tbody) return;

  const value = bulkSelect.value;
  if (!value) {
    setTeacherAttendanceMessage("Vui lòng chọn trạng thái trước.", "error");
    return;
  }

  const selects = tbody.querySelectorAll(".teacher-attendance-status");
  if (!selects.length) {
    setTeacherAttendanceMessage("Không có học sinh nào để áp dụng.", "error");
    return;
  }

  selects.forEach((sel) => {
    sel.value = value;
  });

  setTeacherAttendanceMessage(
    `Đã áp dụng trạng thái "${labelTeacherStatus(
      value
    )}" cho tất cả (chưa lưu DB).`,
    "info"
  );
}

// Lưu điểm danh cho cả lớp (GV)
async function saveAllTeacherAttendance() {
  console.log("👉 saveAllTeacherAttendance() called");

  const dateInput = document.getElementById("teacherAttendanceDate");
  const sessionSelect = document.getElementById("teacherSessionSelect");
  const classSelect = document.getElementById("teacherClassSelect");
  const tbody = document.getElementById("teacherAttendanceTableBody");

  if (!dateInput || !sessionSelect || !classSelect || !tbody) return;

  const date = dateInput.value;
  const session = sessionSelect.value;
  const classId = Number(classSelect.value);

  if (!date || !session || !classId) {
    setTeacherAttendanceMessage(
      "Vui lòng chọn đầy đủ Ngày, Buổi và Lớp trước khi lưu.",
      "error"
    );
    return;
  }

  const rows = tbody.querySelectorAll("tr[data-student-id]");
  if (!rows.length) {
    setTeacherAttendanceMessage(
      "Không có học sinh nào trong danh sách để lưu.",
      "error"
    );
    return;
  }

  const students = Array.from(rows).map((row) => {
    const studentId = Number(row.getAttribute("data-student-id"));
    const statusEl = row.querySelector(".teacher-attendance-status");
    const notesEl = row.querySelector(".teacher-attendance-notes");

    return {
      student_id: studentId,
      status: statusEl ? statusEl.value : "present",
      notes: notesEl ? notesEl.value.trim() : "",
    };
  });

  const payload = {
    class_id: classId,
    attendance_date: date,
    session, // morning | afternoon
    students,
  };

  try {
    setTeacherAttendanceMessage("Đang lưu điểm danh...", "info");

    await fetchFromAPI("attendance/mark", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setTeacherAttendanceMessage("Lưu điểm danh thành công.", "success");
  } catch (err) {
    console.error("Lỗi saveAllTeacherAttendance:", err);
    setTeacherAttendanceMessage(
      err.message || "Lưu điểm danh thất bại.",
      "error"
    );
  }
}

// ================== INIT ==================
function initializeTeacherAttendancePage() {
  console.log("👉 initializeTeacherAttendancePage() called");
  setTodayForTeacherDate();
  loadTeacherClasses();

  const loadBtn = document.getElementById("teacherLoadAttendanceBtn");
  if (loadBtn) {
    loadBtn.addEventListener("click", loadTeacherAttendance);
  }

  const bulkBtn = document.getElementById("teacherApplyBulkStatusBtn");
  if (bulkBtn) {
    bulkBtn.addEventListener("click", applyTeacherBulkStatus);
  }

  const saveBtn = document.getElementById("teacherSaveAllAttendanceBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", saveAllTeacherAttendance);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    initializeTeacherAttendancePage();
  } catch (e) {
    console.error("Lỗi init trang điểm danh GV:", e);
  }
});

let teacherMessageTimeout = null;

function setTeacherAttendanceMessage(text, type = "info") {
  const box = document.getElementById("teacherAttendanceMessage");
  if (!box) return;

  // Reset
  box.className = "message";
  box.textContent = text;

  if (!text) return;

  if (type === "success") box.classList.add("success");
  else if (type === "error") box.classList.add("error");

  box.classList.add("show");

  // Clear timeout trước đó (nếu user bấm nhiều lần)
  if (teacherMessageTimeout) {
    clearTimeout(teacherMessageTimeout);
  }

  // Tự ẩn sau 3 giây
  teacherMessageTimeout = setTimeout(() => {
    box.classList.remove("show");
  }, 3000);
}
