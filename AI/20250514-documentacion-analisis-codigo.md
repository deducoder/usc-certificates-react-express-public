# Documentación de Análisis de Código - USC Certificates

## Índice

1. [Introducción](#introducción)
2. [Componentes del Frontend](#componentes-del-frontend)
3. [Páginas del Frontend](#páginas-del-frontend)
4. [Utilidades del Frontend](#utilidades-del-frontend)
5. [Controladores del Backend](#controladores-del-backend)
6. [Base de Datos](#base-de-datos)
7. [Modelos del Backend](#modelos-del-backend)
8. [Rutas del Backend](#rutas-del-backend)
9. [Archivos Principales](#archivos-principales)

## Introducción

Este documento contiene un análisis detallado del código de la aplicación USC Certificates, una aplicación de gestión académica desarrollada con React en el frontend y Express con Sequelize en el backend. El análisis se enfoca en la estructura, funcionalidades y relaciones entre los diferentes componentes del sistema.

## Componentes del Frontend

### `CardItem.tsx`

- **`CardItem({ title, caption, image, alt, path })`**:
  - **Descripción**: Componente de tarjeta reutilizable que muestra una imagen, título, subtítulo y es clicable para navegar a una ruta específica.
  - **Props**:
    - `title`: Título de la tarjeta
    - `caption`: Texto descriptivo o subtítulo
    - `image`: URL de la imagen
    - `alt`: Texto alternativo para la imagen
    - `path`: Ruta de navegación al hacer clic

### `NavBar.tsx`

- **`NavBar()`**:
  - **Descripción**: Barra de navegación principal que muestra el logo, título y menú con opciones de navegación y cierre de sesión.
  - **Estados**:
    - `drawerOpen`: Controla si el menú lateral está abierto o cerrado
  - **Funciones**:
    - `toggleDrawer()`: Abre o cierra el menú lateral
    - `handleSignOut()`: Maneja el cierre de sesión borrando el token del localStorage
  - **Hooks**:
    - `useNavigate()`: Para redireccionar al usuario
    - `useLocation()`: Para obtener la ruta actual

### `Theme.tsx`

- **Descripción**: Archivo de configuración del tema de Material UI.
- **Exportaciones**:
  - `theme`: Objeto de configuración del tema que define colores primarios, secundarios, tipografía, sombras y otros estilos globales.

### `AlertMessage.tsx`

- **`AlertMessage: React.FC<AlertMessageProps>`**:
  - **Descripción**: Componente para mostrar mensajes de alerta o notificaciones.
  - **Props**:
    - `alert`: Objeto con propiedades `message` y `type` (success, error, warning, info)
    - `clearAlert`: Función para limpiar/cerrar la alerta
  - **Funcionalidad**: Muestra un mensaje de alerta con estilo según su tipo, con cierre automático y manual.

## Páginas del Frontend

### `pagesData.tsx`

- **Descripción General**: Este archivo no define funciones React (componentes de página), sino que contiene datos estáticos que definen la información de las páginas y tarjetas de navegación.
- **Exportaciones**:
  - `pagesData`: Array de objetos con información de páginas (títulos, rutas, descripciones, imágenes)
  - `cardItemsData`: Configuración para los items de tarjetas en la página principal
  - `schoolData`: Información sobre la escuela, como nombre e información de contacto

### `ScoresPage.tsx`

- **`ScoresPage()`**:
  - **Descripción**: Componente para gestionar calificaciones de estudiantes.
  - **Estados**:
    - `alert`: Estado para mostrar mensajes de error o éxito
    - `students`: Lista de estudiantes
    - `subjects`: Lista de materias
    - `scores`: Lista de calificaciones
    - `selectedStudent`, `selectedSubject`: IDs de estudiante y materia seleccionados
    - `scoreValue`: Valor de la calificación a registrar
    - `loading`: Indicador de carga
    - Varios estados para manejar formularios y diálogos
  - **Funciones**:
    - `getStudents()`: Obtiene la lista de estudiantes
    - `getSubjects()`: Obtiene la lista de materias
    - `getScores()`: Obtiene calificaciones filtradas
    - `registerScore()`: Registra una nueva calificación
    - `updateScore()`: Actualiza una calificación existente
    - `deleteScore()`: Elimina una calificación
    - Funciones auxiliares para manejo de diálogos y formularios

### `StudentsPage.tsx`

- **`StudentsPage()`**:
  - **Descripción**: Página para gestión de estudiantes.
  - **Estados**:
    - `alert`: Estado para mostrar mensajes de error o éxito
    - `students`: Lista de estudiantes
    - `careers`: Lista de carreras disponibles
    - `loading`: Indicador de carga
    - Estados para manejar diálogos y formularios
  - **Funciones**:
    - `getStudents()`: Obtiene la lista de estudiantes
    - `getCareers()`: Obtiene la lista de carreras
    - `registerStudentCareer()`: Asigna una carrera a un estudiante
    - `deleteStudentCareer()`: Desasigna una carrera de un estudiante
    - Funciones para manejar diálogos, formularios y navegación

### `SubjectsPage.tsx`

- **`Subjects()`**:
  - **Descripción**: Componente para gestionar las materias o asignaturas.
  - **Estados**:
    - `alert`: Estado para mostrar mensajes de error o éxito
    - `subjects`: Lista de materias
    - `careers`: Lista de carreras
    - Estados para manejar diálogos y formularios
  - **Funciones**:
    - `getSubjects()`: Obtiene la lista de materias
    - `getCareers()`: Obtiene la lista de carreras
    - `createSubject()`: Crea una nueva materia
    - `updateSubject()`: Actualiza una materia existente
    - `deleteSubject()`: Elimina una materia
    - Funciones para manejar diálogos y formularios

### `RegAdministratorPage.tsx`

- **`RegAdministrator()`**:
  - **Descripción**: Componente para registro de administradores.
  - **Estados**:
    - `formData`: Datos del formulario
    - `formErrors`: Errores de validación
    - `alert`: Estado para mensajes de notificación
  - **Funciones**:
    - `handleChange()`: Maneja cambios en los campos del formulario
    - `validateForm()`: Valida los datos del formulario
    - `handleSubmit()`: Procesa el envío del formulario
    - `registerAdmin()`: Envía datos al servidor para crear un administrador

### `RegCareerSubjectPage.tsx`

- **`RegCareerSubjectPage: React.FC`**:
  - **Descripción**: Página para asignar materias a carreras.
  - **Estados**:
    - `careers`: Lista de carreras
    - `subjects`: Lista de materias
    - `careerSubjects`: Relaciones entre carreras y materias
    - Múltiples estados para manejar la interfaz y operaciones
  - **Funciones**:
    - `getCareers()`: Obtiene lista de carreras
    - `getSubjects()`: Obtiene lista de materias
    - `getCareerSubjects()`: Obtiene asignaciones existentes
    - `addSubjectToCareer()`: Asigna una materia a una carrera
    - `removeSubjectFromCareer()`: Elimina una materia de una carrera

### `RegisterPage.tsx`

- **`RegisterPage()`**:
  - **Descripción**: Componente para registro de usuarios.
  - **Estados**:
    - `formData`: Datos del formulario
    - `formErrors`: Errores de validación
    - `alert`: Estado para mensajes
  - **Funciones**:
    - `handleChange()`: Actualiza el estado del formulario
    - `validateForm()`: Valida datos antes del envío
    - `handleSubmit()`: Procesa el envío del formulario
    - `registerUser()`: Envía datos al servidor para crear un usuario

### `RegStudentPage.tsx`

- **`RegStudentPage: React.FC`**:
  - **Descripción**: Página para registro de estudiantes.
  - **Estados**:
    - `formData`: Datos del formulario
    - `formErrors`: Errores de validación
    - `alert`: Estado para mensajes
  - **Funciones**:
    - `handleChange()`: Maneja cambios en inputs
    - `validateForm()`: Valida campos del formulario
    - `handleSubmit()`: Procesa envío del formulario
    - `registerStudent()`: Envía datos al servidor

### `AdministratorsPage.tsx`

- **`Administrators()`**:
  - **Descripción**: Página para gestión de administradores.
  - **Estados**:
    - `administrators`: Lista de administradores
    - `selectedAdmin`: Administrador seleccionado
    - Estados para manejar diálogos y operaciones
  - **Funciones**:
    - `getAdministrators()`: Obtiene lista de administradores
    - `deleteAdministrator()`: Elimina un administrador
    - Funciones para manejar diálogos y confirmaciones

### `CareersPage.tsx`

- **`Careers()`**:
  - **Descripción**: Página para gestión de carreras académicas.
  - **Estados**:
    - `careers`: Lista de carreras
    - `formData`: Datos del formulario
    - Estados para manejar diálogos y operaciones
  - **Funciones**:
    - `getCareers()`: Obtiene lista de carreras
    - `createCareer()`: Crea una nueva carrera
    - `updateCareer()`: Actualiza una carrera existente
    - `deleteCareer()`: Elimina una carrera
    - Funciones para manejar diálogos y formularios

### `CertificatePage.tsx`

- **`CertificatePage: React.FC`**:
  - **Descripción**: Página para generación y visualización de certificados académicos.
  - **Estados**:
    - `students`: Lista de estudiantes
    - `careers`: Lista de carreras
    - `selectedStudent`: Estudiante seleccionado
    - `selectedCareer`: Carrera seleccionada
    - `certificateData`: Datos para el certificado
    - `fields`: Campos personalizables del certificado
    - Múltiples estados para control de la interfaz
  - **Funciones**:
    - `getStudents()`: Obtiene lista de estudiantes
    - `getCareers()`: Obtiene lista de carreras
    - `getFields()`: Obtiene campos del certificado
    - `getCareerSubjects()`: Obtiene materias de una carrera
    - `getStudentScores()`: Obtiene calificaciones del estudiante
    - `generatePDF()`: Genera el PDF del certificado
    - Funciones auxiliares para cálculos y formateo

### `HomePage.tsx`

- **`HomePage()`**:
  - **Descripción**: Página principal que muestra tarjetas de navegación a las diferentes secciones.
  - **Funcionalidad**: Renderiza tarjetas clicables (CardItem) con información de las secciones disponibles.

### `AdministratePage.tsx`

- **`AdministratePage()`**:
  - **Descripción**: Página principal del área administrativa con tarjetas de navegación.
  - **Funcionalidad**: Muestra tarjetas para acceder a las diferentes secciones administrativas como gestión de estudiantes, materias, administradores, etc.

## Utilidades del Frontend

### `certificatePDF.ts`

Este archivo contiene funciones para generar certificados académicos en formato PDF utilizando la biblioteca jsPDF:

- **`generatePDFCertificate()`**: Función principal que genera el PDF del certificado académico.

  - **Parámetros**:
    - `studentData`: Información del estudiante
    - `signatureData`: Datos de las firmas
    - `schoolData`: Información de la institución
    - `subjectsData`: Materias y calificaciones
    - `fieldNames`: Campos personalizados del certificado
  - **Funcionalidad**: Crea un documento PDF con el formato de certificado académico completo

- **Funciones auxiliares**:
  - `addHeaderAndBorder()`: Añade el encabezado y borde al PDF
  - `addMainTitle()`: Añade el título principal del certificado
  - `addSchoolInfo()`: Añade información de la institución
  - `addStudentInfo()`: Añade información del estudiante
  - `addSubjectsTable()`: Crea la tabla de materias y calificaciones
  - `addCalculations()`: Añade cálculos como promedio y total de créditos
  - `addSignatureLines()`: Añade líneas para firmas
  - `addCertificateFooter()`: Añade pie de página del certificado

## Controladores del Backend

### `administrators.ts`

Este archivo define controladores para gestionar administradores en el sistema:

- **`getAdministrators`**: Controlador que obtiene todos los administradores con información de persona asociada.
- **`createAdministrator`**: Crea un nuevo administrador con información de persona.
- **`deleteAdministrator`**: Elimina un administrador por su ID.

### `careers.ts`

Este archivo define los controladores para la entidad "Career" (carreras):

- **`getCareers`**: Obtiene todas las carreras.
- **`createCareer`**: Crea una nueva carrera.
- **`updateCareer`**: Actualiza una carrera existente.
- **`deleteCareer`**: Elimina una carrera por su ID.
- **`getCareerWithSubjects`**: Obtiene una carrera con sus materias asociadas.
- **`addSubjectToCareer`**: Añade una materia a una carrera.
- **`removeSubjectFromCareer`**: Elimina una materia de una carrera.

### `certificate-fields.ts`

Este archivo contiene los controladores para la entidad "CertificateFields" (campos de certificado):

- **`getFields`**: Obtiene todos los campos de certificado.
- **`updateField`**: Actualiza el valor de un campo de certificado.

### `people.ts`

Este archivo define los controladores para la entidad "People", que representa a las personas en el sistema:

- **`getPeople`**: Obtiene todas las personas.
- **`createPerson`**: Crea una nueva persona.
- **`updatePerson`**: Actualiza una persona existente.
- **`deletePerson`**: Elimina una persona por su ID.

### `scores.ts`

Este archivo maneja los controladores para la entidad "Score" (calificaciones):

- **`getScores`**: Obtiene calificaciones con filtros opcionales.
- **`getStudentScores`**: Obtiene calificaciones de un estudiante específico.
- **`createScore`**: Crea una nueva calificación.
- **`updateScore`**: Actualiza una calificación existente.
- **`deleteScore`**: Elimina una calificación por su ID.

### `students-careers.ts`

Este archivo define los controladores para la entidad de unión "StudentCareer" (relación entre estudiantes y carreras):

- **`getStudentCareers`**: Obtiene relaciones entre estudiantes y carreras.
- **`registerStudentCareer`**: Registra a un estudiante en una carrera.
- **`deleteStudentCareer`**: Elimina la relación entre un estudiante y una carrera.

### `students.ts`

Este archivo define los controladores para la entidad "Student" (estudiantes):

- **`getStudents`**: Obtiene todos los estudiantes con sus personas y carreras asociadas.
- **`getStudentByCode`**: Busca un estudiante por su código.
- **`createStudent`**: Crea un nuevo estudiante.
- **`updateStudent`**: Actualiza un estudiante existente.
- **`deleteStudent`**: Elimina un estudiante por su ID.

### `subjects.ts`

Este archivo contiene los controladores para la entidad "Subject" (materias o asignaturas):

- **`getSubjects`**: Obtiene todas las materias.
- **`createSubject`**: Crea una nueva materia.
- **`updateSubject`**: Actualiza una materia existente.
- **`deleteSubject`**: Elimina una materia por su ID.
- **`getSubjectsByCareer`**: Obtiene materias asociadas a una carrera específica.

### `users.ts`

Este archivo define los controladores para la entidad "User" (usuarios):

- **`login`**: Maneja la autenticación de usuarios.
- **`createUser`**: Crea un nuevo usuario.
- **`getUsers`**: Obtiene todos los usuarios.
- **`updateUser`**: Actualiza un usuario existente.
- **`deleteUser`**: Elimina un usuario por su ID.

## Base de Datos

### `connection.ts`

- **Descripción General**: Este archivo es responsable de configurar y exportar la instancia de Sequelize que establece la conexión con la base de datos.
- **Variables de Entorno**:
  - Utiliza variables de entorno para la configuración de la conexión
- **Configuración**:
  - Establece conexión a base de datos MySQL
  - Define opciones como el dialecto, host, puerto, nombre de la BD
  - Maneja autenticación con usuario y contraseña
- **Exportaciones**:
  - `sequelize`: Instancia principal de Sequelize para usar en toda la aplicación
  - `Op`: Operadores de Sequelize para consultas complejas

## Modelos del Backend

### `admin.ts`

Este archivo define el modelo de Sequelize para la entidad "Administrator".

- **Importaciones**: `Model`, `DataTypes`, conexión a BD
- **Interfaz `AdminAttributes`**: Define la estructura de datos del administrador
- **Interfaz `AdminCreationAttributes`**: Define los atributos necesarios para crear un administrador
- **Clase `Admin`**: Extiende `Model` e implementa las interfaces
- **Método `initModel`**: Inicializa y configura el modelo con sus campos
- **Campos del modelo**: `adminId` (PK), `peopleId` (FK)
- **Asociaciones**: Este modelo se asocia con el modelo `People`

### `career.ts`

Este archivo define el modelo de Sequelize para la entidad "Career" (carreras académicas).

- **Interfaz `CareerAttributes`**: Define la estructura con `careerId`, `name`, etc.
- **Clase `Career`**: Extiende `Model` e implementa las interfaces
- **Campos del modelo**: `careerId` (PK), `name`, `description`
- **Asociaciones**: Con `Student` y `Subject` a través de tablas intermedias

### `certificate-field.ts`

Este archivo define el modelo de Sequelize para la entidad "CertificateField".

- **Interfaz `CertificateFieldAttributes`**: Define estructura con `fieldId`, `name`, `value`
- **Clase `CertificateField`**: Extiende `Model`
- **Campos del modelo**: `fieldId` (PK), `name`, `value`

### `people.ts`

Este archivo define el modelo de Sequelize para la entidad "People", que almacena información personal.

- **Interfaz `PeopleAttributes`**: Define campos como `peopleId`, `firstName`, `lastName`, etc.
- **Clase `People`**: Extiende `Model`
- **Campos del modelo**: `peopleId` (PK), datos personales como nombres, apellidos, dirección, teléfono, etc.
- **Asociaciones**: Con `Admin`, `Student` y `User`

### `score.ts`

Este archivo define el modelo de Sequelize para la entidad "Score" (calificaciones).

- **Interfaz `ScoreAttributes`**: Define estructura con `scoreId`, `studentId`, `subjectId`, `score`
- **Clase `Score`**: Extiende `Model`
- **Campos del modelo**: `scoreId` (PK), `studentId` (FK), `subjectId` (FK), `score` (calificación)
- **Asociaciones**: Con `Student` y `Subject`

### `student-career.ts`

Este archivo define el modelo de Sequelize para la tabla de unión "StudentCareer".

- **Interfaz `StudentCareerAttributes`**: Define estructura con `studentId`, `careerId`
- **Clase `StudentCareer`**: Extiende `Model`
- **Campos del modelo**: `studentId` (PK/FK), `careerId` (PK/FK)
- **Asociaciones**: Representa relación muchos a muchos entre `Student` y `Career`

### `student.ts`

Este archivo define el modelo de Sequelize para la entidad "Student" (estudiantes).

- **Interfaz `StudentAttributes`**: Define estructura con `studentId`, `peopleId`, `studentCode`, etc.
- **Clase `Student`**: Extiende `Model`
- **Campos del modelo**: `studentId` (PK), `peopleId` (FK), `studentCode`, etc.
- **Asociaciones**: Con `People`, `Career` (mediante `StudentCareer`) y `Score`

### `subjects.ts`

Este archivo define el modelo de Sequelize para la entidad "Subject" (materias o asignaturas).

- **Interfaz `SubjectAttributes`**: Define estructura con `subjectId`, `name`, `credits`, etc.
- **Clase `Subject`**: Extiende `Model`
- **Campos del modelo**: `subjectId` (PK), `name`, `credits`, etc.
- **Asociaciones**: Con `Career` (mediante tabla de unión) y `Score`

### `user.ts`

Este archivo define el modelo de Sequelize para la entidad "User" (usuarios).

- **Interfaz `UserAttributes`**: Define estructura con `userId`, `peopleId`, `username`, etc.
- **Clase `User`**: Extiende `Model`
- **Campos del modelo**: `userId` (PK), `peopleId` (FK), `username`, `password`, `role`
- **Asociaciones**: Con `People`
- **Hooks**: Para encriptar la contraseña antes de guardar

## Rutas del Backend

### `administrators.ts` (routes)

Este archivo define las rutas de la API para la entidad "Administrator":

- **`GET /api/administrators`**: Obtiene todos los administradores
- **`POST /api/administrators`**: Crea un nuevo administrador
- **`DELETE /api/administrators/:id`**: Elimina un administrador por ID

### `careers.ts` (routes)

Este archivo define las rutas de la API para la entidad "Career":

- **`GET /api/careers`**: Obtiene todas las carreras
- **`POST /api/careers`**: Crea una nueva carrera
- **`PUT /api/careers/:id`**: Actualiza una carrera existente
- **`DELETE /api/careers/:id`**: Elimina una carrera por ID
- **`GET /api/careers/:id/subjects`**: Obtiene materias de una carrera
- **`POST /api/careers/:careerId/subjects/:subjectId`**: Añade materia a carrera
- **`DELETE /api/careers/:careerId/subjects/:subjectId`**: Elimina materia de carrera

### `certificate-fields.ts` (routes)

Este archivo define las rutas de la API para la entidad "CertificateField":

- **`GET /api/certificate-fields`**: Obtiene todos los campos de certificado
- **`PUT /api/certificate-fields/:id`**: Actualiza un campo de certificado

### `people.ts` (routes)

Este archivo define las rutas de la API para la entidad "People":

- **`GET /api/people`**: Obtiene todas las personas
- **`POST /api/people`**: Crea una nueva persona
- **`PUT /api/people/:id`**: Actualiza una persona existente
- **`DELETE /api/people/:id`**: Elimina una persona por ID

### `scores.ts` (routes)

Este archivo define las rutas de la API para la entidad "Score":

- **`GET /api/scores`**: Obtiene calificaciones con filtros opcionales
- **`GET /api/scores/student/:studentId`**: Obtiene calificaciones de un estudiante
- **`POST /api/scores`**: Crea una nueva calificación
- **`PUT /api/scores/:id`**: Actualiza una calificación existente
- **`DELETE /api/scores/:id`**: Elimina una calificación por ID

### `students-careers.ts` (routes)

Este archivo define las rutas de la API para la relación "StudentCareer":

- **`GET /api/students-careers`**: Obtiene relaciones estudiante-carrera
- **`POST /api/students-careers`**: Registra un estudiante en una carrera
- **`DELETE /api/students-careers/:studentId/:careerId`**: Elimina relación

### `students.ts` (routes)

Este archivo define las rutas de la API para la entidad "Student":

- **`GET /api/students`**: Obtiene todos los estudiantes
- **`GET /api/students/code/:code`**: Busca un estudiante por código
- **`POST /api/students`**: Crea un nuevo estudiante
- **`PUT /api/students/:id`**: Actualiza un estudiante existente
- **`DELETE /api/students/:id`**: Elimina un estudiante por ID

### `subjects.ts` (routes)

Este archivo define las rutas de la API para la entidad "Subject":

- **`GET /api/subjects`**: Obtiene todas las materias
- **`POST /api/subjects`**: Crea una nueva materia
- **`PUT /api/subjects/:id`**: Actualiza una materia existente
- **`DELETE /api/subjects/:id`**: Elimina una materia por ID
- **`GET /api/subjects/career/:careerId`**: Obtiene materias de una carrera

### `users.ts` (routes)

Este archivo define las rutas de la API para la entidad "User":

- **`POST /api/users/login`**: Autentica usuario y genera token
- **`POST /api/users`**: Crea un nuevo usuario
- **`GET /api/users`**: Obtiene todos los usuarios
- **`PUT /api/users/:id`**: Actualiza un usuario existente
- **`DELETE /api/users/:id`**: Elimina un usuario por ID

## Archivos Principales

### `client/src/App.tsx`

Este archivo define el componente principal de la aplicación React, usualmente el punto de entrada de la interfaz de usuario:

- **`App()`**: Componente principal que configura:
  - **Rutas**: Utiliza React Router para definir todas las rutas de la aplicación
  - **Contexto**: Provee el contexto de autenticación a toda la aplicación
  - **Tema**: Aplica el tema de Material UI
  - **Estructura**: Define el layout general con NavBar y rutas anidadas
- **Sistema de Rutas**:
  - Rutas públicas: Login, registro
  - Rutas protegidas: Requieren autenticación
  - Rutas por rol: Algunas rutas solo accesibles para administradores

### `client/src/main.tsx`

Este archivo es el punto de entrada principal para la aplicación React en el navegador:

- **Funcionalidad principal**:
  - Renderiza el componente `App` dentro de un `BrowserRouter`
  - Monta la aplicación en el elemento DOM con id "root"
- **Configuración**:
  - Modo estricto de React para desarrollo
  - Configuración del router

### `server/app.ts`

Este archivo parece ser el punto de entrada principal para iniciar el servidor backend:

- **Funcionalidad principal**:
  - Importa la clase `Server`
  - Crea una instancia del servidor
  - Inicia el servidor
- **Manejo de errores**: Captura errores durante el inicio del servidor

### `server/server.ts`

Este archivo define la clase `Server`, que encapsula la lógica para configurar y ejecutar el servidor Express:

- **Clase `Server`**:
  - **Constructor**: Inicializa la aplicación Express, configura el puerto
  - **Métodos**:
    - `connectDB()`: Establece conexión con la base de datos
    - `middlewares()`: Configura middlewares comunes (cors, json, etc.)
    - `routes()`: Configura las rutas de la API
    - `syncModels()`: Sincroniza modelos con la base de datos
    - `listen()`: Inicia el servidor en el puerto especificado
- **Rutas**: Importa y configura todas las rutas de la API
- **Middlewares**:
  - CORS para permitir peticiones de otros dominios
  - Parseo de JSON
  - Servir archivos estáticos
