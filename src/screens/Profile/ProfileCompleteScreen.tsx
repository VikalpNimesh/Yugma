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
import { useAppDispatch } from '../../redux/hooks';
import { fetchUserProfile } from '../../redux/slices/authSlice';

const { width } = Dimensions.get('window');

export default function ProfileCompleteScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const handleExplore = async () => {
    try {
      await dispatch(fetchUserProfile());
    } catch (e) {
      console.log('Error refreshing user profile:', e);
    }

    try {
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTabs' }],
      });
    } catch (e) {
      navigation.navigate('BottomTabs');
    }
  };

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
        <View style={styles.content}>
          {/* Glowing Heart Checkmark Medallion */}
          <View style={styles.medallionWrapper}>
            <View style={styles.outerGlowRing}>
              <LinearGradient
                colors={['#FF2A6D', '#B30B38', '#5E041E']}
                style={styles.innerMedallion}
                start={{ x: 0.2, y: 0.2 }}
                end={{ x: 0.8, y: 0.8 }}
              >
                <View style={styles.heartWrapper}>
                  <MaterialCommunityIcons name="heart" size={80} color="#FF3366" />
                  <View style={styles.checkIconOverlay}>
                    <Icon name="checkmark" size={38} color="#FFFFFF" />
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Floating Sparkles & Petals */}
            <MaterialCommunityIcons name="cards-heart" size={16} color="rgba(255, 120, 160, 0.6)" style={styles.petal1} />
            <MaterialCommunityIcons name="star-four-points" size={20} color={THEME.colors.gold} style={styles.sparkle1} />
            <MaterialCommunityIcons name="cards-heart" size={18} color="rgba(255, 120, 160, 0.4)" style={styles.petal2} />
          </View>

          {/* Heading and Congratulatory Text */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>You're all set! 🎉</Text>
            <Text style={styles.subtitle}>
              Your profile is ready to shine.{"\n"}Let's find your perfect match.
            </Text>
          </View>

          {/* Primary CTA: Explore Matches */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.exploreBtnWrapper}
              onPress={handleExplore}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#FFF5F8', '#FFFFFF']}
                style={styles.exploreBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.exploreBtnText}>Explore Matches</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Secondary Action: Go to Dashboard */}
            <TouchableOpacity
              style={styles.dashboardLink}
              onPress={handleExplore}
              activeOpacity={0.7}
            >
              <Text style={styles.dashboardLinkText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </View>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medallionWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 35,
    position: 'relative',
  },
  outerGlowRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255, 45, 96, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF2D60',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.65,
    shadowRadius: 28,
    elevation: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  innerMedallion: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petal1: {
    position: 'absolute',
    top: 0,
    left: -20,
  },
  sparkle1: {
    position: 'absolute',
    top: 20,
    right: -24,
  },
  petal2: {
    position: 'absolute',
    bottom: 5,
    left: -10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  exploreBtnWrapper: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  exploreBtn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreBtnText: {
    color: '#8A1032',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dashboardLink: {
    marginTop: 18,
    paddingVertical: 8,
  },
  dashboardLinkText: {
    color: THEME.colors.gold,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
