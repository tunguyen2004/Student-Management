// assets/js/admin/manage-classes.js
function initializeClassManagement() {
  loadClasses();

  const classForm = document.getElementById("classForm");
  if (classForm) {
    classForm.addEventListener("submit", handleFormSubmit);
  }
}
function openModal(modalId, title = "Thông tin") {
  const modal = document.getElementById(modalId);
  const modalTitle = modal.querySelector("#modalTitle");

  modal.style.display = "flex"; // show modal, center
  modalTitle.textContent = title; // set title
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
}

async function loadClasses() {
  try {
    const response = await getClasses();
    const classTable = document.getElementById("classTable");
    if (!classTable) return;

    const classList = Array.isArray(response) ? response : response.data;

    if (!Array.isArray(classList)) {
      throw new Error("Dữ liệu lớp học trả về không phải là một mảng.");
    }

    if (classList.length === 0) {
      classTable.innerHTML =
        '<tr><td colspan="10" style="text-align: center;">Không có dữ liệu lớp học.</td></tr>';
      return;
    }

    const rowsHtml = classList
      .map((cls) => {
        // 🔥 Lấy tên giáo viên chủ nhiệm đúng chuẩn
        const teacherName =
          cls.Teacher && cls.Teacher.User
            ? cls.Teacher.User.full_name
            : "Chưa có";

        // 🔥 Trạng thái
        const statusText =
          cls.status === "active" ? "Hoạt động" : "Không hoạt động";

        return `
        <tr>
            <td>${cls.class_code}</td>
            <td>${cls.class_name}</td>
            <td>${cls.grade}</td>
            <td>${cls.school_year}</td>
            <td>${cls.room_number || "N/A"}</td>

            <!-- 🔥 đảm bảo luôn hiện đúng sĩ số -->
            <td>${cls.student_count ?? 0}</td>

            <td>${cls.max_students || "N/A"}</td>
            <td>${statusText}</td>

            <!-- 🔥 hiện đúng giáo viên -->
            <td>${teacherName}</td>

            <td class="actions">
                <button onclick="handleEditClass(${cls.id})">✏️ Sửa</button>
                <button onclick="handleDeleteClass(${cls.id})">🗑️ Xóa</button>
            </td>
        </tr>
    `;
      })
      .join("");

    classTable.innerHTML = rowsHtml;
  } catch (error) {
    console.error("Lỗi khi tải danh sách lớp học:", error);
    const classTable = document.getElementById("classTable");
    if (classTable) {
      classTable.innerHTML =
        '<tr><td colspan="10" style="text-align: center;">Lỗi khi tải dữ liệu. Vui lòng thử lại.</td></tr>';
    }
  }
}

async function loadTeachersForDropdown() {
  try {
    const response = await getTeachers();
    const teacherList = response.data || response; // Defensive check

    const teacherSelect = document.getElementById("homeroom_teacher_id");
    if (teacherSelect) {
      teacherSelect.innerHTML = '<option value="">-- Chọn GVCN --</option>';

      if (Array.isArray(teacherList)) {
        teacherList.forEach((teacher) => {
          const option = document.createElement("option");
          option.value = teacher.Teacher.id;
          option.textContent = teacher.full_name;
          teacherSelect.appendChild(option);
        });
      }
    }
  } catch (error) {
    console.error("Lỗi khi tải danh sách giáo viên:", error);
  }
}

async function handleAddClass() {
  const form = document.getElementById("classForm");
  if (form) {
    form.reset();
    document.getElementById("classId").value = "";
  }
  await loadTeachersForDropdown();
  openModal("classModal", "Thêm lớp học mới");
}

async function handleEditClass(id) {
  try {
    const response = await getClassById(id);
    const cls = response.data || response; // Defensively get the actual class object

    const form = document.getElementById("classForm");
    if (form) {
      document.getElementById("classId").value = cls.id;
      const codeInput = document.getElementById("class_code");
      if (codeInput) codeInput.value = cls.class_code;
      document.getElementById("class_name").value = cls.class_name;
      document.getElementById("grade").value = cls.grade;
      document.getElementById("school_year").value = cls.school_year;
      document.getElementById("room_number").value = cls.room_number || "";
      document.getElementById("max_students").value = cls.max_students || "";
      document.getElementById("status").value = cls.status || "active";

      await loadTeachersForDropdown();
      document.getElementById("homeroom_teacher_id").value =
        cls.homeroom_teacher_id || "";
    }
    openModal("classModal", "Cập nhật thông tin lớp học");
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin lớp học ${id}:`, error);
    alert("Không thể tải thông tin lớp học.");
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const id = document.getElementById("classId").value;

  const homeroomTeacherId = document.getElementById(
    "homeroom_teacher_id"
  ).value;
  const maxStudents = document.getElementById("max_students").value;

  const classData = {
    class_name: document.getElementById("class_name").value,
    grade: document.getElementById("grade").value,
    school_year: document.getElementById("school_year").value,
    room_number: document.getElementById("room_number").value,
    max_students: maxStudents ? parseInt(maxStudents) : null,
    status: document.getElementById("status").value,
    homeroom_teacher_id: homeroomTeacherId ? parseInt(homeroomTeacherId) : null,
  };

  try {
    if (id) {
      await updateClass(id, classData);
      alert("Cập nhật lớp học thành công!");
    } else {
      await createClass(classData);
      alert("Thêm lớp học thành công!");
    }
    closeModal("classModal");
    loadClasses();
  } catch (error) {
    console.error("Lỗi khi lưu thông tin lớp học:", error);
    alert("Lưu thông tin thất bại. " + error.message);
  }
}

async function handleDeleteClass(id) {
  if (
    confirm(
      "Bạn có chắc muốn xóa lớp học này không? Thao tác này không thể hoàn tác."
    )
  ) {
    try {
      await deleteClass(id);
      alert("Đã xóa lớp học thành công!");
      loadClasses();
    } catch (error) {
      console.error("Lỗi khi xóa lớp học:", error);
      alert("Xóa lớp học thất bại.");
    }
  }
}
