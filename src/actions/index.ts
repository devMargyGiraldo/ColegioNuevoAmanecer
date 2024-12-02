"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export const createStudent = async (data: Omit<StudentType, "studentId">) => {
  const { document, name, dateOfBirth, gradeId } = data;

  try {
    const studentExists = await sql`
      SELECT EXISTS (
        SELECT studentid
        FROM students
        WHERE document = ${document}
      );
    `;

    if (studentExists.rows[0].exists) {
      return {
        error: "El estudiante ya existe",
      };
    }

    await sql`
        INSERT INTO Students (document, name, dateOfBirth, gradeId)
        VALUES (${document}, ${name}, ${dateOfBirth}, ${gradeId});
      `;

    revalidatePath("/estudiantes");
    return {
      success: "Estudiante creada exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error creando estudiante",
    };
  }
};

export const updateStudent = async (data: StudentType) => {
  const { studentId, name, gradeId } = data;

  console.log(studentId, name, gradeId);

  try {
    await sql`
        UPDATE Students
        SET name = ${name}, gradeid = ${gradeId}
        WHERE studentid = ${studentId};
      `;

    revalidatePath("/estudiantes");
    return {
      success: "Estudiante actualizado exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error actualizando estudiante",
    };
  }
};

export const deleteStudent = async (id: number) => {
  try {
    await sql`
      DELETE FROM Students
      WHERE studentid = ${id};
    `;

    revalidatePath("/estudiantes");
    return {
      success: "Estudiante eliminado exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error eliminando estudiante",
    };
  }
};

export const createTeacher = async (data: Omit<TeacherType, "teacherId">) => {
  const { document, name, dateOfBirth, specialty, subjectId } = data;

  try {
    const teacherExists = await sql`
      SELECT EXISTS (
        SELECT teacherid
        FROM teachers
        WHERE document = ${document}
      );
    `;

    if (teacherExists.rows[0].exists) {
      return {
        error: "El profesor ya existe",
      };
    }

    await sql`
        INSERT INTO Teachers (document, name, dateOfBirth, specialty, subjectId)
        VALUES (${document}, ${name}, ${dateOfBirth}, ${specialty}, ${subjectId});
      `;

    revalidatePath("/profesores");
    return {
      success: "Profesor creado exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error creando profesor",
    };
  }
};

export const updateTeacher = async (data: TeacherType) => {
  const { teacherId, name, specialty, subjectId } = data;

  console.log(teacherId, name, specialty, subjectId);

  try {
    await sql`
        UPDATE Teachers
        SET name = ${name}, specialty = ${specialty}, subjectid = ${subjectId}
        WHERE teacherid = ${teacherId};
      `;

    revalidatePath("/profesores");
    return {
      success: "Profesor actualizado exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error actualizando profesor",
    };
  }
};

export const deleteTeacher = async (id: number) => {
  try {
    await sql`
      DELETE FROM Teachers
      WHERE teacherid = ${id};
    `;

    revalidatePath("/profesores");
    return {
      success: "Profesor eliminado exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error eliminando profesor",
    };
  }
};

export const createSubject = async (data: Omit<SubjectType, "subjectId">) => {
  const { name } = data;

  try {
    const subjectExists = await sql`
      SELECT EXISTS (
        SELECT subjectid
        FROM subjects
        WHERE name = ${name}
      );
    `;

    if (subjectExists.rows[0].exists) {
      return {
        error: "La asignatura ya existe",
      };
    }

    await sql`
        INSERT INTO subjects (name)
        VALUES (${name});
      `;

    revalidatePath("/asignaturas");
    return {
      success: "Asignatura creada exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error creando asignatura",
    };
  }
};

export const updateSubject = async (data: SubjectType) => {
  const { subjectId, name } = data;

  console.log(subjectId, name);

  try {
    await sql`
        UPDATE Subjects
        SET name = ${name}
        WHERE subjectid = ${subjectId};
      `;

    revalidatePath("/asignaturas");
    return {
      success: "Asignatura actualizada exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error actualizando asignatura",
    };
  }
};

export const deleteSubject = async (id: number) => {
  try {
    await sql`
      DELETE FROM Subjects
      WHERE subjectid = ${id};
    `;

    revalidatePath("/asignaturas");
    return {
      success: "Asignatura eliminada exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error eliminando asignatura",
    };
  }
};

export const createGrade = async (data: Omit<GradeType, "gradeId">) => {
  const { name, level } = data;

  try {
    const gradeExists = await sql`
      SELECT EXISTS (
        SELECT gradeid
        FROM grades
        WHERE name = ${name}
      );
    `;

    if (gradeExists.rows[0].exists) {
      return {
        error: "El grado ya existe",
      };
    }

    await sql`
        INSERT INTO Grades (name, level)
        VALUES (${name}, ${level});
      `;

    revalidatePath("/grados");
    return {
      success: "Grado creado exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error creando grado",
    };
  }
};

export const updateGrade = async (data: GradeType) => {
  const { gradeId, name, level } = data;

  console.log(gradeId, name, level);

  try {
    await sql`
        UPDATE Grades
        SET name = ${name}, level = ${level}
        WHERE gradeid = ${gradeId};
      `;

    revalidatePath("/grados");
    return {
      success: "Grado actualizado exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error actualizando grado",
    };
  }
};

