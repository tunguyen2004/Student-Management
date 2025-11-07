let allStudents = []; // Store the master list of students

function initializeStudentManagement() {
  loadStudents();
  loadClassesForDropdown(); // For the modal
  loadClassesForFilterDropdown(); // For the filter bar

  const studentForm = document.getElementById("studentForm");
  if (studentForm) {
    studentForm.addEventListener("submit", handleFormSubmit);
  }

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", renderStudents);
  }

  const classFilter = document.getElementById("classFilterSelect");
  if (classFilter) {
    classFilter.addEventListener("change", renderStudents);
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

function renderStudents() {
  const studentTable = document.getElementById("studentTable");
  if (!studentTable) return;

  const searchInput = document.getElementById("searchInput");
  const classFilter = document.getElementById("classFilterSelect");

  const searchTerm = searchInput.value.toLowerCase();
  const classId = classFilter.value;

  const filteredStudents = allStudents.filter((student) => {
    const matchesSearch =
      student.full_name.toLowerCase().includes(searchTerm) ||
      student.student_code.toLowerCase().includes(searchTerm);
    const matchesClass = !classId || student.class_id == classId;
    return matchesSearch && matchesClass;
  });

  if (filteredStudents.length === 0) {
    studentTable.innerHTML =
      '<tr><td colspan="9" style="text-align: center;">Không tìm thấy học sinh nào.</td></tr>';
    return;
  }

  const rowsHtml = filteredStudents
    .map(
      (student) => `
            <tr>
                    <td>${student.student_code}</td>
                    <td>${student.full_name}</td>
                    <td>${new Date(
                      student.date_of_birth
                    ).toLocaleDateString()}</td>
                    <td>${student.gender === "male" ? "Nam" : "Nữ"}</td>
                    <td>${
                      student.Class?.class_name ||
                      student.Class?.class_code ||
                      "N/A"
                    }</td>
                    <td>${student.phone || "N/A"}</td>
                    <td>${student.address || "N/A"}</td>
                    <td>${student.status || "N/A"}</td>
                    <td class="actions">
                            <button onclick="handleEditStudent(${
                              student.id
                            })">Sửa</button>
                            <button onclick="handleDeleteStudent(${
                              student.id
                            })">Xóa</button>
                    </td>
            </tr>
    `
    )
    .join("");

  studentTable.innerHTML = rowsHtml;
}

async function loadStudents() {
  try {
    const response = await getStudents();
    const studentList = response.data || response;

    if (Array.isArray(studentList)) {
      allStudents = studentList;
      renderStudents();
    } else {
      throw new Error("API response for students is not an array.");
    }
  } catch (error) {
    console.error("Lỗi khi tải danh sách học sinh:", error);
    document.getElementById("studentTable").innerHTML =
      '<tr><td colspan="9" style="text-align: center;">Tải danh sách thất bại.</td></tr>';
  }
}

async function loadClassesForDropdown() {
  try {
    const response = await getClasses();
    const classList = response.data || response;
    const classSelect = document.getElementById("class_id");

    if (classSelect && Array.isArray(classList)) {
      classSelect.innerHTML = '<option value="">-- Chọn lớp --</option>';
      classList.forEach((cls) => {
        const option = document.createElement("option");
        option.value = cls.id;
        option.textContent = cls.class_name;
        classSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Lỗi khi tải danh sách lớp học cho dropdown:", error);
  }
}

async function loadClassesForFilterDropdown() {
  try {
    const response = await getClasses();
    const classList = response.data || response;
    const classFilterSelect = document.getElementById("classFilterSelect");

    if (classFilterSelect && Array.isArray(classList)) {
      classFilterSelect.innerHTML = '<option value="">Tất cả các lớp</option>';
      classList.forEach((cls) => {
        const option = document.createElement("option");
        option.value = cls.id;
        option.textContent = cls.class_name;
        classFilterSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Lỗi khi tải danh sách lớp học cho bộ lọc:", error);
  }
}

async function handleAddStudent() {
  const form = document.getElementById("studentForm");
  form.reset();

  document.getElementById("studentId").value = ""; // clear ID
  document.getElementById("student_code").value = ""; // code sẽ auto-gen từ BE
  document.getElementById("student_code").disabled = true;

  await loadClassesForDropdown();
  openModal("studentModal", "Thêm học sinh mới");
}

/* ===========================
    ✅ EDIT STUDENT (UPDATE)
=========================== */
async function handleEditStudent(id) {
  try {
    const response = await getStudentById(id);
    const student = response.data || response;

    document.getElementById("studentId").value = student.id;
    document.getElementById("student_code").value = student.student_code;
    document.getElementById("student_code").disabled = true;

    document.getElementById("full_name").value = student.full_name;
    document.getElementById("date_of_birth").value =
      student.date_of_birth?.split("T")[0] || "";
    document.getElementById("gender").value = student.gender;

    document.getElementById("email").value = student.email || "";
    document.getElementById("phone").value = student.phone || "";
    document.getElementById("address").value = student.address || "";
    document.getElementById("parent_name").value = student.parent_name || "";
    document.getElementById("parent_phone").value = student.parent_phone || "";
    document.getElementById("enrollment_date").value =
      student.enrollment_date?.split("T")[0] || "";
    document.getElementById("status").value = student.status || "studying";
    document.getElementById("notes").value = student.notes || "";

    await loadClassesForDropdown();
    document.getElementById("class_id").value = student.class_id;

    openModal("studentModal", "Cập nhật thông tin học sinh");
  } catch (error) {
    console.error("❌ Lỗi load dữ liệu học sinh:", error);
    alert("Không thể tải dữ liệu học sinh.");
  }
}

/* ===========================
    ✅ SUBMIT FORM (CREATE UPDATE)
=========================== */
async function handleFormSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("studentId").value;

  const studentData = {
    full_name: document.getElementById("full_name").value,
    date_of_birth: document.getElementById("date_of_birth").value,
    gender: document.getElementById("gender").value,
    class_id: Number(document.getElementById("class_id").value),
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    parent_name: document.getElementById("parent_name").value,
    parent_phone: document.getElementById("parent_phone").value,
    enrollment_date: document.getElementById("enrollment_date").value,
    status: document.getElementById("status").value,
    notes: document.getElementById("notes").value,
  };

  try {
    if (id) {
      await updateStudent(id, studentData);
      alert("✅ Cập nhật học sinh thành công!");
    } else {
      await createStudent(studentData);
      alert("✅ Thêm học sinh thành công!");
    }

    closeModal("studentModal");
    loadStudents(); // reload UI
  } catch (error) {
    console.error("❌ Lỗi khi lưu:", error);
    alert("Lỗi khi lưu học sinh.");
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const id = document.getElementById("studentId").value;
  const classId = document.getElementById("class_id").value;

  const studentData = {
    student_code: document.getElementById("student_code").value,
    full_name: document.getElementById("full_name").value,
    date_of_birth: document.getElementById("date_of_birth").value,
    gender: document.getElementById("gender").value,
    class_id: classId ? parseInt(classId, 10) : null,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    parent_name: document.getElementById("parent_name").value,
    parent_phone: document.getElementById("parent_phone").value,
    enrollment_date: document.getElementById("enrollment_date").value,
    status: document.getElementById("status").value,
    notes: document.getElementById("notes").value,
  };

  try {
    if (id) {
      await updateStudent(id, studentData);
      alert("Cập nhật học sinh thành công!");
    } else {
      await createStudent(studentData);
      alert("Thêm học sinh thành công!");
    }
    closeModal("studentModal");
    loadStudents();
  } catch (error) {
    console.error("Lỗi khi lưu thông tin học sinh:", error);
    alert("Lưu thông tin thất bại. " + error.message);
  }
}

async function handleDeleteStudent(id) {
  if (confirm("Bạn có chắc muốn xóa học sinh này không?")) {
    try {
      await deleteStudent(id);
      alert("Đã xóa học sinh thành công!");
      loadStudents();
    } catch (error) {
      console.error("Lỗi khi xóa học sinh:", error);
      alert("Xóa học sinh thất bại.");
    }
  }
}
