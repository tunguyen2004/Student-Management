### I quản lý giáo viên 

1. Lấy danh sách tất cả giáo viên

* Method: GET
* Endpoint: /api/teachers
* Vai trò yêu cầu: admin
* Mô tả: Trả về một mảng chứa thông tin của tất cả người dùng có vai trò là teacher.

2. Lấy thông tin một giáo viên

* Method: GET
* Endpoint: /api/teachers/:id (trong đó :id là ID của user)
* Vai trò yêu cầu: admin
* Mô tả: Trả về thông tin chi tiết của một giáo viên cụ thể.

3. Tạo giáo viên mới

* Method: POST
* Endpoint: /api/teachers
* Vai trò yêu cầu: admin
* Mô tả: Tạo một tài khoản người dùng mới với vai trò teacher và một hồ sơ giáo viên tương ứng.
* Body (JSON):

{
  "username": "giaovien_moi",
  "password": "matkhaumoi123",
  "full_name": "Nguyễn Văn Giáo Viên Mới",
  "email": "gv.moi@school.edu.vn",
  "phone": "0901234571",
  "address": "456 Đường ABC, Quận XYZ",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "teacher_code": "GV004",
  "specialization": "Hóa học",
  "degree": "Cử nhân",
  "start_date": "2024-09-01"
}
  (Lưu ý: `username`, `password`, `full_name`, `teacher_code` là bắt buộc)

4. Cập nhật thông tin giáo viên

* Method: PUT
* Endpoint: /api/teachers/:id (trong đó :id là ID của user)
* Vai trò yêu cầu: admin
* Mô tả: Cập nhật thông tin cho một giáo viên. Bạn chỉ cần gửi những trường muốn thay đổi.
* Body (JSON) - Ví dụ:

{
  "full_name": "Tên đã được cập nhật",
  "degree": "Thạc sĩ",
  "is_active": false
}

5. Xóa giáo viên

* Method: DELETE
* Endpoint: /api/teachers/:id (trong đó :id là ID của user)
* Vai trò yêu cầu: admin
* Mô tả: Xóa một giáo viên khỏi hệ thống (bao gồm cả tài khoản user và hồ sơ teacher).
* Phản hồi thành công:

{
  "msg": "Teacher removed successfully"
}


##### II Quản lý môn học 

1. Lấy danh sách tất cả môn học

Method: GET
Endpoint: /api/subjects
Vai trò yêu cầu: Admin
Body: Không có
Mô tả:

Trả về danh sách tất cả môn học trong bảng Subject, sắp xếp theo subject_name (tăng dần).

🧾 2. Lấy thông tin môn học theo ID

Method: GET
Endpoint: /api/subjects/:id
Vai trò yêu cầu: Admin
Body: Không có
Mô tả:

Trả về thông tin chi tiết của một môn học theo id.

Nếu không tìm thấy thì trả về 404.

🧾 3. Tạo mới một môn học

Method: POST
Endpoint: /api/subjects
Vai trò yêu cầu: Admin
Body:

{
  "subject_name": "string",        // Bắt buộc
  "subject_code": "string",        // Bắt buộc, duy nhất
  "description": "string",
  "credits": 3,                    // Bắt buộc
  "hours_per_week": 4,
  "is_elective": true,
  "status": "active"               // hoặc "inactive"
}


Mô tả:

Tạo mới môn học.

Kiểm tra trùng subject_code trước khi tạo.

🧾 4. Cập nhật thông tin môn học

Method: PUT
Endpoint: /api/subjects/:id
Vai trò yêu cầu: Admin
Body:

{
  "subject_name": "string",
  "subject_code": "string",
  "description": "string",
  "credits": 4,
  "hours_per_week": 5,
  "is_elective": false,
  "status": "inactive"
}


Mô tả:

Cập nhật thông tin môn học theo id.

Nếu subject_code bị thay đổi, sẽ kiểm tra trùng mã mới trước khi cập nhật.

🧾 5. Xóa môn học

Method: DELETE
Endpoint: /api/subjects/:id
Vai trò yêu cầu: Admin
Body: Không có
Mô tả:

Xóa môn học theo id.

Nếu không tìm thấy, trả về 404.





##### III Quan li lop hoc
quaả li loớ hoọ 
🧾 1. Lấy danh sách tất cả lớp học

