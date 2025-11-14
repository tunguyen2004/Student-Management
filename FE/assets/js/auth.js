// =========================
// KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
// =========================
const user = JSON.parse(localStorage.getItem("loggedUser"));

// Kiểm tra thời điểm hết hạn của token (trả về timestamp ms) hoặc null nếu không xác định
function getTokenExpiry(userObj) {
  const token = userObj?.token || localStorage.getItem("token");
  if (token && typeof token === "string") {
    const parts = token.split(".");
    if (parts.length === 3) {
      try {
        const payload = JSON.parse(
          atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        if (payload && payload.exp) {
          console.log("Token exp (giây):", payload.exp);
          return payload.exp * 1000; // exp là giây -> ms
        } else {
          console.error("Token không chứa trường exp.");
        }
      } catch (e) {
        console.error("Lỗi khi decode JWT:", e);
      }
    } else {
      console.error("Token không hợp lệ:", token);
    }
  } else {
    console.error("Không tìm thấy token.");
  }
  return null;
}

function performLogout(message) {
  console.log("Đăng xuất người dùng...");
  try {
    localStorage.removeItem("loggedUser");
  } catch (e) {
    console.error("Lỗi khi xóa thông tin đăng nhập:", e);
  }
  if (message) {
    alert(message);
  } else {
    alert("Bạn đã đăng xuất thành công.");
  }
  window.location.href = "/index.html";
}

let logoutTimer = null;

function scheduleTokenExpiryCheck() {
  const user = JSON.parse(localStorage.getItem("loggedUser")); // Lấy lại user từ localStorage
  const expiryTs = getTokenExpiry(user);
  if (expiryTs && Date.now() >= expiryTs) {
    performLogout("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    return;
  }

  // Xóa timer cũ nếu có
  if (logoutTimer) {
    clearInterval(logoutTimer);
    logoutTimer = null;
  }

  logoutTimer = setInterval(() => {
    const user = JSON.parse(localStorage.getItem("loggedUser")); // Lấy lại user từ localStorage
    const expiryTs = getTokenExpiry(user);
    if (!expiryTs) return; // Không có thông tin hết hạn -> không làm gì

    const now = Date.now();
    if (now >= expiryTs) {
      // Token đã hết hạn -> đăng xuất ngay lập tức
      clearInterval(logoutTimer); // Dừng kiểm tra
      performLogout("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
  }, 60 * 1000); // Kiểm tra mỗi phút
}

// Gọi hàm kiểm tra ngay khi tải trang
scheduleTokenExpiryCheck();

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
  alert("Bạn không có quyền truy cập trang !");
  window.location.href = "/pages/admin/dashboard.html";
}

// =========================
console.log("Token expiry timestamp:", getTokenExpiry(user));
console.log(localStorage.getItem("token"));
console.log("Token:", localStorage.getItem("token"));

const now = Date.now();
const expiryTs = getTokenExpiry(user);
console.log("Thời gian hiện tại:", new Date(now).toLocaleString());
console.log("Thời gian hết hạn token:", new Date(expiryTs).toLocaleString());
