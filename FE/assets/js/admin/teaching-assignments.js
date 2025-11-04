document.addEventListener("DOMContentLoaded", () => {
  loadAssignments();
  createModal();
});

async function loadAssignments() {
  try {
    let assignments = await getAssignments();
    if (assignments && !Array.isArray(assignments)) {
      assignments = [assignments];
    }
    renderAssignments(assignments);
  } catch (error) {
    console.error("Failed to load assignments:", error);
    const tbody = document.getElementById("assignmentTableBody");
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align:center;">Không thể tải dữ liệu. Vui lòng kiểm tra console.</td></tr>';
  }
}

function renderAssignments(assignments) {
  const tbody = document.getElementById("assignmentTableBody");
  tbody.innerHTML = "";
  if (!assignments || assignments.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align:center;">Chưa có phân công nào.</td></tr>';
    return;
  }
  assignments.forEach((a) => {
    const row = `
            <tr>
                <td>${a.assignment_id}</td>
                <td><strong>${a.Teacher.teacher_code}</strong><br><small>${
      a.Teacher.User.full_name
    }</small></td>
                <td><strong>${a.Class.class_code}</strong> - ${
      a.Class.class_name
    }</td>
                <td><strong>${a.Subject.subject_code}</strong> - ${
      a.Subject.subject_name
    }</td>
                <td>Học kỳ ${a.semester}</td>
                <td>${a.school_year}</td>
                <td><small>${formatSchedule(a.teaching_schedule)}</small></td>
                <td class="actions">
                    <button onclick="editAssignment(${
                      a.assignment_id
                    })">Sửa</button>
                    <button class="delete-btn" onclick="deleteAssignment(${
                      a.assignment_id
                    })">Xóa</button>
                </td>
            </tr>
        `;
    tbody.innerHTML += row;
  });
}

function formatSchedule(jsonStr) {
  if (!jsonStr || jsonStr === "{}") return "Chưa có lịch";
  try {
    const schedule = JSON.parse(jsonStr);
    return Object.entries(schedule)
      .map(([day, periods]) => {
        const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
        return `<strong>${capitalizedDay}:</strong> ${periods.join(", ")}`;
      })
      .join("<br>");
  } catch (e) {
    return "Lỗi định dạng lịch";
  }
}

// --- MODAL & FORM LOGIC ---

function addAssignment() {
  openAssignmentModal();
}

function editAssignment(id) {
  openAssignmentModal(id);
}

