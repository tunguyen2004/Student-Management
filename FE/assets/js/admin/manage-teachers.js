function initializeTeacherManagement() {
  loadTeachers();

  const teacherForm = document.getElementById("teacherForm");
  if (teacherForm) {
    teacherForm.addEventListener("submit", handleFormSubmit);
  }
}

async function loadTeachers() {
  try {
    const teachers = await getTeachers();
    const teacherTable = document.getElementById("teacherTable");
    if (!teacherTable) return;
    teacherTable.innerHTML = "";

    if (teachers.length === 0) {
      teacherTable.innerHTML =
        '<tr><td colspan="6">Không có dữ liệu giáo viên.</td></tr>';
      return;
    }

    teachers.forEach((teacher) => {
      const row = `
                <tr>
                    <td>${teacher.Teacher.teacher_code}</td>
                    <td>${teacher.full_name}</td>
                    <td>${teacher.email}</td>
                    <td>${teacher.phone}</td>
                    <td>${teacher.Teacher.specialization}</td>
                    <td class="actions">
                        <button onclick="handleEditTeacher(${teacher.id})">✏️ Sửa</button>
                        <button onclick="handleResetPassword(${teacher.id})">🔑 Reset</button>
                        <button onclick="handleDeleteTeacher(${teacher.id})">🗑️ Xóa</button>
                    </td>
                </tr>
            `;
      teacherTable.innerHTML += row;
    });
  } catch (error) {
    console.error("Lỗi khi tải danh sách giáo viên:", error);
    const teacherTable = document.getElementById("teacherTable");
    if (teacherTable) {
      teacherTable.innerHTML =
        '<tr><td colspan="6">Lỗi khi tải dữ liệu. Vui lòng thử lại.</td></tr>';
    }
  }
}

function openModal(title) {
  const modal = document.getElementById("teacherModal");
  const modalTitle = document.getElementById("modalTitle");
  if (modal && modalTitle) {
    modalTitle.textContent = title;
    modal.style.display = "block";
  }
}

function closeModal() {
  const modal = document.getElementById("teacherModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function handleAddTeacher() {
  const form = document.getElementById("teacherForm");
  if (form) {
    form.reset();
    document.getElementById("teacherId").value = "";
  }
  openModal("Thêm giáo viên mới");
}

async function handleEditTeacher(id) {
  try {
    const teacher = await getTeacherById(id);
    const form = document.getElementById("teacherForm");
    if (form) {
      document.getElementById("teacherId").value = teacher.id;
      document.getElementById("username").value = teacher.username;
      document.getElementById("full_name").value = teacher.full_name;
      document.getElementById("email").value = teacher.email;
      document.getElementById("phone").value = teacher.phone;
      document.getElementById("teacher_code").value =
        teacher.teacher.teacher_code;
      document.getElementById("specialization").value =
        teacher.teacher.specialization;
      document.getElementById("degree").value = teacher.teacher.degree;
      document.getElementById("start_date").value = teacher.teacher.start_date
        ? teacher.teacher.start_date.split("T")[0]
        : "";

      // The password field should be cleared for security
      document.getElementById("password").value = "";
    }
    openModal("Cập nhật thông tin giáo viên");
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin giáo viên ${id}:`, error);
    alert("Không thể tải thông tin giáo viên.");
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const id = document.getElementById("teacherId").value;
  const teacherData = {
    username: document.getElementById("username").value,
    full_name: document.getElementById("full_name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    teacher_code: document.getElementById("teacher_code").value,
    specialization: document.getElementById("specialization").value,
    degree: document.getElementById("degree").value,
    start_date: document.getElementById("start_date").value,
  };

  const password = document.getElementById("password").value;
  if (password) {
    teacherData.password = password;
  }

  try {
    if (id) {
      await updateTeacher(id, teacherData);
      alert("Cập nhật giáo viên thành công!");
    } else {
      await createTeacher(teacherData);
      alert("Thêm giáo viên thành công!");
    }
    closeModal();
    loadTeachers();
  } catch (error) {
    console.error("Lỗi khi lưu thông tin giáo viên:", error);
    alert("Lưu thông tin thất bại. " + error.message);
  }
}

function handleResetPassword(id) {
  alert("Chức năng reset mật khẩu cho giáo viên: " + id);
}

async function handleDeleteTeacher(id) {
  if (confirm("Bạn có chắc muốn xóa giáo viên này không?")) {
    try {
      await deleteTeacher(id);
      alert("Đã xóa giáo viên thành công!");
      loadTeachers();
    } catch (error) {
      console.error("Lỗi khi xóa giáo viên:", error);
      alert("Xóa giáo viên thất bại.");
    }
  }
}
