// Importing necessary components and modules from React Native and other libraries
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../../constants'; // Importing images from a constants file
import FormField from '../../components/FormField'; // Importing a custom form field component
import CustomButton from '../../components/CustomButton'; // Importing a custom button component
import { Link, router } from 'expo-router'; // Importing Link and router for navigation

import { getCurrentUser, signIn } from "../../lib/firebase"; // Importing authentication functions
import { useGlobalContext } from "../../context/GlobalProvider"; // Importing global context

// This is the sign-in page component
const SignIn = () => {
  // Getting functions to set user and login status from the global context
  const { setUser, setIsLoggedIn } = useGlobalContext();
  
  // State to manage loading state of the form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State to manage the form inputs
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  // Function to handle form submission
  const submit = async () => {
    // Check if both email and password are filled
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields');
      return; // Return early if fields are not filled
    }

    // Set loading state to true
    setIsSubmitting(true);
    try {
      // Try to sign in with email and password
      await signIn(form.email, form.password);
      // Get the current user after signing in
      const result = await getCurrentUser();
      // Set the user in the global context
      setUser(result);
      // Set logged in status in the global context
      setIsLoggedIn(true);
      // Redirect to home page
      router.replace('/home');
    } catch (error) {
      // Show an error alert if sign-in fails
      Alert.alert('Error', error.message);
    } finally {
      // Set loading state to false
      setIsSubmitting(false);
    }
  };

  return (
    // SafeAreaView ensures the content is within the safe area boundaries of the device
    <SafeAreaView className='bg-primary h-full'>
      {/* ScrollView allows the content to be scrollable */}
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          {/* Displaying the logo */}
          <Image source={images.logo} resizeMode='contain' className="w-[115px] h-[35px]" />
          {/* Displaying the title text */}
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Log in to Sidekick</Text>
          {/* Email input field */}
          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles='mt-7'
            keyboardType='email-address'
          />
          {/* Password input field */}
          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles='mt-7' 
          />
          {/* Sign In button */}
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles='mt-7'
            isLoading={isSubmitting}
          />
          {/* Link to sign up page */}
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link href="/sign-up" className='text-lg font-psemibold text-secondary-100'>Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Exporting the SignIn component so it can be used in other parts of the app
export default SignIn;
