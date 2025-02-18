import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Rating,
  LinearProgress,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import DashboardCard from '../../components/dashboard/DashboardCard';
import EvaluationChart from '../../components/dashboard/EvaluationChart';
import { 
  fetchEvaluations, 
  selectAllEvaluations,
  selectEvaluationLoading 
} from '../../store/slices/evaluationSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(selectCurrentUser);
  const evaluations = useSelector(selectAllEvaluations);
  const loading = useSelector(selectEvaluationLoading);

  useEffect(() => {
    if (user) {
      dispatch(fetchEvaluations());
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const calculateStatistics = () => {
    const userEvaluations = evaluations.filter(evaluation => 
      evaluation.employee === user._id
    );

    const completedEvaluations = userEvaluations.filter(evaluation => 
      evaluation.status === 'completed'
    );

    const pendingEvaluations = userEvaluations.filter(evaluation => 
      evaluation.status === 'pending'
    );

    const averageRating = completedEvaluations.reduce((acc, evaluation) => {
      const evalAvg = evaluation.responses.reduce((sum, r) => sum + r.rating, 0) / evaluation.responses.length;
      return acc + evalAvg;
    }, 0) / (completedEvaluations.length || 1);

    const recentEvaluation = completedEvaluations.length > 0 
      ? completedEvaluations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]
      : null;

    return {
      totalEvaluations: userEvaluations.length,
      completedEvaluations: completedEvaluations.length,
      pendingEvaluations: pendingEvaluations.length,
      averageRating,
      recentEvaluation
    };
  };

  const stats = calculateStatistics();

  const getSkillBreakdown = () => {
    const completedEvaluations = evaluations.filter(evaluation => 
      evaluation.employee === user._id && evaluation.status === 'completed'
    );

    const skillRatings = {};
    completedEvaluations.forEach(evaluation => {
      evaluation.responses.forEach(response => {
        if (!skillRatings[response.questionId]) {
          skillRatings[response.questionId] = {
            total: 0,
            count: 0
          };
        }
        skillRatings[response.questionId].total += response.rating;
        skillRatings[response.questionId].count += 1;
      });
    });

    return Object.entries(skillRatings).map(([skill, data]) => ({
      skill,
      average: data.total / data.count
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user.name}
        </Typography>
        <Typography color="textSecondary">
          {user.position} • {user.department} Department
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Overall Rating"
            value={stats.averageRating.toFixed(1)}
            subtitle={
              <Rating
                value={stats.averageRating}
                readOnly
                precision={0.1}
                size="small"
              />
            }
            icon={StarIcon}
            loading={loading}
            color="primary"
            info="Your average rating across all evaluations"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Reviews"
            value={stats.totalEvaluations}
            icon={AssessmentIcon}
            loading={loading}
            color="info"
            info="Total number of evaluations received"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Completed"
            value={stats.completedEvaluations}
            icon={TrendingUpIcon}
            loading={loading}
            color="success"
            info="Number of completed evaluations"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Pending"
            value={stats.pendingEvaluations}
            icon={AssignmentIcon}
            loading={loading}
            color="warning"
            info="Number of pending evaluations"
          />
        </Grid>

        {/* Performance Chart */}
        <Grid item xs={12} md={8}>
          <EvaluationChart
            title="Performance Overview"
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

        {/* Skill Breakdown */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skill Breakdown
              </Typography>
              <Box sx={{ mt: 2 }}>
                {getSkillBreakdown().map(({ skill, average }) => (
                  <Box key={skill} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{skill}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {average.toFixed(1)}/5.0
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(average / 5) * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Evaluation */}
        {stats.recentEvaluation && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Most Recent Evaluation
                  </Typography>
                  <Chip
                    label={new Date(stats.recentEvaluation.updatedAt).toLocaleDateString()}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Overall Rating
                    </Typography>
                    <Rating
                      value={stats.recentEvaluation.responses.reduce((acc, r) => acc + r.rating, 0) / 
                        stats.recentEvaluation.responses.length}
                      readOnly
                      precision={0.1}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Feedback
                    </Typography>
                    <Typography variant="body2">
                      {stats.recentEvaluation.feedback}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

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
              onClick={() => navigate(`/reports/employee/${user._id}`)}
            >
              View Detailed Report
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployeeDashboard;
