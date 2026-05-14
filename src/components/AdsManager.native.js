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
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={() => console.log('[AdMob] Banner loaded')}
        onAdFailedToLoad={(e) => console.warn('[AdMob] Banner failed:', e.message)}
      />
    </View>
  );
};

// ─── Rewarded Interstitial ────────────────────────────────────────────────────
// One single instance is kept alive. After it shows+closes, a new one is
// pre-loaded automatically. Listeners are stored so they can be cleaned up.

let rewardedAd = null;
let loadedSub = null;
let closedSub = null;
let errorSub = null;

const removeAllListeners = () => {
  loadedSub?.remove();
  closedSub?.remove();
  errorSub?.remove();
  loadedSub = null;
  closedSub = null;
  errorSub = null;
};

export const loadRewardedInterstitial = () => {
  // Clean up previous instance and listeners first
  removeAllListeners();

  rewardedAd = RewardedInterstitialAd.createForAdRequest(
    AD_UNIT_IDS.REWARDED_INTERSTITIAL,
    { requestNonPersonalizedAdsOnly: true }
  );

  loadedSub = rewardedAd.addAdEventListener(AdEventType.LOADED, () => {
    console.log('[AdMob] Rewarded interstitial loaded');
  });

  errorSub = rewardedAd.addAdEventListener(AdEventType.ERROR, (e) => {
    console.warn('[AdMob] Rewarded interstitial error:', e.message);
  });

  rewardedAd.load();
};

export const showRewardedInterstitial = (onAdFinished) => {
  if (!rewardedAd || !rewardedAd.loaded) {
    console.log('[AdMob] Rewarded interstitial not ready – skipping');
    // Still preload for next time
    loadRewardedInterstitial();
    // Invoke callback immediately so the game flow is never blocked
    if (onAdFinished) onAdFinished();
    return;
  }

  // Listen for close ONCE, then preload the next ad
  const onClose = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
    onClose.remove();
    console.log('[AdMob] Rewarded interstitial closed');
    // Preload next ad AFTER the current one is fully dismissed
    loadRewardedInterstitial();
    // Navigate / execute callback now that the ad is gone
    if (onAdFinished) onAdFinished();
  });

  rewardedAd.show().catch((err) => {
    console.error('[AdMob] show() error:', err);
    onClose.remove();
    loadRewardedInterstitial();
    if (onAdFinished) onAdFinished();
  });
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
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
});
