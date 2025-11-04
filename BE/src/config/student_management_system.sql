-- Tạo database
-- CREATE DATABASE IF NOT EXISTS student_management_system;
-- USE student_management_system;

-- Bảng users - Quản lý người dùng
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher') NOT NULL,
    full_name NVARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address NVARCHAR(255),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng teachers - Thông tin giáo viên
CREATE TABLE teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    teacher_code VARCHAR(20) UNIQUE NOT NULL,
    specialization NVARCHAR(100),
    degree NVARCHAR(100),
    start_date DATE,
    salary DECIMAL(12,2),
    bank_account VARCHAR(50),
    bank_name NVARCHAR(100),
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng classes - Quản lý lớp học
CREATE TABLE classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_code VARCHAR(20) UNIQUE NOT NULL,
    class_name NVARCHAR(100) NOT NULL,
    grade ENUM('10', '11', '12') NOT NULL,
    school_year VARCHAR(9) NOT NULL,
    homeroom_teacher_id INT,
    room_number VARCHAR(10),
    max_students INT DEFAULT 40,
    current_students INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (homeroom_teacher_id) REFERENCES teachers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng subjects - Quản lý môn học
CREATE TABLE subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name NVARCHAR(100) NOT NULL,
    description TEXT,
    credits INT DEFAULT 1,
    hours_per_week INT DEFAULT 3,
    is_elective BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng assignments - Phân công giảng dạy
CREATE TABLE assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    semester ENUM('1', '2') NOT NULL,
    school_year VARCHAR(9) NOT NULL,
    teaching_schedule TEXT,
    start_date DATE,
    end_date DATE,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_assignment (teacher_id, class_id, subject_id, semester, school_year)
);

-- Bảng students - Quản lý học sinh
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_code VARCHAR(20) UNIQUE NOT NULL,
    full_name NVARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address NVARCHAR(255),
    parent_name NVARCHAR(100),
    parent_phone VARCHAR(20),
    enrollment_date DATE,
    class_id INT NOT NULL,
    status ENUM('studying', 'transferred', 'graduated', 'dropped') DEFAULT 'studying',
    notes TEXT,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng scores - Quản lý điểm số
CREATE TABLE scores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    assignment_id INT NOT NULL,
    score_type ENUM('15ph', '45ph', 'thi', 'tbmon') NOT NULL,
    score DECIMAL(4,2) NOT NULL,
    semester ENUM('1', '2') NOT NULL,
    school_year VARCHAR(9) NOT NULL,
    exam_date DATE,
    notes TEXT,
    created_by INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng score_summaries - Tổng hợp điểm trung bình
CREATE TABLE score_summaries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    semester ENUM('1', '2') NOT NULL,
    school_year VARCHAR(9) NOT NULL,
    avg_15ph DECIMAL(4,2),
    avg_45ph DECIMAL(4,2),
    exam_score DECIMAL(4,2),
    subject_avg DECIMAL(4,2),
    rank_in_class INT,
    rank_in_grade INT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_summary (student_id, subject_id, semester, school_year)
);

-- Bảng attendances - Điểm danh
CREATE TABLE attendances (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    session ENUM('morning', 'afternoon', 'all_day') DEFAULT 'all_day',
    status ENUM('present', 'absent', 'late', 'excused') DEFAULT 'present',
    notes TEXT,
    recorded_by INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (recorded_by) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_attendance (student_id, attendance_date, session, subject_id)
);

-- Tạo indexes để tối ưu hiệu năng
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_teachers_code ON teachers(teacher_code);
CREATE INDEX idx_classes_grade ON classes(grade);
CREATE INDEX idx_classes_year ON classes(school_year);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_code ON students(student_code);
CREATE INDEX idx_scores_student_semester ON scores(student_id, semester, school_year);
CREATE INDEX idx_assignments_teacher ON assignments(teacher_id, semester, school_year);
CREATE INDEX idx_assignments_class ON assignments(class_id, semester, school_year);
CREATE INDEX idx_attendances_student_date ON attendances(student_id, attendance_date);

-- ====================================================================
-- CHÈN DỮ LIỆU MẪU
-- ====================================================================

