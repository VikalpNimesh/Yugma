import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/userSlice';

const { width, height } = Dimensions.get('window');

const connectBg = require('../../assets/journey_connect_bg.jpg');
const matrimonyBg = require('../../assets/journey_matrimony_bg.jpg');

export default function AppTypeSelectionScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const handleSelection = async (type: 'dating' | 'matrimonial') => {
    try {
      await AsyncStorage.setItem('hasLaunched', 'true');
      dispatch(updateUser({ appType: type }));
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error saving app journey selection', error);
      navigation.navigate('LoginScreen');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Main Royal Burgundy Background Gradient */}
      <LinearGradient
        colors={['#24020D', '#3B0417', '#1F020B', '#160107']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View
        style={[
          styles.contentWrapper,
          { paddingTop: Math.max(insets.top, 24) + 8, paddingBottom: Math.max(insets.bottom, 16) + 8 },
        ]}
      >
        {/* Ornate Top Header */}
        <View style={styles.header}>
          {/* Top Lotus Motif with Flourishes */}
          <View style={styles.flourishRow}>
            <View style={styles.flourishLine} />
            <MaterialCommunityIcons name="flower-tulip" size={16} color="#E5A96A" style={styles.sideLotus} />
            <MaterialCommunityIcons name="flower-poppy" size={24} color="#F5C518" style={styles.centerLotus} />
            <MaterialCommunityIcons name="flower-tulip" size={16} color="#E5A96A" style={styles.sideLotus} />
            <View style={styles.flourishLine} />
          </View>

          {/* Title */}
          <Text style={styles.titleMain}>Choose your</Text>
          <View style={styles.journeyRow}>
            <Text style={styles.titleItalic}>journey</Text>
            <View style={styles.heartArrowWrapper}>
              <MaterialCommunityIcons name="heart-multiple-outline" size={20} color="#F4BA78" />
            </View>
          </View>

          {/* Under-title ornament */}
          <View style={styles.subFlourishRow}>
            <View style={styles.flourishLineShort} />
            <MaterialCommunityIcons name="rhombus-medium" size={14} color="#E5A96A" />
            <View style={styles.flourishLineShort} />
          </View>
        </View>

        {/* Center Cards Container */}
        <View style={styles.cardsContainer}>
          {/* Option 1: Connect Card */}
          <TouchableOpacity
            style={styles.cardOuter}
            activeOpacity={0.9}
            onPress={() => handleSelection('dating')}
          >
            <ImageBackground
              source={connectBg}
              style={styles.cardImageBg}
              imageStyle={styles.cardImage}
              resizeMode="cover"
            >
              {/* Gradient Scrim for text readability */}
              <LinearGradient
                colors={[
                  'rgba(50, 4, 18, 0.4)',
                  'rgba(140, 16, 50, 0.1)',
                  'rgba(18, 2, 7, 0.45)',
                ]}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />

              {/* Card Content Top Row */}
              <View style={styles.cardTopRow}>
                <View style={styles.iconCirclePink}>
                  <MaterialCommunityIcons name="heart-multiple" size={24} color="#FF6584" />
                </View>

                <View style={styles.cardTexts}>
                  <Text style={styles.connectTitle}>Connect</Text>
                  <Text style={styles.connectSubtitle}>
                    Meet amazing people & build a real connection
                  </Text>
                </View>

                <View style={styles.arrowCirclePink}>
                  <Icon name="chevron-forward" size={16} color="#FFFFFF" />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* Overlapping 'OR' Badge */}
          <View style={styles.orBadgeWrapper}>
            <LinearGradient
              colors={['#D92357', '#990E37']}
              style={styles.orBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.orText}>OR</Text>
            </LinearGradient>
          </View>

          {/* Option 2: Find Life Partner Card */}
          <TouchableOpacity
            style={styles.cardOuter}
            activeOpacity={0.9}
            onPress={() => handleSelection('matrimonial')}
          >
            <ImageBackground
              source={matrimonyBg}
              style={styles.cardImageBg}
              imageStyle={styles.cardImage}
              resizeMode="cover"
            >
              {/* Subtle Warm Amber Gradient Overlay */}
              <LinearGradient
                colors={[
                  'rgba(255, 240, 230, 0.35)',
                  'rgba(255, 210, 180, 0.1)',
                  'rgba(60, 10, 20, 0.3)',
                ]}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />

              {/* Card Content Top Row */}
              <View style={styles.cardTopRow}>
                <View style={styles.iconCircleGold}>
                  <MaterialCommunityIcons name="ring" size={24} color="#600D22" />
                </View>

                <View style={styles.cardTexts}>
                  <Text style={styles.matrimonyTitle}>Find Life Partner</Text>
                  <Text style={styles.matrimonySubtitle}>
                    Serious matches for a lifelong commitment
                  </Text>
                </View>

                <View style={styles.arrowCirclePeach}>
                  <Icon name="chevron-forward" size={16} color="#600D22" />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        {/* Footer: 100% Safe & Trusted */}
        <View style={styles.footer}>
          <View style={styles.trustedBadge}>
            <MaterialCommunityIcons name="shield-check" size={18} color="#FF5F7E" />
            <Text style={styles.trustedBadgeText}>100% Safe & Trusted</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F020B',
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 6,
  },
  flourishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  flourishLine: {
    width: width * 0.22,
    height: 1,
    backgroundColor: 'rgba(245, 197, 24, 0.45)',
  },
  centerLotus: {
    marginHorizontal: 2,
  },
  sideLotus: {
    opacity: 0.8,
  },
  titleMain: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  journeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  titleItalic: {
    fontSize: 34,
    fontFamily: 'Georgia',
    fontStyle: 'italic',
    color: '#F4BA78',
    letterSpacing: 0.5,
  },
  heartArrowWrapper: {
    marginLeft: 4,
    justifyContent: 'center',
  },
  subFlourishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  flourishLineShort: {
    width: width * 0.16,
    height: 1,
    backgroundColor: 'rgba(245, 197, 24, 0.35)',
  },
  cardsContainer: {
    position: 'relative',
    marginVertical: 10,
    gap: 0,
  },
  cardOuter: {
    borderRadius: 26,
    overflow: 'hidden',
    height: height * 0.265,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  cardImageBg: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  cardImage: {
    borderRadius: 24,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    paddingTop: 18,
    gap: 12,
    zIndex: 2,
  },
  iconCirclePink: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 101, 132, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleGold: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(96, 13, 34, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTexts: {
    flex: 1,
    paddingTop: 2,
  },
  connectTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  connectSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.88)',
    fontWeight: '500',
  },
  matrimonyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4A081A',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  matrimonySubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#65172A',
    fontWeight: '600',
  },
  arrowCirclePink: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  arrowCirclePeach: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  orBadgeWrapper: {
    alignItems: 'center',
    zIndex: 10,
    marginVertical: -18,
  },
  orBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 6,
  },
  orText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 4,
  },
  trustedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  trustedBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

