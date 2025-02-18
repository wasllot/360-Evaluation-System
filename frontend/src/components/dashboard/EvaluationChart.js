import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme
} from '@mui/material';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const EvaluationChart = ({ data, title }) => {
  const theme = useTheme();

  // Transform data for radar chart if needed
  const chartData = data.map(item => ({
    subject: item.category,
    score: item.averageRating,
    fullMark: 5
  }));

  return (
    <Card>
      <CardContent>
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}
        
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <RadarChart data={chartData}>
              <PolarGrid 
                stroke={theme.palette.divider}
              />
              <PolarAngleAxis 
                dataKey="subject"
                tick={{ 
                  fill: theme.palette.text.primary,
                  fontSize: 12
                }}
              />
              <PolarRadiusAxis 
                angle={30}
                domain={[0, 5]}
                tick={{ 
                  fill: theme.palette.text.secondary,
                  fontSize: 12
                }}
              />
              <Radar
                name="Rating"
                dataKey="score"
                stroke={theme.palette.primary.main}
                fill={theme.palette.primary.main}
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius
                }}
                formatter={(value) => [`${value.toFixed(2)} / 5`, 'Rating']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            * Ratings are on a scale of 0-5
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Sample data structure
const sampleData = [
  { category: 'Leadership', averageRating: 4.2 },
  { category: 'Communication', averageRating: 3.8 },
  { category: 'Technical Skills', averageRating: 4.5 },
  { category: 'Teamwork', averageRating: 4.0 },
  { category: 'Initiative', averageRating: 3.9 },
  { category: 'Problem Solving', averageRating: 4.3 }
];

// Default props
EvaluationChart.defaultProps = {
  data: sampleData,
  title: 'Evaluation Overview'
};

export default EvaluationChart;
