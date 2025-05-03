import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { router } from "expo-router";
export default function LoginPage() {
  return (
    <View className="flex-1 bg-[#166d75] pt-20 px-6 items-center">
      <Image
        source={require('../assets/images/CPI-logo.png')}
        className="w-80 h-40 mb-8"
        resizeMode="contain"
      />

      <View className="w-full max-w-sm">
        {/* Email */}
        <Text className="text-white text-sm font-medium mb-1 tracking-wide">
          Email
        </Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#4B5563" // Tailwind gray-600
          className="w-full rounded-lg bg-[#e6f0f1] text-gray-800 px-4 py-3 mb-6 border border-gray-300"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password */}
        <Text className="text-white text-sm font-medium mb-1 tracking-wide">
          Password
        </Text>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#4B5563"
          className="w-full rounded-lg bg-[#e6f0f1] text-gray-800 px-4 py-3 mb-8 border border-gray-300"
          secureTextEntry
        />

        {/* Login Button */}
        <TouchableOpacity className="w-full bg-[#0f4a50] py-3 rounded-lg active:opacity-90"
        onPress={() => router.push("/home")}>
          <Text className="text-white font-semibold text-base text-center tracking-widest">
            LOGIN
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
