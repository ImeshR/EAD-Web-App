import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

const UserContext = createContext({
  user: null,
  setUserData: () => {},
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const setUserData = (userData) => {
    setUser(userData);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        // Validate if the required claims exist
        const userData = {
          id: decoded.UserId || null,
          email: decoded.Email || null,
          role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null,
        };

        // Set user data only if we have a valid user object
        if (userData.id && userData.email && userData.role) {
          setUser(userData);
        } else {
          console.error("Token is missing necessary claims.");
        }
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
