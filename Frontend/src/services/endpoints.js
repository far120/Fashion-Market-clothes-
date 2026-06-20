// src/constants/endpoints.js

export const API_BASE_URL = "http://localhost:3006/api";

const AUTH_BASE = "/users";
const USER_LOGS_BASE = "/userslogs";

// Auth Endpoints
export const LOGIN = `${AUTH_BASE}/login`;
export const REGISTER = `${AUTH_BASE}`;
export const LOGOUT = `${AUTH_BASE}/logout`;

// User Endpoints
export const GET_PROFILE = `${AUTH_BASE}/me`;
export const UPDATE_PROFILE = `${AUTH_BASE}/me`;
export const RESET_MY_PASSWORD = `${AUTH_BASE}/me/reset-password`;
export const GET_USERS = `${AUTH_BASE}`;
export const DELETE_USER = (userId) => `${AUTH_BASE}/delete/${userId}`;
export const CHANGE_USER_ROLE = (userId) => `${AUTH_BASE}/${userId}/role`;
export const ACTIVATE_USER = (userId) => `${AUTH_BASE}/activate/${userId}`;

// User Logs Endpoints
export const GET_USER_LOGS = `${USER_LOGS_BASE}`;
export const GET_USER_LOGS_BY_USER_ID = (email) => `${USER_LOGS_BASE}/${email}`;

