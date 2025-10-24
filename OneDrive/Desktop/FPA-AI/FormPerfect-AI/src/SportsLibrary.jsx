import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Search,
  SportsBasketball,
  SportsSoccer,
  SportsTennis,
  FitnessCenter,
  Pool,
  DirectionsRun,
} from '@mui/icons-material';
import ApiService from './api';

const sportIcons = {
  basketball: SportsBasketball,
  soccer: SportsSoccer,
  football: SportsSoccer,
  tennis: SportsTennis,
  gym: FitnessCenter,
  swimming: Pool,
  running: DirectionsRun,
};

function SportsLibrary({ onSelectSport }) {
  const [sports, setSports] = useState([]);
  const [filteredSports, setFilteredSports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSports();
  }, []);

  useEffect(() => {
    filterSports();
  }, [searchQuery, selectedCategory, sports]);

  const fetchSports = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getSports();
      setSports(data);
      setFilteredSports(data);
    } catch (err) {
      setError('Failed to load sports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterSports = () => {
    let filtered = sports;

    if (searchQuery) {
      filtered = filtered.filter((sport) =>
        sport.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((sport) => sport.category === selectedCategory);
    }

    setFilteredSports(filtered);
  };

  const categories = ['all', 'team', 'individual', 'combat', 'water', 'strength'];

  const getSportIcon = (sportName) => {
    const iconName = sportName.toLowerCase();
    const IconComponent = sportIcons[iconName] || SportsBasketball;
    return IconComponent;
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Choose Your Sport
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Select a sport to begin your form analysis journey
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search sports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                },
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category.charAt(0).toUpperCase() + category.slice(1)}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
              sx={{
                fontSize: '0.95rem',
                fontWeight: 600,
                px: 2,
                py: 2.5,
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {loading
            ? Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={40} />
                      <Skeleton variant="text" height={20} />
                      <Skeleton variant="rectangular" height={36} sx={{ mt: 2 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : filteredSports.map((sport) => {
                const IconComponent = getSportIcon(sport.name);
                return (
                  <Grid item xs={12} sm={6} md={4} key={sport.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: 8,
                        },
                      }}
                      onClick={() => onSelectSport(sport)}
                    >
                      <Box
                        sx={{
                          height: 200,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconComponent
                          sx={{
                            fontSize: 100,
                            color: 'white',
                            opacity: 0.9,
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                          {sport.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {sport.description || 'Improve your technique with AI-powered analysis'}
                        </Typography>
                        {sport.category && (
                          <Chip
                            label={sport.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </CardContent>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => onSelectSport(sport)}
                        >
                          Select Sport
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
        </Grid>

        {!loading && filteredSports.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No sports found matching your criteria
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default SportsLibrary;