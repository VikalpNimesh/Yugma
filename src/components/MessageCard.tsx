// components/MessageCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface MessageCardProps {
    name: string;
    message: string;
    time: string;
    avatar: string;
    unreadCount?: number;
    online?: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({
    name,
    message,
    time,
    avatar,
    unreadCount,
    online,
}) => {
    return (
        <View style={styles.container}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                {online && <View style={styles.onlineDot} />}
            </View>

            {/* Text Content */}
            <View style={styles.textContainer}>
                <View style={styles.topRow}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.time}>{time}</Text>
                </View>
                <Text style={styles.message} numberOfLines={1}>
                    {message}
                </Text>
            </View>

            {/* Unread Count */}
            {unreadCount ? (
                <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{unreadCount}</Text>
                </View>
            ) : null}
        </View>
    );
};

export default MessageCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#dadada',
        alignItems: 'center',
        justifyContent: "center",

    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 25,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 10,
        height: 10,
        backgroundColor: '#00C851',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#fff',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    name: {
        fontWeight: '600',
        fontSize: 16,
        color: '#111',
    },
    time: {
        color: '#999',
        fontSize: 12,
    },
    message: {
        color: '#666',
        fontSize: 14,
        marginTop: 2,
    },
    unreadBadge: {
        backgroundColor: '#ff3b30',
        borderRadius: 12,
        minWidth: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginLeft: 8,

    },
    unreadText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});
