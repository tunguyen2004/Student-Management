// Xem danh sách HS lớp mình
document.addEventListener("DOMContentLoaded", () => {
  loadAssignedClasses();
});

// lấy danh sách lớp mà giáo viên được phân công dạy
async function loadAssignedClasses() {
  const select = document.getElementById("classSelect");

  try {
    const res = await fetch("http://localhost:5000/api/assignments/teacher", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const classes = await res.json();

    select.innerHTML = `<option value="">-- Chọn lớp --</option>`;

    classes.forEach((c) => {
      select.innerHTML += `<option value="${c.class_id}">${c.Class.class_name} (${c.Class.class_code})</option>`;
    });
  } catch (err) {
    console.error("Error loading assigned classes:", err);
  }
}

// load danh sách học sinh theo class_id
async function loadStudents() {
  const classId = document.getElementById("classSelect").value;
  const tbody = document.getElementById("studentTableBody");
  document.getElementById(
    "studentTableBody"
  ).innerHTML = `<tr><td colspan="4">🔄 Đang tải dữ liệu...</td></tr>`;

  if (!classId) {
    tbody.innerHTML = `<tr><td colspan="4">Vui lòng chọn lớp.</td></tr>`;
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:5000/api/teachers/students?class_id=${classId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Không có quyền truy cập lớp này");
    }

    const students = await res.json();

    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4">Chưa có học sinh nào.</td></tr>`;
      return;
    }

    tbody.innerHTML = "";

    students.forEach((s) => {
      const row = `
        <tr>
            <td>${s.student_code}</td>
            <td>${s.full_name}</td>
            <td>${s.gender === "male" ? "Nam" : "Nữ"}</td>
            <td>${s.dob ?? ""}</td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error("Error loading students:", err);
    tbody.innerHTML = `<tr><td colspan="4">Không có quyền xem lớp này</td></tr>`;
  }
}
