import { api } from './api.js';

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
  }

  async init() {
    const token = localStorage.getItem('tl_token');
    if (token) {
      try {
        const user = await api.getCurrentUser();
        this.currentUser = user;
        this.isAuthenticated = true;
        return true;
      } catch (error) {
        this.clearAuth();
        return false;
      }
    }
    return false;
  }

  async login(username, password) {
    try {
      const result = await api.login(username, password);
      this.currentUser = result.user;
      this.isAuthenticated = true;
      return result;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    this.clearAuth();
    api.logout();
    window.location.href = '#login';
  }

  clearAuth() {
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem('tl_token');
  }
}

export const auth = new AuthManager();
