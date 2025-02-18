import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllEmployees } from '../../store/slices/employeeSlice';
import { selectAllTemplates, fetchTemplates } from '../../store/slices/templateSlice';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Rating,
  Divider,
  Alert
} from '@mui/material';
import {
  createEvaluation,
  updateEvaluation,
  getEvaluationById,
  selectCurrentEvaluation
} from '../../store/slices/evaluationSlice';

const EvaluationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    employee: '',
    template: '',
    responses: [],
    feedback: ''
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const user = useSelector(state => state.auth.user);
  const employees = useSelector(selectAllEmployees);
  const templates = useSelector(selectAllTemplates) || [];
  const evaluation = useSelector(selectCurrentEvaluation);
  const { loading: templateLoading } = useSelector(state => state.template);

  useEffect(() => {
    dispatch(fetchTemplates());
    if (id) {
      dispatch(getEvaluationById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (evaluation?._id && id) {
      setFormData({
        employee: evaluation.employee?._id || '',
        template: evaluation.template?._id || '',
        responses: evaluation.responses || [],
        feedback: evaluation.feedback || ''
      });
      setSelectedEmployee(evaluation.employee || null);
      setSelectedTemplate(evaluation.template || null);
    }
  }, [evaluation, id]);

  const steps = [
    'Seleccionar Empleado',
    'Elegir Plantilla',
    'Proporcionar Calificaciones',
    'Agregar Retroalimentación'
  ];

  const handleEmployeeChange = (event) => {
    const employeeId = event.target.value;
    setFormData(prev => ({ ...prev, employee: employeeId }));
    setSelectedEmployee(employees.find(emp => emp._id === employeeId));
  };

  const handleTemplateChange = (event) => {
    const templateId = event.target.value;
    setFormData(prev => ({ 
      ...prev, 
      template: templateId,
      responses: [] // Reset responses when template changes
    }));
    setSelectedTemplate(templates.find(temp => temp._id === templateId));
  };

  const handleResponseChange = (questionId, field, value) => {
    setFormData(prev => {
      const responses = [...prev.responses];
      const responseIndex = responses.findIndex(r => r.questionId === questionId);
      
      if (responseIndex >= 0) {
        responses[responseIndex] = {
          ...responses[responseIndex],
          [field]: value
        };
      } else {
        responses.push({
          questionId,
          rating: field === 'rating' ? value : 0,
          comment: field === 'comment' ? value : ''
        });
      }

      return { ...prev, responses };
    });
  };

  const handleFeedbackChange = (event) => {
    setFormData(prev => ({ ...prev, feedback: event.target.value }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        return !!formData?.employee;
      case 1:
        return !!formData?.template;
      case 2:
        return selectedTemplate?.questions?.every(q => 
          formData?.responses?.some(r => r?.questionId === q?._id && r?.rating > 0)
        ) || false;
      case 3:
        return formData?.feedback?.length >= 10;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const action = id ? updateEvaluation : createEvaluation;
      const result = await dispatch(action({ id, data: formData })).unwrap();

      navigate(`/evaluations/${result._id}`);
    } catch (err) {
      setError(err.message || 'Failed to save evaluation');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Seleccionar Empleado"
              value={formData.employee}
              onChange={handleEmployeeChange}
              disabled={!!id}
            >
              {employees.map(employee => (
                <MenuItem key={employee._id} value={employee._id}>
                  {employee.firstName} {employee.lastName} - {employee.department}
                </MenuItem>
              ))}
            </TextField>
            {selectedEmployee && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Detalles del Empleado:</Typography>
                <Typography>Nombre: {selectedEmployee.firstName} {selectedEmployee.lastName}</Typography>
                <Typography>Departamento: {selectedEmployee.department}</Typography>
                <Typography>Puesto: {selectedEmployee.position}</Typography>
              </Box>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Seleccionar Plantilla de Evaluación"
              value={formData.template}
              onChange={handleTemplateChange}
              disabled={!!id}
            >
              {templateLoading ? (
                <CircularProgress />
              ) : templates?.length > 0 ? (
                templates.map(template => (
                  <MenuItem key={template._id} value={template._id}>
                    {template.name}
                  </MenuItem>
                ))
              ) : (
                <Typography>No hay plantillas disponibles</Typography>
              )}
            </TextField>
            {!templateLoading && selectedTemplate && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Detalles de la Plantilla:</Typography>
                <Typography>{selectedTemplate.description}</Typography>
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            {selectedTemplate?.questions.map(question => (
              <Paper key={question._id} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1">{question.text}</Typography>
                <Box sx={{ my: 2 }}>
                  <Rating
                    value={formData.responses.find(r => r.questionId === question._id)?.rating || 0}
                    onChange={(_, value) => handleResponseChange(question._id, 'rating', value)}
                  />
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Comentarios (Opcional)"
                  value={formData.responses.find(r => r.questionId === question._id)?.comment || ''}
                  onChange={(e) => handleResponseChange(question._id, 'comment', e.target.value)}
                />
              </Paper>
            ))}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Retroalimentación General"
              value={formData.feedback}
              onChange={handleFeedbackChange}
              helperText="Proporcione una retroalimentación detallada (mínimo 10 caracteres)"
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {id ? 'Editar Evaluación' : 'Nueva Evaluación'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStepContent()}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
        >
          Atrás
        </Button>

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!validateStep() || loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              id ? 'Actualizar Evaluación' : 'Enviar Evaluación'
            )}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!validateStep() || loading}
          >
            Siguiente
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EvaluationForm;
