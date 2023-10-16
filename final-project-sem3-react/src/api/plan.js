import axios from "axios";

import { API_URL } from "./data";

export const fetchPlans = async (token = "") => {
    const response = await axios({
        method: "GET",
        url: API_URL + "/plans",
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};

export const getPlan = async (id) => {
    const response = await axios.get(API_URL + "/plans/" + id);
    return response.data;
};

export const addPlan = async ({ data, token = "" }) => {
    const response = await axios({
        method: "POST",
        url: API_URL + "/plans",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        data: data,
    });
    return response.data;
};

export const updatePlan = async ({ id, data, token = "" }) => {
    const response = await axios({
        method: "PUT",
        url: API_URL + "/plans/" + id,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        data: data,
    });
    return response.data;
};

export const deletePlan = async ({ id = "", token = "" }) => {
    const response = await axios({
        method: "DELETE",
        url: API_URL + "/plans/" + id,
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};
