export {};

declare global {
  type GradeType = {
    gradeId: number;
    name: string;
    level: string;
  };

  type StudentType = {
    studentId: number;
    document: string;
    name: string;
    dateOfBirth: string;
    gradeId: number;
  };
  type TeacherType = {
    teacherId: number;
    document: string;
    name: string;
    dateOfBirth: string;
    specialty: string;
    subjectId: number;
  };

  type SubjectType = {
    subjectId: number;
    name: string;
  };

  type PeriodType = {
    periodId: number;
    periodNumber: number;
    gradeId: number;
    academicYear: string;
    description: string;
    gradeName?: string;
  };

  type AchievementType = {
    achievementId: number;
    periodId: number;
    subjectId: number;
    achievementDescription: string;
  };

  type ScoreType = {
    scoreId: number;
    achievementId: number;
    studentId: number;
    score: number;
    comments: string;
  };
}
