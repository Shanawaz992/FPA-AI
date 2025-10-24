import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Assessment,
  VideoLibrary,
  TrendingUp,
} from '@mui/icons-material';
import ApiService from './api';

function ProfilePage({ user }) {
  const [tabValue, setTabValue] = useState(0);
  const [submissions, setSubmissions] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [submissionsData, analysesData] = await Promise.all([
        ApiService.getSubmissions(),
        ApiService.getAnalyses(),
      ]);
      setSubmissions(submissionsData);
      setAnalyses(analysesData);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAverageScore = () => {
    if (analyses.length === 0) return 0;
    const total = analyses.reduce((sum, analysis) => sum + (analysis.overall_score || 0), 0);
    return Math.round(total / analyses.length);
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Profile Header */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                }}
              >
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {user?.full_name || user?.username}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              <Chip
                icon={<Person />}
                label={`Member since ${new Date(user?.created_at || Date.now()).toLocaleDateString()}`}
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <VideoLibrary sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
                <Typography variant="h3" fontWeight="bold">
                  {submissions.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Submissions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Assessment sx={{ fontSize: 60, color: 'success.main', mb: 1 }} />
                <Typography variant="h3" fontWeight="bold">
                  {analyses.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analyses Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 60, color: 'warning.main', mb: 1 }} />
                <Typography variant="h3" fontWeight="bold">
                  {getAverageScore()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Score
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
          >
            <Tab label="Submissions" />
            <Tab label="Analyses" />
          </Tabs>
        </Paper>

        {/* Content */}
        <Paper>
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {tabValue === 0 && (
                <List>
                  {submissions.length === 0 ? (
                    <ListItem>
                      <ListItemText
                        primary="No submissions yet"
                        secondary="Upload your first video to get started"
                      />
                    </ListItem>
                  ) : (
                    submissions.map((submission) => (
                      <React.Fragment key={submission.id}>
                        <ListItem>
                          <ListItemText
                            primary={submission.title || `Submission #${submission.id}`}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.secondary">
                                  {new Date(submission.created_at).toLocaleDateString()}
                                </Typography>
                                <br />
                                <Chip
                                  label={submission.status}
                                  size="small"
                                  color={submission.status === 'completed' ? 'success' : 'default'}
                                  sx={{ mt: 0.5 }}
                                />
                              </>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))
                  )}
                </List>
              )}

              {tabValue === 1 && (
                <List>
                  {analyses.length === 0 ? (
                    <ListItem>
                      <ListItemText
                        primary="No analyses yet"
                        secondary="Complete your first analysis to see results here"
                      />
                    </ListItem>
                  ) : (
                    analyses.map((analysis) => (
                      <React.Fragment key={analysis.id}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body1">
                                  Analysis #{analysis.id}
                                </Typography>
                                <Chip
                                  label={`Score: ${analysis.overall_score}`}
                                  color="primary"
                                  size="small"
                                />
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="text.secondary">
                                  {new Date(analysis.created_at).toLocaleDateString()}
                                </Typography>
                                <br />
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  Technique: {analysis.technique_score} | Form: {analysis.form_score} | Consistency: {analysis.consistency_score}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))
                  )}
                </List>
              )}
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default ProfilePage;