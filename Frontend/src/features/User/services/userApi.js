import api from "../../../services/api.js";
import { normalizeError, normalizePaginatedResponse } from "../../../services/normalize.js";
import {
    ACTIVATE_USER,
    CHANGE_USER_ROLE,
    DELETE_USER,
    GET_PROFILE,
    GET_USER_LOGS,
    GET_USERS,
    RESET_MY_PASSWORD,
    UPDATE_PROFILE,
} from "../../../services/endpoints.js";



export async function getProfile() {
    try {
        const response = await api.get(GET_PROFILE);
        if (response.status === 200 || response.status === 201) {
            return response.data;
        }
        throw new Error("Failed to fetch profile");
    } catch (error) {
        throw normalizeError(error, "Failed to fetch profile");
    }
}

export async function updateProfile(profileData) {
    try {
    const response = await api.put(UPDATE_PROFILE, profileData);
    if (response.status === 200 || response.status === 201) {
            return response.data;
    }
    throw new Error("Failed to update profile");
    } catch (error) {
        throw normalizeError(error, "Failed to update profile");
    }
}

export async function resetMyPassword(payload) {
    try {
        const response = await api.put(RESET_MY_PASSWORD, payload);
        return response.data;
    } catch (error) {
        throw normalizeError(error, "Failed to reset password");
    }
}

export async function getUsers(params = {}) {
    try {
        const response = await api.get(GET_USERS, { params });
        return normalizePaginatedResponse(response.data);
    } catch (error) {
        throw normalizeError(error, "Failed to fetch users");
    }
}

export async function deleteUser(userId) {
    try {
        const response = await api.delete(DELETE_USER(userId));
        return response.data;
    } catch (error) {
        throw normalizeError(error, "Failed to delete user");
    }
}

export async function changeUserRole(userId, role) {
    try {
        const response = await api.patch(CHANGE_USER_ROLE(userId), { role });
        return response.data;
    } catch (error) {
        throw normalizeError(error, "Failed to change user role");
    }
}

export async function activateUser(userId) {
    try {
        const response = await api.patch(ACTIVATE_USER(userId));
        return response.data;
    } catch (error) {
        throw normalizeError(error, "Failed to activate user");
    }
}



/// Logs

export async function getUserLogs(params) {
    try {
        const response = await api.get(GET_USER_LOGS, { params });
        return normalizePaginatedResponse(response.data);
        // return response.data;
    } catch (error) {
        throw normalizeError(error, "Failed to fetch user logs");
    }
}

