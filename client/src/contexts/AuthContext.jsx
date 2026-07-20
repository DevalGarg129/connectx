import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    register,
    login,
    getHistory,
    addHistory,
} from "../services/auth.service";

import {
    TOKEN_KEY,
    USER_KEY,
} from "../config/constants";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const user = localStorage.getItem(USER_KEY);

        if (user) {
            setUserData(JSON.parse(user));
        }

        setLoading(false);

    }, []);

    const handleRegister = async (name, username, password) => {

        return await register(name, username, password);

    };

    const handleLogin = async (username, password) => {

        const data = await login(username, password);

        localStorage.setItem(TOKEN_KEY, data.token);

        if (data.user) {

            localStorage.setItem(
                USER_KEY,
                JSON.stringify(data.user)
            );

            setUserData(data.user);

        }

        navigate("/home");

        return data;

    };

    const handleLogout = () => {

        localStorage.removeItem(TOKEN_KEY);

        localStorage.removeItem(USER_KEY);

        setUserData(null);

        navigate("/");

    };

    const getHistoryOfUser = async () => {

        return await getHistory();

    };

    const addToUserHistory = async (meetingCode) => {

        return await addHistory(meetingCode);

    };

    const value = {

        userData,

        loading,

        handleLogin,

        handleLogout,

        handleRegister,

        getHistoryOfUser,

        addToUserHistory,

    };

    return (

        <AuthContext.Provider value={value}>

            {children}

        </AuthContext.Provider>

    );

};