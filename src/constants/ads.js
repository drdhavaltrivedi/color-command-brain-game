// src/constants/ads.js
import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

// Set to true to use test IDs
const USE_TEST_ADS = false;

export const AD_UNIT_IDS = {
  BANNER: Platform.select({
    android: USE_TEST_ADS ? TestIds.BANNER : 'ca-app-pub-7068210205141615/3776367167',
    ios: USE_TEST_ADS ? TestIds.BANNER : 'ca-app-pub-7068210205141615/7206529029',
  }),
  REWARDED_INTERSTITIAL: Platform.select({
    android: USE_TEST_ADS ? TestIds.REWARDED_INTERSTITIAL : 'ca-app-pub-7068210205141615/7795503220',
    ios: USE_TEST_ADS ? TestIds.REWARDED_INTERSTITIAL : 'ca-app-pub-7068210205141615/4147902251',
  }),
};
