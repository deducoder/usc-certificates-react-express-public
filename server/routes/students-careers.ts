import { Router } from "express";
import {
  deleteStudentCareer,
  getStudentCareer,
  getStudentCareerByStudentId,
  getStudentsCareers,
  postStudentCareer,
  putStudentCareer,
} from "../controllers/students-careers";

const router = Router();

router.get("/", getStudentsCareers);
router.get("/student/:studentId", getStudentCareerByStudentId);
router.get("/:id", getStudentCareer);
router.post("/", postStudentCareer);
router.put("/:id", putStudentCareer);
router.delete("/:id", deleteStudentCareer);

export default router;
