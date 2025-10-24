import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  TrendingUp,
  FitnessCenter,
  Assessment,
} from '@mui/icons-material';

function AnalysisPage({ analysis, onBack }) {
  if (!analysis) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No analysis data available
        </Typography>
      </Box>
    );
  }

  const ScoreCard = ({ title, score, icon }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" fontWeight="bold" color="primary.main">
          {score}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={score}
          sx={{ mt: 2, height: 8, borderRadius: 4 }}
        />
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', py: 4, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onBack}
            variant="outlined"
          >
            Back to Sports
          </Button>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" fontWeight="bold">
              Analysis Results
            </Typography>
            <Chip
              icon={<CheckCircle />}
              label="Analysis Complete"
              color="success"
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>

        {/* Overall Score */}
        <Paper sx={{ p: 4, mb: 3, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
            Overall Performance Score
          </Typography>
          <Typography variant="h1" fontWeight="bold" sx={{ color: 'white' }}>
            {analysis.overall_score}
            <Typography component="span" variant="h4" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              /100
            </Typography>
          </Typography>
        </Paper>

        {/* Score Breakdown */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Performance Breakdown
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <ScoreCard
              title="Technique"
              score={analysis.technique_score || 0}
              icon={<FitnessCenter color="primary" />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ScoreCard
              title="Form"
              score={analysis.form_score || 0}
              icon={<Assessment color="primary" />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ScoreCard
              title="Consistency"
              score={analysis.consistency_score || 0}
              icon={<TrendingUp color="primary" />}
            />
          </Grid>
        </Grid>

        {/* AI Feedback */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            AI Feedback
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
            {analysis.ai_feedback || 'No feedback available'}
          </Typography>
        </Paper>

        {/* Recommendations */}
        {analysis.recommendations && (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Recommendations
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
              {analysis.recommendations}
            </Typography>
          </Paper>
        )}

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" size="large" onClick={onBack}>
            Analyze Another Skill
          </Button>
          <Button variant="outlined" size="large">
            Save Report
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default AnalysisPage;