-- Chèn dữ liệu users (mật khẩu: 123456 - đã được mã hóa bcrypt)
INSERT INTO users (username, password, role, full_name, email, phone, gender) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye.K8J4S0c8diYe6/.H2t4B2q5D.7Lw2O', 'admin', 'Nguyễn Văn Admin', 'admin@school.edu.vn', '0901234567', 'male'),
('giaovien1', '$2a$10$N9qo8uLOickgx2ZMRZoMye.K8J4S0c8diYe6/.H2t4B2q5D.7Lw2O', 'teacher', 'Trần Thị Giáo Viên', 'giaovien1@school.edu.vn', '0901234568', 'female'),
('giaovien2', '$2a$10$N9qo8uLOickgx2ZMRZoMye.K8J4S0c8diYe6/.H2t4B2q5D.7Lw2O', 'teacher', 'Lê Văn Giáo Viên', 'giaovien2@school.edu.vn', '0901234569', 'male'),
('giaovien3', '$2a$10$N9qo8uLOickgx2ZMRZoMye.K8J4S0c8diYe6/.H2t4B2q5D.7Lw2O', 'teacher', 'Phạm Thị Giáo Viên', 'giaovien3@school.edu.vn', '0901234570', 'female');

-- Chèn dữ liệu teachers
INSERT INTO teachers (user_id, teacher_code, specialization, degree, start_date) VALUES
(2, 'GV001', 'Toán học', 'Thạc sĩ', '2020-09-01'),
(3, 'GV002', 'Ngữ văn', 'Thạc sĩ', '2019-08-15'),
(4, 'GV003', 'Tiếng Anh', 'Thạc sĩ', '2021-09-01');

-- Chèn dữ liệu classes
INSERT INTO classes (class_code, class_name, grade, school_year, homeroom_teacher_id, room_number, max_students) VALUES
('10A1', 'Lớp 10A1', '10', '2024-2025', 1, 'P101', 40),
('10A2', 'Lớp 10A2', '10', '2024-2025', 2, 'P102', 40),
('11A1', 'Lớp 11A1', '11', '2024-2025', 3, 'P201', 35),
('12A1', 'Lớp 12A1', '12', '2024-2025', 1, 'P301', 38);

-- Chèn dữ liệu subjects
INSERT INTO subjects (subject_code, subject_name, description, credits, hours_per_week) VALUES
('TOAN', 'Toán học', 'Môn Toán từ lớp 10 đến 12', 2, 5),
('VAN', 'Ngữ văn', 'Môn Ngữ văn', 2, 4),
('ANH', 'Tiếng Anh', 'Môn Tiếng Anh', 2, 4),
('LY', 'Vật lý', 'Môn Vật lý', 1, 3),
('HOA', 'Hóa học', 'Môn Hóa học', 1, 3),
('SINH', 'Sinh học', 'Môn Sinh học', 1, 3),
('SU', 'Lịch sử', 'Môn Lịch sử', 1, 2),
('DIA', 'Địa lý', 'Môn Địa lý', 1, 2);

-- Chèn dữ liệu assignments
INSERT INTO assignments (teacher_id, class_id, subject_id, semester, school_year, teaching_schedule) VALUES
-- Giáo viên 1 dạy Toán các lớp
(1, 1, 1, '1', '2024-2025', '{"thu2": ["T1","T2"], "thu4": ["T3","T4"]}'),
(1, 2, 1, '1', '2024-2025', '{"thu3": ["T1","T2"], "thu5": ["T3"]}'),

-- Giáo viên 2 dạy Văn các lớp
(2, 1, 2, '1', '2024-2025', '{"thu2": ["T3","T4"], "thu6": ["T1","T2"]}'),
(2, 3, 2, '1', '2024-2025', '{"thu3": ["T3","T4"], "thu5": ["T1","T2"]}'),

-- Giáo viên 3 dạy Anh các lớp
(3, 1, 3, '1', '2024-2025', '{"thu4": ["T1","T2"], "thu6": ["T3","T4"]}'),
(3, 2, 3, '1', '2024-2025', '{"thu2": ["T5","T6"], "thu4": ["T5","T6"]}');

-- Chèn dữ liệu students
INSERT INTO students (student_code, full_name, date_of_birth, gender, email, phone, address, parent_name, parent_phone, enrollment_date, class_id) VALUES
-- Lớp 10A1
('HS1001', 'Nguyễn Văn An', '2008-05-15', 'male', 'an.nguyen@student.edu.vn', '0901111001', '123 Đường Lê Lợi, Quận 1, TP.HCM', 'Nguyễn Văn Bố', '0909111001', '2024-09-01', 1),
('HS1002', 'Trần Thị Bình', '2008-08-20', 'female', 'binh.tran@student.edu.vn', '0901111002', '456 Đường Nguyễn Huệ, Quận 1, TP.HCM', 'Trần Văn Cha', '0909111002', '2024-09-01', 1),
('HS1003', 'Lê Văn Cường', '2008-03-10', 'male', 'cuong.le@student.edu.vn', '0901111003', '789 Đường Pasteur, Quận 3, TP.HCM', 'Lê Văn Bố', '0909111003', '2024-09-01', 1),

