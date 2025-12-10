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

  const full_name = document.getElementById("editFullName").value.trim();
  const phone = document.getElementById("editPhone").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const dob = document.getElementById("editDob").value.trim();
  const address = document.getElementById("editAddress").value.trim();

  // === KIỂM TRA KHÔNG ĐỂ TRỐNG ===
  if (!full_name || !phone || !email || !dob || !address) {
    return alert("❌ Vui lòng nhập đầy đủ tất cả các trường!");
  }

  // === KIỂM TRA EMAIL ===
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return alert("❌ Email không hợp lệ! Vui lòng kiểm tra lại.");
  }

  // === KIỂM TRA SỐ ĐIỆN THOẠI VIỆT NAM ===
  const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
  if (!phoneRegex.test(phone)) {
    return alert("❌ Số điện thoại không hợp lệ! Phải bao gồm 10 số.");
  }

  // === KIỂM TRA NGÀY SINH (không được lớn hơn hiện tại) ===
  const today = new Date();
  const birthday = new Date(dob);

  if (birthday > today) {
    return alert("❌ Ngày sinh không hợp lệ! Không thể lớn hơn ngày hiện tại.");
  }

  const payload = {
    full_name,
    phone,
    email,
    date_of_birth: dob,
    address,
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

    alert("✅ Cập nhật thông tin thành công!");
    closeEditModal();
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
  document.getElementById("editDob").value = PROFILE_DATA.date_of_birth || "";
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
