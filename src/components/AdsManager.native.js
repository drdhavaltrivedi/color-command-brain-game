// src/components/AdsManager.native.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import mobileAds, {
  BannerAd,
  BannerAdSize,
  RewardedInterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../constants/ads';

// ─── SDK Init ────────────────────────────────────────────────────────────────

export const initializeAds = () => {
  return mobileAds().initialize();
};

// ─── Banner Ad ────────────────────────────────────────────────────────────────

export const AppBannerAd = () => {
  return (
    <View style={styles.bannerContainer}>
      <BannerAd
        unitId={AD_UNIT_IDS.BANNER}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={() => console.log('[AdMob] Banner loaded')}
        onAdFailedToLoad={(e) => console.warn('[AdMob] Banner failed:', e.message)}
      />
    </View>
  );
};

// ─── Rewarded Interstitial ────────────────────────────────────────────────────

let rewardedAd = null;
let isAdLoading = false;

export const loadRewardedInterstitial = () => {
  if (isAdLoading) return;
  isAdLoading = true;

  try {
    rewardedAd = RewardedInterstitialAd.createForAdRequest(
      AD_UNIT_IDS.REWARDED_INTERSTITIAL,
      { requestNonPersonalizedAdsOnly: true }
    );

    rewardedAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('[AdMob] Rewarded interstitial loaded');
      isAdLoading = false;
    });

    rewardedAd.addAdEventListener(AdEventType.ERROR, (e) => {
      console.warn('[AdMob] Rewarded interstitial error:', e.message);
      isAdLoading = false;
    });

    rewardedAd.load();
  } catch (err) {
    console.error('[AdMob] Failed to create rewarded interstitial:', err);
    isAdLoading = false;
  }
};

export const showRewardedInterstitial = (onAdFinished) => {
  const finish = () => {
    if (onAdFinished) {
      onAdFinished();
      onAdFinished = null; // Prevent double call
    }
  };

  if (rewardedAd && rewardedAd.loaded) {
    const subscription = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      subscription.remove();
      console.log('[AdMob] Rewarded interstitial closed');
      loadRewardedInterstitial();
      finish();
    });
    
    rewardedAd.show().catch((err) => {
      console.error('[AdMob] show() error:', err);
      subscription.remove();
      loadRewardedInterstitial();
      finish();
    });
  } else {
    console.log('[AdMob] Rewarded interstitial not ready – skipping');
    loadRewardedInterstitial();
    finish();
  }
};

// ─── Legacy aliases ───────────────────────────────────────────────────────────
export const loadInterstitial = loadRewardedInterstitial;
export const showInterstitial = showRewardedInterstitial;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  bannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 60, // Ensure there's space for the banner
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
});
