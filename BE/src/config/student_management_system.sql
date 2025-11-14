-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: student_management_system
-- ------------------------------------------------------
-- Server version	8.0.36
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;

/*!50503 SET NAMES utf8 */
;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */
;

/*!40103 SET TIME_ZONE='+00:00' */
;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */
;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;

--
-- Table structure for table `assignments`
--
DROP TABLE IF EXISTS `assignments`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `assignments` (
    `id` int NOT NULL AUTO_INCREMENT,
    `teacher_id` int NOT NULL,
    `class_id` int NOT NULL,
    `subject_id` int NOT NULL,
    `semester` enum('1', '2') NOT NULL,
    `school_year` varchar(9) NOT NULL,
    `teaching_schedule` text,
    `start_date` date DEFAULT NULL,
    `end_date` date DEFAULT NULL,
    `status` enum('active', 'completed', 'cancelled') DEFAULT 'active',
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_assignment` (
        `teacher_id`,
        `class_id`,
        `subject_id`,
        `semester`,
        `school_year`
    ),
    KEY `subject_id` (`subject_id`),
    KEY `idx_assignments_teacher` (`teacher_id`, `semester`, `school_year`),
    KEY `idx_assignments_class` (`class_id`, `semester`, `school_year`),
    CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`),
    CONSTRAINT `assignments_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
    CONSTRAINT `assignments_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 19 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `assignments`
--
LOCK TABLES `assignments` WRITE;

/*!40000 ALTER TABLE `assignments` DISABLE KEYS */
;

INSERT INTO
    `assignments`
VALUES
    (
        1,
        1,
        1,
        1,
        '1',
        '2024-2025',
        '{\"thu2\": [\"T1\",\"T2\"], \"thu4\": [\"T3\",\"T4\"]}',
        NULL,
        NULL,
        'active',
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        2,
        1,
        2,
        1,
        '1',
        '2024-2025',
        '{\"thu3\": [\"T1\",\"T2\"], \"thu5\": [\"T3\"]}',
        NULL,
        NULL,
        'active',
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        3,
        2,
        1,
        2,
        '1',
        '2024-2025',
        '{\"thu2\": [\"T3\",\"T4\"], \"thu6\": [\"T1\",\"T2\"]}',
        NULL,
        NULL,
        'active',
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        5,
        3,
        1,
        3,
        '1',
        '2024-2025',
        '{\"thu4\": [\"T1\",\"T2\"], \"thu6\": [\"T3\",\"T4\"]}',
        NULL,
        NULL,
        'active',
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        9,
        37,
        3,
        6,
        '1',
        '2024-2025',
        '{\"thu2\":[\"T2\",\"T3\",\"T4\"],\"thu3\":[\"T2\",\"T3\"],\"thu6\":[\"T2\",\"T3\",\"T4\"]}',
        NULL,
        NULL,
        'active',
        '2025-11-08 08:36:52',
        '2025-11-08 09:30:39'
    ),
(
        10,
        3,
        9,
        5,
        '1',
        '2024-2025',
        '{\"thu2\":[\"T2\",\"T3\"]}',
        NULL,
        NULL,
        'active',
        '2025-11-08 08:40:20',
        '2025-11-08 09:27:36'
    ),
(
        11,
        36,
        3,
        7,
        '1',
        '2024-2025',
        '{\"thu2\":[\"T5\",\"T6\",\"T7\"]}',
        NULL,
        NULL,
        'active',
        '2025-11-08 09:02:03',
        '2025-11-08 09:02:03'
    ),
(
        12,
        1,
        2,
        3,
        '1',
        '2024-2025',
        '{\"thu2\":[\"T1\",\"T2\",\"T3\",\"T4\"],\"thu5\":[\"T1\",\"T2\"]}',
        NULL,
        NULL,
        'active',
        '2025-11-08 09:09:47',
        '2025-11-08 09:09:47'
    ),
(
        13,
        37,
        9,
        7,
        '1',
        '2024-2025',
        '{\"thu2\":[\"T1\",\"T2\"]}',
        NULL,
        NULL,
        'active',
        '2025-11-08 09:23:54',
        '2025-11-08 09:23:54'
    ),
(
        14,
        26,
        2,
        5,
        '2',
        '2024-2025',
        '{\"thu2\":[\"T2\",\"T3\",\"T4\"]}',
        NULL,
        NULL,
        'active',
        '2025-11-08 10:18:35',
        '2025-11-08 10:23:43'
    ),
(
        15,
        32,
        2,
        7,
        '1',
        '2024-2025',
        '{\"thu2\":[\"T1\",\"T2\",\"T3\"]}',
        NULL,
        NULL,
        'active',
        '2025-11-08 10:19:00',
        '2025-11-08 10:19:00'
    ),
(
        16,
        30,
        2,
        5,
        '1',
        '2024-2025',
        '{\"thu2\":[\"T7\",\"T8\",\"T9\"]}',
        NULL,
        NULL,
        'active',
        '2025-11-08 10:41:15',
        '2025-11-08 10:41:15'
    ),
(
        17,
        39,
        4,
        7,
        '1',
        '2024-2025',
        '{\"thu2\":[\"T2\",\"T3\",\"T4\"]}',
        NULL,
        NULL,
        'active',
        '2025-11-09 02:49:18',
        '2025-11-09 02:49:18'
    ),
(
        18,
        2,
        9,
        7,
        '1',
        '2024-2025',
        '{\"thu3\":[\"T10\",\"T11\",\"T12\"]}',
        NULL,
        NULL,
        'active',
        '2025-11-09 04:00:23',
        '2025-11-09 04:00:23'
    );

