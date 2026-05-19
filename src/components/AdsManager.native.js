// src/components/AdsManager.native.js
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import mobileAds, {
  AdEventType,
  BannerAd,
  BannerAdSize,
  RewardedAdEventType,
  RewardedInterstitialAd,
} from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../constants/ads';

// ─── SDK Init ────────────────────────────────────────────────────────────────

export const initializeAds = () => {
  return mobileAds().initialize();
};

// ─── Banner Ad ────────────────────────────────────────────────────────────────

export const AppBannerAd = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  return (
    <View style={styles.bannerContainer}>
      {!isLoaded && (
        <View style={styles.bannerPlaceholder}>
          <Text style={styles.placeholderText}>
            {hasFailed ? 'Ad unavailable' : 'Loading ad...'}
          </Text>
        </View>
      )}
      <BannerAd
        unitId={AD_UNIT_IDS.BANNER}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={() => {
          setIsLoaded(true);
          setHasFailed(false);
          console.log('[AdMob] Banner loaded');
        }}
        onAdFailedToLoad={(e) => {
          setIsLoaded(false);
          setHasFailed(true);
          console.warn('[AdMob] Banner failed:', e.message);
        }}
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

    rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
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
    const unsubscribe = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      console.log('[AdMob] Rewarded interstitial closed');
      loadRewardedInterstitial();
      finish();
    });
    
    rewardedAd.show().catch((err) => {
      console.error('[AdMob] show() error:', err);
      if (typeof unsubscribe === 'function') unsubscribe();
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
    position: 'relative',
  },
  bannerPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    fontWeight: '600',
  },
});
