import api from "../api/axios";

export const register = async (name, username, password) => {
    const response = await api.post("/users/register", {
        name,
        username,
        password,
    });

    return response.data;
};

export const login = async (username, password) => {
    const response = await api.post("/users/login", {
        username,
        password,
    });

    return response.data;
};

export const getHistory = async () => {
    const response = await api.get("/users/get_all_activity");

    return response.data;
};

export const addHistory = async (meetingCode) => {
    const response = await api.post("/users/add_to_activity", {
        meeting_code: meetingCode,
    });

    return response.data;
};