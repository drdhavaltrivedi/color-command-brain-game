// src/components/AdsManager.native.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import mobileAds, { BannerAd, BannerAdSize, RewardedInterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../constants/ads';

export const initializeAds = () => {
  return mobileAds().initialize();
};

export const AppBannerAd = () => {
  return (
    <View style={styles.bannerContainer}>
      <BannerAd
        unitId={AD_UNIT_IDS.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.error('Banner ad failed to load: ', error);
        }}
      />
    </View>
  );
};

let rewardedInterstitial = null;

export const loadRewardedInterstitial = () => {
  rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(AD_UNIT_IDS.REWARDED_INTERSTITIAL, {
    requestNonPersonalizedAdsOnly: true,
  });
  
  rewardedInterstitial.addAdEventListener(AdEventType.LOADED, () => {
    console.log('Rewarded Interstitial Ad Loaded');
  });

  rewardedInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
    console.log('Rewarded Interstitial Ad Closed');
    loadRewardedInterstitial(); // Preload next one
  });

  rewardedInterstitial.load();
};

export const showRewardedInterstitial = (onAdFinished) => {
  if (rewardedInterstitial && rewardedInterstitial.loaded) {
    const subscription = rewardedInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
      subscription.remove();
      if (onAdFinished) onAdFinished();
    });
    
    rewardedInterstitial.show().catch(err => {
      console.error('Error showing ad:', err);
      subscription.remove();
      if (onAdFinished) onAdFinished();
    });
  } else {
    console.log('Rewarded Interstitial Ad not loaded yet');
    loadRewardedInterstitial();
    if (onAdFinished) onAdFinished(); // Fallback to continue flow
  }
};

// Legacy support for App.js if it was using InterstitialAd
export const loadInterstitial = loadRewardedInterstitial;
export const showInterstitial = showRewardedInterstitial;

const styles = StyleSheet.create({
  bannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
});
