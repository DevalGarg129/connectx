import api from "../api/axios";

export const createRoom = async (data) => {
    const response = await api.post("/rooms/create", data);
    return response.data;
};

export const joinRoom = async (roomId) => {
    const response = await api.post(`/rooms/${roomId}/join`, data);
    return response.data;
};

export const leaveRoom = async (roomId) => {
    const response = await api.post(`/rooms/${roomId}/leave`, data);
    return response.data;
};

export const getRoom = async (roomId) => {
    const response = await api.post(`/rooms/${roomId}`, data);
    return response.data;
};

export const endRoom = async (roomId) => {
    const response = await api.patch(`/rooms/${roomId}/end`);
    return response.data;
};

export const updateRoomSettings = async (roomId, data) => {
    const response = await api.patch(`/rooms/${roomId}/settings`, data);
    return response.data;
};

export const deleteRoom = async (roomId) => {
    const response = await api.delete(`/rooms/${roomId}`);
    return response.data;
};