import api from './api-client';

// Auth API
export const authApi = {
  login: (credentials) =>
    api.post('/auth/login', credentials),

  registerAlumni: (data) =>
    api.post('/auth/register/alumni', data),

  verifyAlumni: (alumniId) =>
    // Use authenticated admin token (Authorization header via api-client)
    // Do not send an internal API key from the browser (security risk)
    api.post(`/auth/verify/${alumniId}`),
};

// Users API
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) =>
    api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Alumni API
export const alumniApi = {
  getAll: () => api.get('/alumni'),
  getById: (id) => api.get(`/alumni/${id}`),
  update: (id, data) =>
    api.put(`/alumni/${id}`, data),
  verify: (alumniId) =>
    api.post(`/alumni/${alumniId}/verify`),
  bulkCreate: (alumni) =>
    api.post('/alumni/bulk-create', { alumni }),
};

// Admin API
export const adminApi = {
  getAdminNames: () => api.get('/admins/names'),
  getById: (id) => api.get(`/admins/${id}`),
  update: (id, data) =>
    api.put(`/admins/${id}`, data),
  delete: (id) => api.delete(`/admins/${id}`),
  // Admin creates users (Student/Alumni)
  createUser: (data) => api.post('/admins/users', data),
  updateUser: (id, data) =>
    api.put(`/admins/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admins/users/${id}`),
  // Award Moksha coins and tags
  awardMokshaCoins: (data) =>
    api.post('/admins/award-moksha', data),
  awardTag: (data) =>
    api.post('/admins/award-tag', data),
};

// Students API
export const studentsApi = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  // Note: Single student creation should use authApi.registerStudent or POST /auth/register/student
  bulkCreate: (students) =>
    api.post('/students/bulk-create', { students }),
};

// Jobs API
export const jobsApi = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) =>
    api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
  apply: (id) => api.post(`/jobs/${id}/apply`),
  getMyPosted: () => api.get('/jobs/my/posted'),
  updateApplicationStatus: (jobId, applicationId, status) =>
    api.patch(`/jobs/${jobId}/application-status`, { applicationId, status }),
};

// Events API
export const eventsApi = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) =>
    api.post('/events', data),
  update: (id, data) =>
    api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  register: (id) =>
    api.post(`/events/${id}/register`),
};

// Posts API
export const postsApi = {
  getAll: () => api.get('/posts'),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) =>
    api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  like: (id) => api.post(`/posts/${id}/like`),
  comment: (id, text) =>
    api.post(`/posts/${id}/comment`, { text }),
};

// Connections API
export const connectionsApi = {
  getAll: () => api.get('/connections'),
  sendRequest: (alumniId) =>
    api.post('/connections/send-request', { alumniId }),
  acceptRequest: (connectionId) =>
    api.post('/connections/accept-request', {
      connectionId,
    }),
  rejectRequest: (connectionId) =>
    api.post('/connections/reject-request', {
      connectionId,
    }),
};

// Chat API
export const chatApi = {
  getAll: () => api.get('/chats'),
  getById: (id) => api.get(`/chats/${id}`),
  create: (data) =>
    api.post('/chats', data),
  update: (id, data) =>
    api.put(`/chats/${id}`, data),
  delete: (id) => api.delete(`/chats/${id}`),
};

// Messages API
export const messagesApi = {
  getAll: () => api.get('/messages'),
  getById: (id) => api.get(`/messages/${id}`),
  create: (data) =>
    api.post('/messages', data),
  update: (id, data) =>
    api.put(`/messages/${id}`, data),
  delete: (id) => api.delete(`/messages/${id}`),
};

// Campaigns API
export const campaignsApi = {
  getAll: (params) =>
    api.get('/campaigns', { params }),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post('/campaigns', data),
  update: (id, data) =>
    api.put(`/campaigns/${id}`, data),
  delete: (id) => api.delete(`/campaigns/${id}`),
  donate: (id, data) =>
    api.post(`/campaigns/${id}/donate`, data),
  verify: (id) => api.post(`/campaigns/${id}/verify`),
  getAnalytics: () => api.get('/campaigns/analytics'),
};

// Surveys API
export const surveysApi = {
  getAll: (params) =>
    api.get('/surveys', { params }),
  getById: (id) => api.get(`/surveys/${id}`),
  create: (data) => api.post('/surveys', data),
  update: (id, data) =>
    api.put(`/surveys/${id}`, data),
  delete: (id) => api.delete(`/surveys/${id}`),
  respond: (id, data) =>
    api.post(`/surveys/${id}/respond`, data),
  getAnalytics: (id) => api.get(`/surveys/${id}/analytics`),
  getOverallAnalytics: () => api.get('/surveys/analytics'),
};

