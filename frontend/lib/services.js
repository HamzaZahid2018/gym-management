import api from './api';

// Auth Services
export const authService = {
  login: (email, password) =>
    api.post('/users/login/', { email, password }),
  
  register: (data) =>
    api.post('/users/register/', data),
  
  me: () =>
    api.get('/users/me/'),
};

// User/Customer Services
export const userService = {
  getAll: (page = 1) =>
    api.get('/users/', { params: { page } }),
  
  getById: (id) =>
    api.get(`/users/${id}/`),
  
  create: (data) =>
    api.post('/users/', data),
  
  update: (id, data) =>
    api.put(`/users/${id}/`, data),
  
  delete: (id) =>
    api.delete(`/users/${id}/`),
  
  getActive: () =>
    api.get('/users/active_members/'),
  
  getInactive: () =>
    api.get('/users/inactive_members/'),
};

// Payment Services
export const paymentService = {
  getAll: (page = 1) =>
    api.get('/payments/', { params: { page } }),
  
  getById: (id) =>
    api.get(`/payments/${id}/`),
  
  create: (data) =>
    api.post('/payments/', data),
  
  update: (id, data) =>
    api.put(`/payments/${id}/`, data),
  
  delete: (id) =>
    api.delete(`/payments/${id}/`),
  
  getUnpaid: () =>
    api.get('/payments/unpaid/'),
  
  getOverdue: () =>
    api.get('/payments/overdue/'),
  
  getByCustomer: (customerId) =>
    api.get('/payments/by_customer/', { params: { customer_id: customerId } }),
  
  getByMonth: (month, year) =>
    api.get('/payments/by_month/', { params: { month, year } }),
  
  markPaid: (id, data) =>
    api.post(`/payments/${id}/mark_paid/`, data),
  
  bulkCreate: (data) =>
    api.post('/payments/bulk_create/', data),
  
  sendReminders: (reminderType = 'email') =>
    api.post('/payments/send_reminders/', { reminder_type: reminderType }),
};

// Dashboard Services
export const dashboardService = {
  getStats: () =>
    api.get('/dashboard/stats/'),
  
  getMembershipBreakdown: () =>
    api.get('/dashboard/membership_breakdown/'),
  
  getRevenueStats: () =>
    api.get('/dashboard/revenue_stats/'),
  
  getPaymentStatusBreakdown: () =>
    api.get('/dashboard/payment_status_breakdown/'),
  
  getRecentPayments: () =>
    api.get('/dashboard/recent_payments/'),
  
  getNewMembers: () =>
    api.get('/dashboard/new_members/'),
  
  getDuePayments: () =>
    api.get('/dashboard/due_payments/'),
};

export default {
  authService,
  userService,
  paymentService,
  dashboardService,
};
