import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; 

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
      const decoded = jwtDecode(token);

      const userData = {
        id: decoded.UserId,
        email: decoded.Email,
        role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      };

     
      setUser(userData);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
