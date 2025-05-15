import e, { Request, Response } from "express";
import StudentCareer from "../models/student-career";

//function to get all DB student-career relations
export const getStudentsCareers = async (req: Request, res: Response) => {
  const studentsCareers = await StudentCareer.findAll(); //searching all relations
  res.json(studentsCareers); //sending json with all relations as object
};

// function to get one DB student-career relation
export const getStudentCareer = async (req: Request, res: Response) => {
  const { id } = req.params; //gettin ID
  const studentCareer = await StudentCareer.findByPk(id); //searching for one relation by ID
  if (studentCareer) {
    //validate if relation exist
    res.json(studentCareer); //sending json with relation as object
  } else {
    res.status(404).json({
      msg: `don't exist a relation with id: ${id}`,
    });
  }
};

// function to get relation by student ID
export const getStudentCareerByStudentId = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  try {
    const studentCareer = await StudentCareer.findOne({
      where: {
        STUDENT_ID: studentId,
        RELATION_STATUS: 1 // Solo relaciones activas
      }
    });
    
    if (studentCareer) {
      res.json(studentCareer);
    } else {
      res.status(404).json({
        msg: `No existe una relación para el estudiante con id: ${studentId}`
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: `Error al buscar relación para el estudiante con id: ${studentId}`,
    });
  }
};

//function to create a new student-career relation or update existing one
export const postStudentCareer = async (req: Request, res: Response) => {
  const { body } = req; //getting body
  try {
    const existStudentCareer = await StudentCareer.findOne({
      where: {
        STUDENT_ID: body.STUDENT_ID,
        RELATION_STATUS: 1
      },
    });
    
    // Si ya existe una relación, la actualizamos
    if (existStudentCareer) {
      await existStudentCareer.update({ 
        CAREER_ID: body.CAREER_ID,
        // Mantener las fechas existentes o actualizar si se proporcionan nuevas
        START_DATE: body.START_DATE || existStudentCareer.get('START_DATE'),
        END_DATE: body.END_DATE || existStudentCareer.get('END_DATE')
      });
      
      return res.json({
        msg: "Relación estudiante-carrera actualizada correctamente",
        data: existStudentCareer
      });
    } else {
      //creating a new student-career
      const studentCareer = await StudentCareer.create(body); //post data from body
      res.json({
        msg: "Relación estudiante-carrera creada correctamente",
        data: studentCareer
      }); //sending json with user values as object
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      msg: "No se pudo crear o actualizar la relación estudiante-carrera",
      error: error.message
    });
  }
};

//function to update one DB student-career relation by ID
export const putStudentCareer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const studentCareer = await StudentCareer.findByPk(id);
    //validate if exist a relation with the ID
    if (!studentCareer) {
      return res.status(404).json({
        msg: `don't exist a relation with id: ${id}`,
      });
    } else {
      //updating relation
      await studentCareer.update(body);
      res.json(studentCareer); //sending json with new relation values as object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: `can't update relation with id: ${id}`,
    });
  }
};

//function to delete one DB student-career relation by ID
export const deleteStudentCareer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const studentCareer = await StudentCareer.findByPk(id);
  //validate if exist a relation with the ID
  if (!studentCareer) {
    return res.status(404).json({
      msg: `don't exist a relation with id: ${id}`,
    });
  } else {
    //deleting user (STATUS: 1=ACTIVE/0=INACTIVE)
    await studentCareer.update({ RELATION_STATUS: 0 });
    res.json(studentCareer);
  }
};
