const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  static async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'An error occurred');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  static async login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    
    // Get user data
    const user = await this.getCurrentUser();
    return { user, token: data.access_token };
  }

  static async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        username: userData.username,
        password: userData.password,
        full_name: userData.fullName,
      }),
    });
  }

  static async guestLogin() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Guest login failed: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('isGuest', 'true');
      
      return { user: data.user, token: data.access_token, isGuest: true };
    } catch (error) {
      console.error('Guest login error:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Sports
  static async getSports() {
    return this.request('/sports/');
  }

  static async getSport(sportId) {
    return this.request(`/sports/${sportId}`);
  }

  // Skills
  static async getSkills(sportId = null) {
    const query = sportId ? `?sport_id=${sportId}` : '';
    return this.request(`/skills/${query}`);
  }

  static async getSkill(skillId) {
    return this.request(`/skills/${skillId}`);
  }

  // Submissions
  static async createSubmission(submissionData) {
    return this.request('/submissions/', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  }

  static async getSubmissions() {
    return this.request('/submissions/');
  }

  static async getSubmission(submissionId) {
    return this.request(`/submissions/${submissionId}`);
  }

  // Analyses
  static async createAnalysis(analysisData) {
    return this.request('/analyses/', {
      method: 'POST',
      body: JSON.stringify(analysisData),
    });
  }

  static async getAnalyses() {
    return this.request('/analyses/');
  }

  static async getAnalysis(analysisId) {
    return this.request(`/analyses/${analysisId}`);
  }

  // File Upload
  static async uploadVideo(file) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload/video`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  }
}

export default ApiService;