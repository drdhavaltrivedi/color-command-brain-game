// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, Animated } from 'react-native';
import { CC_THEME } from '../constants/theme';

export default function SplashScreen({ onDone }) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Color Command</Text>
        <Text style={styles.subtitle}>REFLEX · STROOP · FOCUS</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CC_THEME.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  title: {
    marginTop: 24,
    fontSize: 36,
    fontWeight: '900',
    color: CC_THEME.text,
    letterSpacing: -1,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: CC_THEME.textDim,
    letterSpacing: 2,
  },
});
