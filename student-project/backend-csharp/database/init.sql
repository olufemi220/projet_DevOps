-- init.sql
-- Database initialization script for Student Management
-- Creates the 3 databases (DEV, UAT, PRD) and seeds sample data

-- Create databases for each environment
CREATE DATABASE IF NOT EXISTS StudentManagement_Dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS StudentManagement_UAT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS StudentManagement_PRD CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ── DEV Database ──────────────────────────────────────────────────────────────
USE StudentManagement_Dev;

CREATE TABLE IF NOT EXISTS students (
    id               INT          NOT NULL AUTO_INCREMENT,
    first_name       VARCHAR(100) NOT NULL,
    last_name        VARCHAR(100) NOT NULL,
    email            VARCHAR(255) NOT NULL,
    phone            VARCHAR(20)  NOT NULL,
    enrollment_date  DATETIME     NOT NULL,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE  INDEX idx_email           (email),
            INDEX idx_enrollment_date (enrollment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample data for DEV
INSERT IGNORE INTO students (first_name, last_name, email, phone, enrollment_date) VALUES
('Alice',  'Dupont',  'alice.dupont@efrei.fr',  '0611223344', '2024-09-01'),
('Bob',    'Martin',  'bob.martin@efrei.fr',    '0622334455', '2024-09-01'),
('Clara',  'Bernard', 'clara.bernard@efrei.fr', '0633445566', '2025-01-15'),
('David',  'Leroy',   'david.leroy@efrei.fr',   '0644556677', '2025-09-01'),
('Emma',   'Moreau',  'emma.moreau@efrei.fr',   '0655667788', '2025-09-01');

-- ── UAT Database ──────────────────────────────────────────────────────────────
USE StudentManagement_UAT;

CREATE TABLE IF NOT EXISTS students (
    id               INT          NOT NULL AUTO_INCREMENT,
    first_name       VARCHAR(100) NOT NULL,
    last_name        VARCHAR(100) NOT NULL,
    email            VARCHAR(255) NOT NULL,
    phone            VARCHAR(20)  NOT NULL,
    enrollment_date  DATETIME     NOT NULL,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE  INDEX idx_email           (email),
            INDEX idx_enrollment_date (enrollment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO students (first_name, last_name, email, phone, enrollment_date) VALUES
('Alice',  'Dupont',  'alice.dupont@efrei.fr',  '0611223344', '2024-09-01'),
('Bob',    'Martin',  'bob.martin@efrei.fr',    '0622334455', '2024-09-01'),
('Clara',  'Bernard', 'clara.bernard@efrei.fr', '0633445566', '2025-01-15');

-- ── PRD Database ──────────────────────────────────────────────────────────────
USE StudentManagement_PRD;

CREATE TABLE IF NOT EXISTS students (
    id               INT          NOT NULL AUTO_INCREMENT,
    first_name       VARCHAR(100) NOT NULL,
    last_name        VARCHAR(100) NOT NULL,
    email            VARCHAR(255) NOT NULL,
    phone            VARCHAR(20)  NOT NULL,
    enrollment_date  DATETIME     NOT NULL,
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE  INDEX idx_email           (email),
            INDEX idx_enrollment_date (enrollment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO students (first_name, last_name, email, phone, enrollment_date) VALUES
('Alice',  'Dupont',  'alice.dupont@efrei.fr',  '0611223344', '2024-09-01'),
('Bob',    'Martin',  'bob.martin@efrei.fr',    '0622334455', '2024-09-01');
