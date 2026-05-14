// src/screens/GameOverScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { RotateCcw, Home, Trophy, Zap } from 'lucide-react-native';
import { CC_THEME, CC_PALETTE, alpha } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBannerAd } from '../components/AdsManager';

export default function GameOverScreen({ score, bestScore, onRetry, onHome }) {
  const [isRetrying, setIsRetrying] = useState(false);
  const isNewBest = score >= bestScore && score > 0;
  const accuracy = score > 0 ? Math.min(100, Math.round((score / (score + 1)) * 100)) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>GAME OVER</Text>
        </View>

        <Text style={styles.finalScore}>{score}</Text>
        <Text style={styles.scoreLabel}>FINAL SCORE</Text>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, isNewBest && styles.statCardHighlight]}>
            <View style={styles.statHeader}>
              <Trophy size={16} color={CC_PALETTE.YELLOW} />
              <Text style={styles.statLabel}>BEST</Text>
            </View>
            <Text style={styles.statValue}>{bestScore}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Zap size={16} color={CC_PALETTE.PURPLE} />
              <Text style={styles.statLabel}>ACCURACY</Text>
            </View>
            <Text style={styles.statValue}>{accuracy}%</Text>
          </View>
        </View>

        {isNewBest && (
          <View style={styles.newBestContainer}>
            <Zap size={14} color={CC_PALETTE.YELLOW} fill={CC_PALETTE.YELLOW} />
            <Text style={styles.newBestText}>NEW PERSONAL BEST</Text>
          </View>
        )}
      </View>

      <AppBannerAd />

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.retryBtn, isRetrying && { opacity: 0.7 }]} 
          onPress={() => {
            if (isRetrying) return;
            setIsRetrying(true);
            onRetry();
          }}
          disabled={isRetrying}
        >
          <RotateCcw color="#0F172A" size={20} />
          <Text style={styles.retryBtnText}>{isRetrying ? 'LOADING...' : 'RETRY'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeBtn} onPress={onHome}>
          <Home color="#fff" size={20} />
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: alpha(CC_PALETTE.RED, 0.14),
    borderWidth: 1,
    borderColor: alpha(CC_PALETTE.RED, 0.35),
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: CC_PALETTE.RED,
    marginRight: 8,
  },
  badgeText: {
    color: CC_PALETTE.RED,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  finalScore: {
    fontSize: 100,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 100,
  },
  scoreLabel: {
    fontSize: 13,
    color: CC_THEME.textDim,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 40,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: CC_THEME.card,
    borderWidth: 1,
    borderColor: CC_THEME.line,
    borderRadius: 16,
    padding: 16,
  },
  statCardHighlight: {
    borderColor: alpha(CC_PALETTE.YELLOW, 0.4),
    backgroundColor: alpha(CC_PALETTE.YELLOW, 0.05),
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: CC_THEME.textDim,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  newBestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
  },
  newBestText: {
    color: CC_PALETTE.YELLOW,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  actions: {
    gap: 12,
  },
  retryBtn: {
    backgroundColor: '#fff',
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  retryBtnText: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  homeBtn: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  homeBtnText: {
    color: CC_THEME.textDim,
    fontSize: 14,
    fontWeight: '600',
  },
});
