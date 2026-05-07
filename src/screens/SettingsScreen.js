// src/screens/SettingsScreen.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { ChevronLeft, Info } from 'lucide-react-native';
import { CC_THEME, CC_PALETTE } from '../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen({ settings, onUpdateSettings, onBack }) {
  const toggleSound = () => onUpdateSettings({ ...settings, sound: !settings.sound });
  const toggleHaptics = () => onUpdateSettings({ ...settings, haptics: !settings.haptics });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>GAMEPLAY</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>Sound Effects</Text>
              <Text style={styles.rowSub}>Feedback on tap</Text>
            </View>
            <Switch
              value={settings.sound}
              onValueChange={toggleSound}
              trackColor={{ false: '#334155', true: CC_PALETTE.GREEN }}
            />
          </View>
          <View style={[styles.row, styles.noBorder]}>
            <View>
              <Text style={styles.rowLabel}>Haptic Feedback</Text>
              <Text style={styles.rowSub}>Vibrate on interaction</Text>
            </View>
            <Switch
              value={settings.haptics}
              onValueChange={toggleHaptics}
              trackColor={{ false: '#334155', true: CC_PALETTE.GREEN }}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowLabel}>How to Play</Text>
              <Text style={styles.rowSub}>Tap the word's meaning, ignore ink.</Text>
            </View>
            <Info color={CC_THEME.textDim} size={20} />
          </View>
          <View style={[styles.row, styles.noBorder]}>
            <View>
              <Text style={styles.rowLabel}>Version</Text>
              <Text style={styles.rowSub}>1.0.0 (Native)</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>Designed for high performance.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 11,
    color: CC_THEME.textDim,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 20,
    paddingLeft: 4,
  },
  section: {
    backgroundColor: CC_THEME.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CC_THEME.line,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: CC_THEME.line,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  rowSub: {
    fontSize: 12,
    color: CC_THEME.textDim,
    marginTop: 2,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 12,
    color: CC_THEME.textDimmer,
    fontWeight: '600',
  },
});
