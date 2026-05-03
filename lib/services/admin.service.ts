import api from './api';

export const adminService = {
  getStats: async () => {
    const { data } = await api.get('/accounts/users/stats/');
    return data;
  },
  
  // Financial data can be added here once backend has finance app
  getFinanceStats: async () => {
    // Placeholder for when finance API is ready
    return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      recentTransactions: []
    };
  }
};