// Success Stories API
export const successStoriesApi = {
  getAll: (params) =>
    api.get('/success-stories', { params }),
  getById: (id) => api.get(`/success-stories/${id}`),
  create: (data) => api.post('/success-stories', data),
  update: (id, data) =>
    api.put(`/success-stories/${id}`, data),
  delete: (id) => api.delete(`/success-stories/${id}`),
  like: (id) => api.post(`/success-stories/${id}/like`),
  verify: (id) => api.post(`/success-stories/${id}/verify`),
  getCategories: () => api.get('/success-stories/categories'),
};

// Dashboard Analytics API
export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getAlumniStats: () => api.get('/analytics/alumni'),
  getEngagement: () => api.get('/analytics/engagement'),
  getTimeSeries: (params) =>
    api.get('/analytics/timeseries', { params }),
  getEventCounts: (params) =>
    api.get('/analytics/events', { params }),
  getUserActivity: (userId) => api.get(`/analytics/users/${userId}`),
  getFunnel: () => api.get('/analytics/funnel'),
  getHeatmap: () => api.get('/analytics/heatmap'),
  getSummary: () => api.get('/analytics/summary'),
  generateSummary: () => api.post('/analytics/summary/generate'),
  trackEvent: (data) =>
    api.post('/analytics/track', data),
  exportData: (format) =>
    api.get(`/analytics/export?format=${format}`, { responseType: 'blob' }),
};

// Audit Logs API
export const auditLogsApi = {
  getAll: (params) =>
    api.get('/audit-logs', { params }),
  getStats: () => api.get('/audit-logs/stats'),
  getResourceHistory: (resourceType, resourceId) =>
    api.get(`/audit-logs/resource/${resourceType}/${resourceId}`),
  getUserActivity: (userId) =>
    api.get(`/audit-logs/user/${userId}`),
  cleanup: (olderThanDays) =>
    api.post('/audit-logs/cleanup', { olderThanDays }),
};

// Bulk Imports API
export const bulkImportsApi = {
  getAll: (params) =>
    api.get('/bulk-imports', { params }),
  getTemplate: (importType) =>
    api.get(`/bulk-imports/template/${importType}`),
  getStatus: (importId) =>
    api.get(`/bulk-imports/${importId}/status`),
  getResults: (importId) =>
    api.get(`/bulk-imports/${importId}/results`),
  create: (file, importType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('importType', importType);
    return api.post('/bulk-imports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  process: (importId) =>
    api.post(`/bulk-imports/${importId}/process`),
  cancel: (importId) =>
    api.delete(`/bulk-imports/${importId}`),
};

// Invitations API
export const invitationsApi = {
  getAll: (params) =>
    api.get('/invitations', { params }),
  getStats: () => api.get('/invitations/stats'),
  create: (data) =>
    api.post('/invitations', data),
  createBulk: (invitations) =>
    api.post('/invitations/bulk', { invitations }),
  resend: (invitationId) =>
    api.post(`/invitations/${invitationId}/resend`),
  cancel: (invitationId) =>
    api.delete(`/invitations/${invitationId}`),
  validateToken: (token) =>
    api.get(`/invitations/validate/${token}`),
  acceptInvitation: (token, data) =>
    api.post(`/invitations/accept/${token}`, data),
};

// KYC API
export const kycApi = {
  getMyKYC: () => api.get('/kyc/me'),
  getById: (kycId) => api.get(`/kyc/${kycId}`),
  submit: (data) =>
    api.post('/kyc', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  resubmit: (kycId, data) =>
    api.put(`/kyc/${kycId}/resubmit`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  addDocument: (kycId, document) => {
    const formData = new FormData();
    formData.append('document', document);
    return api.post(`/kyc/${kycId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getPendingReviews: () => api.get('/kyc/admin/pending'),
  getStats: () => api.get('/kyc/admin/stats'),
  startReview: (kycId) => api.post(`/kyc/${kycId}/review/start`),
  approve: (kycId, notes) =>
    api.post(`/kyc/${kycId}/approve`, { notes }),
  reject: (kycId, reason) =>
    api.post(`/kyc/${kycId}/reject`, { reason }),
};

// Newsletters API
export const newslettersApi = {
  getAll: (params) =>
    api.get('/newsletters', { params }),
  getById: (id) => api.get(`/newsletters/${id}`),
  create: (data) => api.post('/newsletters', data),
  update: (id, data) =>
    api.put(`/newsletters/${id}`, data),
  delete: (id) => api.delete(`/newsletters/${id}`),
  schedule: (id, scheduledAt) =>
    api.post(`/newsletters/${id}/schedule`, { scheduledAt }),
  send: (id) => api.post(`/newsletters/${id}/send`),
  getStats: () => api.get('/newsletters/stats'),
};