/*!40000 ALTER TABLE `assignments` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `attendances`
--
DROP TABLE IF EXISTS `attendances`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `attendances` (
    `id` int NOT NULL AUTO_INCREMENT,
    `student_id` int NOT NULL,
    `class_id` int NOT NULL,
    `attendance_date` date NOT NULL,
    `session` enum('morning', 'afternoon', 'all_day') DEFAULT 'all_day',
    `status` enum('present', 'absent', 'late', 'excused') DEFAULT 'present',
    `notes` text,
    `recorded_by` int NOT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_attendance` (`student_id`, `attendance_date`, `session`),
    KEY `class_id` (`class_id`),
    KEY `recorded_by` (`recorded_by`),
    KEY `idx_attendances_student_date` (`student_id`, `attendance_date`),
    CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
    CONSTRAINT `attendances_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
    CONSTRAINT `attendances_ibfk_3` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `attendances`
--
LOCK TABLES `attendances` WRITE;

/*!40000 ALTER TABLE `attendances` DISABLE KEYS */
;

INSERT INTO
    `attendances`
VALUES
    (
        1,
        1,
        1,
        '2024-09-02',
        'all_day',
        'present',
        NULL,
        2,
        '2025-10-23 09:20:18'
    ),
(
        2,
        2,
        1,
        '2024-09-02',
        'all_day',
        'present',
        NULL,
        2,
        '2025-10-23 09:20:18'
    ),
(
        3,
        3,
        1,
        '2024-09-02',
        'all_day',
        'late',
        NULL,
        2,
        '2025-10-23 09:20:18'
    ),
(
        4,
        1,
        1,
        '2024-09-03',
        'all_day',
        'present',
        NULL,
        2,
        '2025-10-23 09:20:18'
    ),
(
        5,
        2,
        1,
        '2024-09-03',
        'all_day',
        'absent',
        NULL,
        2,
        '2025-10-23 09:20:18'
    ),
(
        6,
        3,
        1,
        '2024-09-03',
        'all_day',
        'present',
        NULL,
        2,
        '2025-10-23 09:20:18'
    );

/*!40000 ALTER TABLE `attendances` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `classes`
--
DROP TABLE IF EXISTS `classes`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `classes` (
    `id` int NOT NULL AUTO_INCREMENT,
    `class_code` varchar(20) NOT NULL,
    `class_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
    `grade` enum('10', '11', '12') NOT NULL,
    `school_year` varchar(9) NOT NULL,
    `homeroom_teacher_id` int DEFAULT NULL,
    `room_number` varchar(10) DEFAULT NULL,
    `max_students` int DEFAULT '40',
    `current_students` int DEFAULT '0',
    `status` enum('active', 'inactive') DEFAULT 'active',
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `class_code` (`class_code`),
    KEY `homeroom_teacher_id` (`homeroom_teacher_id`),
    KEY `idx_classes_grade` (`grade`),
    KEY `idx_classes_year` (`school_year`),
    CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`homeroom_teacher_id`) REFERENCES `teachers` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `classes`
--
LOCK TABLES `classes` WRITE;

/*!40000 ALTER TABLE `classes` DISABLE KEYS */
;

INSERT INTO
    `classes`
VALUES
    (
        1,
        '10A1',
        'Lớp 10A1',
        '10',
        '2024-2025',
        31,
        'P101',
        40,
        1,
        'active',
        '2025-10-23 09:20:18',
        '2025-10-25 09:58:51'
    ),
(
        2,
        '10A2',
        'Lớp 10A2',
        '10',
        '2024-2025',
        2,
        'P102',
        40,
        0,
        'active',
        '2025-10-23 09:20:18',
        '2025-11-08 07:20:18'
    ),
(
        3,
        '11A1',
        'Lớp 11A1',
        '11',
        '2024-2025',
        3,
        'P201',
        35,
        1,
        'active',
        '2025-10-23 09:20:18',
        '2025-11-07 10:06:18'
    ),
(
        4,
        '12A1',
        'Lớp 12A1',
        '12',
        '2024-2025',
        1,
        'P301',
        38,
        1,
        'active',
        '2025-10-23 09:20:18',
        '2025-11-14 08:51:32'
    ),
(
        9,
        '11A2',
        'Lớp 11A2',
        '11',
        '2024-2025',
        27,
        'P202',
        35,
        0,
        'active',
        '2025-10-25 09:21:02',
        '2025-10-25 09:58:59'
    ),
(
        10,
        '12A2',
        'Lớp 12A2',
        '12',
        '2024-2025',
        37,
        'P302',
        38,
        1,
        'active',
        '2025-10-25 09:21:02',
        '2025-11-09 05:05:09'
    );

/*!40000 ALTER TABLE `classes` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `score_summaries`
--
DROP TABLE IF EXISTS `score_summaries`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `score_summaries` (
    `id` int NOT NULL AUTO_INCREMENT,
    `student_id` int NOT NULL,
    `subject_id` int NOT NULL,
    `semester` enum('1', '2') NOT NULL,
    `school_year` varchar(9) NOT NULL,
    `avg_15ph` decimal(4, 2) DEFAULT NULL,
    `avg_45ph` decimal(4, 2) DEFAULT NULL,
    `exam_score` decimal(4, 2) DEFAULT NULL,
    `subject_avg` decimal(4, 2) DEFAULT NULL,
    `rank_in_class` int DEFAULT NULL,
    `rank_in_grade` int DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_summary` (
        `student_id`,
        `subject_id`,
        `semester`,
        `school_year`
    ),
    KEY `subject_id` (`subject_id`),
    CONSTRAINT `score_summaries_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
    CONSTRAINT `score_summaries_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `score_summaries`
--
LOCK TABLES `score_summaries` WRITE;

/*!40000 ALTER TABLE `score_summaries` DISABLE KEYS */
;

