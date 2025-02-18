import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  Container,
  Button
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import DashboardCard from '../../components/dashboard/DashboardCard';
import EvaluationChart from '../../components/dashboard/EvaluationChart';
import { fetchEmployees, selectAllEmployees, selectCombinedLoading } from '../../store/slices/employeeSlice';
import { fetchEvaluations, selectAllEvaluations } from '../../store/slices/evaluationSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const employees = useSelector(selectAllEmployees);
  const evaluations = useSelector(selectAllEvaluations);
  const loading = useSelector(selectCombinedLoading);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchEvaluations());
  }, [dispatch]);

  const calculateStatistics = () => {
    const completedEvaluations = evaluations.filter(evaluation => evaluation.status === 'completed');
    const pendingEvaluations = evaluations.filter(evaluation => evaluation.status === 'pending');
    
    const averageRating = completedEvaluations.reduce((acc, evaluation) => {
      const evalAvg = evaluation.responses.reduce((sum, r) => sum + r.rating, 0) / evaluation.responses.length;
      return acc + evalAvg;
    }, 0) / (completedEvaluations.length || 1);

    return {
      totalEmployees: employees.length,
      totalEvaluations: evaluations.length,
      completedEvaluations: completedEvaluations.length,
      pendingEvaluations: pendingEvaluations.length,
      averageRating
    };
  };

  const stats = calculateStatistics();

  const handleNewEvaluation = () => {
    navigate('/evaluations/new');
  };

  const handleNewEmployee = () => {
    navigate('/employees/new');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Panel de Administrador</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewEvaluation}
            sx={{ mr: 2 }}
          >
            Nueva Evaluación
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleNewEmployee}
          >
            Agregar Empleado
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total de Empleados"
            info="Número total de empleados en el sistema"

          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Evaluaciones Completadas"
            info="Número de evaluaciones completadas"

          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Evaluaciones Pendientes"
            info="Número de evaluaciones pendientes de completar"

          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Calificación Promedio"
            subtitle="De 5.0"
            info="Calificación promedio en todas las evaluaciones completadas"

          />
        </Grid>

        {/* Charts and Analytics */}
        <Grid item xs={12} md={8}>
          <EvaluationChart
            title="Desempeño General por Categoría"
            data={[
              { category: 'Leadership', averageRating: 4.2 },
              { category: 'Communication', averageRating: 3.8 },
              { category: 'Technical Skills', averageRating: 4.5 },
              { category: 'Teamwork', averageRating: 4.0 },
              { category: 'Initiative', averageRating: 3.9 },
              { category: 'Problem Solving', averageRating: 4.3 }
            ]}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Acciones Rápidas
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              onClick={() => navigate('/evaluations')}
            >
              Ver Todas las Evaluaciones
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              onClick={() => navigate('/employees')}
            >
              Gestionar Empleados
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              onClick={() => navigate('/reports')}
            >
              Ver Reportes
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/templates')}
            >
              Gestionar Plantillas
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
