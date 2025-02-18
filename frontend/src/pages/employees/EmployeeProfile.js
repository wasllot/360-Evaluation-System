import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { 
  fetchEmployeeById,
  selectCurrentEmployee,
  selectEmployeeLoading
} from '../../store/slices/employeeSlice';

function EmployeeProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
const selectedEmployee = useSelector(selectCurrentEmployee);
const loading = useSelector(selectEmployeeLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeById(id));
    }
  }, [dispatch, id]);

  if (loading || !selectedEmployee) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                src={selectedEmployee.avatar}
              >
                {selectedEmployee.name?.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {selectedEmployee.name}
              </Typography>
              <Chip
                label={selectedEmployee.role}
                color={
                  selectedEmployee.role === 'admin'
                    ? 'error'
                    : selectedEmployee.role === 'manager'
                    ? 'warning'
                    : 'primary'
                }
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Employee Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedEmployee.email}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedEmployee.department}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Position
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedEmployee.position}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Join Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedEmployee.joinDate).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}

export default EmployeeProfile;
