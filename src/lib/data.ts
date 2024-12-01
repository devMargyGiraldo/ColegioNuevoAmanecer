import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";

export async function fetchStudents() {
  noStore();

  try {
    const data = await sql`SELECT * FROM students`;
    const students: StudentType[] = data.rows.map((student) => ({
      studentId: student.studentid,
      document: student.document,
      name: student.name,
      dateOfBirth: new Date(student.dateofbirth).toISOString().split("T")[0],
      gradeId: student.gradeid,
    }));

    return students;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch students data.");
  }
}

export async function fetchGrades() {
  noStore();

  try {
    const data = await sql`SELECT * FROM grades`;

    const grades: GradeType[] = data.rows.map((grade) => ({
      gradeId: grade.gradeid,
      name: grade.name,
      level: grade.level,
    }));

    return grades;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch grades data.");
  }
}

export async function fetchSubjects() {
  noStore();

  try {
    const data = await sql`SELECT * FROM subjects`;
    const subjects: SubjectType[] = data.rows.map((subject) => ({
      subjectId: subject.subjectid,
      name: subject.name,
    }));

    return subjects;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch subjects data.");
  }
}

export async function fetchTeachers() {
  noStore();

  try {
    const data = await sql`SELECT * FROM teachers`;
    const teachers: TeacherType[] = data.rows.map((teacher) => ({
      teacherId: teacher.teacherid,
      document: teacher.document,
      name: teacher.name,
      dateOfBirth: new Date(teacher.dateofbirth).toISOString().split("T")[0],
      specialty: teacher.specialty,
      subjectId: teacher.subjectid,
    }));

    return teachers;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch teachers data.");
  }
}

export async function fetchPeriods() {
  noStore();

  try {
    const data =
      await sql`SELECT p.*, g.name FROM periods p LEFT JOIN grades g ON p.gradeid = g.gradeid`;
    const periods: PeriodType[] = data.rows.map((period) => ({
      periodId: period.periodid,
      periodNumber: period.periodnumber,
      gradeId: period.gradeid,
      academicYear: period.academicyear,
      description: period.description,
      gradeName: period.name,
    }));

    return periods;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch periods data.");
  }
}

export async function fetchAchievements() {
  noStore();

  try {
    const data = await sql`SELECT * FROM achievements`;
    const achievements: AchievementType[] = data.rows.map((achievement) => ({
      achievementId: achievement.achievementid,
      periodId: achievement.periodid,
      subjectId: achievement.subjectid,
      achievementDescription: achievement.achievementdescription,
    }));

    return achievements;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch achievements data.");
  }
}

export async function fetchScores() {
  noStore();

  try {
    const data = await sql`SELECT * FROM scores`;
    const scores: ScoreType[] = data.rows.map((score) => ({
      scoreId: score.scoreid,
      achievementId: score.achievementid,
      studentId: score.studentid,
      score: score.score,
      comments: score.comments,
    }));

    return scores;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch scores data.");
  }
}
