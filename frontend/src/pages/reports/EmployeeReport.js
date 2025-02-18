import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Alert,
  Tabs,
  Tab,
  Rating
} from '@mui/material';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { getEmployeeReport, selectEmployeeReport } from '../../store/slices/evaluationSlice';
import { exportToPDF } from '../../utils/exportUtils';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const EmployeeReport = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('all');

  const report = useSelector(selectEmployeeReport);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        await dispatch(getEmployeeReport(id)).unwrap();
      } catch (err) {
        setError(err.message || 'Failed to fetch employee report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [dispatch, id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleExportPDF = () => {
    exportToPDF({
      title: `Evaluation Report - ${report?.employee?.name}`,
      data: report,
      type: 'employee-report'
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const prepareRadarData = () => {
    if (!report?.ratings) return [];
    
    return report.ratings.map(rating => ({
      subject: rating.questionId,
      score: rating.averageRating,
      fullMark: 5
    }));
  };

  const prepareTimelineData = () => {
    if (!report?.timeline) return [];

    return report.timeline.map(item => ({
      date: formatDate(item.date),
      rating: item.averageRating
    }));
  };

  const prepareDistributionData = () => {
    if (!report?.ratings) return [];

    return report.ratings.map(rating => ({
      question: rating.questionId,
      ...rating.distribution
    }));
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

  if (!report) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No report data available</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Evaluation Report - {report.employee?.name}
        </Typography>
        <Button
          variant="contained"
          onClick={handleExportPDF}
        >
          Export PDF
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Overall Rating
              </Typography>
              <Typography variant="h4">
                {report.statistics?.averageOverallRating.toFixed(1)}
              </Typography>
              <Rating 
                value={report.statistics?.averageOverallRating} 
                readOnly 
                precision={0.1}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Evaluations
              </Typography>
              <Typography variant="h4">
                {report.statistics?.totalEvaluations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Department Average
              </Typography>
              <Typography variant="h4">
                {report.statistics?.departmentAverage.toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Last Evaluation
              </Typography>
              <Typography variant="h6">
                {report.statistics?.lastEvaluationDate ? 
                  formatDate(report.statistics.lastEvaluationDate) : 
                  'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Timeline" />
          <Tab label="Feedback" />
          <Tab label="Distribution" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer>
              <RadarChart data={prepareRadarData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar
                  name="Rating"
                  dataKey="score"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={prepareTimelineData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#8884d8"
                  name="Average Rating"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <List>
            {report.feedback.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        Evaluation on {formatDate(item.date)}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary">
                          {item.evaluator.name} ({item.evaluator.role})
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {item.feedback}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < report.feedback.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={prepareDistributionData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="question" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="1" stackId="a" fill="#ff0000" name="1 Star" />
                <Bar dataKey="2" stackId="a" fill="#ff8c00" name="2 Stars" />
                <Bar dataKey="3" stackId="a" fill="#ffd700" name="3 Stars" />
                <Bar dataKey="4" stackId="a" fill="#90ee90" name="4 Stars" />
                <Bar dataKey="5" stackId="a" fill="#008000" name="5 Stars" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default EmployeeReport;
