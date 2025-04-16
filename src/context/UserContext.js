import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadPingoCoupleUser = async () => {
      try {
        const storedPingoCoupleUser = await AsyncStorage.getItem('currentUser');
        if (storedPingoCoupleUser) {
          setUser(JSON.parse(storedPingoCoupleUser));
        }
      } catch (error) {
        console.error('Error loading storedPingoCoupleUser user:', error);
      }
    };
    loadPingoCoupleUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
