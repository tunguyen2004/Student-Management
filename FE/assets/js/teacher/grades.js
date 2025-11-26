// // -------- INIT ----------
// console.log("✅ api.mdsbjjs LOADED");

// document.addEventListener("DOMContentLoaded", () => {
//   loadAssignedClassesAndSubjects();
// });

// // DOM
// const classSelect = document.getElementById("classSelect");
// const subjectSelect = document.getElementById("subjectSelect");
// const semesterSelect = document.getElementById("semesterSelect");

// // -------- LOAD ASSIGNED CLASS + SUBJECT ----------
// async function loadAssignedClassesAndSubjects() {
//   try {
//     const assignments = await getTeacherAssignments(); // ✅ đúng tên

//     classSelect.innerHTML = `<option value="">-- Chọn lớp --</option>`;
//     subjectSelect.innerHTML = `<option value="">-- Chọn môn --</option>`;

//     assignments.forEach((a) => {
//       classSelect.innerHTML += `<option value="${a.class_id}">${a.Class.class_name}</option>`;
//       subjectSelect.innerHTML += `<option value="${a.subject_id}">${a.Subject.subject_name}</option>`;
//     });
//   } catch (err) {
//     console.error(err);
//     alert("❌ Lỗi tải danh sách phân công");
//   }
// }

// // -------- LOAD STUDENTS ----------
// async function loadStudentsAndScores() {
//   const classId = classSelect.value;
//   const subjectId = subjectSelect.value;

//   if (!classId || !subjectId) return;

//   const tbody = document.getElementById("scoreTableBody");
//   tbody.innerHTML = `<tr><td colspan="6">Đang tải...</td></tr>`;

//   try {
//     const students = await getTeacherStudents(classId); // ✅ dùng API đúng

//     tbody.innerHTML = "";

//     students.forEach((s) => {
//       tbody.innerHTML += `
//         <tr data-student="${s.student_id}">
//           <td>${s.student_code}</td>
//           <td>${s.full_name}</td>
//           <td><input class="score-input" onchange="saveScore(this,'15ph')" /></td>
//           <td><input class="score-input" onchange="saveScore(this,'45ph')" /></td>
//           <td><input class="score-input" onchange="saveScore(this,'thi')" /></td>
//           <td class="avg"></td>
//         </tr>`;
//     });
//   } catch (err) {
//     tbody.innerHTML = `<tr><td colspan="6">❌ Không thể tải dữ liệu</td></tr>`;
//   }
// }

// // -------- SAVE SCORE (AUTO SAVE) ----------
// async function saveScore(input, scoreType) {
//   const row = input.closest("tr");

//   const payload = {
//     student_id: row.getAttribute("data-student"),
//     subject_id: subjectSelect.value,
//     class_id: classSelect.value, // ✅ BẮT BUỘC
//     score_type: scoreType,
//     score: input.value,
//     semester: semesterSelect.value,
//     school_year: "2024-2025",
//   };

//   try {
//     await updateScore(payload);
//     input.classList.add("success");
//   } catch (err) {
//     input.classList.add("error");
//   } finally {
//     setTimeout(() => input.classList.remove("success", "error"), 600);
//   }
// }

// async function viewScores() {
//   const class_id = classSelect.value;
//   const subject_id = subjectSelect.value;
//   const semester = semesterSelect.value;
//   const school_year = "2024-2025";

//   if (!class_id || !subject_id || !semester) {
//     alert("Vui lòng chọn đầy đủ lớp, môn và học kỳ!");
//     return;
//   }

//   const tbody = document.getElementById("scoreTableBody");
//   tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Đang tải...</td></tr>`;

//   try {
//     const scores = await getScoresByClassSubject({
//       class_id,
//       subject_id,
//       semester,
//       school_year,
//     });

//     if (!scores || scores.length === 0) {
//       tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Không có dữ liệu điểm</td></tr>`;
//       return;
//     }

//     // Gom điểm theo học sinh
//     const grouped = {};
//     scores.forEach((s) => {
//       if (!grouped[s.student_id]) {
//         grouped[s.student_id] = {
//           code: s.Student.student_code,
//           name: s.Student.full_name,
//           "15ph": [],
//           "45ph": [],
//           thi: [],
//           tbmon: [],
//         };
//       }
//       grouped[s.student_id][s.score_type].push(s.score);
//     });

//     // Render bảng
//     tbody.innerHTML = "";
//     Object.values(grouped).forEach((st) => {
//       const avg = (
//         avgOf(st["15ph"]) * 0.3 +
//           avgOf(st["45ph"]) * 0.3 +
//           avgOf(st["thi"]) * 0.4 || 0
//       ).toFixed(2);

//       tbody.innerHTML += `
//         <tr>
//           <td>${st.code}</td>
//           <td>${st.name}</td>
//           <td>${st["15ph"].join(", ") || "-"}</td>
//           <td>${st["45ph"].join(", ") || "-"}</td>
//           <td>${st["thi"].join(", ") || "-"}</td>
//           <td>${avg}</td>
//         </tr>`;
//     });
//   } catch (err) {
//     console.error("❌ viewScores error:", err);
//     tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Lỗi tải dữ liệu</td></tr>`;
//   }
// }

// // helper tính trung bình
// function avgOf(arr) {
//   if (!arr || arr.length === 0) return 0;
//   return arr.reduce((a, b) => a + parseFloat(b), 0) / arr.length;
// }

// -------- INIT ----------
console.log("✅ teacher/grades.js LOADED");