INSERT INTO
    `score_summaries`
VALUES
    (
        1,
        1,
        1,
        '1',
        '2024-2025',
        8.75,
        8.00,
        NULL,
        8.40,
        NULL,
        NULL,
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        3,
        1,
        3,
        '1',
        '2024-2025',
        8.00,
        NULL,
        NULL,
        8.00,
        NULL,
        NULL,
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        4,
        2,
        1,
        '1',
        '2024-2025',
        7.75,
        NULL,
        NULL,
        7.75,
        NULL,
        NULL,
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        5,
        2,
        2,
        '1',
        '2024-2025',
        9.00,
        NULL,
        NULL,
        9.00,
        NULL,
        NULL,
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        6,
        2,
        3,
        '1',
        '2024-2025',
        7.50,
        NULL,
        NULL,
        7.50,
        NULL,
        NULL,
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    );

/*!40000 ALTER TABLE `score_summaries` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `scores`
--
DROP TABLE IF EXISTS `scores`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `scores` (
    `id` int NOT NULL AUTO_INCREMENT,
    `student_id` int NOT NULL,
    `subject_id` int NOT NULL,
    `assignment_id` int DEFAULT NULL,
    `score_type` enum('15ph', '45ph', 'thi', 'tbmon') NOT NULL,
    `score` decimal(4, 2) NOT NULL,
    `semester` enum('1', '2') NOT NULL,
    `school_year` varchar(9) NOT NULL,
    `exam_date` date DEFAULT NULL,
    `notes` text,
    `created_by` int NOT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `class_id` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `subject_id` (`subject_id`),
    KEY `assignment_id` (`assignment_id`),
    KEY `created_by` (`created_by`),
    KEY `idx_scores_student_semester` (`student_id`, `semester`, `school_year`),
    KEY `fk_scores_class` (`class_id`),
    CONSTRAINT `fk_scores_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
    CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
    CONSTRAINT `scores_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
    CONSTRAINT `scores_ibfk_3` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`),
    CONSTRAINT `scores_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 42 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `scores`
--
LOCK TABLES `scores` WRITE;

/*!40000 ALTER TABLE `scores` DISABLE KEYS */
;

INSERT INTO
    `scores`
VALUES
    (
        4,
        1,
        2,
        3,
        '15ph',
        7.50,
        '1',
        '2024-2025',
        '2024-09-12',
        NULL,
        2,
        '2025-10-23 09:20:18',
        '2025-11-09 07:24:05',
        1
    ),
(
        5,
        1,
        3,
        5,
        '15ph',
        8.00,
        '1',
        '2024-2025',
        '2024-09-11',
        NULL,
        4,
        '2025-10-23 09:20:18',
        '2025-11-09 07:24:05',
        1
    ),
(
        6,
        2,
        1,
        1,
        '15ph',
        7.00,
        '1',
        '2024-2025',
        '2024-09-10',
        NULL,
        2,
        '2025-10-23 09:20:18',
        '2025-11-09 07:24:05',
        1
    ),
(
        7,
        2,
        1,
        1,
        '15ph',
        8.50,
        '1',
        '2024-2025',
        '2024-09-24',
        NULL,
        2,
        '2025-10-23 09:20:18',
        '2025-11-09 07:24:05',
        1
    ),
(
        8,
        2,
        2,
        3,
        '15ph',
        9.00,
        '1',
        '2024-2025',
        '2024-09-12',
        NULL,
        2,
        '2025-10-23 09:20:18',
        '2025-11-09 07:24:05',
        1
    ),
(
        9,
        2,
        3,
        5,
        '15ph',
        7.50,
        '1',
        '2024-2025',
        '2024-09-11',
        NULL,
        4,
        '2025-10-23 09:20:18',
        '2025-11-09 07:24:05',
        1
    ),
(
        10,
        3,
        1,
        1,
        '15ph',
        6.50,
        '1',
        '2024-2025',
        '2024-09-10',
        NULL,
        2,
        '2025-10-23 09:20:18',
        '2025-11-09 07:24:05',
        1
    ),
(
        11,
        3,
        2,
        3,
        '15ph',
        8.00,
        '1',
        '2024-2025',
        '2024-09-12',
        NULL,
        2,
        '2025-10-23 09:20:18',
        '2025-11-09 07:24:05',
        1
    ),
(
        12,
        3,
        3,
        5,
        '15ph',
        9.50,
        '1',
        '2024-2025',
        '2024-09-11',
        NULL,
        4,
        '2025-10-23 09:20:18',
        '2025-11-09 07:24:05',
        1
    ),
(
        20,
        5,
        7,
        11,
        'thi',
        10.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        37,
        '2025-11-12 02:23:46',
        '2025-11-12 02:23:46',
        3
    ),
(
        21,
        6,
        7,
        11,
        '15ph',
        7.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-12 02:24:02',
        '2025-11-14 08:11:12',
        3
    ),
(
        22,
        5,
        7,
        11,
        '45ph',
        10.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        37,
        '2025-11-14 02:53:30',
        '2025-11-14 02:53:30',
        3
    ),
(
        26,
        6,
        7,
        11,
        '45ph',
        10.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 04:24:38',
        '2025-11-14 04:24:38',
        3
    ),
(
        27,
        6,
        7,
        11,
        'thi',
        10.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 04:24:43',
        '2025-11-14 04:24:43',
        3
    ),
(
        28,
        10,
        7,
        11,
        '15ph',
        10.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 04:25:36',
        '2025-11-14 04:25:36',
        3
    ),
