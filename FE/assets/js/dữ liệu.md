##### I quản lý giáo viên 

1. Lấy danh sách tất cả giáo viên

* Method: GET
* Endpoint: /api/teachers
* Vai trò yêu cầu: admin
* Mô tả: Trả về một mảng chứa thông tin của tất cả người dùng có vai trò là teacher.
* reponse tra về 
[
    {
        "id": 3,
        "username": "giaovien2",
        "role": "teacher",
        "full_name": "nguyễn văn a",
        "email": "giaovien2@school.edu.vn",
        "phone": "0901234569",
        "address": null,
        "date_of_birth": null,
        "gender": "male",
        "is_active": false,
        "last_login": null,
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-24T02:18:58.000Z",
        "teacher": {
            "id": 2,
            "user_id": 3,
            "teacher_code": "GV002",
            "specialization": "Ngữ văn",
            "degree": "tiến sĩ",
            "start_date": "2019-08-15",
            "salary": null,
            "bank_account": null,
            "bank_name": null,
            "notes": null,
            "created_at": "2025-10-23T09:20:18.000Z",
            "updated_at": "2025-10-24T02:18:58.000Z"
        }
    },
    {
        "id": 4,
        "username": "giaovien3",
        "role": "teacher",
        "full_name": "Phạm Thị Giáo Viên",
        "email": "giaovien3@school.edu.vn",
        "phone": "0901234570",
        "address": null,
        "date_of_birth": null,
        "gender": "female",
        "is_active": true,
        "last_login": null,
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T10:09:02.000Z",
        "teacher": {
            "id": 3,
            "user_id": 4,
            "teacher_code": "GV003",
            "specialization": "Tiếng Anh",
            "degree": "Thạc sĩ",
            "start_date": "2021-09-01",
            "salary": null,
            "bank_account": null,
            "bank_name": null,
            "notes": null,
            "created_at": "2025-10-23T09:20:18.000Z",
            "updated_at": "2025-10-23T09:20:18.000Z"
        }
    },
    {
        "id": 2,
        "username": "giaovien1",
        "role": "teacher",
        "full_name": "Trần Thị Giáo Viên Mới",
        "email": "new.email@school.edu.vn",
        "phone": "0383137092",
        "address": "123 Đường mới, TP. Mới",
        "date_of_birth": null,
        "gender": "female",
        "is_active": true,
        "last_login": "2025-10-25T02:17:59.000Z",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-25T02:17:59.000Z",
        "teacher": {
            "id": 1,
            "user_id": 2,
            "teacher_code": "GV001",
            "specialization": "hóa học",
            "degree": "Tiến sĩ",
            "start_date": "2020-09-01",
            "salary": null,
            "bank_account": null,
            "bank_name": null,
            "notes": null,
            "created_at": "2025-10-23T09:20:18.000Z",
            "updated_at": "2025-10-23T14:59:08.000Z"
        }
    }
]

2. Lấy thông tin một giáo viên

