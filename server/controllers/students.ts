import { Request, Response } from "express";
import Student from "../models/student";
import Career from "../models/career";
import db from "../database/connection";

//function to get all DB students
export const getStudents = async (req: Request, res: Response) => {
  try {
    // Consulta SQL directa para obtener estudiantes con sus carreras
    const [results] = await db.query(`
      SELECT s.*, c.CAREER_ID, c.CAREER_NAME, c.CAREER_STATUS
      FROM STUDENTS s
      LEFT JOIN STUDENTS_CAREERS sc ON s.STUDENT_ID = sc.STUDENT_ID AND sc.RELATION_STATUS = 1
      LEFT JOIN CAREERS c ON sc.CAREER_ID = c.CAREER_ID
      ORDER BY s.STUDENT_ID
    `);

    // Procesar resultados para agrupar carreras por estudiante
    const studentMap = new Map();
    
    (results as any[]).forEach(row => {
      const studentId = row.STUDENT_ID;
      
      // Si no hemos procesado este estudiante antes, inicializamos su entrada
      if (!studentMap.has(studentId)) {
        const student = {
          id: studentId,
          STUDENT_ID: studentId,
          STUDENT_TUITION: row.STUDENT_TUITION,
          STUDENT_NAME: row.STUDENT_NAME,
          STUDENT_PA_LAST_NAME: row.STUDENT_PA_LAST_NAME,
          STUDENT_MA_LAST_NAME: row.STUDENT_MA_LAST_NAME,
          STUDENT_CREATION: row.STUDENT_CREATION,
          STUDENT_LAST_UPDATE: row.STUDENT_LAST_UPDATE,
          STUDENT_STATUS: row.STUDENT_STATUS === 1,
          careers: []
        };
        studentMap.set(studentId, student);
      }
      
      // Añadir la carrera al estudiante si existe
      if (row.CAREER_ID) {
        const career = {
          CAREER_ID: row.CAREER_ID,
          CAREER_NAME: row.CAREER_NAME,
          CAREER_STATUS: row.CAREER_STATUS === 1
        };
        
        // Evitar duplicados de carrera
        const student = studentMap.get(studentId);
        const careerExists = student.careers.some((c: any) => c.CAREER_ID === career.CAREER_ID);
        
        if (!careerExists) {
          student.careers.push(career);
        }
      }
    });
    
    // Convertir el mapa a un array de estudiantes
    const students = Array.from(studentMap.values());
    
    res.json(students);
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    res.status(500).json({
      msg: "Error al obtener estudiantes",
      error: (error as Error).message
    });
  }
};

//function to get one DB student by ID
export const getStudent = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const student = await Student.findByPk(id); //searching for one student by ID
  if (student) {
    //validate if student exist
    res.json(student); //sending json with student as object
  } else {
    res.status(404).json({
      msg: `don't exist a student with id: ${id}`,
    });
  }
};

//function to get lastest student in DB
export const getLastStudent = async (req: Request, res: Response) => {
  try {
    const lastStudent = await Student.findOne({
      order: [["STUDENT_ID", "DESC"]],
    });
    if (!lastStudent) {
      res.status(404).json({ msg: "don't exist students" });
    } else {
      res.json(lastStudent.STUDENT_TUITION);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "error getting last student" });
  }
};

//function to create a new student
export const postStudent = async (req: Request, res: Response) => {
  const { body } = req; //getting body
  try {
    const student = await Student.create(body); //post data from body
    res.json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "can't create a new student",
    });
  }
};

//function to update one DB student by ID
export const putStudent = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const { body } = req; //getting body
  try {
    const student = await Student.findByPk(id);
    //validate if exist a student with the ID
    if (!student) {
      return res.status(404).json({
        msg: `don't exist a student with id: ${id}`,
      });
    } else {
      //updating student
      await student.update(body);
      res.json(student); //sending json with new student values as object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: `can't update student with id: ${id}`,
    });
  }
};

//function to delete one DB student by ID
export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const student = await Student.findByPk(id);
  //validate if exist a student with the ID
  if (!student) {
    return res.status(404).json({
      msg: `don't exist a student with id: ${id}`,
    });
  } else {
    //deleting admin (STATUS: 1=ACTIVE/0=INACTIVE)
    await student.update({ STUDENT_STATUS: 0 });
    res.json(student);
  }
};
