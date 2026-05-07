// App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { CC_THEME } from './src/constants/theme';

// Screens (we will create these)
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { loadInterstitial, showInterstitial } from './src/components/AdsManager';

const TWEAK_DEFAULTS = {
  startTimer: 3.0,
  rampSpeed: 'normal',
  colorCount: 4,
  reverseMode: false,
  trapMode: true,
  flashIntensity: 'medium',
};

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [settings, setSettings] = useState({ sound: true, haptics: true });
  const [gameCount, setGameCount] = useState(0);

  useEffect(() => {
    loadInterstitial();
  }, []);

  const handleGameOver = (finalScore) => {
    setScore(finalScore);
    if (finalScore > bestScore) {
      setBestScore(finalScore);
    }
    setScreen('gameover');
    
    const newCount = gameCount + 1;
    setGameCount(newCount);
    if (newCount % 3 === 0) {
      showInterstitial();
    }

    if (settings.haptics) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen onDone={() => setScreen('home')} />;
      case 'home':
        return (
          <HomeScreen
            bestScore={bestScore}
            onPlay={() => setScreen('game')}
            onSettings={() => setScreen('settings')}
          />
        );
      case 'game':
        return (
          <GameScreen
            tweaks={tweaks}
            settings={settings}
            onGameOver={handleGameOver}
            onPause={() => {}} // TODO: Add pause logic
          />
        );
      case 'gameover':
        return (
          <GameOverScreen
            score={score}
            bestScore={bestScore}
            onRetry={() => setScreen('game')}
            onHome={() => setScreen('home')}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={setSettings}
            onBack={() => setScreen('home')}
          />
        );
      default:
        return <HomeScreen onPlay={() => setScreen('game')} />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {renderScreen()}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CC_THEME.background,
  },
});
