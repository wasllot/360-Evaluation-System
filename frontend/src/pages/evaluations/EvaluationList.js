import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon
} from '@mui/icons-material';

import {
  fetchEvaluations,
  selectAllEvaluations,
  selectEvaluationLoading,
  selectEvaluationError
} from '../../store/slices/evaluationSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';

const statusColors = {
  pending: 'warning',
  in_progress: 'info',
  completed: 'success'
};

const EvaluationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const evaluations = useSelector(selectAllEvaluations);
  const loading = useSelector(selectEvaluationLoading);
  const error = useSelector(selectEvaluationError);
  const currentUser = useSelector(selectCurrentUser);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchEvaluations());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const canEdit = (evaluation) => {
    if (!currentUser) return false;
    return (
      currentUser.role === 'admin' ||
      (currentUser.role === 'manager' && currentUser.department === evaluation.employee?.department) ||
      currentUser._id === evaluation.evaluator?._id
    );
  };

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesStatus = !statusFilter || evaluation.status === statusFilter;
    const matchesSearch = !searchTerm || 
      `${evaluation.employee?.firstName} ${evaluation.employee?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${evaluation.evaluator?.firstName} ${evaluation.evaluator?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Evaluations</Typography>
        {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/evaluations/new')}
          >
            New Evaluation
          </Button>
        )}
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select
            label="Status"
            variant="outlined"
            size="small"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Evaluator</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvaluations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((evaluation) => (
                <TableRow key={evaluation._id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {evaluation.employee?.firstName} {evaluation.employee?.lastName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {evaluation.employee?.department}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">
                        {evaluation.evaluator?.firstName} {evaluation.evaluator?.lastName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {evaluation.evaluator?.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={evaluation.status}
                      color={statusColors[evaluation.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {formatDate(evaluation.updatedAt)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/evaluations/${evaluation._id}`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    {canEdit(evaluation) && (
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/evaluations/${evaluation._id}/edit`)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            {filteredEvaluations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No evaluations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEvaluations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
};

export default EvaluationList;
