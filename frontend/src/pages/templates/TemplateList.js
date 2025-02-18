import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { 
  fetchTemplates, 
  deleteTemplate,
  selectAllTemplates,
  selectTemplateLoading,
  selectTemplateError
} from '../../store/slices/templateSlice';

function TemplateList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const templates = useSelector(selectAllTemplates);
  const loading = useSelector(selectTemplateLoading);
  const error = useSelector(selectTemplateError);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      await dispatch(deleteTemplate(id));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Evaluation Templates
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/templates/new')}
          >
            Create Template
          </Button>
        </Box>

        <Grid container spacing={3}>
          {templates.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                No templates found. Create your first template to get started.
              </Typography>
            </Grid>
          ) : (
            templates.map((template) => (
              <Grid item xs={12} md={6} lg={4} key={template._id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {template.description}
                    </Typography>
                    <Typography variant="subtitle2" color="text.primary" gutterBottom>
                      Categories:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {template.categories?.map((category, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{
                            bgcolor: 'rgba(51, 51, 51, 0.08)',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                        >
                          {category}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                    <IconButton 
                      size="small" 
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete(template._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default TemplateList;
