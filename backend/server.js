const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection FAILED:', err.message);
  } else {
    console.log('✅ Database connected at:', res.rows[0].now);
  }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, fullName: user.full_name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Middleware: Verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Helper: Calculate grade
const calculateGrade = (score) => {
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'E';
};

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.full_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// CLASS MANAGEMENT ROUTES
// ============================================================================

// Get all classes
app.get('/classes', verifyToken, async (req, res) => {
  try {
    const query = `
      SELECT 
        c.*,
        l.name as level_name,
        u.full_name as class_teacher_name,
        COUNT(DISTINCT s.id) as student_count,
        COUNT(DISTINCT cs.subject_id) as subject_count
      FROM classes c
      JOIN levels l ON c.level_id = l.id
      LEFT JOIN users u ON c.class_teacher_id = u.id
      LEFT JOIN students s ON c.class_id = s.class_id
      LEFT JOIN class_subjects cs ON c.id = cs.class_id
      GROUP BY c.id, l.name, u.full_name
      ORDER BY c.year DESC, c.term DESC, l.display_order, c.name
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new class
app.post('/classes', verifyToken, async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const client = await pool.connect();
  try {
    const { name, levelId, year, term, classTeacherId, subjectIds, teacherIds } = req.body;

    await client.query('BEGIN');

    // Create class
    const classResult = await client.query(
      `INSERT INTO classes (name, level_id, year, term, class_teacher_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, levelId, year, term, classTeacherId]
    );

    const classId = classResult.rows[0].id;

    // Link subjects to class
    if (subjectIds && subjectIds.length > 0) {
      for (let i = 0; i < subjectIds.length; i++) {
        await client.query(
          `INSERT INTO class_subjects (class_id, subject_id, teacher_id)
           VALUES ($1, $2, $3)`,
          [classId, subjectIds[i], teacherIds[i] || null]
        );
      }
    }

    await client.query('COMMIT');
    res.json(classResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// ============================================================================
// SPREADSHEET ROUTES
// ============================================================================

// Get spreadsheet data
app.get('/classes/:classId/spreadsheet', verifyToken, async (req, res) => {
  try {
    const { classId } = req.params;

    // Get class info
    const classInfo = await pool.query(
      `SELECT c.*, l.name as level_name
       FROM classes c
       JOIN levels l ON c.level_id = l.id
       WHERE c.id = $1`,
      [classId]
    );

    if (classInfo.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    // Get students
    const students = await pool.query(
      `SELECT id, full_name, admission_number
       FROM students
       WHERE class_id = $1
       ORDER BY display_order, full_name`,
      [classId]
    );

    // Get subjects with teacher info
    const subjects = await pool.query(
      `SELECT cs.subject_id, s.name, s.code, cs.teacher_id, u.full_name as teacher_name
       FROM class_subjects cs
       JOIN subjects s ON cs.subject_id = s.id
       LEFT JOIN users u ON cs.teacher_id = u.id
       WHERE cs.class_id = $1
       ORDER BY s.display_order, s.name`,
      [classId]
    );

    // Get all marks
    const marks = await pool.query(
      `SELECT student_id, subject_id, score, entered_by, updated_at
       FROM marks
       WHERE class_id = $1`,
      [classId]
    );

    // Build marks matrix
    const marksMatrix = {};
    marks.rows.forEach(mark => {
      const key = `${mark.student_id}_${mark.subject_id}`;
      marksMatrix[key] = {
        score: mark.score,
        enteredBy: mark.entered_by,
        updatedAt: mark.updated_at
      };
    });

    // Check user permissions
    const userSubjects = subjects.rows
      .filter(s => s.teacher_id === req.user.id || req.user.role === 'ADMIN')
      .map(s => s.subject_id);

    res.json({
      class: classInfo.rows[0],
      students: students.rows,
      subjects: subjects.rows,
      marks: marksMatrix,
      permissions: {
        canEdit: req.user.role === 'ADMIN' || userSubjects.length > 0,
        canEditAll: req.user.role === 'ADMIN',
        editableSubjects: req.user.role === 'ADMIN' ? subjects.rows.map(s => s.subject_id) : userSubjects,
        canFinalize: req.user.role === 'ADMIN'
      }
    });
  } catch (error) {
    console.error('Get spreadsheet error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update single cell
app.put('/classes/:classId/cell', verifyToken, async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentId, subjectId, score } = req.body;

    // Check if class is finalized
    const classCheck = await pool.query(
      'SELECT is_finalized FROM classes WHERE id = $1',
      [classId]
    );

    if (classCheck.rows[0]?.is_finalized) {
      return res.status(400).json({ error: 'Class is finalized. Cannot edit marks.' });
    }

    // Check permission
    if (req.user.role !== 'ADMIN') {
      const permCheck = await pool.query(
        `SELECT teacher_id FROM class_subjects
         WHERE class_id = $1 AND subject_id = $2`,
        [classId, subjectId]
      );

      if (permCheck.rows.length === 0 || permCheck.rows[0].teacher_id !== req.user.id) {
        return res.status(403).json({ error: 'You cannot edit this subject' });
      }
    }

    // Validate score
    if (score !== null && (score < 0 || score > 100)) {
      return res.status(400).json({ error: 'Score must be between 0 and 100' });
    }

    // Update or insert mark
    const result = await pool.query(
      `INSERT INTO marks (student_id, subject_id, class_id, score, entered_by)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (student_id, subject_id, class_id)
       DO UPDATE SET score = $4, entered_by = $5, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [studentId, subjectId, classId, score, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update cell error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Bulk update marks
app.post('/classes/:classId/bulk-update', verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { classId } = req.params;
    const { marks } = req.body; // Array of { studentId, subjectId, score }

    // Check if class is finalized
    const classCheck = await client.query(
      'SELECT is_finalized FROM classes WHERE id = $1',
      [classId]
    );

    if (classCheck.rows[0]?.is_finalized) {
      return res.status(400).json({ error: 'Class is finalized. Cannot edit marks.' });
    }

    await client.query('BEGIN');

    for (const mark of marks) {
      if (mark.score !== null && mark.score !== undefined) {
        await client.query(
          `INSERT INTO marks (student_id, subject_id, class_id, score, entered_by)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (student_id, subject_id, class_id)
           DO UPDATE SET score = $4, entered_by = $5, updated_at = CURRENT_TIMESTAMP`,
          [mark.studentId, mark.subjectId, classId, mark.score, req.user.id]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ message: 'Marks updated successfully', count: marks.length });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Bulk update error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// ============================================================================
// FINALIZATION & ANALYSIS
// ============================================================================

// Finalize class
app.post('/classes/:classId/finalize', verifyToken, async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const client = await pool.connect();
  try {
    const { classId } = req.params;

    await client.query('BEGIN');

    // Check completion
    const completionCheck = await client.query(
      'SELECT completion_percentage FROM classes WHERE id = $1',
      [classId]
    );

    if (completionCheck.rows[0].completion_percentage < 100) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Cannot finalize. Not all marks entered.',
        completion: completionCheck.rows[0].completion_percentage
      });
    }

    // Delete old compiled results
    await client.query('DELETE FROM compiled_results WHERE class_id = $1', [classId]);

    // Get all students
    const students = await client.query(
      'SELECT id FROM students WHERE class_id = $1',
      [classId]
    );

    // Compile results for each student
    for (const student of students.rows) {
      // Get all marks
      const studentMarks = await client.query(
        `SELECT score, subject_id FROM marks
         WHERE student_id = $1 AND class_id = $2`,
        [student.id, classId]
      );

      if (studentMarks.rows.length === 0) continue;

      const total = studentMarks.rows.reduce((sum, m) => sum + parseFloat(m.score), 0);
      const average = total / studentMarks.rows.length;
      const grade = calculateGrade(average);

      // Insert compiled result
      const compiledResult = await client.query(
        `INSERT INTO compiled_results (student_id, class_id, total_marks, average_mark, total_subjects, grade)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [student.id, classId, total, average, studentMarks.rows.length, grade]
      );

      const compiledId = compiledResult.rows[0].id;

      // Insert subject results
      for (const mark of studentMarks.rows) {
        const subjectGrade = calculateGrade(mark.score);
        await client.query(
          `INSERT INTO subject_results (compiled_result_id, subject_id, score, grade)
           VALUES ($1, $2, $3, $4)`,
          [compiledId, mark.subject_id, mark.score, subjectGrade]
        );
      }
    }

    // Calculate rankings
    await client.query(`
      WITH ranked AS (
        SELECT id, RANK() OVER (ORDER BY average_mark DESC) as position
        FROM compiled_results WHERE class_id = $1
      )
      UPDATE compiled_results cr
      SET class_position = r.position
      FROM ranked r
      WHERE cr.id = r.id
    `, [classId]);

    // Mark class as finalized
    await client.query(
      `UPDATE classes 
       SET is_finalized = TRUE, finalized_at = CURRENT_TIMESTAMP, finalized_by = $1
       WHERE id = $2`,
      [req.user.id, classId]
    );

    await client.query('COMMIT');
    res.json({ message: 'Class finalized successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Finalize error:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// Get analytics
app.get('/classes/:classId/analytics', verifyToken, async (req, res) => {
  try {
    const { classId } = req.params;

    // Check if finalized
    const classCheck = await pool.query(
      'SELECT is_finalized FROM classes WHERE id = $1',
      [classId]
    );

    if (!classCheck.rows[0]?.is_finalized) {
      return res.status(400).json({ error: 'Class not finalized yet' });
    }

    // Get compiled results with student info
    const results = await pool.query(
      `SELECT cr.*, s.full_name, s.admission_number
       FROM compiled_results cr
       JOIN students s ON cr.student_id = s.id
       WHERE cr.class_id = $1
       ORDER BY cr.class_position`,
      [classId]
    );

    // Get subject results
    const subjectResults = await pool.query(
      `SELECT sr.*, sub.name as subject_name, sub.code
       FROM subject_results sr
       JOIN compiled_results cr ON sr.compiled_result_id = cr.id
       JOIN subjects sub ON sr.subject_id = sub.id
       WHERE cr.class_id = $1`,
      [classId]
    );

    // Calculate statistics
    const averages = results.rows.map(r => r.average_mark);
    const classAverage = averages.reduce((a, b) => a + b, 0) / averages.length;

    const gradeDistribution = results.rows.reduce((acc, r) => {
      acc[r.grade] = (acc[r.grade] || 0) + 1;
      return acc;
    }, {});

    res.json({
      students: results.rows,
      subjectResults: subjectResults.rows,
      statistics: {
        totalStudents: results.rows.length,
        classAverage: classAverage.toFixed(2),
        highest: Math.max(...averages),
        lowest: Math.min(...averages),
        gradeDistribution
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// UTILITY ROUTES
// ============================================================================

// Get levels
app.get('/levels', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM levels ORDER BY display_order');
    res.json(result.rows);
  } catch (error) {
    console.error('Get levels error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get subjects for level
app.get('/levels/:levelId/subjects', verifyToken, async (req, res) => {
  try {
    const { levelId } = req.params;
    const result = await pool.query(
      'SELECT * FROM subjects WHERE level_id = $1 ORDER BY display_order, name',
      [levelId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get teachers
app.get('/teachers', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email FROM users WHERE role = 'TEACHER' ORDER BY full_name"
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add students to class
app.post('/classes/:classId/students', verifyToken, async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const { classId } = req.params;
    const { students } = req.body; // Array of { fullName, admissionNumber, gender }

    const results = [];
    for (const student of students) {
      try {
        const result = await pool.query(
          `INSERT INTO students (full_name, admission_number, class_id, gender)
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [student.fullName, student.admissionNumber, classId, student.gender]
        );
        results.push({ success: true, student: result.rows[0] });
      } catch (err) {
        results.push({ success: false, error: err.message, student });
      }
    }

    res.json({ results });
  } catch (error) {
    console.error('Add students error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// BROADSHEET & REPORTS
// ============================================================================

// Get broadsheet (Excel-style class view)
app.get('/classes/:classId/broadsheet', verifyToken, async (req, res) => {
  try {
    const { classId } = req.params;

    // Check if finalized
    const classCheck = await pool.query(
      'SELECT is_finalized, name FROM classes WHERE id = $1',
      [classId]
    );

    if (!classCheck.rows[0]?.is_finalized) {
      return res.status(400).json({ error: 'Class must be finalized first' });
    }

    // Get all students with compiled results
    const students = await pool.query(
      `SELECT 
        cr.class_position,
        s.admission_number,
        s.full_name,
        cr.total_marks,
        cr.average_mark,
        cr.grade,
        cr.total_subjects
      FROM compiled_results cr
      JOIN students s ON cr.student_id = s.id
      WHERE cr.class_id = $1
      ORDER BY cr.class_position`,
      [classId]
    );

    // Get all subjects for this class
    const subjects = await pool.query(
      `SELECT DISTINCT sub.id, sub.name, sub.code
       FROM class_subjects cs
       JOIN subjects sub ON cs.subject_id = sub.id
       WHERE cs.class_id = $1
       ORDER BY sub.display_order, sub.name`,
      [classId]
    );

    // Get all subject results
    const subjectResults = await pool.query(
      `SELECT 
        sr.score,
        sr.grade,
        sr.subject_id,
        s.admission_number
      FROM subject_results sr
      JOIN compiled_results cr ON sr.compiled_result_id = cr.id
      JOIN students s ON cr.student_id = s.id
      WHERE cr.class_id = $1`,
      [classId]
    );

    // Build matrix
    const matrix = {};
    subjectResults.rows.forEach(sr => {
      const key = `${sr.admission_number}_${sr.subject_id}`;
      matrix[key] = {
        score: sr.score,
        grade: sr.grade
      };
    });

    res.json({
      className: classCheck.rows[0].name,
      students: students.rows,
      subjects: subjects.rows,
      subjectResults: matrix
    });

  } catch (error) {
    console.error('Broadsheet error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export broadsheet as CSV
app.get('/classes/:classId/broadsheet/export', verifyToken, async (req, res) => {
  try {
    const { classId } = req.params;

    // Get broadsheet data
    const classCheck = await pool.query(
      'SELECT name FROM classes WHERE id = $1 AND is_finalized = TRUE',
      [classId]
    );

    if (classCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Class not finalized' });
    }

    const students = await pool.query(
      `SELECT 
        cr.class_position,
        s.admission_number,
        s.full_name,
        cr.total_marks,
        cr.average_mark,
        cr.grade
      FROM compiled_results cr
      JOIN students s ON cr.student_id = s.id
      WHERE cr.class_id = $1
      ORDER BY cr.class_position`,
      [classId]
    );

    const subjects = await pool.query(
      `SELECT DISTINCT sub.id, sub.name, sub.code
       FROM class_subjects cs
       JOIN subjects sub ON cs.subject_id = sub.id
       WHERE cs.class_id = $1
       ORDER BY sub.display_order`,
      [classId]
    );

    const subjectResults = await pool.query(
      `SELECT sr.score, sr.subject_id, s.admission_number
       FROM subject_results sr
       JOIN compiled_results cr ON sr.compiled_result_id = cr.id
       JOIN students s ON cr.student_id = s.id
       WHERE cr.class_id = $1`,
      [classId]
    );

    // Build CSV
    let csv = 'Position,Admission No,Student Name,';
    csv += subjects.rows.map(s => s.name).join(',');
    csv += ',Total,Average,Grade\n';

    students.rows.forEach(student => {
      csv += `${student.class_position},${student.admission_number},"${student.full_name}",`;
      
      // Add subject scores
      subjects.rows.forEach(subject => {
        const result = subjectResults.rows.find(
          sr => sr.admission_number === student.admission_number && sr.subject_id === subject.id
        );
        csv += `${result ? result.score : ''},`;
      });
      
      csv += `${student.total_marks},${student.average_mark},${student.grade}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${classCheck.rows[0].name}_broadsheet.csv"`);
    res.send(csv);

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Generate individual student report data
app.get('/classes/:classId/students/:studentId/report', verifyToken, async (req, res) => {
  try {
    const { classId, studentId } = req.params;

    // Get student info
    const student = await pool.query(
      `SELECT s.*, c.name as class_name, c.year, c.term, l.name as level_name
       FROM students s
       JOIN classes c ON s.class_id = c.id
       JOIN levels l ON c.level_id = l.id
       WHERE s.id = $1 AND c.id = $2`,
      [studentId, classId]
    );

    if (student.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Get compiled results
    const compiled = await pool.query(
      `SELECT * FROM compiled_results
       WHERE student_id = $1 AND class_id = $2`,
      [studentId, classId]
    );

    if (compiled.rows.length === 0) {
      return res.status(400).json({ error: 'Results not compiled yet' });
    }

    // Get subject results
    const subjectResults = await pool.query(
      `SELECT sr.*, s.name as subject_name, s.code
       FROM subject_results sr
       JOIN subjects s ON sr.subject_id = s.id
       WHERE sr.compiled_result_id = $1
       ORDER BY s.display_order, s.name`,
      [compiled.rows[0].id]
    );

    res.json({
      student: student.rows[0],
      compiled: compiled.rows[0],
      subjects: subjectResults.rows
    });

  } catch (error) {
    console.error('Report data error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Bulk report generation metadata
app.get('/classes/:classId/bulk-reports', verifyToken, async (req, res) => {
  try {
    const { classId } = req.params;

    // Get all students in class with results
    const students = await pool.query(
      `SELECT s.id, s.full_name, s.admission_number, cr.class_position
       FROM students s
       JOIN compiled_results cr ON s.id = cr.student_id
       WHERE cr.class_id = $1
       ORDER BY cr.class_position`,
      [classId]
    );

    res.json({
      totalReports: students.rows.length,
      students: students.rows
    });

  } catch (error) {
    console.error('Bulk reports error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// SERVER START
// ============================================================================

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});