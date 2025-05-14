# Check List de Implementación: Edición de Carreras de Alumnos

## Información General

- **Fecha:** 14 de Mayo de 2024
- **Versión:** 1.0
- **Módulo:** Gestión de Alumnos
- **Referencia:** Plan de Implementación Mejorado v1.1

## Instrucciones

Utilice esta lista de verificación para guiar el proceso de implementación de la funcionalidad de edición de carreras para alumnos. Marque cada elemento a medida que se complete.

## 1. Verificación del Entorno y Dependencias

- [ ] Confirmar la existencia de la ruta `/api/careers` en el backend
- [ ] Confirmar la existencia de la ruta `/api/students-careers` en el backend
- [ ] Verificar que el modelo `Student` está correctamente definido
- [ ] Verificar que el modelo `Career` está correctamente definido
- [ ] Verificar que el modelo de relación `StudentCareer` está correctamente definido
- [ ] Validar que las relaciones entre los modelos están configuradas adecuadamente
- [ ] Confirmar que el frontend puede acceder a las APIs existentes

## 2. Implementación del Backend (Endpoint Optimizado)

- [ ] Actualizar `routes/students.ts` para añadir la ruta `/api/students/:id/with-career`
- [ ] Implementar el controlador `updateStudentWithCareer` en `controllers/students.ts`
- [ ] Importar los modelos necesarios en el controlador (Student, Career, StudentCareer)
- [ ] Implementar la lógica de transacción de base de datos en el controlador
- [ ] Añadir validación para verificar que la carrera existe
- [ ] Implementar el manejo de errores adecuado en el controlador
- [ ] Crear tests unitarios para el nuevo endpoint
- [ ] Verificar el correcto funcionamiento del endpoint con herramientas como Postman
- [ ] Documentar el nuevo endpoint en la documentación de la API

## 3. Implementación del Frontend

### 3.1 Actualización de StudentsPage.tsx - Estados y Types

- [ ] Definir interfaz para el tipo Career si no existe
- [ ] Añadir estado para la lista de carreras: `const [careers, setCareers] = useState<Career[]>([])`
- [ ] Añadir estado para la carrera seleccionada: `const [selectedCareer, setSelectedCareer] = useState<Career['careerId'] | null>(null)`
- [ ] Añadir estado para indicar carga de carreras: `const [loadingCareers, setLoadingCareers] = useState<boolean>(false)`
- [ ] Añadir estado para indicar guardado de cambios: `const [savingChanges, setSavingChanges] = useState<boolean>(false)`
- [ ] Añadir estado para detectar cambios en la carrera: `const [careerChanged, setCareerChanged] = useState<boolean>(false)`

### 3.2 Actualización de StudentsPage.tsx - Funciones

- [ ] Implementar función `fetchCareers` para cargar las carreras
- [ ] Modificar `useEffect` para incluir la llamada a `fetchCareers`
- [ ] Actualizar función `handleEditRow` para inicializar la carrera seleccionada
- [ ] Implementar función `updateStudentCareer` para actualizar la carrera del estudiante
- [ ] Modificar función `handleEditSubmit` para incluir actualización de carrera
- [ ] Añadir validación para evitar envíos sin cambios en la carrera

### 3.3 Actualización de StudentsPage.tsx - UI

- [ ] Añadir columna de carrera en el DataGrid:

```typescript
{
  field: 'careerName',
  headerName: 'CARRERA',
  width: 180,
  renderCell: (params) => {
    const studentCareers = params.row.careers || [];
    return studentCareers.length > 0 ? studentCareers[0].name : 'Sin asignar';
  }
}
```

- [ ] Añadir selector de carrera en el diálogo de edición:

