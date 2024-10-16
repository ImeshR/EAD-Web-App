import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom';

const UserContext = createContext({
  user: null,
  isLoading: true,
  setUserData: () => {},
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const setUserData = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setUser(null); // Reset user state
    navigate('/login'); // Redirect to login page
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);

        const userData = {
          id: decoded.UserId || null,
          email: decoded.Email || null,
          role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null,
        };

        if (userData.id && userData.email && userData.role) {
          setUser(userData);
        } else {
          console.error("Token is missing necessary claims.");
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Failed to decode token', error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false); // Set loading to false once token is processed
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, setUserData , logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
