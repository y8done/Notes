import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Initialize Token from LocalStorage
    const [token, setToken] = useState(localStorage.getItem("token"));

    // 2. Initialize User from LocalStorage (Parse the JSON string)
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("userInfo");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // 3. Update the Login function to accept User Data
    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        
        // Save to LocalStorage
        localStorage.setItem("token", newToken);
        localStorage.setItem("userInfo", JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        
        // Clear LocalStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);