import axios from "axios";

// Vite exposes env variables starting with VITE_ via import.meta.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const startSession = async (playerName) => {
  const res = await axios.post(`${API_URL}/session/start`, { playerName });
  return res.data;
};

export const endSession = async (sessionId, score) => {
  const res = await axios.post(`${API_URL}/session/end`, { sessionId, score });
  return res.data;
};

export const saveScore = async (playerId, score) => {
  const res = await axios.post(`${API_URL}/score`, { playerId, score });
  return res.data;
};

export const getLeaderboard = async () => {
  const res = await axios.get(`${API_URL}/leaderboard`);
  return res.data;
};

export const getConfig = async () => {
  const res = await axios.get(`${API_URL}/config`);
  return res.data;
};
