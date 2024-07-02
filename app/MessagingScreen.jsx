import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Image, Text, Alert, Dimensions, Platform } from 'react-native';
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
  const [inputMessage, setInputMessage] = useState('');
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
    setInputMessage('');
  }, [sendMessage, user.id, recipientId]);

  const pickMedia = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
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
            <View className="bg-black rounded-lg overflow-hidden" style={{ width, height }}>
              <Image
                source={{ uri: currentMessage.image }}
                className="w-full h-full"
              />
            </View>
          </TouchableOpacity>
        );
      }

      if (currentMessage.video) {
        return (
          <View className="bg-black rounded-lg overflow-hidden" style={{ width, height }}>
            <Video
              source={{ uri: currentMessage.video }}
              className="w-full h-full"
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
      <Send {...props} containerStyle="justify-center items-center w-11 h-11 mr-1">
        <Ionicons name="send" size={24} color="#5B37B7" />
      </Send>
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle="bg-black-200 border-t-0 pt-1.5 pb-1.5 items-center justify-center"
        primaryStyle="items-center"
        renderActions={() => (
          <TouchableOpacity onPress={pickMedia} className="justify-center items-center w-11 h-11 ml-1">
            <Ionicons name="image" size={24} color="#5B37B7" />
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <SafeAreaView className="bg-primary border-2 h-full">
      <View className="flex-row items-center p-2.5 border-b border-black-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center ml-2.5">
          <Image 
            source={{ uri: 'https://via.placeholder.com/40' }} 
            className="w-10 h-10 rounded-full mr-2.5"
          />
          <Text className="text-white text-lg font-psemibold">{recipientName}</Text>
        </View>
        <TouchableOpacity className="mx-2">
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
        textInputProps={{
          className: "flex-1 text-white bg-black-100 rounded-full px-3 py-2 mx-2.5 text-base leading-6 max-h-24",
          placeholderTextColor: "#666",
          multiline: true,
        }}
        text={inputMessage}
        onInputTextChanged={text => setInputMessage(text)}
        bottomOffset={Platform.select({ios: 34, android: 0})}
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

export default MessagingScreen;