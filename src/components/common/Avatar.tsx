import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, ImageStyle, TextStyle } from 'react-native';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 50, style }) => {
  const getInitials = (fullName?: string) => {
    if (!fullName) return '?';
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  const getRandomColor = (fullName?: string) => {
    if (!fullName) return '#ccc';
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF',
      '#33FFF5', '#FFB833', '#FF5F6D', '#4A148C', '#004D40'
    ];
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: getRandomColor(name),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...style,
  };

  const textStyle: TextStyle = {
    color: '#fff',
    fontSize: size * 0.4,
    fontWeight: '600',
  };

  const imageStyle: ImageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const isBrokenLocalPath = uri?.startsWith('file:///');
  const hasValidUri = uri && uri.trim() !== '' && !isBrokenLocalPath;

  if (hasValidUri) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri }}
          style={imageStyle}
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{getInitials(name)}</Text>
    </View>
  );
};

export default Avatar;