(
        29,
        10,
        7,
        11,
        '45ph',
        8.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 04:25:40',
        '2025-11-14 04:25:40',
        3
    ),
(
        30,
        10,
        7,
        11,
        'thi',
        4.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 04:25:46',
        '2025-11-14 04:25:46',
        3
    ),
(
        31,
        5,
        7,
        11,
        '15ph',
        10.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 07:40:13',
        '2025-11-14 08:47:40',
        3
    ),
(
        32,
        4,
        5,
        16,
        '15ph',
        8.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 08:39:17',
        '2025-11-14 08:39:28',
        2
    ),
(
        33,
        4,
        5,
        16,
        '45ph',
        7.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 08:42:38',
        '2025-11-14 08:42:38',
        2
    ),
(
        34,
        4,
        7,
        15,
        '15ph',
        10.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 08:49:48',
        '2025-11-14 08:49:48',
        2
    ),
(
        35,
        12,
        7,
        15,
        '15ph',
        8.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 08:49:55',
        '2025-11-14 08:49:55',
        2
    ),
(
        36,
        12,
        7,
        15,
        '45ph',
        9.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 08:50:00',
        '2025-11-14 08:50:00',
        2
    ),
(
        37,
        4,
        7,
        15,
        '45ph',
        8.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 08:50:06',
        '2025-11-14 08:50:06',
        2
    ),
(
        38,
        4,
        7,
        15,
        'thi',
        9.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 08:50:18',
        '2025-11-14 08:50:18',
        2
    ),
(
        39,
        12,
        7,
        15,
        'thi',
        10.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 08:50:24',
        '2025-11-14 08:50:24',
        2
    ),
(
        40,
        13,
        7,
        17,
        '15ph',
        6.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 09:02:31',
        '2025-11-14 09:02:31',
        4
    ),
(
        41,
        1,
        7,
        NULL,
        '15ph',
        3.00,
        '1',
        '2024-2025',
        NULL,
        NULL,
        1,
        '2025-11-14 09:02:45',
        '2025-11-14 09:02:45',
        1
    );

/*!40000 ALTER TABLE `scores` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Temporary view structure for view `student_details`
--
DROP TABLE IF EXISTS `student_details`;

/*!50001 DROP VIEW IF EXISTS `student_details`*/
;

SET
    @saved_cs_client = @ @character_set_client;

/*!50503 SET character_set_client = utf8mb4 */
;

/*!50001 CREATE VIEW `student_details` AS SELECT 
 1 AS `id`,
 1 AS `student_code`,
 1 AS `full_name`,
 1 AS `date_of_birth`,
 1 AS `gender`,
 1 AS `email`,
 1 AS `phone`,
 1 AS `address`,
 1 AS `parent_name`,
 1 AS `parent_phone`,
 1 AS `enrollment_date`,
 1 AS `status`,
 1 AS `class_code`,
 1 AS `class_name`,
 1 AS `grade`,
 1 AS `school_year`,
 1 AS `homeroom_teacher_name`*/
;

SET
    character_set_client = @saved_cs_client;

