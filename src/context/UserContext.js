import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadDeepDiveUser = async () => {
      try {
        const storedDeepDiveUser = await AsyncStorage.getItem('currentUser');
        if (storedDeepDiveUser) {
          setUser(JSON.parse(storedDeepDiveUser));
        }
      } catch (error) {
        console.error('Error loading storedDeepDiveUser user:', error);
      }
    };
    loadDeepDiveUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
