// assets/js/api.js
const API_URL = "http://localhost:5000/api";
async function fetchFromAPI(endpoint, options = {}) {
  const TOKEN = localStorage.getItem("token");
  const url = `${API_URL}/${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (TOKEN) {
    headers["Authorization"] = `Bearer ${TOKEN}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json();

      const error = new Error(
        errorData.msg || errorData.message || "API Error"
      );
      error.data = errorData;
      error.status = response.status;

      throw error;
    }

    return response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

// =========================
// TEACHER API
// =========================

function getTeachers() {
  return fetchFromAPI("teachers");
}

function deleteTeacher(id) {
  return fetchFromAPI(`teachers/${id}`, { method: "DELETE" });
}

function createTeacher(teacherData) {
  return fetchFromAPI("teachers", {
    method: "POST",
    body: JSON.stringify(teacherData),
  });
}

function getTeacherById(id) {
  return fetchFromAPI(`teachers/${id}`);
}

function updateTeacher(id, teacherData) {
  return fetchFromAPI(`teachers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(teacherData),
  });
}

// =========================
// SUBJECT API
// =========================

function getSubjects() {
  return fetchFromAPI("subjects");
}

function getSubjectById(id) {
  return fetchFromAPI(`subjects/${id}`);
}

function createSubject(subjectData) {
  return fetchFromAPI("subjects", {
    method: "POST",
    body: JSON.stringify(subjectData),
  });
}

function updateSubject(id, subjectData) {
  return fetchFromAPI(`subjects/${id}`, {
    method: "PUT",
    body: JSON.stringify(subjectData),
  });
}

function deleteSubject(id) {
  return fetchFromAPI(`subjects/${id}`, { method: "DELETE" });
}

// =========================
// STUDENT API
// =========================

function getStudents() {
  return fetchFromAPI("students");
}

function getStudentById(id) {
  return fetchFromAPI(`students/${id}`);
}

function createStudent(studentData) {
  return fetchFromAPI("students", {
    method: "POST",
    body: JSON.stringify(studentData),
  });
}

function updateStudent(id, studentData) {
  return fetchFromAPI(`students/${id}`, {
    method: "PATCH",
    body: JSON.stringify(studentData),
  });
}

function deleteStudent(id) {
  return fetchFromAPI(`students/${id}`, { method: "DELETE" });
}

function transferStudentClass(id, classId) {
  return fetchFromAPI(`students/${id}`, {
    method: "PUT",
    body: JSON.stringify({ class_id: classId }),
  });
}

// =========================
// CLASS API
// =========================

function getClasses() {
  return fetchFromAPI("classes");
}

function getClassById(id) {
  return fetchFromAPI(`classes/${id}`);
}

function createClass(classData) {
  return fetchFromAPI("classes", {
    method: "POST",
    body: JSON.stringify(classData),
  });
}

function updateClass(id, classData) {
  return fetchFromAPI(`classes/${id}`, {
    method: "PUT",
    body: JSON.stringify(classData),
  });
}

function deleteClass(id) {
  return fetchFromAPI(`classes/${id}`, { method: "DELETE" });
}

// =========================
// ASSIGNMENT API
// =========================

function getAssignments() {
  return fetchFromAPI("assignments");
}

function getAssignmentById(id) {
  return fetchFromAPI(`assignments/${id}`);
}

function createAssignment(assignmentData) {
  return fetchFromAPI("assignments", {
    method: "POST",
    body: JSON.stringify(assignmentData),
  });
}

function updateAssignment(id, assignmentData) {
  return fetchFromAPI(`assignments/${id}`, {
    method: "PUT",
    body: JSON.stringify(assignmentData),
  });
}

function deleteAssignmentApi(id) {
  return fetchFromAPI(`assignments/${id}`, { method: "DELETE" });
}

function createBulkAssignments(assignments) {
  return fetchFromAPI("assignments/bulk", {
    method: "POST",
    body: JSON.stringify({ assignments }),
  });
}
function getFreeSlots(classId, semester, schoolYear) {
  return fetchFromAPI(
    `assignments/free-slots?class_id=${classId}&semester=${semester}&school_year=${schoolYear}`
  );
}

// ✅ Validate xem lịch có bị trùng hay không
function validateAssignment(data) {
  return fetchFromAPI("assignments/validate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// =========================
// TEACHER (SELF) API
// =========================

// }

// Danh sách học sinh của lớp mà GV được phân công (check quyền ở BE)
function getTeacherStudents(classId) {
  return fetchFromAPI(`teachers/students?class_id=${classId}`);
}

// =========================
// SCORES API (Giáo viên/Admin)
// =========================

// Lấy điểm theo lớp + môn + học kỳ (để prefill bảng nếu cần)
// =========================
// TEACHER VIEW ASSIGNMENTS API
// =========================
function getTeacherAssignments() {
  return fetchFromAPI("assignments/teacher");
}
console.log("✅ api.js LOADED");

// =========================
// SCORES API (Giáo viên/Admin)
// =========================

// Lấy điểm theo lớp + môn + học kỳ
function getScoresByClassSubject({
  class_id,
  subject_id,
  semester,
  school_year,
}) {
  const q = new URLSearchParams({
    class_id,
    subject_id,
    semester,
    school_year,
  });
  return fetchFromAPI(`scores?${q.toString()}`);
}

// Lưu 1 điểm (auto-save từng ô)
function updateScore(payload) {
  return fetchFromAPI("scores/update", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// Lưu nhiều điểm (nếu có UI lưu hàng loạt)
function upsertScoresBulk(items) {
  return fetchFromAPI("scores/bulk", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}
