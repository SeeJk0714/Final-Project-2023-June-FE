import axios from "axios";

import { API_URL } from "./data";

export const addBill = async (data) => {
    const response = await axios({
        method: "POST",
        url: API_URL + "/bills",
        headers: {
            "Content-Type": "application/json",
        },
        data: data,
    });
    return response.data;
};

export const deleteBill = async (bill_id = "") => {
    const response = await axios({
        method: "DELETE",
        url: API_URL + "/bills/" + bill_id,
    });
    return response.data;
};
