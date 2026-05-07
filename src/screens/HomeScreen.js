// src/screens/HomeScreen.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Play, Settings, Trophy, Volume2 } from 'lucide-react-native';
import { CC_THEME, CC_PALETTE, alpha } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBannerAd } from '../components/AdsManager';

const { width } = Dimensions.get('window');

export default function HomeScreen({ bestScore, onPlay, onSettings }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn}>
          <Volume2 color="#fff" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onSettings}>
          <Settings color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <View style={styles.titleContainer}>
          <Text style={styles.titlePrefix}>Color</Text>
          <Text style={styles.titleSuffix}>Command</Text>
        </View>
        <Text style={styles.tagline}>
          Tap the <Text style={styles.boldText}>word</Text> — not the color.{"\n"}
          Don't let your eyes fool you.
        </Text>
      </View>

      <View style={styles.scoreCard}>
        <View style={styles.scoreLeft}>
          <View style={styles.trophyIcon}>
            <Trophy color={CC_PALETTE.YELLOW} size={20} />
          </View>
          <View>
            <Text style={styles.scoreLabel}>BEST SCORE</Text>
            <Text style={styles.scoreValue}>{bestScore}</Text>
          </View>
        </View>
        <View style={styles.rankContainer}>
          <Text style={styles.scoreLabel}>RANK</Text>
          <Text style={[styles.rankValue, { color: bestScore >= 30 ? CC_PALETTE.GREEN : bestScore >= 10 ? CC_PALETTE.YELLOW : CC_THEME.textDim }]}>
            {bestScore >= 30 ? 'EXPERT' : bestScore >= 10 ? 'SHARP' : 'ROOKIE'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.playBtn} onPress={onPlay}>
        <Play fill="#0F172A" color="#0F172A" size={24} />
        <Text style={styles.playBtnText}>PLAY</Text>
      </TouchableOpacity>
      
      <AppBannerAd />
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made for fast fingers.</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
  },
  titlePrefix: {
    fontSize: 48,
    fontWeight: '900',
    color: CC_THEME.text,
    lineHeight: 48,
  },
  titleSuffix: {
    fontSize: 48,
    fontWeight: '900',
    color: CC_PALETTE.YELLOW, // Gradient-like feel
    lineHeight: 48,
  },
  tagline: {
    marginTop: 16,
    fontSize: 16,
    color: CC_THEME.textDim,
    textAlign: 'center',
    lineHeight: 22,
  },
  boldText: {
    color: CC_THEME.text,
    fontWeight: '700',
  },
  scoreCard: {
    backgroundColor: CC_THEME.card,
    borderWidth: 1,
    borderColor: CC_THEME.line,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scoreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trophyIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: alpha(CC_PALETTE.YELLOW, 0.15),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  scoreLabel: {
    fontSize: 11,
    color: CC_THEME.textDim,
    fontWeight: '700',
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '800',
    color: CC_THEME.text,
  },
  rankContainer: {
    alignItems: 'flex-end',
  },
  rankValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  playBtn: {
    backgroundColor: '#FFFFFF',
    height: 64,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  playBtnText: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '800',
    marginLeft: 12,
    letterSpacing: 1,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    color: CC_THEME.textDimmer,
    fontSize: 12,
    fontWeight: '600',
  },
});
