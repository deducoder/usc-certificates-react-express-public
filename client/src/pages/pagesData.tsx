import { routerType } from "../types/router.types";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import AdministratePage from "./AdministratePage";
import StudentsPage from "./StudentsPage";
import AdministratorsPage from "./AdministratorsPage";
import CareersPage from "./CareersPage";
import SubjectsPage from "./SubjectsPage";
import RegStudentPage from "./RegStudentPage";
import RegAdministratorPage from "./RegAdministratorPage";
import RegCareerSubjectPage from "./RegCareerSubjectPage";
import ScoresPage from "./ScoresPage";
import CertificatePage from "./certificatePage";

const PagesData: routerType[] = [
  {
    path: "/",
    element: <RegisterPage />, //<HomePage />,
    title: "inicio",
  },
  {
    path: "registrar",
    element: <RegisterPage />,
    title: "registrar",
  },
  {
    path: "administrar",
    element: <AdministratePage />,
    title: "administrar",
  },
  {
    path: "administrar/alumnos",
    element: <StudentsPage />,
    title: "alumnos",
  },
  {
    path: "administrar/alumnos/calificaciones/:studentId",
    element: <ScoresPage />,
    title: "calificaciones",
  },
  {
    path: "administrar/alumnos/certificado/:studentId",
    element: <CertificatePage />,
    title: "certificados",
  },
  {
    path: "administrar/administrativos",
    element: <AdministratorsPage />,
    title: "administrativos",
  },
  {
    path: "administrar/carreras",
    element: <CareersPage />,
    title: "carreras",
  },
  {
    path: "administrar/materias",
    element: <SubjectsPage />,
    title: "materias",
  },
  {
    path: "/alumno",
    element: <RegStudentPage />,
    title: "alumno",
  },
  {
    path: "/administrativo",
    element: <RegAdministratorPage />,
    title: "administrativo",
  },
  {
    path: "/carrera-materia",
    element: <RegCareerSubjectPage />,
    title: "carreras",
  },
];

export default PagesData;
