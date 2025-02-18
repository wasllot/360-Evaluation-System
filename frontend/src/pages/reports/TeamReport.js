import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { selectAllEmployees, selectEmployeeLoading } from '../../store/slices/employeeSlice';
import { selectAllEvaluations, selectEvaluationLoading } from '../../store/slices/evaluationSlice';


import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { fetchEmployees } from '../../store/slices/employeeSlice';
import { fetchEvaluations } from '../../store/slices/evaluationSlice';

const TeamReport = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  
  // Log user role for debugging
  console.log('Current user role:', user?.role);

  const employees = useSelector(selectAllEmployees);
  const evaluations = useSelector(selectAllEvaluations);
  const employeesLoading = useSelector(selectEmployeeLoading);
  const evaluationsLoading = useSelector(selectEvaluationLoading);


  const [teamStats, setTeamStats] = useState({
    totalEmployees: 0,
    completedEvaluations: 0,
    pendingEvaluations: 0,
    averageScores: {
      technical_skills: 0,
      soft_skills: 0,
      leadership: 0,
      productivity: 0,
    },
  });

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchEvaluations());
  }, [dispatch]);

  useEffect(() => {
    if (employees.length > 0 && evaluations.length > 0) {
      // Filter team members if user is a manager
      const teamMembers = user.role === 'manager'
        ? employees.filter(employee => employee.department === user.department)
        : employees;

      // Filter evaluations for team members
      const teamEvaluations = evaluations.filter(evaluation => 
        teamMembers.some(member => member._id === evaluation.employee._id)
      );

      // Calculate statistics
      const stats = {
        totalEmployees: teamMembers.length,
        completedEvaluations: teamEvaluations.filter(
          evaluation => evaluation.status === 'completed'
        ).length,
        pendingEvaluations: teamEvaluations.filter(
          evaluation => evaluation.status !== 'completed'
        ).length,
        averageScores: {
          technical_skills: 0,
          soft_skills: 0,
          leadership: 0,
          productivity: 0,
        },
      };

      // Calculate average scores
      const completedEvaluations = teamEvaluations.filter(
        evaluation => evaluation.status === 'completed'
      );

      if (completedEvaluations.length > 0) {
        const scores = completedEvaluations.reduce((acc, evaluation) => ({
          technical_skills: acc.technical_skills + (evaluation.scores.technical_skills || 0),
          soft_skills: acc.soft_skills + (evaluation.scores.soft_skills || 0),
          leadership: acc.leadership + (evaluation.scores.leadership || 0),
          productivity: acc.productivity + (evaluation.scores.productivity || 0),
        }), {
          technical_skills: 0,
          soft_skills: 0,
          leadership: 0,
          productivity: 0,
        });

        Object.keys(scores).forEach(key => {
          stats.averageScores[key] = scores[key] / completedEvaluations.length;
        });
      }

      setTeamStats(stats);
    }
  }, [employees, evaluations, user]);

  if (employeesLoading || evaluationsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Team Performance Report
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Team Members
                </Typography>
                <Typography variant="h4">
                  {teamStats.totalEmployees}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completed Evaluations
                </Typography>
                <Typography variant="h4">
                  {teamStats.completedEvaluations}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Evaluations
                </Typography>
                <Typography variant="h4">
                  {teamStats.pendingEvaluations}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completion Rate
                </Typography>
                <Typography variant="h4">
                  {teamStats.totalEmployees > 0
                    ? `${Math.round((teamStats.completedEvaluations / teamStats.totalEmployees) * 100)}%`
                    : '0%'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Average Performance Scores
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(teamStats.averageScores).map(([category, score]) => (
                  <TableRow key={category}>
                    <TableCell component="th" scope="row">
                      {category.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </TableCell>
                    <TableCell align="right">
                      {score.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default TeamReport;
