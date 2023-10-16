import axios from "axios";

import { API_URL } from "./data";

export const fetchTodolists = async (token = "") => {
    const response = await axios({
        method: "GET",
        url: API_URL + "/todolists",
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};

export const getTodolist = async (id) => {
    const response = await axios.get(API_URL + "/todolists/" + id);
    return response.data;
};

export const addTodoList = async ({ data, token = "" }) => {
    const response = await axios({
        method: "POST",
        url: API_URL + "/todolists",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        data: data,
    });
    return response.data;
};

export const deleteTodoList = async ({ id = "", token = "" }) => {
    const response = await axios({
        method: "DELETE",
        url: API_URL + "/todolists/" + id,
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};
