// components/MessageCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from './common/Avatar';
import THEME from '../constant/theme';

interface MessageCardProps {
  name: string;
  message: string;
  time: string;
  avatar: string | null | undefined;
  unreadCount?: number;
  online?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

const MessageCard: React.FC<MessageCardProps> = ({
  name,
  message,
  time,
  avatar,
  unreadCount,
  online,
  onPress,
  onLongPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Avatar uri={avatar} name={name} size={54} />
        {online && <View style={styles.onlineDot} />}
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {message}
        </Text>
      </View>

      {/* Unread Count */}
      {unreadCount ? (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default MessageCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    backgroundColor: '#4CD964',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#1D0208',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  time: {
    fontSize: 11,
    color: '#B08092',
    marginLeft: 8,
  },
  message: {
    fontSize: 13,
    color: '#F3D7E0',
    lineHeight: 18,
  },
  unreadBadge: {
    backgroundColor: '#FF3366',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginLeft: 10,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
