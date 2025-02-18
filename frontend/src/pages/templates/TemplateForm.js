import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { createTemplate } from '../../store/slices/templateSlice';

function TemplateForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categories: [],
  });

  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setFormData({
        ...formData,
        categories: [...formData.categories, newCategory.trim()],
      });
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(
        (category) => category !== categoryToRemove
      ),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Template name is required');
      return;
    }

    if (formData.categories.length === 0) {
      setError('At least one category is required');
      return;
    }

    try {
      await dispatch(createTemplate(formData)).unwrap();
      navigate('/templates');
    } catch (err) {
      setError(err.message || 'Failed to create template');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Evaluation Template
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Template Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Categories
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      label="Add Category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCategory();
                        }
                      }}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddCategory}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.categories.map((category, index) => (
                      <Chip
                        key={index}
                        label={category}
                        onDelete={() => handleRemoveCategory(category)}
                        deleteIcon={<CloseIcon />}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>

              {error && (
                <Grid item xs={12}>
                  <Typography color="error">{error}</Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/templates')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Create Template
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default TemplateForm;
