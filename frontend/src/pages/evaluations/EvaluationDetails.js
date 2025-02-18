import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Button,
  Container,
  Divider,
  Chip,
  Rating
} from '@mui/material';
import CommentSection from '../../components/comments/CommentSection';

import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon
} from '@mui/icons-material';

import {
  getEvaluationById,
  selectCurrentEvaluation,
  selectEvaluationLoading,
  selectEvaluationError
} from '../../store/slices/evaluationSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';

const EvaluationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const evaluation = useSelector(selectCurrentEvaluation);
  const loading = useSelector(selectEvaluationLoading);
  const error = useSelector(selectEvaluationError);
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(getEvaluationById(id));
  }, [dispatch, id]);

  const canEdit = () => {
    if (!evaluation || !currentUser) return false;
    return (
      currentUser.role === 'admin' ||
      (currentUser.role === 'manager' && currentUser.department === evaluation.employee?.department) ||
      currentUser._id === evaluation.evaluator?._id
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!evaluation) {
    return (
      <Box sx={{ p: 3 }}>
          <Alert severity="info">Evaluación no encontrada</Alert>

      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
          <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ mb: 2 }}
            >
              Atrás
            </Button>


        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Detalles de la Evaluación
          </Typography>
          {canEdit() && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/evaluations/${id}/edit`)}
              >
                Editar Evaluación
              </Button>

          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Empleado
              </Typography>

                <Typography variant="h6">
                  {evaluation.employee?.firstName} {evaluation.employee?.lastName}
                </Typography>
                <Typography color="textSecondary">
                  {evaluation.employee?.position || 'N/A'} • {evaluation.employee?.department || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Evaluador
              </Typography>

                <Typography variant="h6">
                  {evaluation.evaluator?.firstName} {evaluation.evaluator?.lastName}
                </Typography>
                <Typography color="textSecondary">
                  {evaluation.evaluator?.position || 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Estado
              </Typography>

                <Chip
                  label={evaluation.status}
                  color={
                    evaluation.status === 'completed' ? 'success' :
                    evaluation.status === 'in_progress' ? 'warning' : 'default'
                  }
                  sx={{ mt: 1 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Fecha
                </Typography>
                <Typography>
                  {new Date(evaluation.updatedAt).toLocaleDateString()}
                </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      <Box mt={4}>
        <CommentSection evaluationId={evaluation._id} />
      </Box>

        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Respuestas
            </Typography>
            {(evaluation.responses || []).map((response, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {evaluation.template?.questions?.find(q => q._id === response.questionId)?.text || 'Pregunta'}
                </Typography>
                <Rating
                  value={response.rating}
                  readOnly
                  precision={0.5}
                  sx={{ mb: 1 }}
                />
                {response.comment && (
                  <Typography variant="body2" color="textSecondary">
                    {response.comment}
                  </Typography>
                )}
                {index < evaluation.responses.length - 1 && (
                  <Divider sx={{ mt: 2 }} />
                )}
              </Box>
            ))}
          </Paper>
        </Grid>

            {evaluation.criteria && evaluation.criteria.length > 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Criterios de Evaluación
            </Typography>

                  {evaluation.criteria.map((criterion, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1">
                        {criterion.category}: {criterion.name}
                      </Typography>
                      <Rating
                        value={criterion.score}
                        readOnly
                        precision={0.5}
                        sx={{ mb: 1 }}
                      />
                      {criterion.comment && (
                        <Typography variant="body2" color="textSecondary">
                          {criterion.comment}
                        </Typography>
                      )}
                      {index < evaluation.criteria.length - 1 && (
                        <Divider sx={{ mt: 2 }} />
                      )}
                    </Box>
                  ))}
                </Paper>
              </Grid>
            )}
            {evaluation.feedback && (
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Retroalimentación General
            </Typography>

                  <Typography>
                    {evaluation.feedback}
                  </Typography>
                </Paper>
              </Grid>
            )}

      </Grid>
    </Container>
  );
};

export default EvaluationDetails;
