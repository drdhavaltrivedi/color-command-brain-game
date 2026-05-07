// src/components/AdsManager.js (Web Mock)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// This file is used for Web builds where react-native-google-mobile-ads is not supported.

export const AppBannerAd = () => {
  return (
    <View style={styles.bannerPlaceholder}>
      <Text style={styles.placeholderText}>[ Advertisement ]</Text>
    </View>
  );
};

export const loadInterstitial = () => {
  console.log('AdMob Interstitial: Not supported on Web');
};

export const showInterstitial = () => {
  console.log('AdMob Interstitial: Not supported on Web');
};

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