document.addEventListener("DOMContentLoaded", () => {
  loadAssignedClassesAndSubjects();
});

// DOM
const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const semesterSelect = document.getElementById("semesterSelect");

// -------- LOAD ASSIGNED CLASS + SUBJECT ----------
async function loadAssignedClassesAndSubjects() {
  try {
    const assignments = await getTeacherAssignments(); // ✅ API phân công

    classSelect.innerHTML = `<option value="">-- Chọn lớp --</option>`;
    subjectSelect.innerHTML = `<option value="">-- Chọn môn --</option>`;

    assignments.forEach((a) => {
      classSelect.innerHTML += `<option value="${a.class_id}">${a.Class.class_name}</option>`;
      subjectSelect.innerHTML += `<option value="${a.subject_id}">${a.Subject.subject_name}</option>`;
    });
  } catch (err) {
    console.error(err);
    alert("❌ Lỗi tải danh sách phân công");
  }
}

// -------- LOAD STUDENTS + SCORES TỪ BE MỚI ----------
// Gọi GET /api/scores/scores?class_id=&subject_id=&semester=&school_year=
async function loadStudentsAndScores() {
  const class_id = classSelect.value;
  const subject_id = subjectSelect.value;
  const semester = semesterSelect.value;
  const school_year = "2024-2025"; // sau này có thể cho chọn

  const tbody = document.getElementById("scoreTableBody");

  if (!class_id || !subject_id || !semester) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Vui lòng chọn lớp, môn và học kỳ</td></tr>`;
    return;
  }

  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">⏳ Đang tải...</td></tr>`;

  try {
    const query = new URLSearchParams({
      class_id,
      subject_id,
      semester,
      school_year,
    });

    // dùng fetchFromAPI chung (trong api.js)
    const data = await fetchFromAPI(`scores/scores?${query.toString()}`);

    // BE trả về dạng:
    // [
    //   { student_id, student_code, full_name, "15ph": number|null, "45ph": number|null, thi: number|null },
    //   ...
    // ]

    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Không có học sinh trong lớp</td></tr>`;
      return;
    }

    tbody.innerHTML = "";

    data.forEach((st) => {
      const s15 = st["15ph"] ?? null;
      const s45 = st["45ph"] ?? null;
      const thi = st.thi ?? null;

      let avgDisplay = "-";
      if (s15 !== null || s45 !== null || thi !== null) {
        const avg = (
          (s15 || 0) * 0.3 +
          (s45 || 0) * 0.3 +
          (thi || 0) * 0.4
        ).toFixed(2);
        avgDisplay = avg;
      }

      tbody.innerHTML += `
        <tr data-student="${st.student_id}">
          <td>${st.student_code}</td>
          <td>${st.full_name}</td>
          <td>
            <input
              class="score-input"
              value="${s15 !== null ? s15 : ""}"
              onchange="saveScore(this,'15ph')"
            />
          </td>
          <td>
            <input
              class="score-input"
              value="${s45 !== null ? s45 : ""}"
              onchange="saveScore(this,'45ph')"
            />
          </td>
          <td>
            <input
              class="score-input"
              value="${thi !== null ? thi : ""}"
              onchange="saveScore(this,'thi')"
            />
          </td>
          <td class="avg">${avgDisplay}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("❌ loadStudentsAndScores error:", err);
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Lỗi tải dữ liệu</td></tr>`;
  }
}

// -------- SAVE SCORE (AUTO SAVE) ----------
// Gọi PATCH /api/scores/update (qua updateScore() trong api.js)
async function saveScore(input, scoreType) {
  const row = input.closest("tr");

  const payload = {
    student_id: row.getAttribute("data-student"),
    subject_id: subjectSelect.value,
    class_id: classSelect.value,
    score_type: scoreType,
    score: input.value,
    semester: semesterSelect.value,
    school_year: "2024-2025",
  };

  // validate nhẹ
  if (payload.score === "") {
    // cho phép để trống = xoá? tuỳ yêu cầu, tạm thời: không gọi API
    return;
  }

  const num = parseFloat(payload.score);
  if (isNaN(num) || num < 0 || num > 10) {
    alert("Điểm phải từ 0 đến 10");
    input.classList.add("error");
    setTimeout(() => input.classList.remove("error"), 600);
    return;
  }

  try {
    await updateScore(payload); // hàm wrapper trong api.js trỏ tới /api/scores/update
    input.classList.add("success");

    // cập nhật lại cột TB môn của dòng đó
    const tr = input.closest("tr");
    const s15 = parseFloat(
      tr.querySelector('input[onchange*="15ph"]').value || "0"
    );
    const s45 = parseFloat(
      tr.querySelector('input[onchange*="45ph"]').value || "0"
    );
    const thi = parseFloat(
      tr.querySelector('input[onchange*="thi"]').value || "0"
    );

    const avg = (
      (isNaN(s15) ? 0 : s15) * 0.3 +
      (isNaN(s45) ? 0 : s45) * 0.3 +
      (isNaN(thi) ? 0 : thi) * 0.4
    ).toFixed(2);
    const allEmpty =
      tr.querySelector('input[onchange*="15ph"]').value === "" &&
      tr.querySelector('input[onchange*="45ph"]').value === "" &&
      tr.querySelector('input[onchange*="thi"]').value === "";

    tr.querySelector(".avg").textContent = allEmpty ? "-" : avg;
  } catch (err) {
    console.error("❌ saveScore error:", err);
    input.classList.add("error");
  } finally {
    setTimeout(() => input.classList.remove("success", "error"), 600);
  }
}
