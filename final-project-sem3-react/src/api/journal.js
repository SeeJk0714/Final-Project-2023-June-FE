import axios from "axios";

import { API_URL } from "./data";

export const fetchJournals = async (token = "") => {
    const response = await axios({
        method: "GET",
        url: API_URL + "/journals",
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};

export const getJournal = async (id) => {
    const response = await axios.get(API_URL + "/journals/" + id);
    return response.data;
};

export const addJournal = async ({ data, token = "" }) => {
    const response = await axios({
        method: "POST",
        url: API_URL + "/journals",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        data: data,
    });
    return response.data;
};

export const updateJournal = async ({ id, data, token = "" }) => {
    const response = await axios({
        method: "PUT",
        url: API_URL + "/journals/" + id,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        data: data,
    });
    return response.data;
};

export const deleteJournal = async ({ id = "", token = "" }) => {
    const response = await axios({
        method: "DELETE",
        url: API_URL + "/journals/" + id,
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};
