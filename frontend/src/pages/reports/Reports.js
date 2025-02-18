import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import {
  Assessment,
  Business,
  Timeline,
  Group,
} from '@mui/icons-material';

function Reports() {
  const navigate = useNavigate();

  const reportTypes = [
    {
      title: 'Department Reports',
      description: 'View evaluation statistics and performance metrics by department',
      icon: <Business sx={{ fontSize: 40 }} />,
      action: () => navigate('/reports/department/all'),
    },
    {
      title: 'Performance Trends',
      description: 'Analyze employee performance trends over time',
      icon: <Timeline sx={{ fontSize: 40 }} />,
      action: () => navigate('/reports/trends'),
    },
    {
      title: 'Team Reports',
      description: 'Review team-specific evaluation results and feedback',
      icon: <Group sx={{ fontSize: 40 }} />,
      action: () => navigate('/reports/teams'),
    },
    {
      title: 'Summary Reports',
      description: 'Get an overview of all evaluation results and statistics',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      action: () => navigate('/reports/summary'),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reports
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {reportTypes.map((report, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {report.icon}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom align="center">
                    {report.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {report.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={report.action}
                  >
                    View Report
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default Reports;
