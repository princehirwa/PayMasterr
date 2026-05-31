import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('epms_token');
    const username = localStorage.getItem('epms_user');
    if (token && username) setUser({ username });
  }, []);

  const loginUser = (token, username) => {
    localStorage.setItem('epms_token', token);
    localStorage.setItem('epms_user', username);
    setUser({ username });
  };

  const logoutUser = () => {
    localStorage.removeItem('epms_token');
    localStorage.removeItem('epms_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
