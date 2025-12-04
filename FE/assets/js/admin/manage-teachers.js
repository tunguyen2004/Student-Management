console.log("✅ manage-teachers.js loaded");

let allTeachers = []; // lưu toàn bộ danh sách để filter

function initializeTeacherManagement() {
  loadTeachers();

  const teacherForm = document.getElementById("teacherForm");
  if (teacherForm) {
    teacherForm.addEventListener("submit", handleFormSubmit);
  }

  // Event search & filter
  document
    .getElementById("searchInput")
    ?.addEventListener("input", applyFilters);
  document
    .getElementById("filterSubject")
    ?.addEventListener("change", applyFilters);
}

/* ============================================================
   🧩 LOAD DANH SÁCH GIÁO VIÊN
=============================================================== */
async function loadTeachers() {
  try {
    const teachers = await getTeachers();
    allTeachers = teachers; // Lưu tất cả để dùng tìm kiếm

    renderTeachers(teachers);
    loadSubjectFilter(teachers);
  } catch (error) {
    console.error("Lỗi khi tải danh sách:", error);
    document.getElementById("teacherTable").innerHTML =
      '<tr><td colspan="6">Lỗi tải dữ liệu.</td></tr>';
  }
}

/* ============================================================
   🧩 RENDER TABLE
=============================================================== */
function renderTeachers(teachers) {
  const table = document.getElementById("teacherTable");
  table.innerHTML = "";

  if (!teachers || teachers.length === 0) {
    table.innerHTML = '<tr><td colspan="6">Không có dữ liệu.</td></tr>';
    return;
  }

  teachers.forEach((t) => {
    table.innerHTML += `
            <tr>
                <td>${teachers.indexOf(t) + 1}</td>
                <td>${t.Teacher.teacher_code}</td>
                <td>${t.full_name}</td>
                <td>${t.email}</td>
                <td>${t.phone}</td>
                <td>${t.Teacher.specialization}</td>
                <td class="actions">
                    <button onclick="handleEditTeacher(${t.id})">✏️ Sửa</button>
                    <button onclick="handleDeleteTeacher(${
                      t.id
                    })">🗑️ Xóa</button>
                </td>
            </tr>
        `;
  });
}

/* ============================================================
   🧩 LOAD BỘ LỌC MÔN DẠY
=============================================================== */
function loadSubjectFilter(teachers) {
  const filter = document.getElementById("filterSubject");
  if (!filter) return;

  const subjects = [...new Set(teachers.map((t) => t.Teacher.specialization))];

  filter.innerHTML = `<option value="">-- Lọc theo môn --</option>`;

  subjects.forEach((sub) => {
    filter.innerHTML += `<option value="${sub}">${sub}</option>`;
  });
}

/* ============================================================
   🔎 TÌM KIẾM + LỌC
=============================================================== */
function applyFilters() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const subject = document.getElementById("filterSubject").value;

  let result = allTeachers.filter((t) => {
    const matchSearch =
      t.Teacher.teacher_code.toLowerCase().includes(keyword) ||
      t.full_name.toLowerCase().includes(keyword) ||
      t.email.toLowerCase().includes(keyword);

    const matchSubject = subject === "" || t.Teacher.specialization === subject;

    return matchSearch && matchSubject;
  });

  renderTeachers(result);
}

/* ============================================================
   ➕ THÊM GIÁO VIÊN
=============================================================== */
function openModal(title) {
  const modal = document.getElementById("teacherModal");
  if (!modal) return;

  document.getElementById("modalTitle").innerText = title;
  modal.classList.add("show");
}
function closeModal() {
  const modal = document.getElementById("teacherModal");

  if (!modal) return;

  // Xóa class show → modal quay về display:none theo CSS
  modal.classList.remove("show");
}

function handleAddTeacher() {
  const form = document.getElementById("teacherForm");
  if (form) {
    form.reset();
    document.getElementById("teacherId").value = "";
  }
  openModal("Thêm giáo viên mới");
}

