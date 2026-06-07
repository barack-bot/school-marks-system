
-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users (Teachers and Admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'TEACHER')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Academic Levels
CREATE TABLE levels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- Classes
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level_id INTEGER NOT NULL REFERENCES levels(id),
    year INTEGER NOT NULL,
    term INTEGER NOT NULL CHECK (term BETWEEN 1 AND 3),
    class_teacher_id INTEGER REFERENCES users(id),
    
    -- Finalization
    is_finalized BOOLEAN DEFAULT FALSE,
    finalized_at TIMESTAMP,
    finalized_by INTEGER REFERENCES users(id),
    
    -- Progress tracking
    total_cells INTEGER DEFAULT 0,
    filled_cells INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, level_id, year, term)
);

-- Subjects
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    level_id INTEGER NOT NULL REFERENCES levels(id),
    display_order INTEGER DEFAULT 0,
    UNIQUE(code, level_id)
);

-- Class-Subject Mapping
CREATE TABLE class_subjects (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES users(id),
    UNIQUE(class_id, subject_id)
);

-- Students
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    class_id INTEGER NOT NULL REFERENCES classes(id),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE')),
    parent_contact VARCHAR(20),
    parent_email VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marks (The Spreadsheet Data)
CREATE TABLE marks (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id),
    class_id INTEGER NOT NULL REFERENCES classes(id),
    score DECIMAL(5,2) CHECK (score >= 0 AND score <= 100),
    entered_by INTEGER REFERENCES users(id),
    entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_id, class_id)
);

-- Compiled Results (After Finalization)
CREATE TABLE compiled_results (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id INTEGER NOT NULL REFERENCES classes(id),
    
    total_marks DECIMAL(8,2) NOT NULL,
    average_mark DECIMAL(5,2) NOT NULL,
    total_subjects INTEGER NOT NULL,
    grade VARCHAR(5),
    
    class_position INTEGER,
    stream_position INTEGER,
    
    compiled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, class_id)
);