```typescript
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
      const currentCareer = selectedRowEdit?.careers?.[0]?.careerId || null;
      setCareerChanged(newValue !== currentCareer);
    }}
    disabled={savingChanges}
  >
    <MenuItem value="">Sin carrera</MenuItem>
    {careers.map((career) => (
      <MenuItem key={career.careerId} value={career.careerId}>
        {career.name}
      </MenuItem>
    ))}
  </Select>
  {loadingCareers && <CircularProgress size={20} sx={{ ml: 1 }} />}
</FormControl>
```

- [ ] Modificar el botón de guardado para que muestre estado de carga:

```typescript
<Button
  onClick={() => handleEditSubmit(selectedRowEdit)}
  color="primary"
  disabled={savingChanges}
>
  {savingChanges ? "Guardando..." : "Guardar"}
  {savingChanges && <CircularProgress size={24} sx={{ ml: 1 }} />}
</Button>
```

## 4. Pruebas de la Implementación

### 4.1 Pruebas del Backend

- [ ] Verificar que el endpoint responde correctamente a solicitudes válidas
- [ ] Verificar que el endpoint maneja correctamente errores de validación
- [ ] Verificar que la transacción se revierte en caso de error
- [ ] Verificar que las relaciones de carrera se actualizan correctamente

### 4.2 Pruebas del Frontend

- [ ] Verificar que la lista de carreras se carga correctamente
- [ ] Verificar que la tabla muestra correctamente la carrera de cada estudiante
- [ ] Verificar que el diálogo de edición muestra la carrera actual del estudiante
- [ ] Verificar funcionamiento del selector de carrera:
  - [ ] Selección de nueva carrera
  - [ ] Eliminación de carrera (opción "Sin carrera")
  - [ ] Mantenimiento de la misma carrera
- [ ] Verificar que el sistema detecta cuando no hay cambios en la carrera
- [ ] Verificar el manejo adecuado de errores en todas las operaciones
- [ ] Verificar que los mensajes de éxito y error se muestran correctamente
- [ ] Verificar que la interfaz responde adecuadamente durante operaciones asíncronas
- [ ] Verificar la correcta recarga de datos después de una actualización exitosa

### 4.3 Pruebas de Integración

- [ ] Probar el flujo completo desde la selección de un estudiante hasta la actualización exitosa
- [ ] Verificar que los cambios persisten después de recargar la página
- [ ] Verificar el comportamiento cuando las APIs están lentas o no disponibles
- [ ] Probar con diferentes casos de uso (asignar carrera, cambiar carrera, eliminar carrera)

## 5. Optimizaciones y Mejoras (Opcional)

- [ ] Implementar caché de carreras para mejorar rendimiento
- [ ] Añadir paginación si la lista de carreras es extensa
- [ ] Añadir filtros por carrera en la tabla de estudiantes
- [ ] Mejorar la experiencia de usuario con animaciones sutiles
- [ ] Implementar modo oscuro o temas personalizables
- [ ] Añadir histórico de cambios de carrera
- [ ] Mejorar accesibilidad de la interfaz

## 6. Documentación y Despliegue

- [ ] Actualizar documentación del frontend
- [ ] Actualizar documentación del backend
- [ ] Actualizar documentación de la API
- [ ] Crear documentación para usuarios finales
- [ ] Planificar y ejecutar el despliegue a producción
- [ ] Realizar pruebas de validación post-despliegue
- [ ] Notificar a los usuarios sobre la nueva funcionalidad

## 7. Revisión Final

- [ ] Realizar revisión de código (code review)
- [ ] Verificar que se cumplen todos los requisitos iniciales
- [ ] Confirmar que la implementación sigue las mejores prácticas de código
- [ ] Verificar que se han abordado todas las áreas de mejora identificadas en la auditoría
- [ ] Confirmar que la experiencia de usuario es satisfactoria
- [ ] Evaluar si existen oportunidades adicionales de mejora para futuras versiones

---

## Notas Adicionales:

- Documentar cualquier problema o desviación del plan original durante la implementación
- Mantener comunicación constante con el equipo sobre el progreso
- Considerar realizar pruebas con usuarios reales antes del despliegue final
