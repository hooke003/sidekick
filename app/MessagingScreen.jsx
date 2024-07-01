import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Alert, Modal, Dimensions } from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
import { Video } from 'expo-av';
import { useWebSocket } from '../context/WebSocketProvider';
import { useGlobalContext } from '../context/GlobalProvider';
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ImageView from "react-native-image-viewing";

const MAX_WIDTH = Dimensions.get('window').width * 0.7; // Max width for media

const MessagingScreen = () => {
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { sendMessage, socket } = useWebSocket();
  const { user } = useGlobalContext();
  const { recipientId, recipientName } = useLocalSearchParams();

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message' && (data.senderId === recipientId || data.recipientId === recipientId)) {
          setMessages(previousMessages => 
            GiftedChat.append(previousMessages, [{
              _id: data.timestamp,
              text: data.content,
              createdAt: new Date(data.timestamp),
              user: {
                _id: data.senderId,
                name: data.senderId === user.id ? user.username : 'Other User',
              },
              image: data.image,
              video: data.video,
              width: data.width,
              height: data.height,
            }])
          );
        }
      };
    }
  }, [socket, recipientId, user.id, user.username]);

  const onSend = useCallback((newMessages = []) => {
    const messageData = {
      type: 'message',
      content: newMessages[0].text || '',
      senderId: user.id,
      recipientId: recipientId,
      timestamp: new Date().toISOString(),
      image: newMessages[0].image || null,
      video: newMessages[0].video || null,
      width: newMessages[0].width || null,
      height: newMessages[0].height || null,
    };
    sendMessage(messageData);
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  }, [sendMessage, user.id, recipientId]);

  const pickMedia = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      // Launch image library to pick an image or video
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false, // Disable the crop screen
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedMedia = result.assets[0];
        const newMessage = [
          {
            _id: Date.now(),
            image: selectedMedia.type === 'image' ? selectedMedia.uri : null,
            video: selectedMedia.type === 'video' ? selectedMedia.uri : null,
            createdAt: new Date(),
            user: {
              _id: user.id,
              name: user.username,
            },
            width: selectedMedia.width,
            height: selectedMedia.height,
          },
        ];
        onSend(newMessage);
      }
    } catch (error) {
      console.error("Error picking media: ", error);
      Alert.alert("Error", "There was an error picking the media.");
    }
  };

  const renderBubble = (props) => {
    const { currentMessage } = props;

    if (currentMessage.image || currentMessage.video) {
      const aspectRatio = currentMessage.width / currentMessage.height;
      const width = Math.min(MAX_WIDTH, currentMessage.width);
      const height = width / aspectRatio;

      if (currentMessage.image) {
        return (
          <TouchableOpacity onPress={() => setSelectedImage(currentMessage.image)}>
            <View style={[styles.mediaContainer, { width, height }]}>
              <Image
                source={{ uri: currentMessage.image }}
                style={styles.media}
              />
            </View>
          </TouchableOpacity>
        );
      }

      if (currentMessage.video) {
        return (
          <View style={[styles.mediaContainer, { width, height }]}>
            <Video
              source={{ uri: currentMessage.video }}
              style={styles.media}
              useNativeControls
              resizeMode="contain"
              isLooping
            />
          </View>
        );
      }
    }

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#5B37B7',
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 5,
            padding: 5,
          },
          left: {
            backgroundColor: '#2C2C2E',
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 15,
            padding: 5,
          },
        }}
        textStyle={{
          right: { color: 'white' },
          left: { color: 'white' },
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#5B37B7" />
        </View>
      </Send>
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.inputPrimary}
      />
    );
  };

  return (
    <SafeAreaView className="bg-primary border-2 h-full">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/40' }} 
            style={styles.avatar}
          />
          <Text style={styles.headerText}>{recipientName}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="call" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="videocam" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: user.id,
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        alwaysShowSend
        renderActions={() => (
          <TouchableOpacity onPress={pickMedia} style={styles.iconButton}>
            <Ionicons name="image" size={24} color="#5B37B7" />
          </TouchableOpacity>
        )}
      />

      {selectedImage && (
        <ImageView
          images={[{ uri: selectedImage }]}
          imageIndex={0}
          visible={true}
          onRequestClose={() => setSelectedImage(null)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputToolbar: {
    backgroundColor: '#1C1C1E',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  inputPrimary: {
    color: 'white',
  },
  iconButton: {
    marginLeft: 10,
    marginBottom: 5,
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 5,
  },
  mediaContainer: {
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
  },
});

export default MessagingScreen;





