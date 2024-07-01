import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from "expo-router"; // Importing router from expo-router

const MessagesList = () => {
  const { user } = useGlobalContext();

  // This should be replaced with actual data from your backend
  const conversations = [
    { id: '1', username: 'User1', lastMessage: 'Hello there!' },
    { id: '2', username: 'User2', lastMessage: 'How are you?' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => router.push({
        pathname: "MessagingScreen",
        params: { recipientId: item.id, itemId: item.id }
      })}
    >
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.lastMessage}>{item.lastMessage}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    padding: 20,
  },
  conversationItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#232533',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  lastMessage: {
    fontSize: 14,
    color: '#CDCDE0',
    marginTop: 5,
  },
});

export default MessagesList;