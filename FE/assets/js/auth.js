// =========================
// KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
// =========================
const user = JSON.parse(localStorage.getItem("loggedUser"));

// Kiểm tra thời điểm hết hạn của token (trả về timestamp ms) hoặc null nếu không xác định
function getTokenExpiry(userObj) {
  if (!userObj) return null;

  // Thử đọc JWT từ các trường phổ biến
  const token = userObj.token || userObj.accessToken || userObj.jwt;
  if (token && typeof token === "string") {
    const parts = token.split(".");
    if (parts.length === 3) {
      try {
        const payload = JSON.parse(
          atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        if (payload && payload.exp) return payload.exp * 1000; // exp là giây -> ms
      } catch (e) {
        // bỏ qua nếu decode thất bại
      }
    }
  }

  // Thử đọc các trường expires trong user object (số hoặc chuỗi)
  const candidates = ["expiresAt", "expiry", "expiryTime", "expiration", "exp"];
  for (const key of candidates) {
    if (userObj[key]) {
      const val = userObj[key];
      if (typeof val === "number") {
        // Nếu là giây (khoảng < 1e12) chuyển sang ms
        return val > 1e12 ? val : val * 1000;
      }
      const parsed = Date.parse(val);
      if (!isNaN(parsed)) return parsed;
    }
  }

  return null;
}

function performLogout(message) {
  try {
    localStorage.removeItem("loggedUser");
  } catch (e) {}
  if (message) alert(message);
  window.location.href = "/index.html";
}

// Thiết lập kiểm tra và tự động đăng xuất khi token hết hạn
(function scheduleTokenExpiryCheck() {
  const expiryTs = getTokenExpiry(user);
  if (!expiryTs) return; // không có thông tin expiry -> không làm gì

  const now = Date.now();
  if (now >= expiryTs) {
    performLogout("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    return;
  }

  const timeout = expiryTs - now + 1000; // thêm 1s đệm
  // Hủy timeout khi user bị logout theo cách khác không xử lý ở đây (không cần thiết trong file nhỏ)
  setTimeout(() => {
    performLogout("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }, timeout);
})();

// Nếu chưa đăng nhập -> quay lại trang login
if (!user) {
  window.location.href = "/index.html";
}

// =========================
// KIỂM TRA PHÂN QUYỀN TRUY CẬP
// =========================
const currentPath = window.location.pathname;

// Nếu là trang admin mà user không phải admin -> chặn
if (currentPath.includes("/admin/") && user.role !== "admin") {
  alert("Bạn không có quyền truy cập trang quản trị!");
  window.location.href = "/pages/teacher/dashboard.html";
}

// Nếu là trang teacher mà user không phải teacher -> chặn
if (currentPath.includes("/teacher/") && user.role !== "teacher") {
  alert("Bạn không có quyền truy cập trang giáo viên!");
  window.location.href = "/pages/admin/dashboard.html";
}

// =========================
