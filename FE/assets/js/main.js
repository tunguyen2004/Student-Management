// =========================
// XỬ LÝ ĐĂNG NHẬP
// =========================
async function login(username, password) {
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("loggedUser", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("fullName", data.user.full_name);
    }

    return data;
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    return { success: false, message: "Đã có lỗi xảy ra. Vui lòng thử lại." };
  }
}

function logout() {
  if (!confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
    return;
  }
  localStorage.removeItem("loggedUser");
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("fullName");
  window.location.href = "/index.html";
}

function getLoggedUser() {
  return JSON.parse(localStorage.getItem("loggedUser"));
}
