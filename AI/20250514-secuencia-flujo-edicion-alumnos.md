# Secuencia del Flujo de Edición de Datos de Alumnos

## Información General

- **Fecha:** 14 de Mayo de 2025
- **Autor:** Sistema de Documentación Automatizada
- **Versión:** 1.0
- **Módulo:** Gestión de Alumnos

## Descripción General

Este documento describe la secuencia detallada del flujo de edición de datos de un alumno en el sistema USC Certificates, desde la interfaz de usuario hasta la persistencia en base de datos, detallando la comunicación entre el frontend (React) y el backend (Express).

## Secuencia Detallada del Flujo

### 1. Acceso a la Página de Administración

1. **Acción del Usuario**:
   - El usuario navega a la página de administración (`AdministratePage.tsx`).
2. **Respuesta del Sistema**:
   - El componente `AdministratePage` renderiza una página con tarjetas (usando el componente `CardItem`) para las diferentes secciones administrativas.
   - Se muestra la tarjeta "ALUMNOS" con su descripción "Consulta, edita o elimina alumnos".

### 2. Acceso a la Gestión de Alumnos

3. **Acción del Usuario**:
   - El usuario hace clic en la tarjeta "ALUMNOS".
4. **Respuesta del Sistema**:
   - El sistema navega a la ruta `/administrar/alumnos` que carga el componente `StudentsPage.tsx`.
   - Se inicia la carga de la página de gestión de alumnos.

### 3. Carga de Datos de Alumnos

5. **Procesamiento en Frontend**:

   - El hook `useEffect` en `StudentsPage.tsx` se ejecuta al montar el componente.
   - La función `fetchStudents` realiza una solicitud al backend.

6. **Comunicación con el Backend**:

   - Se envía una petición GET a `${import.meta.env.VITE_API_URL}/api/students`.
   - Esta petición es manejada por la ruta GET `/api/students` definida en `server/routes/students.ts`.
   - El controlador `getStudents` del archivo `server/controllers/students.ts` procesa la solicitud.

7. **Procesamiento en el Backend**:

   - El controlador consulta la base de datos utilizando el modelo `Student`.
   - Se recuperan todos los estudiantes con información de persona asociada y estado activo/inactivo.

8. **Respuesta del Backend**:

   - El servidor responde con un array JSON que contiene los datos de todos los estudiantes.

9. **Procesamiento de la Respuesta en Frontend**:
   - La función `fetchStudents` recibe la respuesta y actualiza el estado `students` con `setStudents(data)`.
   - El componente se re-renderiza con los nuevos datos.

### 4. Visualización de la Lista de Alumnos

10. **Renderizado de la Tabla**:
    - El componente `DataGrid` de MUI muestra los datos de estudiantes en formato de tabla.
    - Cada fila representa un estudiante con sus propiedades (ID, matrícula, nombre, apellidos, etc.).
    - La columna "ACCIONES" muestra iconos para editar, eliminar o reactivar cada estudiante.
    - Las filas de estudiantes inactivos aparecen en un estilo diferente (gris claro).

### 5. Selección de Alumno para Edición

11. **Acción del Usuario**:

    - El usuario identifica al alumno que desea editar en la tabla.
    - Hace clic en el icono de edición (`<EditIcon>`) en la fila correspondiente.

12. **Respuesta del Sistema**:
    - Se ejecuta la función `handleEditRow(row)` que recibe el objeto completo de la fila seleccionada.
    - La función establece `selectedRowEdit` con los datos del estudiante seleccionado.
    - Se activa `setOpenEditDialog(true)` para mostrar el diálogo de edición.

### 6. Visualización del Diálogo de Edición

13. **Renderizado del Diálogo**:
    - Se muestra un componente `Dialog` de Material UI con título "Editar Estudiante".
    - El diálogo contiene campos de texto (`TextField`) prellenados con los datos actuales del estudiante:
      - Nombre
      - Apellido Paterno
      - Apellido Materno
      - Matrícula
    - Se muestran botones "Cancelar" y "Guardar".

### 7. Modificación de Datos

14. **Acción del Usuario**:

    - El usuario modifica uno o más campos en el formulario.
    - Cada cambio actualiza el estado `selectedRowEdit` mediante manejadores de eventos como:
      ```jsx
      onChange={(e) => setSelectedRowEdit({
        ...selectedRowEdit,
        STUDENT_NAME: e.target.value,
      })}
      ```

15. **Acción del Usuario**:
    - Después de realizar los cambios, el usuario hace clic en el botón "Guardar".

### 8. Envío de Datos Actualizados

