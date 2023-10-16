import axios from "axios";

import { API_URL } from "./data";

export const fetchLists = async () => {
    const response = await axios.get(API_URL + "/lists");
    return response.data;
};

export const addList = async (data) => {
    const response = await axios({
        method: "POST",
        url: API_URL + "/lists",
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    });
    return response.data;
};

export const ClickList = async (id) => {
    const response = await axios({
        method: "PUT",
        url: API_URL + "/lists/" + id + "/click",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const UnclickList = async (id) => {
    const response = await axios({
        method: "PUT",
        url: API_URL + "/lists/" + id + "/unclick",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const deleteList = async (list_id = "") => {
    const response = await axios({
        method: "DELETE",
        url: API_URL + "/lists/" + list_id,
    });
    return response.data;
};