* Method: GET
* Endpoint: /api/teachers/:id (trong đó :id là ID của user)
* Vai trò yêu cầu: admin
* Mô tả: Trả về thông tin chi tiết của một giáo viên cụ thể.
* respone tra ve 
* {
    "id": 3,
    "username": "giaovien2",
    "role": "teacher",
    "full_name": "nguyễn văn a",
    "email": "giaovien2@school.edu.vn",
    "phone": "0901234569",
    "address": null,
    "date_of_birth": null,
    "gender": "male",
    "is_active": false,
    "last_login": null,
    "created_at": "2025-10-23T09:20:18.000Z",
    "updated_at": "2025-10-24T02:18:58.000Z",
    "teacher": {
        "id": 2,
        "user_id": 3,
        "teacher_code": "GV002",
        "specialization": "Ngữ văn",
        "degree": "tiến sĩ",
        "start_date": "2019-08-15",
        "salary": null,
        "bank_account": null,
        "bank_name": null,
        "notes": null,
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-24T02:18:58.000Z"
    }
}

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
[
    {
        "id": 5,
        "subject_name": "Hóa học",
        "subject_code": "HOA",
        "description": "Môn Hóa học",
        "credits": 1,
        "hours_per_week": 3,
        "is_elective": false,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z"
    },
    {
        "id": 7,
        "subject_name": "Lịch sử",
        "subject_code": "SU",
        "description": "Môn Lịch sử",
        "credits": 1,
        "hours_per_week": 2,
        "is_elective": false,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z"
    },
    {
        "id": 2,
        "subject_name": "Ngữ văn",
        "subject_code": "VAN",
        "description": "Môn Ngữ văn",
        "credits": 2,
        "hours_per_week": 4,
        "is_elective": false,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z"
    },
    {
        "id": 6,
        "subject_name": "Sinh học",
        "subject_code": "SINH",
        "description": "Môn Sinh học",
        "credits": 1,
        "hours_per_week": 3,
        "is_elective": false,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z"
    },
    {
        "id": 3,
        "subject_name": "Tiếng Anh",
        "subject_code": "ANH",
        "description": "Môn Tiếng Anh",
        "credits": 2,
        "hours_per_week": 4,
        "is_elective": false,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z"
    },
    {
        "id": 1,
        "subject_name": "Toán học",
        "subject_code": "TOAN",
        "description": "Môn Toán từ lớp 10 đến 12",
        "credits": 2,
        "hours_per_week": 5,
        "is_elective": false,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z"
    },
    {
        "id": 4,
        "subject_name": "Vật lý",
        "subject_code": "LY",
        "description": "Môn Vật lý",
        "credits": 1,
        "hours_per_week": 3,
        "is_elective": false,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z"
    },
    {
        "id": 8,
        "subject_name": "Địa lý",
        "subject_code": "DIA",
        "description": "Môn Địa lý",
        "credits": 1,
        "hours_per_week": 2,
        "is_elective": false,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z"
    }
]

Trả về danh sách tất cả môn học trong bảng Subject, sắp xếp theo subject_name (tăng dần).

🧾 2. Lấy thông tin môn học theo ID

Method: GET
Endpoint: /api/subjects/:id
Vai trò yêu cầu: Admin
Body: Không có
reponse:
{
    "id": 1,
    "subject_name": "Toán học",
    "subject_code": "TOAN",
    "description": "Môn Toán từ lớp 10 đến 12",
    "credits": 2,
    "hours_per_week": 5,
    "is_elective": false,
    "status": "active",
    "created_at": "2025-10-23T09:20:18.000Z",
    "updated_at": "2025-10-23T09:20:18.000Z"
}
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

[
    {
        "id": 1,
        "class_code": "10A1",
        "class_name": "Lớp 10A1",
        "grade": "10",
        "school_year": "2024-2025",
        "homeroom_teacher_id": 1,
        "room_number": "P101",
        "max_students": 40,
        "current_students": 1,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-25T08:13:34.000Z",
        "teacher": {
            "id": 1,
            "teacher_code": "GV001",
            "user": {
                "full_name": "Trần Thị Giáo Viên Mới"
            }
        }
    },
    {
        "id": 2,
        "class_code": "10A2",
        "class_name": "Lớp 10A2",
        "grade": "10",
        "school_year": "2024-2025",
        "homeroom_teacher_id": 2,
        "room_number": "P102",
        "max_students": 40,
        "current_students": 0,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-24T07:17:16.000Z",
        "teacher": {
            "id": 2,
            "teacher_code": "GV002",
            "user": {
                "full_name": "nguyễn văn a"
            }
        }
    },
    {
        "id": 3,
        "class_code": "11A1",
        "class_name": "Lớp 11A1",
        "grade": "11",
        "school_year": "2024-2025",
        "homeroom_teacher_id": 3,
        "room_number": "P201",
        "max_students": 35,
        "current_students": -1,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-25T08:08:40.000Z",
        "teacher": {
            "id": 3,
            "teacher_code": "GV003",
            "user": {
                "full_name": "Phạm Thị Giáo Viên"
            }
        }
    },
    {
        "id": 4,
        "class_code": "12A1",
        "class_name": "Lớp 12A1",
        "grade": "12",
        "school_year": "2024-2025",
        "homeroom_teacher_id": 1,
        "room_number": "P301",
        "max_students": 38,
        "current_students": 0,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z",
        "teacher": {
            "id": 1,
            "teacher_code": "GV001",
            "user": {
                "full_name": "Trần Thị Giáo Viên Mới"
            }
        }
    }
]
Lấy toàn bộ danh sách lớp học (Class).