16. **Procesamiento en Frontend**:

    - Se ejecuta la función `handleEditSubmit(selectedRowEdit)`.
    - Esta función prepara los datos a enviar, creando un objeto con los campos necesarios:
      ```javascript
      const dataToSend = {
        STUDENT_ID: updatedRow.id,
        STUDENT_NAME: updatedRow.STUDENT_NAME,
        STUDENT_PA_LAST_NAME: updatedRow.STUDENT_PA_LAST_NAME,
        STUDENT_MA_LAST_NAME: updatedRow.STUDENT_MA_LAST_NAME,
        STUDENT_TUITION: updatedRow.STUDENT_TUITION,
      };
      ```

17. **Comunicación con el Backend**:

    - Se envía una petición PUT a `${import.meta.env.VITE_API_URL}/api/students/${dataToSend.STUDENT_ID}`.
    - El cuerpo de la petición contiene el objeto `dataToSend` serializado como JSON.
    - Esta petición es manejada por la ruta PUT `/api/students/:id` definida en `server/routes/students.ts`.
    - El controlador `updateStudent` del archivo `server/controllers/students.ts` procesa la solicitud.

18. **Procesamiento en el Backend**:

    - El controlador valida los datos recibidos.
    - Busca el estudiante con el ID proporcionado.
    - Actualiza los campos correspondientes.
    - Guarda los cambios en la base de datos usando el método `save()` de Sequelize.
    - Actualiza la fecha de última modificación (`STUDENT_LAST_UPDATE`).

19. **Respuesta del Backend**:
    - El servidor responde con un objeto JSON que contiene el estudiante actualizado.
    - Se incluye un código de estado HTTP 200 (OK).

### 9. Procesamiento de la Respuesta y Actualización de la UI

20. **Procesamiento de la Respuesta en Frontend**:

    - La promesa fetch se resuelve y se procesa la respuesta.
    - Se configura una notificación de éxito:
      ```javascript
      setAlertMessage("Estudiante actualizado correctamente");
      setAlertSeverity("success");
      setAlertOpen(true);
      ```
    - Se programa una recarga de la página para mostrar los datos actualizados:
      ```javascript
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      ```
    - Se cierra el diálogo de edición: `setOpenEditDialog(false)`.
    - Se limpia el estado `selectedRowEdit`: `setSelectedRowEdit(null)`.

21. **Respuesta del Sistema**:
    - Se muestra una alerta de éxito utilizando el componente `AlertMessage`.
    - Después de un segundo, la página se recarga automáticamente.
    - La tabla de estudiantes se actualiza con los datos modificados.

### 10. Finalización

22. **Estado Final**:
    - El usuario visualiza la tabla actualizada con los cambios realizados.
    - El sistema queda listo para nuevas operaciones.

## Manejo de Errores

Durante el flujo de edición, pueden ocurrir los siguientes errores:

1. **Error de Conexión con la API**:

   - Si la comunicación con el backend falla, se captura la excepción en el bloque `catch`.
   - Se muestra una alerta de error: "Error al actualizar el estudiante".
   - Se registra el error en la consola para depuración.

2. **Error en el Servidor**:

   - Si el servidor responde con un código de error, se lanza una excepción.
   - El mensaje incluye el texto de estado de la respuesta.
   - Se muestra una alerta de error al usuario.

3. **Validación en el Frontend**:

   - Aunque no se implementa validación explícita en el código mostrado, la interfaz permite editar solo los campos específicos.
   - Los campos no editables (como ID, fechas) no están expuestos para modificación.

4. **Validación en el Backend**:
   - El controlador `updateStudent` verifica que el estudiante exista antes de actualizarlo.
   - Si el estudiante no existe, devuelve un error 404.
   - Se validan los campos recibidos antes de aplicar la actualización.

## Tecnologías Utilizadas

1. **Frontend**:

   - React (Hooks, Context API)
   - Material UI (DataGrid, Dialog, TextField, Button)
   - Fetch API para comunicación con el backend

2. **Backend**:

   - Express.js (Routing, Controllers)
   - Sequelize ORM para interacción con la base de datos
   - Modelos de datos (Student, People)

3. **Base de Datos**:
   - MySQL (según la configuración en connection.ts)

## Conclusiones

El flujo de edición de datos de alumnos implementa un patrón CRUD completo, con separación clara entre la interfaz de usuario y la lógica de negocio. La arquitectura cliente-servidor permite una comunicación eficiente mediante API REST, y la interfaz proporciona retroalimentación clara al usuario sobre el resultado de sus acciones.