--
-- Table structure for table `students`
--
DROP TABLE IF EXISTS `students`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `students` (
    `id` int NOT NULL AUTO_INCREMENT,
    `student_code` varchar(20) NOT NULL,
    `full_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
    `date_of_birth` date NOT NULL,
    `gender` enum('male', 'female', 'other') NOT NULL,
    `email` varchar(100) DEFAULT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `address` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `parent_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `parent_phone` varchar(20) DEFAULT NULL,
    `enrollment_date` date DEFAULT NULL,
    `class_id` int NOT NULL,
    `status` enum('studying', 'transferred', 'graduated', 'dropped') DEFAULT 'studying',
    `notes` text,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `student_code` (`student_code`),
    KEY `idx_students_class` (`class_id`),
    KEY `idx_students_code` (`student_code`),
    CONSTRAINT `students_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 14 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `students`
--
LOCK TABLES `students` WRITE;

/*!40000 ALTER TABLE `students` DISABLE KEYS */
;

INSERT INTO
    `students`
VALUES
    (
        1,
        'HS1001',
        'Nguyễn Văn An',
        '2008-05-15',
        'male',
        'an.nguyen@student.edu.vn',
        '0901111001',
        '123 Đường Lê Lợi, Quận 1, TP.HCM',
        'Nguyễn Văn Bố',
        '0909111001',
        '2024-09-01',
        1,
        'studying',
        NULL,
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        2,
        'HS1002',
        'Trần Thị Bình',
        '2008-08-20',
        'female',
        'binh.tran@student.edu.vn',
        '0901111002',
        '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
        'Trần Văn Cha',
        '0909111002',
        '2024-09-01',
        1,
        'studying',
        NULL,
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        3,
        'HS1003',
        'Lê Văn Cường',
        '2008-03-10',
        'male',
        'cuong.le@student.edu.vn',
        '0901111003',
        '789 Đường Pasteur, Quận 3, TP.HCM',
        'Lê Văn Bố',
        '0909111003',
        '2024-09-01',
        1,
        'studying',
        NULL,
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        4,
        'HS1004',
        'Phạm Thị Dung',
        '2008-07-25',
        'female',
        'dung.pham@student.edu.vn',
        '0901111004',
        '321 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM',
        'Phạm Văn Bố',
        '0909111004',
        '2024-09-01',
        2,
        'studying',
        NULL,
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        5,
        'HS1005',
        'Hoàng Văn anh',
        '2008-12-05',
        'female',
        'em.hoang@student.edu.vn',
        '0901111005',
        '654 Đường Lý Tự Trọng, Quận 1, TP.HCM',
        'Hoàng Văn Bố',
        '0909111005',
        '2024-09-01',
        3,
        'studying',
        '',
        '2025-10-23 09:20:18',
        '2025-11-07 10:16:50'
    ),
(
        6,
        'HS1101',
        'Vũ Thị Phương',
        '2007-04-18',
        'female',
        'phuong.vu@student.edu.vn',
        '0901111006',
        '987 Đường Hai Bà Trưng, Quận 1, TP.HCM',
        'Vũ Văn Bố',
        '0909111006',
        '2024-09-01',
        3,
        'studying',
        NULL,
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        9,
        'HS1010',
        'Nguyễn Văn c',
        '2007-12-01',
        'male',
        'anhtu105182@gmail.com',
        '0987654123',
        'hà nội',
        'Hoàng Văn Bố',
        '0901234578',
        '2025-12-31',
        1,
        'studying',
        '',
        '2025-10-25 08:13:34',
        '2025-11-08 07:21:58'
    ),
(
        10,
        'HS25-0001',
        'Nguyễn Văn A',
        '2008-05-15',
        'male',
        'vana@example.com',
        '0901234567',
        '123 Lê Lợi, Q.1, TP.HCM',
        'Nguyễn Văn B',
        '0909876543',
        '2025-09-05',
        3,
        'studying',
        'Chuyển từ THCS XYZ',
        '2025-11-07 10:06:18',
        '2025-11-07 10:06:18'
    ),
(
        11,
        'HS25-0002',
        'nguyễn việt hoàng Tú ',
        '2004-02-12',
        'male',
        'anhtu105182@gmail.com',
        '0987654123',
        'hà nội',
        'Hoàng Văn Bố',
        '0987654321',
        '2025-12-31',
        10,
        'studying',
        '',
        '2025-11-08 01:49:06',
        '2025-11-08 01:49:06'
    ),
(
        12,
        'HS25-0003',
        'nguyễn việt hoàng Tú năm',
        '2008-12-14',
        'male',
        'anhtu105182@gmail.com',
        '0987654123',
        'hà nội',
        'Hoàng Văn Bố',
        '0393810287',
        '2025-12-31',
        2,
        'studying',
        '',
        '2025-11-08 07:20:18',
        '2025-11-08 07:20:18'
    ),
(
        13,
        'HS04-0001',
        'nguyễn việt hoàng anh Thư',
        '2009-12-23',
        'male',
        'anhtu105182@gmail.com',
        '0987654123',
        'hà nội',
        'Hoàng Văn Bố',
        '3027623825',
        '2004-12-04',
        4,
        'studying',
        '',
        '2025-11-14 08:51:32',
        '2025-11-14 08:51:32'
    );

/*!40000 ALTER TABLE `students` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `subjects`
--
DROP TABLE IF EXISTS `subjects`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `subjects` (
    `id` int NOT NULL AUTO_INCREMENT,
    `subject_code` varchar(20) NOT NULL,
    `subject_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
    `description` text,
    `credits` int DEFAULT '1',
    `hours_per_week` int DEFAULT '3',
    `is_elective` tinyint(1) DEFAULT '0',
    `status` enum('active', 'inactive') DEFAULT 'active',
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `subject_code` (`subject_code`)
) ENGINE = InnoDB AUTO_INCREMENT = 14 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `subjects`
--
LOCK TABLES `subjects` WRITE;

/*!40000 ALTER TABLE `subjects` DISABLE KEYS */
;

INSERT INTO
    `subjects`
VALUES
    (
        1,
        'TOAN',
        'Toán học',
        'Môn Toán từ lớp 10 đến 12',
        2,
        5,
        0,
        'active',
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        2,
        'VAN',
        'Ngữ văn',
        'Môn Ngữ văn',
        2,
        4,
        0,
        'active',
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        3,
        'ANH',
        'Tiếng Anh',
        'Môn Tiếng Anh',
        2,
        4,
        0,
        'active',
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        4,
        'LY',
        'Vật lý',
        'Môn Vật lý',
        1,
        3,
        0,
        'active',
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        5,
        'HOA',
        'Hóa học',
        'Môn Hóa học',
        2,
        3,
        0,
        'active',
        '2025-10-23 09:20:18',
        '2025-11-10 04:20:11'
    ),
(
        6,
        'SINH',
        'Sinh học',
        'Môn Sinh học',
        1,
        3,
        0,
        'active',
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        7,
        'SU',
        'Lịch sử',
        'Môn Lịch sử',
        1,
        2,
        0,
        'active',
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        8,
        'DIA',
        'Địa lý',
        'Môn Địa lý',
        1,
        2,
        0,
        'active',
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        13,
        'the',
        'thẻ dục ',
        NULL,
        3,
        3,
        0,
        'active',
        '2025-11-10 04:26:22',
        '2025-11-10 04:26:22'
    );

/*!40000 ALTER TABLE `subjects` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Temporary view structure for view `teacher_details`
--
DROP TABLE IF EXISTS `teacher_details`;

/*!50001 DROP VIEW IF EXISTS `teacher_details`*/
;

SET
    @saved_cs_client = @ @character_set_client;

/*!50503 SET character_set_client = utf8mb4 */
;

/*!50001 CREATE VIEW `teacher_details` AS SELECT 
 1 AS `user_id`,
 1 AS `username`,
 1 AS `full_name`,
 1 AS `email`,
 1 AS `phone`,
 1 AS `gender`,
 1 AS `teacher_id`,
 1 AS `teacher_code`,
 1 AS `specialization`,
 1 AS `degree`,
 1 AS `start_date`*/