-- Subject Results (After Finalization)
CREATE TABLE subject_results (
    id SERIAL PRIMARY KEY,
    compiled_result_id INTEGER NOT NULL REFERENCES compiled_results(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id),
    score DECIMAL(5,2) NOT NULL,
    grade VARCHAR(5),
    subject_position INTEGER,
    UNIQUE(compiled_result_id, subject_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_classes_year_term ON classes(year, term);
CREATE INDEX idx_classes_finalized ON classes(is_finalized);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_admission ON students(admission_number);
CREATE INDEX idx_marks_student_subject ON marks(student_id, subject_id);
CREATE INDEX idx_marks_class ON marks(class_id);
CREATE INDEX idx_compiled_results_class ON compiled_results(class_id);
CREATE INDEX idx_compiled_results_position ON compiled_results(class_position);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update class completion percentage
CREATE OR REPLACE FUNCTION update_class_completion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE classes
    SET 
        filled_cells = (
            SELECT COUNT(*) 
            FROM marks 
            WHERE class_id = NEW.class_id AND score IS NOT NULL
        ),
        total_cells = (
            SELECT COUNT(s.id) * COUNT(DISTINCT cs.subject_id)
            FROM students s
            CROSS JOIN class_subjects cs
            WHERE s.class_id = NEW.class_id AND cs.class_id = NEW.class_id
        ),
        completion_percentage = (
            SELECT 
                CASE 
                    WHEN COUNT(s.id) * COUNT(DISTINCT cs.subject_id) > 0 
                    THEN (COUNT(m.id)::DECIMAL / (COUNT(s.id) * COUNT(DISTINCT cs.subject_id))) * 100
                    ELSE 0 
                END
            FROM students s
            CROSS JOIN class_subjects cs
            LEFT JOIN marks m ON s.id = m.student_id AND cs.subject_id = m.subject_id AND m.class_id = NEW.class_id
            WHERE s.class_id = NEW.class_id AND cs.class_id = NEW.class_id
        )
    WHERE id = NEW.class_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_completion
AFTER INSERT OR UPDATE OR DELETE ON marks
FOR EACH ROW
EXECUTE FUNCTION update_class_completion();

-- Update timestamp on marks
CREATE OR REPLACE FUNCTION update_marks_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_marks_timestamp
BEFORE UPDATE ON marks
FOR EACH ROW
EXECUTE FUNCTION update_marks_timestamp();

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default admin and teachers
-- Password for all: "admin123"
INSERT INTO users (full_name, email, password_hash, role) VALUES
('System Administrator', 'admin@iranda.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN'),
('John Kamau', 'john@iranda.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER'),
('Grace Wanjiru', 'grace@iranda.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER'),
('Peter Ochieng', 'peter@iranda.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER'),
('Mary Akinyi', 'mary@iranda.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER');

-- Insert levels
INSERT INTO levels (name, code, display_order) VALUES
('Grade 1', 'G1', 1),
('Grade 2', 'G2', 2),
('Grade 3', 'G3', 3),
('Grade 4', 'G4', 4),
('Grade 5', 'G5', 5),
('Grade 6', 'G6', 6),
('Grade 7', 'G7', 7),
('Grade 8', 'G8', 8);

-- Insert subjects for Grade 4
INSERT INTO subjects (name, code, level_id, display_order) VALUES
('Mathematics', 'MATH', 4, 1),
('English', 'ENG', 4, 2),
('Kiswahili', 'KIS', 4, 3),
('Science', 'SCI', 4, 4),
('Social Studies', 'SST', 4, 5),
('CRE', 'CRE', 4, 6),
('Physical Education', 'PE', 4, 7);

-- Create sample class
INSERT INTO classes (name, level_id, year, term, class_teacher_id) VALUES
('Grade 4 Stream A', 4, 2025, 1, 2);

-- Link subjects to class and assign teachers
INSERT INTO class_subjects (class_id, subject_id, teacher_id) VALUES
(1, 1, 2), -- Math - John
(1, 2, 3), -- English - Grace
(1, 3, 3), -- Kiswahili - Grace
(1, 4, 4), -- Science - Peter
(1, 5, 4), -- SST - Peter
(1, 6, 5), -- CRE - Mary
(1, 7, 5); -- PE - Mary

-- Add sample students
INSERT INTO students (full_name, admission_number, class_id, gender, display_order) VALUES
('Peter Omondi Otieno', '2025001', 1, 'MALE', 1),
('Grace Akinyi Odhiambo', '2025002', 1, 'FEMALE', 2),
('David Mwangi Kariuki', '2025003', 1, 'MALE', 3),
('Sarah Wanjiru Kimani', '2025004', 1, 'FEMALE', 4),
('James Kamau Njoroge', '2025005', 1, 'MALE', 5),
('Emily Njoki Wangari', '2025006', 1, 'FEMALE', 6),
('Michael Otieno Ouma', '2025007', 1, 'MALE', 7),
('Lucy Wambui Githinji', '2025008', 1, 'FEMALE', 8),
('Daniel Kipchoge Koech', '2025009', 1, 'MALE', 9),
('Faith Chebet Ruto', '2025010', 1, 'FEMALE', 10);

-- Add some sample marks
INSERT INTO marks (student_id, subject_id, class_id, score, entered_by) VALUES
(1, 1, 1, 85.5, 2),
(1, 2, 1, 78.0, 3),
(2, 1, 1, 92.0, 2),
(2, 2, 1, 88.5, 3),
(3, 1, 1, 75.0, 2);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check setup
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Levels', COUNT(*) FROM levels
UNION ALL
SELECT 'Classes', COUNT(*) FROM classes
UNION ALL
SELECT 'Subjects', COUNT(*) FROM subjects
UNION ALL
SELECT 'Students', COUNT(*) FROM students
UNION ALL
SELECT 'Marks', COUNT(*) FROM marks;

-- View class completion
SELECT 
    c.name,
    c.completion_percentage,
    c.filled_cells,
    c.total_cells,
    c.is_finalized
FROM classes c;