Bao gồm thông tin giáo viên chủ nhiệm (Teacher) và tên đầy đủ của họ (User.full_name).

Sắp xếp theo school_year (DESC), grade (ASC), class_name (ASC).

🧾 2. Lấy thông tin lớp học theo ID

Method: GET
Endpoint: /api/classes/:id
Vai trò yêu cầu: Admin
Body: Không có
Mô tả:
{
    "id": 1,
    "class_code": "10A1",
    "class_name": "Lớp 10A1",
    "grade": "10",
    "school_year": "2024-2025",
    "homeroom_teacher_id": 1,
    "room_number": "P101",
    "max_students": 40,
    "current_students": 1,
    "status": "active",
    "created_at": "2025-10-23T09:20:18.000Z",
    "updated_at": "2025-10-25T08:13:34.000Z",
    "teacher": {
        "id": 1,
        "teacher_code": "GV001",
        "user": {
            "full_name": "Trần Thị Giáo Viên Mới"
        }
    }
}
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



##### V phan cong giao vien 


GET /api/assignments

Mô tả: Lấy danh sách tất cả phân công giảng dạy.
Body: (Không có)
Response lấy tất cả danh sách phân công  ví dụ:

[
    {
        "id": 1,
        "teacher_id": 1,
        "class_id": 1,
        "subject_id": 1,
        "semester": "1",
        "school_year": "2024-2025",
        "teaching_schedule": "{\"thu2\": [\"T1\",\"T2\"], \"thu4\": [\"T3\",\"T4\"]}",
        "start_date": null,
        "end_date": null,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z",
        "teacher": {
            "teacher_code": "GV001",
            "user": {
                "full_name": "Trần Thị Giáo Viên Mới"
            }
        },
        "class": {
            "class_code": "10A1",
            "class_name": "Lớp 10A1"
        },
        "subject": {
            "subject_code": "TOAN",
            "subject_name": "Toán học"
        }
    },
    {
        "id": 2,
        "teacher_id": 1,
        "class_id": 2,
        "subject_id": 1,
        "semester": "1",
        "school_year": "2024-2025",
        "teaching_schedule": "{\"thu3\": [\"T1\",\"T2\"], \"thu5\": [\"T3\"]}",
        "start_date": null,
        "end_date": null,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z",
        "teacher": {
            "teacher_code": "GV001",
            "user": {
                "full_name": "Trần Thị Giáo Viên Mới"
            }
        },
        "class": {
            "class_code": "10A2",
            "class_name": "Lớp 10A2"
        },
        "subject": {
            "subject_code": "TOAN",
            "subject_name": "Toán học"
        }
    },
    {
        "id": 3,
        "teacher_id": 2,
        "class_id": 1,
        "subject_id": 2,
        "semester": "1",
        "school_year": "2024-2025",
        "teaching_schedule": "{\"thu2\": [\"T3\",\"T4\"], \"thu6\": [\"T1\",\"T2\"]}",
        "start_date": null,
        "end_date": null,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z",
        "teacher": {
            "teacher_code": "GV002",
            "user": {
                "full_name": "nguyễn văn a"
            }
        },
        "class": {
            "class_code": "10A1",
            "class_name": "Lớp 10A1"
        },
        "subject": {
            "subject_code": "VAN",
            "subject_name": "Ngữ văn"
        }
    },
    {
        "id": 4,
        "teacher_id": 2,
        "class_id": 3,
        "subject_id": 2,
        "semester": "1",
        "school_year": "2024-2025",
        "teaching_schedule": "{\"thu3\": [\"T3\",\"T4\"], \"thu5\": [\"T1\",\"T2\"]}",
        "start_date": null,
        "end_date": null,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z",
        "teacher": {
            "teacher_code": "GV002",
            "user": {
                "full_name": "nguyễn văn a"
            }
        },
        "class": {
            "class_code": "11A1",
            "class_name": "Lớp 11A1"
        },
        "subject": {
            "subject_code": "VAN",
            "subject_name": "Ngữ văn"
        }
    },
    {
        "id": 5,
        "teacher_id": 3,
        "class_id": 1,
        "subject_id": 3,
        "semester": "1",
        "school_year": "2024-2025",
        "teaching_schedule": "{\"thu4\": [\"T1\",\"T2\"], \"thu6\": [\"T3\",\"T4\"]}",
        "start_date": null,
        "end_date": null,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z",
        "teacher": {
            "teacher_code": "GV003",
            "user": {
                "full_name": "Phạm Thị Giáo Viên"
            }
        },
        "class": {
            "class_code": "10A1",
            "class_name": "Lớp 10A1"
        },
        "subject": {
            "subject_code": "ANH",
            "subject_name": "Tiếng Anh"
        }
    },
    {
        "id": 6,
        "teacher_id": 3,
        "class_id": 2,
        "subject_id": 3,
        "semester": "1",
        "school_year": "2024-2025",
        "teaching_schedule": "{\"thu2\": [\"T5\",\"T6\"], \"thu4\": [\"T5\",\"T6\"]}",
        "start_date": null,
        "end_date": null,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z",
        "teacher": {
            "teacher_code": "GV003",
            "user": {
                "full_name": "Phạm Thị Giáo Viên"
            }
        },
        "class": {
            "class_code": "10A2",
            "class_name": "Lớp 10A2"
        },
        "subject": {
            "subject_code": "ANH",
            "subject_name": "Tiếng Anh"
        }
    }
]

 GET /api/assignments/:id

