//importing components
import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
import AlertMessage from "../components/AlertMessage";
import PinIcon from "@mui/icons-material/Pin";
import ArticleIcon from "@mui/icons-material/Article";
import { NavLink } from "react-router-dom";

//student definition
interface student {
  id?: number;
  STUDENT_ID: number;
  STUDENT_TUITION: number;
  STUDENT_NAME: string;
  STUDENT_PA_LAST_NAME: string;
  STUDENT_MA_LAST_NAME: string;
  STUDENT_CREATION: string;
  STUDENT_LAST_UPDATE: string;
  STUDENT_STATUS: boolean;
  careers?: Career[];
}

// Definición de carrera
interface Career {
  CAREER_ID: number;
  CAREER_NAME: string;
  CAREER_STATUS: boolean;
}

function Students() {
  const [students, setStudents] = useState<student[]>([]);
  const [selectedRowEdit, setSelectedRowEdit] = useState<student | null>(null);
  const [selectedRowDel, setSelectedRowDel] = useState<student | null>(null);
  const [selectedRowActive, setSelectedRowActive] = useState<student | null>(
    null
  );
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDelDialog, setOpenDelDialog] = useState(false);
  const [openActivateDialog, setOpenActivateDialog] = useState(false);
  // alerta
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  //score
  const [selectedStuent, setSelectedStudent] = useState<student | null>(null);
  
  // Estados para carreras
  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<number | null>(null);
  const [loadingCareers, setLoadingCareers] = useState<boolean>(false);
  const [savingChanges, setSavingChanges] = useState<boolean>(false);
  const [careerChanged, setCareerChanged] = useState<boolean>(false);

  //fetching students 
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/students`);
        const data = await response.json();
        //console.log(data);
        setStudents(data);
      } catch (error) {
        console.error("error fetching students: ", error);
      }
    };
    
    const fetchCareers = async () => {
      setLoadingCareers(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/careers`);
        if (!response.ok) {
          throw new Error(`Error al obtener carreras: ${response.statusText}`);
        }
        const data = await response.json();
        setCareers(data);
      } catch (error) {
        console.error("Error en fetchCareers:", error);
        setAlertMessage(
          `Error al cargar carreras: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`
        );
        setAlertSeverity("error");
        setAlertOpen(true);
      } finally {
        setLoadingCareers(false);
      }
    };
    
    fetchStudents();
    fetchCareers();
  }, []);
  //students table
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  //columns names
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "STUDENT_TUITION", headerName: "MATRÍCULA", width: 130 },
    { field: "STUDENT_NAME", headerName: "NOMBRE/S", width: 200 },
    {
      field: "STUDENT_PA_LAST_NAME",
      headerName: "APELLIDO PATERNO",
      width: 200,
    },
    {
      field: "STUDENT_MA_LAST_NAME",
      headerName: "APELLIDO MATERNO",
      width: 200,
    },
    {
      field: "careerName",
      headerName: "CARRERA",
      width: 180,
      renderCell: (params) => {
        const studentCareers = params.row.careers || [];
        return studentCareers.length > 0
          ? studentCareers[0].CAREER_NAME
          : 'Sin asignar';
      }
    },
    {
      field: "STUDENT_CREATION",
      headerName: "CREADO",
      width: 130,
    },
    {
      field: "STUDENT_LAST_UPDATE",
      headerName: "MODIFICADO",
      width: 130,
    },
    {
      field: "STUDENT_STATUS",
      headerName: "ESTADO",
      width: 100,
      renderCell: (params) => (params.value ? "Activo" : "Inactivo"),
    },
    {
      field: "SCHOOLAR",
      headerName: "ESCOLAR",
      width: 100,
      renderCell: (params) => (
        <>
          <NavLink
            to={`/administrar/alumnos/calificaciones/${params.row.id}`} // Passing the student ID in the URL
            style={{ textDecoration: "none" }}
          >
            <IconButton
              color="warning"
              disabled={params.row.STUDENT_STATUS === 0}
            >
              <PinIcon></PinIcon>
            </IconButton>
          </NavLink>
          <NavLink
            to={`/administrar/alumnos/certificado/${params.row.id}`} // Passing the student ID in the URL
            style={{ textDecoration: "none" }}
          >
            <IconButton
              color="primary"
              disabled={params.row.STUDENT_STATUS === 0}
            >
              <ArticleIcon></ArticleIcon>
            </IconButton>
          </NavLink>
        </>
      ),
    },
    {
      field: "ACTIONS",
      headerName: "ACCIONES",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEditRow(params.row)}
            disabled={params.row.STUDENT_STATUS === 0}
          >
            <EditIcon></EditIcon>
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteRow(params.row)}
            disabled={params.row.STUDENT_STATUS === 0}
          >
            <DeleteIcon></DeleteIcon>
          </IconButton>
          <IconButton
            color="success"
            onClick={() => handleActivateRow(params.row)}
            disabled={params.row.STUDENT_STATUS === 1}
          >
            <ReplayIcon></ReplayIcon>
          </IconButton>
        </>
      ),
    },
  ];

  //rows values from students fetch
  const rows = students.map((student) => ({
    id: student.STUDENT_ID,
    STUDENT_TUITION: student.STUDENT_TUITION,
    STUDENT_NAME: student.STUDENT_NAME,
    STUDENT_PA_LAST_NAME: student.STUDENT_PA_LAST_NAME,
    STUDENT_MA_LAST_NAME: student.STUDENT_MA_LAST_NAME,
    STUDENT_CREATION: formatDate(student.STUDENT_CREATION),
    STUDENT_LAST_UPDATE: formatDate(student.STUDENT_LAST_UPDATE),
    STUDENT_STATUS: student.STUDENT_STATUS,
    careers: student.careers
  }));

  const paginationModel = { page: 0, pageSize: 10 };

  //edit
  const handleEditRow = (row: student) => {
    setSelectedRowEdit(row);
    setCareerChanged(false);
    setAlertOpen(false);

    // Establecer la carrera seleccionada si el estudiante tiene alguna
    if (row.careers && row.careers.length > 0) {
      setSelectedCareer(row.careers[0].CAREER_ID);
    } else {
      setSelectedCareer(null);
    }

    setOpenEditDialog(true);
  };

  const handleEditSubmit = async (updatedRow: student) => {
    setSavingChanges(true);
    
    try {
      // 1. Actualizar datos básicos del estudiante
      const dataToSend = {
        STUDENT_ID: updatedRow.id,
        STUDENT_NAME: updatedRow.STUDENT_NAME,
        STUDENT_PA_LAST_NAME: updatedRow.STUDENT_PA_LAST_NAME,
        STUDENT_MA_LAST_NAME: updatedRow.STUDENT_MA_LAST_NAME,
        STUDENT_TUITION: updatedRow.STUDENT_TUITION,
      };
      const url = `${import.meta.env.VITE_API_URL}/api/students/${dataToSend.STUDENT_ID}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar el estudiante: ${response.statusText}`);
      }

      // 2. Actualizar la carrera del estudiante si cambió
      if (careerChanged) {
        await updateStudentCareer(updatedRow.id);
      }

      setAlertMessage("Estudiante actualizado correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      
      // Recargar datos
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error al actualizar estudiante:", error);
      setAlertMessage(
        `Error al actualizar el estudiante: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setSavingChanges(false);
      setOpenEditDialog(false);
      setSelectedRowEdit(null);
      setSelectedCareer(null);
      setCareerChanged(false);
    }
  };

  // Función para actualizar la carrera del estudiante
  const updateStudentCareer = async (studentId: number | undefined) => {
    if (!studentId) return;
    
    try {
      // Preparar datos para la API
      const currentDate = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      const careerData: any = {
        STUDENT_ID: studentId,
        START_DATE: currentDate,
        END_DATE: currentDate // Usar la misma fecha como placeholder
      };
      
      // Solo añadir CAREER_ID si hay una carrera seleccionada
      if (selectedCareer !== null) {
        careerData.CAREER_ID = selectedCareer;
      }
      
      // Llamar a la API para actualizar/crear la relación
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/students-careers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(careerData),
      });
      
      if (!response.ok) {
        throw new Error(`Error al actualizar la carrera: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error en updateStudentCareer:", error);
      throw error; // Propagar el error para manejo en handleEditSubmit
    }
  };

  //delete
  const handleDeleteRow = (row: student) => {
    setSelectedRowDel(row);
    setOpenDelDialog(true);
  };

  const handleDeleteSubmit = async (deletedRow: student) => {
    //console.log(deletedRow.id);
    try {
      const dataToSend = {
        STUDENT_ID: deletedRow.id,
        STUDENT_STATUS: 0,
      };
      const url = `${import.meta.env.VITE_API_URL}/api/students/${dataToSend.STUDENT_ID}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // Send the new object
      });
      if (!response.ok) {
        throw new Error(`Failed to delete student: ${response.statusText}`);
      }

      const data = await response.json();
      //console.log("deleted response", data);
      // datos de la alertra
      setAlertMessage("Estudiante eliminado correctamente");
      setAlertSeverity("error");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 2000 milisegundos = 2 segundos //refresh students page
    } catch (error) {
      console.error("Error deleting student:", error);
      setAlertMessage("Error al eliminar el estudiante");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenDelDialog(false); //close dialog
      setSelectedRowDel(null); //return row value to null
    }
  };

  //activate
  const handleActivateRow = (row: student) => {
    setSelectedRowActive(row);
    setOpenActivateDialog(true);
  };

  const handleActivateSubmit = async (activatedRow: student) => {
    //console.log(activatedRow.id);
    try {
      const dataToSend = {
        STUDENT_ID: activatedRow.id,
        STUDENT_STATUS: 1,
      };
      const url = `${import.meta.env.VITE_API_URL}/api/students/${dataToSend.STUDENT_ID}`;
      //console.log("Fetching URL:", url); // Log the full URL

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend), // Send the new object
      });
      if (!response.ok) {
        throw new Error(`Failed to activate student: ${response.statusText}`);
      }

      const data = await response.json();
      //console.log("deleted response", data);
      // datos de la alertra
      setAlertMessage("Estudiante reactivado correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 2000 milisegundos = 2 segundos //refresh students page
    } catch (error) {
      console.error("Error activating student:", error);
      setAlertMessage("Error al reactivar el estudiante");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setOpenActivateDialog(false); //close dialog
      setSelectedRowActive(null); //return row value to null
    }
  };

  useEffect(() => {
    if (selectedRowEdit) {
      //console.log("Selected row edited:", selectedRowEdit);
    } else {
      //console.log("Selected row is null.");
    }
  }, [selectedRowEdit]);

  useEffect(() => {
    if (selectedRowDel) {
      //console.log("Selected row deleted:", selectedRowDel);
    } else {
      //console.log("Selected row is null.");
    }
  }, [selectedRowDel]);

  useEffect(() => {
    if (selectedRowActive) {
      //console.log("Selected row deleted:", selectedRowDel);
    } else {
      //console.log("Selected row is null.");
    }
  }, [selectedRowActive]);

  //cerrar alerta
  const handleAlertClose = () => setAlertOpen(false);

  //scores
  const handleSelectedStudent = (row: student) => {
    if (row) {
      setSelectedStudent(row);
    }
    //console.log(row.id);
  };

  return (
    <>
      <NavBar></NavBar>
      <Container sx={{ padding: "2rem" }} disableGutters maxWidth={false}>
        <Paper sx={{ padding: "2rem", margin: "2 rem" }}>
          <Typography variant="h6">ALUMNOS</Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowClassName={(params) =>
              params.row.STUDENT_STATUS === 0 ? "inactive-row" : ""
            }
            sx={{
              border: 0,
              "& .inactive-row": {
                backgroundColor: "#f0f0f0", // Color más oscuro para inactivos
                color: "#999", // Color del texto
              },
            }}
          />
        </Paper>
        <AlertMessage
          message={alertMessage}
          severity={alertSeverity}
          open={alertOpen}
          onClose={handleAlertClose}
        />
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Editar Estudiante</DialogTitle>
          <DialogContent>
            {selectedRowEdit && (
              <>
                <TextField
                  margin="dense"
                  label="Nombre"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.STUDENT_NAME}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      STUDENT_NAME: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Apellido Paterno"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.STUDENT_PA_LAST_NAME}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      STUDENT_PA_LAST_NAME: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Apellido Materno"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.STUDENT_MA_LAST_NAME}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      STUDENT_MA_LAST_NAME: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Matrícula"
                  fullWidth
                  variant="outlined"
                  value={selectedRowEdit.STUDENT_TUITION}
                  onChange={(e) =>
                    setSelectedRowEdit({
                      ...selectedRowEdit,
                      STUDENT_TUITION: Number(e.target.value),
                    })
                  }
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="career-select-label">Carrera</InputLabel>
                  <Select
                    labelId="career-select-label"
                    id="career-select"
                    value={selectedCareer || ""}
                    onChange={(e) => {
                      const newValue = e.target.value ? Number(e.target.value) : null;
                      setSelectedCareer(newValue);

                      // Verificar si la carrera ha cambiado
                      const currentCareer = selectedRowEdit?.careers?.[0]?.CAREER_ID || null;
                      setCareerChanged(newValue !== currentCareer);
                    }}
                    disabled={savingChanges}
                  >
                    <MenuItem value="">Sin carrera</MenuItem>
                    {careers.map((career) => (
                      <MenuItem key={career.CAREER_ID} value={career.CAREER_ID}>
                        {career.CAREER_NAME}
                      </MenuItem>
                    ))}
                  </Select>
                  {loadingCareers && <CircularProgress size={20} sx={{ ml: 1 }} />}
                </FormControl>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenEditDialog(false)}
              variant="contained"
              color="error"
              disabled={savingChanges}
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                selectedRowEdit && handleEditSubmit(selectedRowEdit)
              }
              variant="contained"
              color="primary"
              disabled={savingChanges}
            >
              {savingChanges ? "Guardando..." : "Guardar"}
              {savingChanges && <CircularProgress size={24} sx={{ ml: 1 }} />}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openDelDialog} onClose={() => setOpenDelDialog(false)}>
          <DialogTitle>Eliminar Estudiante</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Está seguro de que desea eliminar este estudiante?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDelDialog(false)}
              color="primary"
              variant="contained"
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                selectedRowDel && handleDeleteSubmit(selectedRowDel)
              }
              variant="contained"
              color="error"
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openActivateDialog}
          onClose={() => setOpenActivateDialog(false)}
        >
          <DialogTitle>Reactivar Estudiante</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Está seguro de que desea reactivar este estudiante?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenActivateDialog(false)}
              color="error"
              variant="contained"
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                selectedRowActive && handleActivateSubmit(selectedRowActive)
              }
              variant="contained"
              color="success"
            >
              Reactivar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default Students;