;

SET
    character_set_client = @saved_cs_client;

--
-- Table structure for table `teachers`
--
DROP TABLE IF EXISTS `teachers`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `teachers` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `teacher_code` varchar(20) NOT NULL,
    `specialization` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `degree` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `start_date` date DEFAULT NULL,
    `salary` decimal(12, 2) DEFAULT NULL,
    `bank_account` varchar(50) DEFAULT NULL,
    `bank_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `notes` text,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_id` (`user_id`),
    UNIQUE KEY `teacher_code` (`teacher_code`),
    KEY `idx_teachers_code` (`teacher_code`),
    CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 40 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `teachers`
--
LOCK TABLES `teachers` WRITE;

/*!40000 ALTER TABLE `teachers` DISABLE KEYS */
;

INSERT INTO
    `teachers`
VALUES
    (
        1,
        2,
        'GV001',
        'hóa học',
        'Tiến sĩ',
        '2020-09-01',
        NULL,
        NULL,
        NULL,
        NULL,
        '2025-10-23 09:20:18',
        '2025-10-23 14:59:08'
    ),
(
        2,
        3,
        'GV002',
        'Ngữ văn',
        'tiến sĩ',
        '2019-08-15',
        4000000.00,
        '63871263811231231',
        'vietcombank',
        '',
        '2025-10-23 09:20:18',
        '2025-11-09 04:01:05'
    ),
(
        3,
        4,
        'GV003',
        'Tiếng Anh',
        'Thạc sĩ',
        '2021-09-01',
        NULL,
        NULL,
        NULL,
        NULL,
        '2025-10-23 09:20:18',
        '2025-10-23 09:20:18'
    ),
(
        5,
        6,
        'GV0004',
        'lịch sử ',
        'tiến sĩ',
        '2025-10-22',
        NULL,
        NULL,
        NULL,
        NULL,
        '2025-10-25 04:09:58',
        '2025-10-25 04:09:58'
    ),
(
        26,
        27,
        'GV004',
        'Vật lý',
        'tiến sĩ',
        '2020-09-01',
        NULL,
        NULL,
        NULL,
        NULL,
        '2025-10-25 09:14:25',
        '2025-11-07 14:45:04'
    ),
(
        27,
        28,
        'GV005',
        'Hóa học',
        'Thạc sĩ',
        '2020-09-01',
        1321321.00,
        '63871263811231231',
        'acb',
        '',
        '2025-10-25 09:14:25',
        '2025-11-09 04:50:24'
    ),
(
        29,
        30,
        'GV007',
        'Lịch sử',
        'Thạc sĩ',
        '2020-09-01',
        NULL,
        NULL,
        NULL,
        NULL,
        '2025-10-25 09:14:25',
        '2025-10-25 09:14:25'
    ),
(
        30,
        31,
        'GV008',
        'Địa lý',
        'Thạc sĩ',
        '2020-09-01',
        1321321.00,
        '63871263811231231',
        'acb',
        '',
        '2025-10-25 09:14:25',
        '2025-11-09 03:35:45'
    ),
(
        31,
        32,
        'GV009',
        'Tin học',
        'Cử nhân',
        '2020-09-01',
        NULL,
        NULL,
        NULL,
        NULL,
        '2025-10-25 09:14:25',
        '2025-10-25 09:14:25'
    ),
(
        32,
        33,
        'GV010',
        'Giáo dục công dân',
        'Cử nhân',
        '2020-09-01',
        NULL,
        NULL,
        NULL,
        NULL,
        '2025-10-25 09:14:25',
        '2025-10-25 09:14:25'
    ),
(
        34,
        35,
        'GV012',
        'Mỹ thuật',
        'Cử nhân',
        '2020-09-01',
        NULL,
        NULL,
        NULL,
        NULL,
        '2025-10-25 09:14:25',
        '2025-10-25 09:14:25'
    ),
(
        36,
        37,
        'GV24-0001',
        'Hóa học',
        'Cử nhân',
        '2024-09-01',
        NULL,
        NULL,
        NULL,
        NULL,
        '2025-11-07 14:32:03',
        '2025-11-07 14:32:03'
    ),
(
        37,
        38,
        'GV20-0001',
        'tin học ',
        'thạc sĩ',
        '2020-09-01',
        1321321.00,
        '63871263811231231',
        'acb',
        '',
        '2025-11-07 15:02:39',
        '2025-11-09 04:02:48'
    ),
(
        38,
        40,
        'GV20-0002',
        'tin học ',
        'thạc sĩ',
        '2020-09-01',
        1321321.00,
        '63871263811231231',
        'acb',
        '',
        '2025-11-08 07:39:10',
        '2025-11-08 07:39:10'
    ),
(
        39,
        41,
        'GV20-0003',
        'tin học ',
        'thạc sĩ',
        '2020-09-01',
        1321321.00,
        '63871263811231231',
        'acb',
        '',
        '2025-11-09 02:29:41',
        '2025-11-09 02:29:41'
    );

/*!40000 ALTER TABLE `teachers` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `users`
--
DROP TABLE IF EXISTS `users`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL,
    `password` varchar(255) NOT NULL,
    `role` enum('admin', 'teacher') NOT NULL,
    `full_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
    `email` varchar(100) DEFAULT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `address` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
    `date_of_birth` date DEFAULT NULL,
    `gender` enum('male', 'female', 'other') DEFAULT NULL,
    `is_active` tinyint(1) DEFAULT '1',
    `last_login` datetime DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `username` (`username`),
    UNIQUE KEY `email` (`email`),
    KEY `idx_users_role` (`role`),
    KEY `idx_users_username` (`username`)
) ENGINE = InnoDB AUTO_INCREMENT = 42 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `users`
--
LOCK TABLES `users` WRITE;

/*!40000 ALTER TABLE `users` DISABLE KEYS */
;

