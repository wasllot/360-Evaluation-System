import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  loading,
  info,
  color = 'primary'
}) => {
  const theme = useTheme();

  const getTrendColor = () => {
    if (trend > 0) return theme.palette.success.main;
    if (trend < 0) return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  const getTrendIcon = () => {
    if (trend > 0) return <ArrowUpwardIcon sx={{ color: getTrendColor() }} />;
    if (trend < 0) return <ArrowDownwardIcon sx={{ color: getTrendColor() }} />;
    return null;
  };

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        '&:hover': {
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mr: 1 }}
              >
                {title}
              </Typography>
              {info && (
                <Tooltip title={info}>
                  <IconButton size="small">
                    <InfoIcon fontSize="small" color="action" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', height: 50 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <>
                <Typography
                  variant="h4"
                  color={`${color}.main`}
                  sx={{ mb: 1 }}
                >
                  {value}
                </Typography>

                {subtitle && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {subtitle}
                  </Typography>
                )}

                {trend !== undefined && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getTrendIcon()}
                    <Typography
                      variant="body2"
                      sx={{
                        color: getTrendColor(),
                        display: 'flex',
                        alignItems: 'center',
                        ml: 0.5
                      }}
                    >
                      {Math.abs(trend)}%
                    </Typography>
                    {trendLabel && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        {trendLabel}
                      </Typography>
                    )}
                  </Box>
                )}
              </>
            )}
          </Box>

          {Icon && (
            <Box
              sx={{
                backgroundColor: `${color}.lighter`,
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon
                sx={{
                  color: `${color}.main`,
                  fontSize: 24
                }}
              />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// Sample usage:
/*
<DashboardCard
  title="Total Evaluations"
  value="156"
  subtitle="Completed evaluations"
  icon={AssessmentIcon}
  trend={12}
  trendLabel="vs last month"
  info="Total number of completed evaluations across all employees"
  color="primary"
/>

<DashboardCard
  title="Average Rating"
  value="4.2"
  subtitle="Out of 5.0"
  icon={StarIcon}
  trend={-2.5}
  trendLabel="vs last quarter"
  info="Average rating across all evaluations"
  color="warning"
/>

<DashboardCard
  title="Pending Reviews"
  value="23"
  subtitle="Requires attention"
  icon={PendingIcon}
  loading={false}
  info="Number of evaluations pending review"
  color="error"
/>
*/

export default DashboardCard;
