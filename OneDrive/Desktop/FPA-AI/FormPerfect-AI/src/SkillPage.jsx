import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Skeleton,
  Alert,
  Paper,
  TextField,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack,
  CloudUpload,
  VideoLibrary,
} from '@mui/icons-material';
import ApiService from './api';

function SkillPage({ sport, skill, onSelectSkill, onAnalysisComplete, onBack }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState(null);
  const [submissionData, setSubmissionData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    if (sport && !skill) {
      fetchSkills();
    }
  }, [sport, skill]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getSkills(sport.id);
      setSkills(data);
    } catch (err) {
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setError('');
    } else {
      setError('Please select a valid video file');
    }
  };

  const handleSubmit = async () => {
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(10);

      // Upload video
      const uploadResult = await ApiService.uploadVideo(videoFile);
      setUploadProgress(50);

      // Create submission
      const submission = await ApiService.createSubmission({
        skill_id: skill.id,
        video_url: uploadResult.url,
        title: submissionData.title || `${skill.name} Analysis`,
        description: submissionData.description,
      });
      setUploadProgress(75);

      // Create analysis with mock data
      const analysis = await ApiService.createAnalysis({
        submission_id: submission.id,
        ai_feedback: 'Great form! Your technique shows good fundamentals. Focus on maintaining consistency.',
        overall_score: 85,
        technique_score: 88,
        form_score: 82,
        consistency_score: 85,
        recommendations: '1. Keep your core engaged\n2. Focus on smooth movements\n3. Practice regularly',
      });

      setUploadProgress(100);
      onAnalysisComplete(analysis);
    } catch (err) {
      setError(err.message || 'Failed to process submission');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Show skill selection
  if (!skill) {
    return (
      <Box sx={{ minHeight: '100vh', py: 4, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={onBack} sx={{ bgcolor: 'white' }}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {sport?.name} Skills
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Choose a skill to analyze
              </Typography>
            </Box>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Grid container spacing={3}>
            {loading
              ? Array.from(new Array(6)).map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardContent>
                        <Skeleton variant="text" height={40} />
                        <Skeleton variant="text" height={20} />
                        <Skeleton variant="rectangular" height={36} sx={{ mt: 2 }} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              : skills.map((skillItem) => (
                  <Grid item xs={12} sm={6} md={4} key={skillItem.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6,
                        },
                      }}
                      onClick={() => onSelectSkill(skillItem)}
                    >
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {skillItem.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {skillItem.description || 'Analyze and improve your technique'}
                        </Typography>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ mt: 2 }}
                          onClick={() => onSelectSkill(skillItem)}
                        >
                          Select Skill
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  // Show video upload
  return (
    <Box sx={{ minHeight: '100vh', py: 4, backgroundColor: 'background.default' }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={onBack} sx={{ bgcolor: 'white' }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Upload Video
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {sport?.name} - {skill?.name}
            </Typography>
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <VideoLibrary sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Upload Your Performance Video
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI will analyze your technique and provide detailed feedback
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Title (Optional)"
            margin="normal"
            value={submissionData.title}
            onChange={(e) => setSubmissionData({ ...submissionData, title: e.target.value })}
          />

          <TextField
            fullWidth
            label="Description (Optional)"
            margin="normal"
            multiline
            rows={3}
            value={submissionData.description}
            onChange={(e) => setSubmissionData({ ...submissionData, description: e.target.value })}
          />

          <Box sx={{ mt: 3, mb: 2 }}>
            <input
              accept="video/*"
              style={{ display: 'none' }}
              id="video-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="video-upload">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                startIcon={<CloudUpload />}
                sx={{ py: 2 }}
              >
                {videoFile ? videoFile.name : 'Choose Video File'}
              </Button>
            </label>
          </Box>

          {uploadProgress > 0 && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Processing... {uploadProgress}%
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={!videoFile || loading}
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            {loading ? 'Analyzing...' : 'Submit for Analysis'}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default SkillPage;