INSERT INTO
    `users`
VALUES
    (
        1,
        'admin',
        '$2b$10$cl6Lq7jqgSK5g6DyWu9zHOuocWn1LyDJsavaGUesoL9cZUMaJAxqG',
        'admin',
        'Nguyễn Văn Admin',
        'admin@school.edu.vn',
        '0901234567',
        NULL,
        NULL,
        'male',
        1,
        '2025-11-14 10:58:49',
        '2025-10-23 09:20:18',
        '2025-11-14 10:58:49'
    ),
(
        2,
        'giaovien1',
        '$2b$10$cl6Lq7jqgSK5g6DyWu9zHOuocWn1LyDJsavaGUesoL9cZUMaJAxqG',
        'teacher',
        'Trần Thị Giáo Viên Mới',
        'new.email@school.edu.vn',
        '0383137092',
        '123 Đường mới, TP. Mới',
        NULL,
        'female',
        1,
        '2025-10-25 02:17:59',
        '2025-10-23 09:20:18',
        '2025-10-25 02:17:59'
    ),
(
        3,
        'giaovien2',
        '$2b$10$cl6Lq7jqgSK5g6DyWu9zHOuocWn1LyDJsavaGUesoL9cZUMaJAxqG',
        'teacher',
        'nguyễn văn a',
        'giaovien2@school.edu.vn',
        '0901234569',
        'ngô xá',
        '1999-12-31',
        'male',
        0,
        NULL,
        '2025-10-23 09:20:18',
        '2025-11-09 04:01:05'
    ),
(
        4,
        'giaovien3',
        '$2b$10$cl6Lq7jqgSK5g6DyWu9zHOuocWn1LyDJsavaGUesoL9cZUMaJAxqG',
        'teacher',
        'Phạm Thị Giáo Viên',
        'giaovien3@school.edu.vn',
        '0901234570',
        NULL,
        NULL,
        'female',
        1,
        NULL,
        '2025-10-23 09:20:18',
        '2025-10-23 10:09:02'
    ),
(
        6,
        'giaovien4',
        '$2b$10$nuuqZXlpQRaTHMHjIY99ze4HiQMdX.IwJbhoyspID1qeCc1mL36fm',
        'teacher',
        'nguyễn văn b',
        'banhtu@gmail.com',
        '0393810287',
        NULL,
        NULL,
        NULL,
        1,
        '2025-10-25 04:10:26',
        '2025-10-25 04:09:58',
        '2025-10-25 04:10:26'
    ),
(
        27,
        'giaovien14',
        '$2b$10$cl6Lq7jqgSK5g6DyWu9zHOuocWn1LyDJsavaGUesoL9cZUMaJAxqG',
        'teacher',
        'nguyễn văn a',
        'giaovien4@school.edu.vn',
        '0901234571',
        NULL,
        NULL,
        'female',
        1,
        NULL,
        '2025-10-25 09:13:16',
        '2025-11-07 14:45:04'
    ),
(
        28,
        'giaovien5',
        '$2b$10$cl6Lq7jqgSK5g6DyWu9zHOuocWn1LyDJsavaGUesoL9cZUMaJAxqG',
        'teacher',
        'Phan Văn Dạy',
        'giaovien5@school.edu.vn',
        '0901234572',
        'hà nội ',
        '2003-03-01',
        'male',
        1,
        '2025-11-09 05:01:10',
        '2025-10-25 09:13:16',
        '2025-11-09 05:01:10'
    ),
(
        30,
        'giaovien7',
        '$2b$10$cl6Lq7jqgSK5g6DyWu9zHOuocWn1LyDJsavaGUesoL9cZUMaJAxqG',
        'teacher',
        'Vũ Văn Thành',
        'giaovien7@school.edu.vn',
        '0901234574',
        NULL,
        NULL,
        'male',
        1,
        NULL,
        '2025-10-25 09:13:16',
        '2025-10-25 09:13:16'
    ),
(
        31,
        'giaovien8',
        '$2b$10$cl6Lq7jqgSK5g6DyWu9zHOuocWn1LyDJsavaGUesoL9cZUMaJAxqG',
        'teacher',
        'Lý Thị Hoa',
        'giaovien8@school.edu.vn',
        '0901234575',
        'hà nội ',
        '2003-03-01',
        'female',
        1,
        NULL,
        '2025-10-25 09:13:16',
        '2025-11-09 03:35:45'
    ),
(
        32,
        'giaovien9',
        '$2b$10$cl6Lq7jqgSK5g6DyWu9zHOuocWn1LyDJsavaGUesoL9cZUMaJAxqG',
        'teacher',
        'Trịnh Văn Lực',
        'giaovien9@school.edu.vn',
        '0901234576',
        NULL,
        NULL,
        'male',
        1,
        NULL,
        '2025-10-25 09:13:16',
        '2025-10-25 09:13:16'
    ),
(
        33,
        'giaovien10',
        '$2b$10$cl6Lq7jqgSK5g6DyWu9zHOuocWn1LyDJsavaGUesoL9cZUMaJAxqG',
        'teacher',
        'Nguyễn Thị Lan',
        'giaovien10@school.edu.vn',
        '0901234577',
        NULL,
        NULL,
        'female',
        1,
        NULL,
        '2025-10-25 09:13:16',
        '2025-10-25 09:13:16'
    ),