-- Lớp 10A2
('HS1004', 'Phạm Thị Dung', '2008-07-25', 'female', 'dung.pham@student.edu.vn', '0901111004', '321 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM', 'Phạm Văn Bố', '0909111004', '2024-09-01', 2),
('HS1005', 'Hoàng Văn Em', '2008-12-05', 'male', 'em.hoang@student.edu.vn', '0901111005', '654 Đường Lý Tự Trọng, Quận 1, TP.HCM', 'Hoàng Văn Bố', '0909111005', '2024-09-01', 2),

-- Lớp 11A1
('HS1101', 'Vũ Thị Phương', '2007-04-18', 'female', 'phuong.vu@student.edu.vn', '0901111006', '987 Đường Hai Bà Trưng, Quận 1, TP.HCM', 'Vũ Văn Bố', '0909111006', '2024-09-01', 3),
('HS1102', 'Đặng Văn Quân', '2007-09-30', 'male', 'quan.dang@student.edu.vn', '0901111007', '147 Đường Lê Văn Sỹ, Quận 3, TP.HCM', 'Đặng Văn Bố', '0909111007', '2024-09-01', 3);

-- Chèn dữ liệu scores
INSERT INTO scores (student_id, subject_id, assignment_id, score_type, score, semester, school_year, exam_date, created_by) VALUES
-- Điểm học sinh 1 (HS1001)
(1, 1, 1, '15ph', 8.5, '1', '2024-2025', '2024-09-10', 2),
(1, 1, 1, '15ph', 9.0, '1', '2024-2025', '2024-09-24', 2),
(1, 1, 1, '45ph', 8.0, '1', '2024-2025', '2024-10-15', 2),
(1, 2, 3, '15ph', 7.5, '1', '2024-2025', '2024-09-12', 2),
(1, 3, 5, '15ph', 8.0, '1', '2024-2025', '2024-09-11', 4),

-- Điểm học sinh 2 (HS1002)
(2, 1, 1, '15ph', 7.0, '1', '2024-2025', '2024-09-10', 2),
(2, 1, 1, '15ph', 8.5, '1', '2024-2025', '2024-09-24', 2),
(2, 2, 3, '15ph', 9.0, '1', '2024-2025', '2024-09-12', 2),
(2, 3, 5, '15ph', 7.5, '1', '2024-2025', '2024-09-11', 4),

-- Điểm học sinh 3 (HS1003)
(3, 1, 1, '15ph', 6.5, '1', '2024-2025', '2024-09-10', 2),
(3, 2, 3, '15ph', 8.0, '1', '2024-2025', '2024-09-12', 2),
(3, 3, 5, '15ph', 9.5, '1', '2024-2025', '2024-09-11', 4);

-- Chèn dữ liệu score_summaries
INSERT INTO score_summaries (student_id, subject_id, semester, school_year, avg_15ph, avg_45ph, exam_score, subject_avg) VALUES
(1, 1, '1', '2024-2025', 8.75, 8.0, NULL, 8.4),
(1, 2, '1', '2024-2025', 7.5, NULL, NULL, 7.5),
(1, 3, '1', '2024-2025', 8.0, NULL, NULL, 8.0),
(2, 1, '1', '2024-2025', 7.75, NULL, NULL, 7.75),
(2, 2, '1', '2024-2025', 9.0, NULL, NULL, 9.0),
(2, 3, '1', '2024-2025', 7.5, NULL, NULL, 7.5);

-- Chèn dữ liệu attendances
INSERT INTO attendances (student_id, class_id, attendance_date, session, status, recorded_by) VALUES
(1, 1, '2024-09-02', 'all_day', 'present', 2),
(2, 1, '2024-09-02', 'all_day', 'present', 2),
(3, 1, '2024-09-02', 'all_day', 'late', 2),
(1, 1, '2024-09-03', 'all_day', 'present', 2),
(2, 1, '2024-09-03', 'all_day', 'absent', 2),
(3, 1, '2024-09-03', 'all_day', 'present', 2);

-- ====================================================================
-- STORED PROCEDURES VÀ VIEWS
-- ====================================================================

-- View để xem thông tin giáo viên đầy đủ
CREATE VIEW teacher_details AS
SELECT 
    u.id as user_id,
    u.username,
    u.full_name,
    u.email,
    u.phone,
    u.gender,
    t.id as teacher_id,
    t.teacher_code,
    t.specialization,
    t.degree,
    t.start_date
FROM users u
INNER JOIN teachers t ON u.id = t.user_id
WHERE u.role = 'teacher';

