// screens/MessagesScreen.tsx
import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native';
// import MessageCard from '../components/MessageCard';
import LinearGradient from 'react-native-linear-gradient';
import MessageCard from '../../components/MessageCard';
// import MessageItem from '../components/MessageItem';

const MessagesScreen = () => {
    const messages = [
        {
            id: 1,
            name: 'Priya Sharma',
            message: "That sounds like a great plan! I'd love to...",
            time: '2 min ago',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            unreadCount: 2,
            online: true,
        },
        {
            id: 2,
            name: 'Arjun Patel',
            message: 'Thanks for sharing those photos! Your family s...',
            time: '1 hour ago',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            unreadCount: 0,
            online: false,
        },
        {
            id: 3,
            name: 'Sneha Gupta',
            message: 'I really enjoyed our conversation yesterday.',
            time: '1 day ago',
            avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
            unreadCount: 0,
            online: true,
        },
        {
            id: 3,
            name: 'Priya Sharma',
            message: "That sounds like a great plan! I'd love to...",
            time: '2 min ago',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            unreadCount: 2,
            online: true,
        },
        {
            id: 5,
            name: 'Arjun Patel',
            message: 'Thanks for sharing those photos! Your family s...',
            time: '1 hour ago',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            unreadCount: 0,
            online: false,
        },
        {
            id: 34,
            name: 'Sneha Gupta',
            message: 'I really enjoyed our conversation yesterday.',
            time: '1 day ago',
            avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
            unreadCount: 0,
            online: true,
        },
    ];

    return (
        <LinearGradient
            colors={['#FFDAB9', 'white', "pink"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientContainer}
        >


            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Messages</Text>
                <Text style={styles.subtitle}>
                    Connect with your matches and build meaningful relationships
                </Text>

                <FlatList
                    contentContainerStyle={styles.list}
                    data={messages}
                    renderItem={({ item }) => (
                        <MessageCard key={item.id} {...item} />

                    )}

                />
            </ScrollView>
        </LinearGradient>
    );
};

export default MessagesScreen;




const styles = StyleSheet.create({
    gradientContainer: {
        borderRadius: 12,
        // marginBottom: 12,
        flex: 1,
    },
    container: {
        // backgroundColor: '#fafafa',
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111',
    },
    subtitle: {
        color: '#666',
        fontSize: 14,
        marginBottom: 20,
    },
    list: {
        marginTop: 8,
    },
});
