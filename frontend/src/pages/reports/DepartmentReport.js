import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DepartmentReport() {
  const { department } = useParams();
  const [selectedDepartment, setSelectedDepartment] = useState(department || 'all');
  const [chartData, setChartData] = useState({
    labels: ['Technical Skills', 'Soft Skills', 'Leadership', 'Productivity'],
    datasets: [
      {
        label: 'Average Score',
        data: [0, 0, 0, 0],
        backgroundColor: 'rgba(51, 51, 51, 0.6)', // Using our new primary color
        borderColor: '#333',
        borderWidth: 1,
      },
    ],
  });

  const departments = [
    'all',
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance',
  ];

  // Simulated data - In a real app, this would come from the Redux store
  const evaluationData = {
    Engineering: {
      technical_skills: 4.2,
      soft_skills: 3.8,
      leadership: 3.5,
      productivity: 4.0,
    },
    Marketing: {
      technical_skills: 3.8,
      soft_skills: 4.5,
      leadership: 4.0,
      productivity: 4.2,
    },
    Sales: {
      technical_skills: 3.5,
      soft_skills: 4.8,
      leadership: 4.2,
      productivity: 4.5,
    },
    'Human Resources': {
      technical_skills: 3.7,
      soft_skills: 4.6,
      leadership: 4.3,
      productivity: 4.1,
    },
    Finance: {
      technical_skills: 4.3,
      soft_skills: 4.0,
      leadership: 3.8,
      productivity: 4.4,
    },
  };

  useEffect(() => {
    if (selectedDepartment === 'all') {
      // Calculate averages across all departments
      const averages = Object.values(evaluationData).reduce(
        (acc, dept) => ({
          technical_skills: acc.technical_skills + dept.technical_skills,
          soft_skills: acc.soft_skills + dept.soft_skills,
          leadership: acc.leadership + dept.leadership,
          productivity: acc.productivity + dept.productivity,
        }),
        { technical_skills: 0, soft_skills: 0, leadership: 0, productivity: 0 }
      );

      const departmentCount = Object.keys(evaluationData).length;
      
      setChartData({
        ...chartData,
        datasets: [{
          ...chartData.datasets[0],
          data: [
            averages.technical_skills / departmentCount,
            averages.soft_skills / departmentCount,
            averages.leadership / departmentCount,
            averages.productivity / departmentCount,
          ],
        }],
      });
    } else {
      // Set data for specific department
      const deptData = evaluationData[selectedDepartment];
      if (deptData) {
        setChartData({
          ...chartData,
          datasets: [{
            ...chartData.datasets[0],
            data: [
              deptData.technical_skills,
              deptData.soft_skills,
              deptData.leadership,
              deptData.productivity,
            ],
          }],
        });
      }
    }
  }, [selectedDepartment]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${selectedDepartment === 'all' ? 'All Departments' : selectedDepartment} Performance Metrics`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Department Report
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={selectedDepartment}
                label="Department"
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ height: 400 }}>
                <Bar data={chartData} options={options} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default DepartmentReport;