-- View để xem thông tin học sinh đầy đủ
CREATE VIEW student_details AS
SELECT 
    s.id,
    s.student_code,
    s.full_name,
    s.date_of_birth,
    s.gender,
    s.email,
    s.phone,
    s.address,
    s.parent_name,
    s.parent_phone,
    s.enrollment_date,
    s.status,
    c.class_code,
    c.class_name,
    c.grade,
    c.school_year,
    t.full_name as homeroom_teacher_name
FROM students s
INNER JOIN classes c ON s.class_id = c.id
LEFT JOIN teachers ht ON c.homeroom_teacher_id = ht.id
LEFT JOIN users t ON ht.user_id = t.id;

-- Stored procedure để tính điểm trung bình môn
DELIMITER //
CREATE PROCEDURE CalculateSubjectAverage(
    IN p_student_id INT,
    IN p_subject_id INT,
    IN p_semester ENUM('1','2'),
    IN p_school_year VARCHAR(9)
)
BEGIN
    DECLARE avg_15ph DECIMAL(4,2);
    DECLARE avg_45ph DECIMAL(4,2);
    DECLARE exam_score DECIMAL(4,2);
    DECLARE subject_avg DECIMAL(4,2);
    
    -- Tính điểm trung bình 15 phút
    SELECT AVG(score) INTO avg_15ph 
    FROM scores 
    WHERE student_id = p_student_id 
    AND subject_id = p_subject_id 
    AND semester = p_semester 
    AND school_year = p_school_year
    AND score_type = '15ph';
    
    -- Tính điểm trung bình 45 phút
    SELECT AVG(score) INTO avg_45ph 
    FROM scores 
    WHERE student_id = p_student_id 
    AND subject_id = p_subject_id 
    AND semester = p_semester 
    AND school_year = p_school_year
    AND score_type = '45ph';
    
    -- Lấy điểm thi
    SELECT score INTO exam_score 
    FROM scores 
    WHERE student_id = p_student_id 
    AND subject_id = p_subject_id 
    AND semester = p_semester 
    AND school_year = p_school_year
    AND score_type = 'thi'
    LIMIT 1;
    
    -- Tính điểm trung bình môn (công thức có thể điều chỉnh)
    SET subject_avg = (COALESCE(avg_15ph, 0) * 0.3 + COALESCE(avg_45ph, 0) * 0.3 + COALESCE(exam_score, 0) * 0.4);
    
    -- Insert hoặc update vào bảng score_summaries
    INSERT INTO score_summaries (student_id, subject_id, semester, school_year, avg_15ph, avg_45ph, exam_score, subject_avg)
    VALUES (p_student_id, p_subject_id, p_semester, p_school_year, avg_15ph, avg_45ph, exam_score, subject_avg)
    ON DUPLICATE KEY UPDATE 
        avg_15ph = VALUES(avg_15ph),
        avg_45ph = VALUES(avg_45ph),
        exam_score = VALUES(exam_score),
        subject_avg = VALUES(subject_avg),
        updated_at = CURRENT_TIMESTAMP;
        
END //
DELIMITER ;

-- Trigger để tự động cập nhật số lượng học sinh khi thêm/xóa học sinh
DELIMITER //
CREATE TRIGGER after_student_insert
AFTER INSERT ON students
FOR EACH ROW
BEGIN
    UPDATE classes 
    SET current_students = current_students + 1 
    WHERE id = NEW.class_id;
END //

CREATE TRIGGER after_student_delete
AFTER DELETE ON students
FOR EACH ROW
BEGIN
    UPDATE classes 
    SET current_students = current_students - 1 
    WHERE id = OLD.class_id;
END //

CREATE TRIGGER after_student_update
AFTER UPDATE ON students
FOR EACH ROW
BEGIN
    IF OLD.class_id != NEW.class_id THEN
        UPDATE classes SET current_students = current_students - 1 WHERE id = OLD.class_id;
        UPDATE classes SET current_students = current_students + 1 WHERE id = NEW.class_id;
    END IF;
END //
DELIMITER ;

-- ====================================================================
-- TÀI KHOẢN MẪU ĐỂ TEST
-- ====================================================================

/*
TÀI KHOẢN ĐỂ ĐĂNG NHẬP:
1. Admin:
   - Username: admin
   - Password: 123456
   - Quyền: Toàn quyền

2. Giáo viên:
   - Username: giaovien1
   - Password: 123456
   - Quyền: Giáo viên (dạy Toán)

3. Giáo viên:
   - Username: giaovien2  
   - Password: 123456
   - Quyền: Giáo viên (dạy Văn)

4. Giáo viên:
   - Username: giaovien3
   - Password: 123456
   - Quyền: Giáo viên (dạy Anh)
*/

SELECT 'Database và dữ liệu mẫu đã được tạo thành công!' as status;