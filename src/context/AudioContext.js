import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [volume, setVolume] = useState(1.0); 

  useEffect(() => {
    const loadDeepStoredVolume = async () => {
      try {
        const storedDeepVolumeHere = await AsyncStorage.getItem('volume');
        if (storedDeepVolumeHere !== null) {
          setVolume(parseFloat(storedDeepVolumeHere));
        }
      } catch (error) {
        console.log('Error loading the volume:', error);
      }
    };
    loadDeepStoredVolume();
  }, []);

  const handleChangeThisVolume = async (thisVolume) => {
    try {
      await AsyncStorage.setItem('volume', thisVolume.toString());
      setVolume(thisVolume);
    } catch (error) {
      console.log('Error saving volume:', error);
    }
  };

  return (
    <AudioContext.Provider value={{ volume, setVolume: handleChangeThisVolume }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
