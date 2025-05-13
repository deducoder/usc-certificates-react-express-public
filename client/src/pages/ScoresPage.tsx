import { useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import AlertMessage from "../components/AlertMessage";
import EditIcon from "@mui/icons-material/Edit";

interface Student {
  STUDENT_NAME: string;
  STUDENT_PA_LAST_NAME: string;
  STUDENT_MA_LAST_NAME: string;
  SCORE_VALUE: number | null;
}

interface StudentCareer {
  CAREER_ID: number; // or string depending on your API
}

interface Career {
  CAREER_NAME: string;
}

interface Subject {
  SUBJECT_ID: number;
  SUBJECT_NAME: string;
  SUBJECT_PERIOD: Number;
}

function ScoresPage() {
  const { studentId } = useParams(); // Obtiene ID del estudiante de la URL
  const [student, setStudent] = useState<Student | null>(null); // Changed to null initially
  const [studentCareer, setStudentCareer] = useState<StudentCareer | null>(
    null
  ); // Changed to null initially
  const [career, setCareer] = useState<Career | null>(null); // Changed to null initially
  const [subjects, setSubjects] = useState<subject[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number | "">(1); // Default period is 1
  const [scores, setScores] = useState<Score[]>([]);
  const [selectedRowAdd, setSelectedRowAdd] = useState<Student | null>(null);
  // alerta
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  //editar
  const [selectedRowEdit, setSelectedRowEdit] = useState<Student | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  useEffect(() => {
    //fetching student info
    const fetchStudent = async () => {
      try {
        const studentResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/students/${studentId}`
        );        
        const studentData = await studentResponse.json();
        //console.log(studentData);
        setStudent(studentData);
      } catch (error) {
        console.error(error);
      }
    };

    //fetching student-career info
    const fetchStudentCareer = async () => {
      try {
        const studentCareerResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/students-careers/${studentId}`
        );        
        const studentCareerData = await studentCareerResponse.json();
        //console.log(studentCareerData);
        setStudentCareer(studentCareerData); 

        if (studentCareerData.CAREER_ID) {
          fetchCareer(studentCareerData.CAREER_ID); // Envía el ID de carrera
          fetchSubjects(studentCareerData.CAREER_ID);
          fetchScores(studentCareerData.STUDENT_ID);
        }
      } catch (error) {
        console.error(error);
      }
    };

    //fetching career info
    const fetchCareer = async (careerId: number) => {
      try {
        const careerResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/careers/${careerId}`
        );        
        const careerData = await careerResponse.json();
        //console.log(careerData);
        setCareer(careerData);
      } catch (error) {
        console.error(error);
      }
    };

    //fetching subjects
    const fetchSubjects = async (careerId: number) => {
      try {
        const subjectResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/subjects/career/${careerId}`
        );        
        const subjectData = await subjectResponse.json();
        //console.log(subjectData);
        setSubjects(subjectData);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchScores = async (studentId: number) => {
      try {
        const scoreResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/scores/student/${studentId}`
        );        
        const scoreData = await scoreResponse.json();

        // Asegura que scoreData es un array
        if (Array.isArray(scoreData)) {
          //console.log(scores);
          setScores(scoreData);
        } else {
          console.error("Scores data is not an array", scoreData);
          setScores([]); 
        }
      } catch (error) {
        console.error(error);
        setScores([]); 
      }
    };

    fetchStudent();
    fetchStudentCareer();
  }, [studentId]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "SUBJECT_NAME",
      headerName: "MATERIA",
      width: 500,
    },
    {
      field: "SUBJECT_PERIOD",
      headerName: "PERIODO",
      width: 120,
    },
    {
      field: "SCORE",
      headerName: "CALIFICACIÓN",
      width: 120,
      editable: true,
    },
    {
      field: "SCORE_OBSERVATION",
      headerName: "OBSERVACIÓN",
      width: 120,
      editable: true,
    },
    {
      field: "ACTIONS",
      headerName: "ACCIONES",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleScoreSubmit(params.row)}
          >
            <AddIcon></AddIcon>
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleEditRow(params.row)}
            disabled={params.row.SCORE === null}
          >
            <EditIcon></EditIcon>
          </IconButton>
        </>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  //add score
  const handleScoreSubmit = async (score: Row) => {
    try {
      const dataToSend = {
        STUDENT_ID: studentId,
        SUBJECT_ID: score.id,
        SCORE: score.SCORE,
        SCORE_OBSERVATION: score.SCORE_OBSERVATION,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/scores`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );
      

      if (!response.ok) {
        throw new Error(`Failed to add score: ${response.statusText}`);
      }

      const newScore = await response.json();

      // Display success message
      setAlertMessage("Calificación agregada correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);

      // Update scores state with the new score
      setScores((prevScores) => [
        ...prevScores,
        {
          ...newScore,
          SUBJECT_ID: score.id,
          SCORE: score.SCORE,
          SCORE_OBSERVATION: score.SCORE_OBSERVATION,
        },
      ]);
    } catch (error) {
      console.error(error);
      setAlertMessage("Error al agregar calificación");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenEditDialog(false); // Close dialog if open
    }
  };

  //edit
  const handleEditRow = (row: score) => {
    setSelectedRowEdit(row);
    setOpenEditDialog(true);
  };

  const handleEditSubmit = async (score: Score) => {
    if (!score.SCORE_ID) {
      console.error("SCORE_ID is not defined");
      return;
    }

    try {
      const dataToSend = {
        SCORE_ID: score.SCORE_ID,
        STUDENT_ID: studentId,
        SUBJECT_ID: score.id,
        SCORE: score.SCORE,
        SCORE_OBSERVATION: score.SCORE_OBSERVATION,
      };

      const url = `${import.meta.env.VITE_API_URL}/api/scores/${score.SCORE_ID}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`Failed to update score: ${response.statusText}`);
      }

      setAlertMessage("Calificación actualizada correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);

      setScores((prevScores) =>
        prevScores.map((item) =>
          item.SCORE_ID === score.SCORE_ID
            ? {
                ...item,
                SCORE: score.SCORE,
                SCORE_OBSERVATION: score.SCORE_OBSERVATION,
              }
            : item
        )
      );
    } catch (error) {
      console.error(error);
      setAlertMessage("Error al actualizar calificación");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenEditDialog(false); // Close dialog
      setSelectedRowEdit(null); // Reset selected row
    }
  };

  const handlePeriodChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedPeriod(event.target.value as number);
  };

  const filteredRows = subjects.filter(
    (subject) => subject.SUBJECT_PERIOD === selectedPeriod
  );

  const rows = filteredRows.map((subject) => {
    const score = scores.find((s) => s.SUBJECT_ID === subject.SUBJECT_ID);

    return {
      id: subject.SUBJECT_ID,
      SUBJECT_NAME: subject.SUBJECT_NAME,
      SUBJECT_PERIOD: subject.SUBJECT_PERIOD,
      SCORE: score ? score.SCORE : null,
      SCORE_OBSERVATION: score ? score.SCORE_OBSERVATION : null,
      SCORE_ID: score ? score.SCORE_ID : null,
    };
  });

  const handleAlertClose = () => setAlertOpen(false);

  return (
    <>
      <NavBar />
      <Container sx={{ padding: "2rem" }} disableGutters maxWidth={false}>
        <Paper sx={{ padding: "2rem", margin: "2rem" }}>
          <Typography variant="h6">
            {`${student?.STUDENT_NAME || "Unknown"} ${
              student?.STUDENT_PA_LAST_NAME || ""
            } ${student?.STUDENT_MA_LAST_NAME || ""}`}
          </Typography>
          <Typography variant="body1">
            {`CARRERA: ${career?.CAREER_NAME ?? "N/A"}`}
          </Typography>
          <Typography variant="body1">
            {`MATRÍCULA: ${student?.STUDENT_TUITION ?? "N/A"}`}
          </Typography>
        </Paper>
        <Paper sx={{ padding: "2rem", margin: "2rem" }}>
          <Typography variant="h6">CALIFICACIONES</Typography>
          <Typography variant="body1">
            OBSERVACIONES PERMITIDAS: TS, EQ, EX
          </Typography>
          <FormControl sx={{ mt: 4, mb: 4 }} fullWidth>
            <InputLabel id="period-select-label">CUATRIMESTRE</InputLabel>
            <Select
              labelId="period-select-label"
              label="CUATRIMESTRE"
              value={selectedPeriod}
              onChange={handlePeriodChange}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((period) => (
                <MenuItem key={period} value={period}>
                  {period}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowClassName={(params) =>
              params.row.SUBJECT_STATUS === 0 ? "inactive-row" : ""
            }
            sx={{
              border: 0,
              "& .inactive-row": {
                backgroundColor: "#f0f0f0", // Color más oscuro para inactivos
                color: "#999", // Color del texto
              },
            }}
          ></DataGrid>
        </Paper>
        <AlertMessage
          message={alertMessage}
          severity={alertSeverity}
          open={alertOpen}
          onClose={handleAlertClose}
        />
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Editar Calificación</DialogTitle>
          <DialogContent>
            {selectedRowEdit && (
              <>
                <TextField
                  margin="dense"
                  label="Calificación"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.SCORE}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      SCORE: e.target.value,
                    })
                  }
                  sx={{ minWidth: "30rem" }}
                />
                <TextField
                  margin="dense"
                  label="Observación"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.SCORE_OBSERVATION}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      SCORE_OBSERVATION: e.target.value,
                    })
                  }
                  sx={{ minWidth: "30rem" }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenEditDialog(false)}
              variant="contained"
              color="error"
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                selectedRowEdit && handleEditSubmit(selectedRowEdit)
              }
              variant="contained"
              color="primary"
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default ScoresPage;
