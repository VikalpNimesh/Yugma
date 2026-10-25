import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import THEME from '../../constant/theme';

const { width } = Dimensions.get('window');

export default function WelcomeHeroScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={THEME.colors.bgGradient}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.brandContainer}>
            <MaterialCommunityIcons name="flower-tulip" size={26} color={THEME.colors.gold} />
            <Text style={styles.brandTitle}>Yugma</Text>
          </View>

          <View style={styles.securityBadge}>
            <Icon name="shield-checkmark" size={14} color={THEME.colors.gold} />
            <Text style={styles.securityBadgeText}>Trusted & Secure</Text>
          </View>
        </View>

        {/* Center Medallion Visual */}
        <View style={styles.medallionWrapper}>
          <View style={styles.glowingAura}>
            <LinearGradient
              colors={['#FF4B72', '#B50E3E', '#5E041E']}
              style={styles.medallionCircle}
              start={{ x: 0.2, y: 0.2 }}
              end={{ x: 0.8, y: 0.8 }}
            >
              <View style={styles.innerMedallion}>
                <MaterialCommunityIcons name="heart-multiple" size={62} color="#FFF" style={styles.medallionIcon} />
                <MaterialCommunityIcons name="flower-outline" size={28} color={THEME.colors.gold} style={styles.lotusSubIcon} />
              </View>
            </LinearGradient>
          </View>

          {/* Floating Petal Accents */}
          <MaterialCommunityIcons name="cards-heart" size={16} color="rgba(255, 120, 160, 0.6)" style={styles.petal1} />
          <MaterialCommunityIcons name="cards-heart" size={20} color="rgba(255, 120, 160, 0.4)" style={styles.petal2} />
          <MaterialCommunityIcons name="cards-heart" size={14} color="rgba(255, 120, 160, 0.7)" style={styles.petal3} />
        </View>

        {/* Hero Title & Subtitle */}
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Find your{"\n"}perfect match</Text>
          <Text style={styles.heroSubtitle}>Two paths. One beautiful journey.</Text>
        </View>

        {/* Dual Path Preview Cards */}
        <View style={styles.cardsRow}>
          <TouchableOpacity
            style={styles.previewCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AppTypeSelection')}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.04)']}
              style={styles.previewCardGradient}
            >
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="heart-pulse" size={20} color="#FF6584" />
                <Text style={styles.cardTitle}>Connect</Text>
              </View>
              <Text style={styles.cardDesc}>Meet amazing people & build a real connection</Text>
              <View style={styles.cardArrow}>
                <Icon name="chevron-forward" size={14} color="#FFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.previewCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AppTypeSelection')}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.04)']}
              style={styles.previewCardGradient}
            >
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="ring" size={20} color={THEME.colors.gold} />
                <Text style={styles.cardTitle}>Find Life Partner</Text>
              </View>
              <Text style={styles.cardDesc}>Serious matches for a lifelong commitment</Text>
              <View style={styles.cardArrow}>
                <Icon name="chevron-forward" size={14} color="#FFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Primary CTA Button */}
        <TouchableOpacity
          style={styles.ctaButtonWrapper}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('AppTypeSelection')}
        >
          <LinearGradient
            colors={['#FFF2F5', '#FFFFFF']}
            style={styles.ctaButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialCommunityIcons name="flower-tulip" size={20} color="#8A1032" style={{ marginRight: 8 }} />
            <Text style={styles.ctaButtonText}>Get Started</Text>
            <Icon name="arrow-forward" size={18} color="#8A1032" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Footer Text */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Real People. Meaningful Connections.  ❤️
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.8,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.4)',
    gap: 5,
  },
  securityBadgeText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: '600',
  },
  medallionWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  glowingAura: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255, 45, 96, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF2D60',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 15,
  },
  medallionCircle: {
    width: 145,
    height: 145,
    borderRadius: 72.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  innerMedallion: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  medallionIcon: {
    marginBottom: -5,
  },
  lotusSubIcon: {
    marginTop: 2,
  },
  petal1: {
    position: 'absolute',
    top: 10,
    left: width * 0.18,
  },
  petal2: {
    position: 'absolute',
    bottom: 25,
    right: width * 0.18,
  },
  petal3: {
    position: 'absolute',
    top: 55,
    right: width * 0.22,
  },
  heroTextContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.3,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 15,
  },
  previewCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  previewCardGradient: {
    padding: 14,
    minHeight: 125,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 1,
  },
  cardDesc: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
  },
  cardArrow: {
    alignSelf: 'flex-end',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonWrapper: {
    marginTop: 15,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  ctaButtonText: {
    color: '#8A1032',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footerContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  footerText: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
