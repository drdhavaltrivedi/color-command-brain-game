// src/components/AdsManager.js (Web Mock)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// This file is used for Web builds where react-native-google-mobile-ads is not supported.

export const initializeAds = () => {
  console.log('AdMob: Initialized (Web Mock)');
  return Promise.resolve();
};

export const AppBannerAd = () => {
  return (
    <View style={styles.bannerPlaceholder}>
      <Text style={styles.placeholderText}>[ Advertisement ]</Text>
    </View>
  );
};

export const loadRewardedInterstitial = () => {
  console.log('AdMob Rewarded Interstitial: Not supported on Web');
};

export const showRewardedInterstitial = (onAdFinished) => {
  console.log('AdMob Rewarded Interstitial: Not supported on Web');
  if (onAdFinished) onAdFinished();
};

// Legacy support
export const loadInterstitial = loadRewardedInterstitial;
export const showInterstitial = showRewardedInterstitial;

const styles = StyleSheet.create({
  bannerPlaceholder: {
    height: 60,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
