import { Router } from "express";
import {
  deleteStudent,
  getLastStudent,
  getStudent,
  getStudents,
  postStudent,
  putStudent,
} from "../controllers/students";

const router = Router();

router.get("/", getStudents);
router.get("/latest", getLastStudent);
router.get("/:id", getStudent);
router.post("/", postStudent);
router.put("/:id", putStudent);
router.delete("/:id", deleteStudent);

export default router;