(
        35,
        'giaovien12',
        '$2b$10$cl6Lq7jqgSK5g6DyWu9zHOuocWn1LyDJsavaGUesoL9cZUMaJAxqG',
        'teacher',
        'Phạm Thị Oanh',
        'giaovien12@school.edu.vn',
        '0901234579',
        NULL,
        NULL,
        'female',
        1,
        NULL,
        '2025-10-25 09:13:16',
        '2025-10-25 09:13:16'
    ),
(
        37,
        'gv123',
        '$2b$10$InCB5e10/H88R4NhP2w/0epIEFbEniy0/dZlr3Rirt1z6d1DVdfoa',
        'teacher',
        'Nguyễn Văn Giáo Viên Mới 1',
        'gv.moi@school.edu.vn',
        '09012345098',
        '456 Đường ABC, Quận XYZ',
        '1990-01-01',
        'male',
        1,
        '2025-11-14 10:01:03',
        '2025-11-07 14:32:03',
        '2025-11-14 10:47:15'
    ),
(
        38,
        'gv1234',
        '$2b$10$4wtSmW9u2dNMPhgVZP3Rp.8NSAauPX2N8rfFEUpNKpV4Gg0580vOK',
        'teacher',
        'nguyễn việt hoàng anh',
        'anhtu105182@gmail.com',
        '0987654123',
        'hà nội ',
        '2003-03-01',
        'male',
        1,
        '2025-11-14 09:07:15',
        '2025-11-07 15:02:39',
        '2025-11-14 09:07:15'
    ),
(
        40,
        'gv234',
        '$2b$10$OX9hW/9f/W6tayYG7tg/b.oTaiaF42i4SNOi89ByocGW4tavDpwIK',
        'teacher',
        'nguyễn việt hoàng Tú',
        'adfadsads@gmail.com',
        '0987654123',
        'hà nội ',
        '2003-03-01',
        'male',
        1,
        '2025-11-11 01:33:41',
        '2025-11-08 07:39:10',
        '2025-11-11 01:33:41'
    ),
(
        41,
        'tuan1',
        '$2b$10$ILUY8Hz5E8Lm4DKNz00W6.kucq0aDQ4lETLrBnGkOxVUi70HEaxtm',
        'teacher',
        'nguyễn anh Tuấn ',
        'tuan1@gmail.com',
        '0987346252',
        'hà nội ',
        '2003-03-01',
        'male',
        1,
        '2025-11-09 03:52:27',
        '2025-11-09 02:29:41',
        '2025-11-09 03:52:27'
    );

/*!40000 ALTER TABLE `users` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Final view structure for view `student_details`
--
/*!50001 DROP VIEW IF EXISTS `student_details`*/
;

/*!50001 SET @saved_cs_client          = @@character_set_client */
;

/*!50001 SET @saved_cs_results         = @@character_set_results */
;

/*!50001 SET @saved_col_connection     = @@collation_connection */
;

/*!50001 SET character_set_client      = utf8mb4 */
;

/*!50001 SET character_set_results     = utf8mb4 */
;

/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */
;

/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `student_details` AS select `s`.`id` AS `id`,`s`.`student_code` AS `student_code`,`s`.`full_name` AS `full_name`,`s`.`date_of_birth` AS `date_of_birth`,`s`.`gender` AS `gender`,`s`.`email` AS `email`,`s`.`phone` AS `phone`,`s`.`address` AS `address`,`s`.`parent_name` AS `parent_name`,`s`.`parent_phone` AS `parent_phone`,`s`.`enrollment_date` AS `enrollment_date`,`s`.`status` AS `status`,`c`.`class_code` AS `class_code`,`c`.`class_name` AS `class_name`,`c`.`grade` AS `grade`,`c`.`school_year` AS `school_year`,`t`.`full_name` AS `homeroom_teacher_name` from (((`students` `s` join `classes` `c` on((`s`.`class_id` = `c`.`id`))) left join `teachers` `ht` on((`c`.`homeroom_teacher_id` = `ht`.`id`))) left join `users` `t` on((`ht`.`user_id` = `t`.`id`))) */
;

/*!50001 SET character_set_client      = @saved_cs_client */
;

/*!50001 SET character_set_results     = @saved_cs_results */
;

/*!50001 SET collation_connection      = @saved_col_connection */
;

--
-- Final view structure for view `teacher_details`
--
/*!50001 DROP VIEW IF EXISTS `teacher_details`*/
;

/*!50001 SET @saved_cs_client          = @@character_set_client */
;

/*!50001 SET @saved_cs_results         = @@character_set_results */
;

/*!50001 SET @saved_col_connection     = @@collation_connection */
;

/*!50001 SET character_set_client      = utf8mb4 */
;

/*!50001 SET character_set_results     = utf8mb4 */
;

/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */
;

/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `teacher_details` AS select `u`.`id` AS `user_id`,`u`.`username` AS `username`,`u`.`full_name` AS `full_name`,`u`.`email` AS `email`,`u`.`phone` AS `phone`,`u`.`gender` AS `gender`,`t`.`id` AS `teacher_id`,`t`.`teacher_code` AS `teacher_code`,`t`.`specialization` AS `specialization`,`t`.`degree` AS `degree`,`t`.`start_date` AS `start_date` from (`users` `u` join `teachers` `t` on((`u`.`id` = `t`.`user_id`))) where (`u`.`role` = 'teacher') */
;

/*!50001 SET character_set_client      = @saved_cs_client */
;

/*!50001 SET character_set_results     = @saved_cs_results */
;

/*!50001 SET collation_connection      = @saved_col_connection */
;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */
;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */
;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */
;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */
;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */
;

-- Dump completed on 2025-11-14 18:01:11