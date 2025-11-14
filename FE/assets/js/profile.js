document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await fetchFromAPI("profile/me");

    if (!data) return alert("Không tải được thông tin hồ sơ!");

    // ⭐⭐ QUAN TRỌNG: LƯU VÀO BIẾN GLOBAL ⭐⭐
    PROFILE_DATA = data;

    // Header
    document.getElementById("profileName").textContent = data.full_name;
    document.getElementById("profileRole").textContent =
      data.role === "teacher"
        ? "Giáo viên"
        : data.role === "admin"
        ? "Quản trị viên"
        : "Người dùng";

    // User info
    set("username", data.username);
    set("email", data.email);
    set("phone", data.phone);
    set("address", data.address);
    set("dob", formatDate(data.date_of_birth));
    set(
      "gender",
      data.gender === "male" ? "Nam" : data.gender === "female" ? "Nữ" : "Khác"
    );

    // Status badge
    document.getElementById("statusBadge").innerHTML = data.is_active
      ? `<span style="color:green;font-weight:600;">Đang hoạt động</span>`
      : `<span style="color:red;font-weight:600;">Bị khóa</span>`;

    // Teacher info
    if (data.role === "teacher" && data.Teacher) {
      const t = data.Teacher;
      document.getElementById("teacherSection").style.display = "block";

      set("teacherCodeHeader", t.teacher_code);
      set("teacherCode", t.teacher_code);
      set("specialization", t.specialization);
      set("degree", t.degree);
      set("startDate", formatDate(t.start_date));
      set("salary", new Intl.NumberFormat().format(t.salary) + " VNĐ");
      set("bankInfo", `${t.bank_account} (${t.bank_name})`);
    }

    // System info
    set("createdAt", formatDate(data.created_at));
    set("updatedAt", formatDate(data.updated_at));
    set("lastLogin", formatDate(data.last_login));
  } catch (err) {
    console.error("Lỗi profile:", err);
  }
});

function set(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "—";
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("vi-VN");
}

async function saveProfileUpdate() {
  if (!PROFILE_DATA) return alert("Không có dữ liệu hồ sơ!");

  const payload = {
    full_name: document.getElementById("editFullName").value.trim(),
    phone: document.getElementById("editPhone").value.trim(),
    email: document.getElementById("editEmail").value.trim(),
    address: document.getElementById("editAddress").value.trim(),
  };

  // Nếu là giáo viên thì thêm trường giáo viên
  if (PROFILE_DATA.role === "teacher" && PROFILE_DATA.Teacher) {
    payload.specialization = document
      .getElementById("editSpecialization")
      .value.trim();
    payload.degree = document.getElementById("editDegree").value.trim();
  }

  try {
    const res = await fetchFromAPI("profile/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (!res) return alert("Cập nhật thất bại!");

    alert("Cập nhật thông tin thành công!");
    closeEditModal();

    // reload lại dữ liệu profile
    location.reload();
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
    alert("Không thể cập nhật thông tin!");
  }
}

let PROFILE_DATA = null;

// mở modal
function openEditModal() {
  if (!PROFILE_DATA) return;

  document.getElementById("editFullName").value = PROFILE_DATA.full_name || "";
  document.getElementById("editPhone").value = PROFILE_DATA.phone || "";
  document.getElementById("editEmail").value = PROFILE_DATA.email || "";
  document.getElementById("editAddress").value = PROFILE_DATA.address || "";

  // nếu là giáo viên thì mở form teacher
  if (PROFILE_DATA.role === "teacher" && PROFILE_DATA.Teacher) {
    document.getElementById("teacherEditFields").style.display = "block";
    document.getElementById("editSpecialization").value =
      PROFILE_DATA.Teacher.specialization || "";
    document.getElementById("editDegree").value =
      PROFILE_DATA.Teacher.degree || "";
  }

  document.getElementById("editModal").style.display = "flex";
}

// đóng modal
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}
