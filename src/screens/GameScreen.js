// src/screens/GameScreen.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Pause } from 'lucide-react-native';
import { CC_THEME, CC_PALETTE, alpha, shade } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useSound } from '../hooks/useSound';

const { width } = Dimensions.get('window');

const COLORS_4 = [
  { name: 'RED',    hex: CC_PALETTE.RED },
  { name: 'BLUE',   hex: CC_PALETTE.BLUE },
  { name: 'GREEN',  hex: CC_PALETTE.GREEN },
  { name: 'YELLOW', hex: CC_PALETTE.YELLOW },
];
const COLORS_6 = [
  ...COLORS_4,
  { name: 'PURPLE', hex: CC_PALETTE.PURPLE },
  { name: 'ORANGE', hex: CC_PALETTE.ORANGE },
];

function pickRandom(arr, except) {
  let pool = except ? arr.filter(x => x.name !== except.name) : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

function generateRound(colors, prevWord, trapAllowed) {
  const wordColor = pickRandom(colors, prevWord);
  let displayColor;
  if (trapAllowed && Math.random() < 0.18) {
    displayColor = wordColor;
  } else {
    displayColor = pickRandom(colors, wordColor);
  }
  return { id: Math.random(), wordColor, displayColor };
}

export default function GameScreen({ tweaks, settings, onGameOver, onPause }) {
  const colors = tweaks.colorCount === 6 ? COLORS_6 : COLORS_4;
  const reverseMode = tweaks.reverseMode;

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(() => generateRound(colors, null, false));
  const [timeLeft, setTimeLeft] = useState(tweaks.startTimer);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [pressedKey, setPressedKey] = useState(null);

  const { playSound } = useSound(settings.sound);

  const timerAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const lastTickRef = useRef(Date.now());
  const lockedRef = useRef(false);
  const intervalRef = useRef(null);

  const roundDuration = useMemo(() => {
    const start = tweaks.startTimer;
    const reductionPerStep = tweaks.rampSpeed === 'slow' ? 0.12 : tweaks.rampSpeed === 'fast' ? 0.28 : 0.20;
    const stepEvery = tweaks.rampSpeed === 'slow' ? 6 : tweaks.rampSpeed === 'fast' ? 4 : 5;
    const steps = Math.floor(score / stepEvery);
    return Math.max(1.0, start - steps * reductionPerStep);
  }, [score, tweaks]);

  const trapEnabled = tweaks.trapMode && score >= 15;

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, [round]);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    setTimeLeft(roundDuration);
    timerAnim.setValue(1);
    
    lastTickRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      if (lockedRef.current) return;
      
      const now = Date.now();
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      
      setTimeLeft(t => {
        const next = t - dt;
        if (next <= 0) {
          handleTimeout();
          return 0;
        }
        return next;
      });
    }, 16);
  };

  const handleTimeout = () => {
    lockedRef.current = true;
    triggerWrong(null);
  };

  const nextRound = (prevWord) => {
    const r = generateRound(colors, prevWord, trapEnabled);
    setRound(r);
    setFeedback(null);
    setPressedKey(null);
    lockedRef.current = false;
  };

  const handleTap = (colorName) => {
    if (lockedRef.current) return;
    setPressedKey(colorName);
    const correctAnswer = reverseMode ? round.displayColor.name : round.wordColor.name;
    if (colorName === correctAnswer) {
      triggerCorrect();
    } else {
      triggerWrong(colorName);
    }
  };

  const triggerCorrect = () => {
    lockedRef.current = true;
    setFeedback('correct');
    playSound('correct');
    if (settings.haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const newStreak = streak + 1;
    let bonus = 0;
    if (newStreak > 0 && newStreak % 3 === 0) bonus = 2;
    setScore(s => s + 1 + bonus);
    setStreak(newStreak);

    setTimeout(() => nextRound(round.wordColor), 180);
  };

  const triggerWrong = (tappedName) => {
    lockedRef.current = true;
    setFeedback('wrong');
    playSound('wrong');
    if (settings.haptics) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      onGameOver(score);
    }, 1200);
  };

  const timerPct = Math.max(0, timeLeft / roundDuration);
  const timerColor = timerPct > 0.5 ? CC_PALETTE.GREEN : timerPct > 0.25 ? CC_PALETTE.YELLOW : CC_PALETTE.RED;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onPause} style={styles.pauseBtn}>
          <Pause color="#fff" size={20} />
        </TouchableOpacity>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        <View style={[styles.streakContainer, streak >= 3 && styles.streakActive]}>
          <Text style={[styles.streakText, streak >= 3 && styles.streakTextActive]}>
            {streak >= 1 ? (streak >= 3 ? '🔥' : '✦') : ''} ×{streak}
          </Text>
        </View>
      </View>

      <View style={styles.timerTrack}>
        <View style={[styles.timerFill, { width: `${timerPct * 100}%`, backgroundColor: timerColor }]} />
      </View>

      <View style={styles.modeInfo}>
        <Text style={styles.infoText}>ROUND · {score + 1}</Text>
        <Text style={styles.infoText}>
          {reverseMode ? 'REVERSE · TAP INK' : 'TAP THE WORD'}{trapEnabled ? ' · TRAP' : ''}
        </Text>
      </View>

      <Animated.View style={[styles.wordArea, { transform: [{ translateX: shakeAnim }] }]}>
        <Text style={[styles.word, { color: round.displayColor.hex, textShadowColor: alpha(round.displayColor.hex, 0.4) }]}>
          {round.wordColor.name}
        </Text>
        {score === 0 && feedback === null && (
          <Text style={styles.hint}>
            {reverseMode ? 'Tap the INK color' : 'Tap what it SAYS'}
          </Text>
        )}
      </Animated.View>

      <View style={[styles.grid, { height: colors.length === 6 ? 280 : 200 }]}>
        {colors.map(c => (
          <TouchableOpacity
            key={c.name}
            activeOpacity={0.8}
            onPress={() => handleTap(c.name)}
            disabled={lockedRef.current}
            style={[
              styles.colorBtn,
              { backgroundColor: c.hex, shadowColor: shade(c.hex, -25) },
              feedback === 'wrong' && pressedKey === c.name && styles.wrongBtn,
              feedback === 'wrong' && c.name === (reverseMode ? round.displayColor.name : round.wordColor.name) && styles.correctHintBtn
            ]}
          >
            <Text style={styles.colorBtnText}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {feedback === 'correct' && <View style={[styles.flash, { backgroundColor: alpha(CC_PALETTE.GREEN, 0.3) }]} />}
      {feedback === 'wrong' && (
        <View style={[styles.flash, { backgroundColor: alpha(CC_PALETTE.RED, 0.4), alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={styles.wrongTitle}>WRONG</Text>
          <Text style={styles.wrongSub}>ANSWER WAS</Text>
          <Text style={[styles.wrongAnswer, { color: (reverseMode ? round.displayColor : round.wordColor).hex }]}>
            {(reverseMode ? round.displayColor : round.wordColor).name}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  pauseBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 10,
    color: CC_THEME.textDim,
    fontWeight: '700',
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 32,
  },
  streakContainer: {
    minWidth: 50,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  streakActive: {
    backgroundColor: alpha(CC_PALETTE.ORANGE, 0.18),
    borderWidth: 1,
    borderColor: alpha(CC_PALETTE.ORANGE, 0.4),
  },
  streakText: {
    fontSize: 13,
    fontWeight: '800',
    color: CC_THEME.textDim,
  },
  streakTextActive: {
    color: CC_PALETTE.ORANGE,
  },
  timerTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 4,
    marginTop: 16,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    borderRadius: 4,
  },
  modeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  infoText: {
    fontSize: 11,
    color: CC_THEME.textDimmer,
    fontWeight: '700',
    letterSpacing: 1,
  },
  wordArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  word: {
    fontSize: 72,
    fontWeight: '900',
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
  },
  hint: {
    position: 'absolute',
    bottom: 20,
    fontSize: 14,
    color: CC_THEME.textDimmer,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorBtn: {
    width: '48%',
    height: '45%',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4%',
    elevation: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  colorBtnText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  flash: {
    position: 'absolute',
    inset: 0,
    zIndex: 100,
    pointerEvents: 'none',
  },
  wrongTitle: {
    fontSize: 64,
    fontWeight: '900',
    color: '#fff',
  },
  wrongSub: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
    marginTop: 10,
    letterSpacing: 2,
  },
  wrongAnswer: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: 4,
  },
  wrongBtn: {
    opacity: 0.5,
  },
  correctHintBtn: {
    borderWidth: 4,
    borderColor: '#fff',
  }
});
