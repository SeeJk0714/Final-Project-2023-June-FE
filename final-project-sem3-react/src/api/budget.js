import axios from "axios";

import { API_URL } from "./data";

export const fetchBudgets = async (token = "") => {
    const response = await axios({
        method: "GET",
        url: API_URL + "/budgets",
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};

export const getBudget = async (id) => {
    const response = await axios.get(API_URL + "/budgets/" + id);
    return response.data;
};

export const createBudget = async ({ data, token = "" }) => {
    const response = await axios({
        method: "POST",
        url: API_URL + "/budgets",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        data: data,
    });
    return response.data;
};

export const deleteBudget = async ({ id = "", token = "" }) => {
    const response = await axios({
        method: "DELETE",
        url: API_URL + "/budgets/" + id,
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};
