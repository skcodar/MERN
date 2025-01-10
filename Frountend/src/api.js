// src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';  // Replace with your backend URL

export const fetchTransactions = (month, search, page = 1, perPage = 10) => {
  return axios.get(`${API_BASE_URL}/transactions`, {
    params: { month, search, page, perPage }
  });
};

export const fetchStatistics = (month) => {
  return axios.get(`${API_BASE_URL}/statistics`, { params: { month } });
};

export const fetchBarChartData = (month) => {
  return axios.get(`${API_BASE_URL}/bar-chart`, { params: { month } });
};

export const fetchPieChartData = (month) => {
  return axios.get(`${API_BASE_URL}/pie-chart`, { params: { month } });
};