Method: GET
Endpoint: /api/classes
Vai trò yêu cầu: Admin
Body: Không có
Mô tả:

Lấy toàn bộ danh sách lớp học (Class).

Bao gồm thông tin giáo viên chủ nhiệm (Teacher) và tên đầy đủ của họ (User.full_name).

Sắp xếp theo school_year (DESC), grade (ASC), class_name (ASC).

🧾 2. Lấy thông tin lớp học theo ID

Method: GET
Endpoint: /api/classes/:id
Vai trò yêu cầu: Admin
Body: Không có
Mô tả:

Lấy chi tiết một lớp học dựa trên id.

Gồm thông tin giáo viên chủ nhiệm và họ tên giáo viên (qua bảng User).

Nếu không tìm thấy, trả về 404.

🧾 3. Tạo mới lớp học

Method: POST
Endpoint: /api/classes
Vai trò yêu cầu: Admin
Body:

{
  "class_code": "string",            // Bắt buộc
  "class_name": "string",            // Bắt buộc
  "grade": "10",                     // Bắt buộc (VD: "10", "11", "12")
  "school_year": "2024-2025",        // Bắt buộc
  "homeroom_teacher_id": 5,          // ID giáo viên chủ nhiệm (tùy chọn)
  "room_number": "A102",
  "max_students": 45,
  "status": "active"                 // hoặc "inactive"
}


Mô tả:

Tạo mới một lớp học.

Kiểm tra đủ các trường bắt buộc (class_code, class_name, grade, school_year).

🧾 4. Cập nhật thông tin lớp học

Method: PUT
Endpoint: /api/classes/:id
Vai trò yêu cầu: Admin
Body:

{
  "class_code": "string",
  "class_name": "string",
  "grade": "string",
  "school_year": "string",
  "homeroom_teacher_id": 5,
  "room_number": "string",
  "max_students": 50,
  "status": "active"
}


Mô tả:

Cập nhật thông tin của lớp học dựa trên id.

Nếu lớp không tồn tại, trả về 404.

Cho phép cập nhật toàn bộ hoặc một phần các trường.

🧾 5. Xóa lớp học

Method: DELETE
Endpoint: /api/classes/:id
Vai trò yêu cầu: Admin
Body: Không có
Mô tả:

Xóa lớp học theo id.

Nếu không tồn tại, trả về 404





##### IV quam ly hoc sinh 

2.1. Lấy danh sách tất cả học sinh

Method: GET
Endpoint: /api/students
Body: (none)
Response mẫu:

[
  {
    "id": 1,
    "student_code": "STU202501",
    "full_name": "Nguyễn Văn A",
    "date_of_birth": "2008-09-15",
    "gender": "male",
    "class_id": 3,
    "Class": {
      "id": 3,
      "class_code": "10A1",
      "class_name": "Lớp 10A1"
    }
  }
]

🔹 2.2. Lấy thông tin học sinh theo ID

Method: GET
Endpoint: /api/students/:id
Ví dụ: /api/students/2
Body: (none)
Response mẫu:

{
  "id": 2,
  "student_code": "STU202502",
  "full_name": "Trần Thị B",
  "date_of_birth": "2008-12-01",
  "gender": "female",
  "class_id": 4,
  "Class": {
    "id": 4,
    "class_code": "10A2",
    "class_name": "Lớp 10A2"
  }
}

🔹 2.3. Thêm học sinh mới

Method: POST
Endpoint: /api/students
Body mẫu:

{
  "student_code": "STU202503",
  "full_name": "Lê Văn C",
  "date_of_birth": "2009-02-10",
  "gender": "male",
  "class_id": 2
}

🔹 2.4. Cập nhật học sinh

Method: PUT
Endpoint: /api/students/:id
Ví dụ: /api/students/3
Body mẫu:

{
  "full_name": "Lê Văn C (đã cập nhật)",
  "class_id": 5
}

🔹 2.5. Xóa học sinh

Method: DELETE
Endpoint: /api/students/:id
Ví dụ: /api/students/3
Body: (none)
Response:

{ "msg": "Student removed successfully" }


2.6 chuyen lop 
1. Endpoint: PUT /api/students/25
2. Method: PUT
3. Body của request:

{
  "class_id": 3
}