function createModal() {
  if (document.getElementById("assignmentModal")) return;
  const modalHTML = `
    <div id="assignmentModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="modalTitle"></h2>
          <span class="close-btn" onclick="closeAssignmentModal()">&times;</span>
        </div>
        <div class="modal-body">
          <form id="assignmentForm">
            <input type="hidden" id="assignmentId" name="assignmentId">
            <div class="form-row">
                <div class="form-group">
                  <label for="teacherId">Giáo viên:</label>
                  <select id="teacherId" name="teacherId" required></select>
                </div>
                <div class="form-group">
                  <label for="classId">Lớp học:</label>
                  <select id="classId" name="classId" required></select>
                </div>
            </div>
            <div class="form-group">
              <label for="subjectId">Môn học:</label>
              <select id="subjectId" name="subjectId" required></select>
            </div>
            <div class="form-row">
                <div class="form-group">
                  <label for="semester">Học kỳ:</label>
                  <select id="semester" name="semester" required>
                    <option value="" disabled selected>-- Chọn --</option>
                    <option value="1">Học kỳ 1</option>
                    <option value="2">Học kỳ 2</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="schoolYear">Năm học:</label>
                  <input type="text" id="schoolYear" name="schoolYear" placeholder="Ví dụ: 2024-2025" required>
                </div>
            </div>
            <div class="form-group">
                <label>Lịch dạy:</label>
                <div id="scheduleContainer"></div>
                <button type="button" class="btn-add-schedule" onclick="addScheduleRow()">+ Thêm lịch dạy</button>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="closeAssignmentModal()">Hủy</button>
              <button type="submit" class="btn btn-primary">Lưu</button>
            </div>
          </form>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  document
    .getElementById("assignmentForm")
    .addEventListener("submit", handleAssignmentFormSubmit);
}

async function populateTeachers() {
  const select = document.getElementById("teacherId");
  select.innerHTML = `<option value="" disabled selected>-- Đang tải... --</option>`;
  try {
    const teachers = await getTeachers();
    select.innerHTML = `<option value="" disabled selected>-- Chọn giáo viên --</option>`;
    teachers.forEach((teacher) => {
      // Sửa lỗi: Dùng ID của giáo viên (teacher.teacher.id) thay vì ID của user (teacher.id)
      select.innerHTML += `<option value="${teacher.Teacher.id}">${teacher.full_name} (${teacher.Teacher.teacher_code})</option>`;
    });
  } catch (error) {
    console.error(`Failed to populate teachers:`, error);
    select.innerHTML = `<option value="">Lỗi tải dữ liệu</option>`;
  }
}

async function populateClasses() {
  const select = document.getElementById("classId");
  select.innerHTML = `<option value="" disabled selected>-- Đang tải... --</option>`;
  try {
    const classes = await getClasses();
    select.innerHTML = `<option value="" disabled selected>-- Chọn lớp học --</option>`;
    classes.forEach((cls) => {
      select.innerHTML += `<option value="${cls.id}">${cls.class_name} (${cls.school_year})</option>`;
    });
  } catch (error) {
    console.error(`Failed to populate classes:`, error);
    select.innerHTML = `<option value="">Lỗi tải dữ liệu</option>`;
  }
}

async function populateSubjects() {
  const select = document.getElementById("subjectId");
  select.innerHTML = `<option value="" disabled selected>-- Đang tải... --</option>`;
  try {
    const subjects = await getSubjects();
    select.innerHTML = `<option value="" disabled selected>-- Chọn môn học --</option>`;
    subjects.forEach((subject) => {
      select.innerHTML += `<option value="${subject.id}">${subject.subject_name} (${subject.subject_code})</option>`;
    });
  } catch (error) {
    console.error(`Failed to populate subjects:`, error);
    select.innerHTML = `<option value="">Lỗi tải dữ liệu</option>`;
  }
}

async function openAssignmentModal(id = null) {
  const modal = document.getElementById("assignmentModal");
  const modalTitle = document.getElementById("modalTitle");
  document.getElementById("assignmentForm").reset();
  document.getElementById("scheduleContainer").innerHTML = "";
  document.getElementById("assignmentId").value = "";

  const populatePromises = [
    populateTeachers(),
    populateClasses(),
    populateSubjects(),
  ];
  await Promise.all(populatePromises);

  if (id) {
    modalTitle.textContent = "Cập nhật phân công";
    try {
      const assignment = await getAssignmentById(id);
      document.getElementById("assignmentId").value = assignment.id;
      document.getElementById("teacherId").value = assignment.teacher_id;
      document.getElementById("classId").value = assignment.class_id;
      document.getElementById("subjectId").value = assignment.subject_id;
      document.getElementById("semester").value = assignment.semester;
      document.getElementById("schoolYear").value = assignment.school_year;

      if (assignment.teaching_schedule) {
        const schedule = JSON.parse(assignment.teaching_schedule);
        Object.entries(schedule).forEach(([day, periods]) => {
          addScheduleRow(day, periods);
        });
      }
    } catch (error) {
      console.error(`Failed to fetch assignment ${id}:`, error);
      alert("Không thể tải thông tin phân công.");
      return;
    }
  } else {
    modalTitle.textContent = "Thêm phân công mới";
  }
  modal.style.display = "flex";
}

function closeAssignmentModal() {
  document.getElementById("assignmentModal").style.display = "none";
}

function addScheduleRow(day = "thu2", periods = []) {
  const container = document.getElementById("scheduleContainer");
  const row = document.createElement("div");
  row.className = "schedule-row";

  const dayOptions = ["thu2", "thu3", "thu4", "thu5", "thu6", "thu7"]
    .map(
      (d) =>
        `<option value="${d}" ${d === day ? "selected" : ""}>${
          d.charAt(0).toUpperCase() + d.slice(1)
        }</option>`
    )
    .join("");

  const periodOptions = Array.from({ length: 12 }, (_, i) => `T${i + 1}`)
    .map(
      (p) =>
        `<option value="${p}" ${
          periods.includes(p) ? "selected" : ""
        }>${p}</option>`
    )
    .join("");

  row.innerHTML = `
        <select class="schedule-day form-control">${dayOptions}</select>
        <select class="schedule-periods form-control" multiple>${periodOptions}</select>
        <button type="button" class="btn-remove-schedule" onclick="this.parentElement.remove()">Xóa</button>
    `;
  container.appendChild(row);
}

async function handleAssignmentFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const assignmentId = form.assignmentId.value;

  const scheduleRows = document.querySelectorAll(
    "#scheduleContainer .schedule-row"
  );
  const schedule = {};
  scheduleRows.forEach((row) => {
    const day = row.querySelector(".schedule-day").value;
    const periods = Array.from(
      row.querySelector(".schedule-periods").selectedOptions
    ).map((opt) => opt.value);
    if (periods.length > 0) {
      if (schedule[day]) {
        schedule[day].push(...periods);
      } else {
        schedule[day] = periods;
      }
    }
  });

  const data = {
    teacher_id: form.teacherId.value,
    class_id: form.classId.value,
    subject_id: form.subjectId.value,
    semester: form.semester.value,
    school_year: form.schoolYear.value,
    teaching_schedule: JSON.stringify(schedule),
  };

  try {
    if (assignmentId) {
      await updateAssignment(assignmentId, data);
      alert("Cập nhật phân công thành công!");
    } else {
      await createAssignment(data);
      alert("Thêm phân công thành công!");
    }
    closeAssignmentModal();
    loadAssignments();
  } catch (error) {
    console.error("Failed to save assignment:", error);
    alert(`Lưu phân công thất bại: ${error.message}`);
  }
}

async function deleteAssignment(id) {
  const confirmed = confirm(`Bạn có chắc muốn xóa phân công ID ${id}?`);
  if (confirmed) {
    try {
      await deleteAssignmentApi(id);
      alert("Đã xóa phân công thành công!");
      loadAssignments();
    } catch (error) {
      console.error(`Failed to delete assignment ${id}:`, error);
      alert("Xóa phân công thất bại. Vui lòng thử lại.");
    }
  }
}