export const deleteGrade = async (id: number) => {
  try {
    await sql`
      DELETE FROM Grades
      WHERE gradeid = ${id};
    `;

    revalidatePath("/grados");
    return {
      success: "Grado eliminado exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error eliminando grado",
    };
  }
};

export const createPeriod = async (data: Omit<PeriodType, "periodId">) => {
  const { periodNumber, gradeId, academicYear, description } = data;

  try {
    const periodExists = await sql`
      SELECT EXISTS (
        SELECT periodid
        FROM periods
        WHERE periodnumber = ${periodNumber} and academicyear = ${academicYear} and gradeid = ${gradeId}
      );
    `;

    if (periodExists.rows[0].exists) {
      return {
        error: "El periodo ya existe",
      };
    }

    await sql`
        INSERT INTO Periods (periodnumber, gradeid, academicyear, description)
        VALUES (${periodNumber}, ${gradeId}, ${academicYear}, ${description});
      `;

    revalidatePath("/calificaciones");
    return {
      success: "Periodo creado exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error creando periodo",
    };
  }
};

export const updatePeriod = async (data: PeriodType) => {
  const { periodId, periodNumber, gradeId, academicYear, description } = data;

  console.log(periodId, periodNumber, gradeId, academicYear, description);

  try {
    await sql`
        UPDATE Periods
        SET periodnumber = ${periodNumber}, gradeid = ${gradeId}, academicyear = ${academicYear}, description = ${description}
        WHERE periodid = ${periodId};
      `;

    revalidatePath("/calificaciones");
    return {
      success: "Periodo actualizado exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error actualizando periodo",
    };
  }
};

export const deletePeriod = async (id: number) => {
  try {
    await sql`
      DELETE FROM Periods
      WHERE periodid = ${id};
    `;

    revalidatePath("/calificaciones");
    return {
      success: "Periodo eliminado exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error eliminando periodo",
    };
  }
};

export const createAchievement = async (
  data: Omit<AchievementType, "achievementId">,
) => {
  const { periodId, subjectId, achievementDescription } = data;

  try {
    const achievementExists = await sql`
      SELECT EXISTS (
        SELECT achievementid
        FROM achievements
        WHERE periodid = ${periodId}
      );
    `;

    if (achievementExists.rows[0].exists) {
      return {
        error: "El logro ya existe",
      };
    }

    await sql`
        INSERT INTO Achievements (periodid, subjectid, achievementdescription)
        VALUES (${periodId}, ${subjectId}, ${achievementDescription});
      `;

    revalidatePath("/logros");
    return {
      success: "Logro creado exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error creando logro",
    };
  }
};

export const updateAchievement = async (data: AchievementType) => {
  const { achievementId, periodId, subjectId, achievementDescription } = data;

  console.log(achievementId, periodId, subjectId, achievementDescription);

  try {
    await sql`
        UPDATE Achievements
        SET periodid = ${periodId}, subjectid = ${subjectId}, achievementdescription = ${achievementDescription}
        WHERE achievementid = ${achievementId};
      `;

    revalidatePath("/logros");
    return {
      success: "Logro actualizado exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error actualizando logro",
    };
  }
};

export const deleteAchievement = async (id: number) => {
  try {
    await sql`
      DELETE FROM Achievements
      WHERE achievementid = ${id};
    `;

    revalidatePath("/logros");
    return {
      success: "Logro eliminado exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error eliminando logro",
    };
  }
};

export const createScore = async (data: Omit<ScoreType, "scoreId">) => {
  const { achievementId, studentId, score, comments } = data;

  try {
    const scoreExists = await sql`
      SELECT EXISTS (
        SELECT scoreid
        FROM scores
        WHERE achievementid = ${achievementId} and studentid = ${studentId}
      );
    `;

    if (scoreExists.rows[0].exists) {
      return {
        error: "El logro ya existe",
      };
    }

    await sql`
        INSERT INTO Scores (achievementid, studentid, score, comments)
        VALUES (${achievementId}, ${studentId}, ${score}, ${comments});
      `;

    revalidatePath("/calificaciones");
    return {
      success: "Calificación creada exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error creando calificación",
    };
  }
};

export const updateScore = async (data: ScoreType) => {
  const { scoreId, achievementId, studentId, score, comments } = data;

  console.log(scoreId, achievementId, studentId, score, comments);

  try {
    await sql`
        UPDATE Scores
        SET achievementid = ${achievementId}, studentid = ${studentId}, score = ${score}, comments = ${comments}
        WHERE scoreid = ${scoreId};
      `;

    revalidatePath("/calificaciones");
    return {
      success: "Calificación actualizada exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error actualizando calificación",
    };
  }
};

export const deleteScore = async (id: number) => {
  try {
    await sql`
      DELETE FROM Scores
      WHERE scoreid = ${id};
    `;

    revalidatePath("/calificaciones");
    return {
      success: "Calificación eliminada exitosamente",
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error eliminando calificación",
    };
  }
};