Mô tả: Lấy thông tin chi tiết 1 phân công theo id.
Body: (Không có)
Ví dụ:
GET /api/assignments/1

Response:
 
{
    "id": 1,
    "teacher_id": 1,
    "class_id": 1,
    "subject_id": 1,
    "semester": "1",
    "school_year": "2024-2025",
    "teaching_schedule": "{\"thu2\": [\"T1\",\"T2\"], \"thu4\": [\"T3\",\"T4\"]}",
    "start_date": null,
    "end_date": null,
    "status": "active",
    "created_at": "2025-10-23T09:20:18.000Z",
    "updated_at": "2025-10-23T09:20:18.000Z",
    "teacher": {
        "id": 1,
        "user_id": 2,
        "teacher_code": "GV001",
        "specialization": "hóa học",
        "degree": "Tiến sĩ",
        "start_date": "2020-09-01",
        "salary": null,
        "bank_account": null,
        "bank_name": null,
        "notes": null,
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T14:59:08.000Z",
        "user": {
            "full_name": "Trần Thị Giáo Viên Mới"
        }
    },
    "class": {
        "id": 1,
        "class_code": "10A1",
        "class_name": "Lớp 10A1",
        "grade": "10",
        "school_year": "2024-2025",
        "homeroom_teacher_id": 31,
        "room_number": "P101",
        "max_students": 40,
        "current_students": 1,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-25T09:58:51.000Z"
    },
    "subject": {
        "id": 1,
        "subject_name": "Toán học",
        "subject_code": "TOAN",
        "description": "Môn Toán từ lớp 10 đến 12",
        "credits": 2,
        "hours_per_week": 5,
        "is_elective": false,
        "status": "active",
        "created_at": "2025-10-23T09:20:18.000Z",
        "updated_at": "2025-10-23T09:20:18.000Z"
    }
}
🟩 3️⃣ POST /api/assignments

Mô tả: Thêm mới một phân công giảng dạy.
Body mẫu:

{
  "teacher_id": 1,
  "class_id": 2,
  "subject_id": 3,
  "semester": 1,
  "school_year": "2024-2025"
}

🟨 4️⃣ PUT /api/assignments/:id

Mô tả: Cập nhật một phân công giảng dạy.
Body mẫu (chỉ cần gửi các trường cần sửa):

{
  "teacher_id": 2,
  "semester": 2,
  "school_year": "2025-2026"
}

🟥 5️⃣ DELETE /api/assignments/:id

Mô tả: Xoá một phân công giảng dạy.
Body: (Không có)
Ví dụ:
DELETE /api/assignments/10
Response:

{ "msg": "Assignment removed successfully" }

🟪 6️⃣ POST /api/assignments/bulk

Mô tả: Thêm nhiều phân công giảng dạy cùng lúc.
Body mẫu:

{
  "assignments": [
    {
      "teacher_id": 1,
      "class_id": 2,
      "subject_id": 3,
      "semester": 1,
      "school_year": "2024-2025"
    },
    {
      "teacher_id": 2,
      "class_id": 3,
      "subject_id": 4,
      "semester": 2,
      "school_year": "2024-2025"
    }
  ]
}


