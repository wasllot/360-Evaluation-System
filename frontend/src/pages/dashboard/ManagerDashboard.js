import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import DashboardCard from '../../components/dashboard/DashboardCard';
import EvaluationChart from '../../components/dashboard/EvaluationChart';
import { fetchEmployees, selectAllEmployees, selectCombinedLoading } from '../../store/slices/employeeSlice';
import { fetchEvaluations, selectAllEvaluations } from '../../store/slices/evaluationSlice';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(state => state.auth.user);
  const employees = useSelector(selectAllEmployees);
  const evaluations = useSelector(selectAllEvaluations);
  const loading = useSelector(selectCombinedLoading);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchEvaluations());
  }, [dispatch]);

  const teamEmployees = employees.filter(emp => emp.department === user.department);

  const calculateStatistics = () => {
    const teamEvaluations = evaluations.filter(evaluation => 
      teamEmployees.some(emp => emp._id === evaluation.employee)
    );

    const completedEvaluations = teamEvaluations.filter(evaluation => evaluation.status === 'completed');
    const pendingEvaluations = teamEvaluations.filter(evaluation => evaluation.status === 'pending');
    
    const averageRating = completedEvaluations.reduce((acc, evaluation) => {
      const evalAvg = evaluation.responses.reduce((sum, r) => sum + r.rating, 0) / evaluation.responses.length;
      return acc + evalAvg;
    }, 0) / (completedEvaluations.length || 1);

    return {
      totalTeamMembers: teamEmployees.length,
      totalEvaluations: teamEvaluations.length,
      completedEvaluations: completedEvaluations.length,
      pendingEvaluations: pendingEvaluations.length,
      averageRating
    };
  };

  const stats = calculateStatistics();

  const handleNewEvaluation = () => {
    navigate('/evaluations/new');
  };

  const getPendingEvaluations = () => {
    return evaluations
      .filter(evaluation => 
        evaluation.status === 'pending' &&
        teamEmployees.some(emp => emp._id === evaluation.employee)
      )
      .slice(0, 5);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{user.department} Department Dashboard</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewEvaluation}
        >
          New Evaluation
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Team Members"
            value={stats.totalTeamMembers}
            icon={PeopleIcon}
            loading={loading}
            color="primary"
            info="Total number of employees in your department"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Completed Reviews"
            value={stats.completedEvaluations}
            icon={AssessmentIcon}
            loading={loading}
            color="success"
            info="Number of completed evaluations in your department"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Pending Reviews"
            value={stats.pendingEvaluations}
            icon={AssignmentIcon}
            loading={loading}
            color="warning"
            info="Number of evaluations pending completion"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Team Average"
            value={stats.averageRating.toFixed(1)}
            subtitle="Out of 5.0"
            icon={TrendingUpIcon}
            loading={loading}
            color="info"
            info="Average rating across all completed evaluations"
          />
        </Grid>

        {/* Team Performance Chart */}
        <Grid item xs={12} md={8}>
          <EvaluationChart
            title="Team Performance by Category"
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

        {/* Pending Evaluations */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Evaluations
              </Typography>
              <List>
                {getPendingEvaluations().map((evaluation, index) => {
                  const employee = teamEmployees.find(emp => emp._id === evaluation.employee);
                  return (
                    <React.Fragment key={evaluation._id}>
                      {index > 0 && <Divider />}
                      <ListItem
                        button
                        onClick={() => navigate(`/evaluations/${evaluation._id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={employee?.name}
                          secondary={`Due: ${new Date(evaluation.dueDate).toLocaleDateString()}`}
                        />
                        <Chip
                          label="Pending"
                          color="warning"
                          size="small"
                        />
                      </ListItem>
                    </React.Fragment>
                  );
                })}
              </List>
              {getPendingEvaluations().length === 0 && (
                <Typography color="textSecondary" align="center">
                  No pending evaluations
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/evaluations')}
            >
              View All Evaluations
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/reports/team')}
            >
              Team Reports
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/reports/department/${user.department}`)}
            >
              Department Report
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManagerDashboard;