/* ============================================================
✏️ SỬA GIÁO VIÊN
=============================================================== */
async function handleEditTeacher(id) {
  try {
    const teacher = await getTeacherById(id);

    document.getElementById("teacherId").value = teacher.id;
    document.getElementById("teacher_code").value =
      teacher.Teacher.teacher_code;
    document.getElementById("username").value = teacher.username;
    document.getElementById("full_name").value = teacher.full_name;
    document.getElementById("email").value = teacher.email;
    document.getElementById("phone").value = teacher.phone;
    document.getElementById("address").value = teacher.address || "";
    document.getElementById("date_of_birth").value =
      teacher.date_of_birth?.split("T")[0] || "";
    document.getElementById("gender").value = teacher.gender || "male";

    document.getElementById("specialization").value =
      teacher.Teacher.specialization;
    document.getElementById("degree").value = teacher.Teacher.degree;
    document.getElementById("start_date").value =
      teacher.Teacher.start_date?.split("T")[0] || "";

    document.getElementById("bank_name").value =
      teacher.Teacher.bank_name || "";
    document.getElementById("bank_account").value =
      teacher.Teacher.bank_account || "";
    document.getElementById("salary").value = teacher.Teacher.salary || "";
    document.getElementById("notes").value = teacher.Teacher.notes || "";

    document.getElementById("password").value = "";

    openModal("Cập nhật thông tin giáo viên");
  } catch (error) {
    console.error("Lỗi khi load giáo viên:", error);
    alert("Không thể tải thông tin giáo viên.");
  }
}

/* ============================================================
   💾 LƯU / CẬP NHẬT GIÁO VIÊN
=============================================================== */
async function handleFormSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("teacherId").value;

  // Lấy dữ liệu
  const full_name = document.getElementById("full_name").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const specialization = document.getElementById("specialization").value.trim();
  const teacher_code = document.getElementById("teacher_code").value.trim();
  const password = document.getElementById("password").value;

  let salary = document.getElementById("salary").value.replace(/\D/g, "");

  /* ============================================
      🔥 VALIDATION FORM
     ============================================ */

  // if (!teacher_code) return alert("❌ Vui lòng nhập Mã giáo viên!");
  if (!full_name) return alert("❌ Vui lòng nhập Họ tên!");
  if (!username) return alert("❌ Vui lòng nhập Username!");
  if (username.length < 4) return alert("❌ Username phải có ít nhất 4 ký tự!");

  if (!email) return alert("❌ Email không được để trống!");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) return alert("❌ Email không hợp lệ!");

  if (!phone) return alert("❌ Vui lòng nhập số điện thoại!");
  if (!/^\d{10}$/.test(phone))
    return alert("❌ Số điện thoại phải đúng 10 số!");

  if (!specialization) return alert("❌ Vui lòng nhập chuyên môn!");

  if (password && password.length < 6)
    return alert("❌ Mật khẩu phải tối thiểu 6 ký tự!");

  // Validate lương
  if (salary) {
    salary = parseInt(salary);
    if (salary < 1000000 || salary > 100000000) {
      return alert("❌ Lương phải nằm trong khoảng 1.000.000 - 100.000.000 !");
    }
  }

  /* ============================================
      🔥 TẠO OBJECT ĐỂ GỬI API
     ============================================ */

  const teacherData = {
    username,
    full_name,
    email,
    phone,
    address: document.getElementById("address").value,
    date_of_birth: document.getElementById("date_of_birth").value,
    gender: document.getElementById("gender").value,
    teacher_code,
    specialization,
    degree: document.getElementById("degree").value,
    start_date: document.getElementById("start_date").value,
    bank_name: document.getElementById("bank_name").value,
    bank_account: document.getElementById("bank_account").value,
    salary: salary || null,
    notes: document.getElementById("notes").value,
  };

  if (password) teacherData.password = password;

  try {
    if (id) {
      await updateTeacher(id, teacherData);
      alert("✔ Cập nhật giáo viên thành công!");
    } else {
      await createTeacher(teacherData);
      alert("✔ Thêm giáo viên thành công!");
    }

    closeModal();
    loadTeachers();
  } catch (error) {
    console.error("Lỗi khi lưu:", error);
    alert("❌ Lưu thất bại!");
  }
}

/* ============================================================
   🗑️ XÓA GIÁO VIÊN
=============================================================== */
async function handleDeleteTeacher(id) {
  if (!confirm("Bạn muốn xóa giáo viên này?")) return;

  try {
    await deleteTeacher(id);
    alert("Đã xóa thành công!");
    loadTeachers();
  } catch (error) {
    console.error("Lỗi khi xóa:", error);
    alert("Xóa thất bại.");
  }
}

const salaryInput = document.getElementById("salary");

if (salaryInput) {
  salaryInput.addEventListener("input", () => {
    let value = salaryInput.value.replace(/\D/g, "");
    if (!value) return (salaryInput.value = "");

    salaryInput.value = new Intl.NumberFormat("vi-VN").format(value);
  });
}

/* ============================================================
🔗 PUBLIC FUNCTIONS
=============================================================== */
window.handleEditTeacher = handleEditTeacher;
window.handleAddTeacher = handleAddTeacher;
window.handleFormSubmit = handleFormSubmit;
window.openModal = openModal;
window.closeModal = closeModal;
console.log("👉 teacherForm =", document.getElementById("teacherForm"));
