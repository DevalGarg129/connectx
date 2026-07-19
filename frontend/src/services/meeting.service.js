import api from "../api/axios";

export const createMeeting = async (data) => {
    const response = await api.post("/meeting/create", data);
    return response.data;
}

export const joinMeeting = async (meetingCode) => {
    const response = await api.post(`/meeting/join/${meetingCode}`, meetingCode);
    return response.data;
}

export const leaveMeeting = async (meetingCode) => {
    const response = await api.post(`/meeting/join/${meetingCode}`, meetingCode);
    return response.data;
}

export const endMeeting = async (meetingCode) => {
    const response = await api.put(`/meeting/end/${meetingCode}`, meetingCode);
    return response.data;
}

export const getMeeting = async (meetingCode) => {
    const response = await api.get(`/meeting/getMeeting/${meetingCode}`, meetingCode);
    return response.data;
}

export const getMyMeetings = async () => {
    const response = await api.get(`/meeting/my/all`);
    return response.data;
}
