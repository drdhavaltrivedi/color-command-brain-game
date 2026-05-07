// src/components/AdsManager.js
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

// Test IDs - Replace with your own in production
const BANNER_ID = Platform.select({
  android: TestIds.BANNER,
  ios: TestIds.BANNER,
});

const INTERSTITIAL_ID = Platform.select({
  android: TestIds.INTERSTITIAL,
  ios: TestIds.INTERSTITIAL,
});

export const AppBannerAd = () => {
  return (
    <View style={styles.bannerContainer}>
      <BannerAd
        unitId={BANNER_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

let interstitial = null;

export const loadInterstitial = () => {
  interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID, {
    requestNonPersonalizedAdsOnly: true,
  });
  
  interstitial.load();
};

export const showInterstitial = () => {
  if (interstitial && interstitial.loaded) {
    interstitial.show();
    loadInterstitial(); // Preload next one
  } else {
    loadInterstitial();
  }
};

const styles = StyleSheet.create({
  bannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
});
