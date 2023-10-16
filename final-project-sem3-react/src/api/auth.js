import axios from "axios";

import { API_URL } from "./data";

export const loginUser = async (data) => {
    const response = await axios({
        method: "POST",
        url: API_URL + "/auth/login",
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    });
    return response.data;
};

export const registerUser = async (data) => {
    const response = await axios({
        method: "POST",
        url: API_URL + "/auth/register",
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    });
    return response.data;
};

export const fetchUsers = async (token = "") => {
    const response = await axios({
        method: "GET",
        url: API_URL + "/auth",
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};

export const getUser = async (id) => {
    const response = await axios.get(API_URL + "/auth/" + id);
    return response.data;
};

export const addUser = async ({ data, token = "" }) => {
    const response = await axios({
        method: "POST",
        url: API_URL + "/auth",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        data: data,
    });
    return response.data;
};

export const passwordUser = async ({ data, token = "" }) => {
    const response = await axios({
        method: "POST",
        url: API_URL + "/auth/password",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        data: data,
    });
    return response.data;
};

export const updateUser = async ({ id, data, token = "" }) => {
    const response = await axios({
        method: "PUT",
        url: API_URL + "/auth/" + id,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        data: data,
    });
    return response.data;
};

export const updatePasword = async ({ id, data, token = "" }) => {
    const response = await axios({
        method: "PUT",
        url: API_URL + "/auth/password/" + id,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        data: data,
    });
    return response.data;
};

export const deleteUser = async ({ id = "", token = "" }) => {
    const response = await axios({
        method: "DELETE",
        url: API_URL + "/auth/" + id,
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};
