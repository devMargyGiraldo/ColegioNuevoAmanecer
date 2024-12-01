import { sql } from "@vercel/postgres";

export const seed = async () => {
  try {
    // Crear tablas
    await sql`
      CREATE TABLE IF NOT EXISTS Grades (
        gradeId SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        level VARCHAR(50) NOT NULL
      );`;

    await sql`CREATE TABLE IF NOT EXISTS Students (
        studentId SERIAL PRIMARY KEY,
        document VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        dateOfBirth DATE NOT NULL,
        gradeId INT NOT NULL,
        FOREIGN KEY (gradeId) REFERENCES Grades (gradeId) ON DELETE CASCADE
      );
    `;

    console.log("Seed data inserted successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
