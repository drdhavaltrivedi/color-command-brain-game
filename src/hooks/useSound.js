// src/hooks/useSound.js
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

const SOUND_URLS = {
  tap: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c3527e7d62.mp3', // Simple tap
  correct: 'https://cdn.pixabay.com/audio/2021/08/04/audio_062310d510.mp3', // Success/Ding
  wrong: 'https://cdn.pixabay.com/audio/2022/03/10/audio_7314546595.mp3', // Error/Buzz
  gameOver: 'https://cdn.pixabay.com/audio/2021/08/09/audio_88444c803a.mp3', // Game Over
};

export function useSound(enabled) {
  const [loadedSounds, setLoadedSounds] = useState({});

  useEffect(() => {
    async function loadAll() {
      const loaded = {};
      for (const [key, url] of Object.entries(SOUND_URLS)) {
        try {
          const { sound } = await Audio.Sound.createAsync({ uri: url });
          loaded[key] = sound;
        } catch (e) {
          console.log(`Error loading sound ${key}:`, e);
        }
      }
      setLoadedSounds(loaded);
    }

    loadAll();

    return () => {
      Object.values(loadedSounds).forEach(sound => sound.unloadAsync());
    };
  }, []);

  const playSound = async (key) => {
    if (!enabled || !loadedSounds[key]) return;
    try {
      await loadedSounds[key].replayAsync();
    } catch (e) {
      console.log(`Error playing sound ${key}:`, e);
    }
  };

  return { playSound };
}
