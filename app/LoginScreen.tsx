import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { login } from "@/src/repositories/authRepo";
import React, { useState } from "react";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.push("/maps");
    } catch (error: any) {
      Alert.alert("Login Gagal", error.message || "Periksa email dan password");
    }
  };

  return (
    <View className="flex-1 bg-[#166d75] pt-20 px-6 items-center">
      <Image source={require("@/assets/images/CPI-logo.png")} className="w-80 h-40 mb-8" resizeMode="contain" />
      <View className="w-full max-w-sm">
        <Text className="text-white text-sm font-medium mb-1">Email</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#4B5563"
          className="w-full rounded-lg bg-[#e6f0f1] text-gray-800 px-4 py-3 mb-6 border border-gray-300"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text className="text-white text-sm font-medium mb-1">Password</Text>
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#4B5563"
          className="w-full rounded-lg bg-[#e6f0f1] text-gray-800 px-4 py-3 mb-8 border border-gray-300"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity className="w-full bg-[#0f4a50] py-3 rounded-lg" onPress={handleLogin}>
          <Text className="text-white font-semibold text-base text-center">LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-4" onPress={() => router.push("/RegistrationScreen")}>
          <Text className="text-white text-sm text-center">
            Belum punya akun? <Text className="font-semibold">Registrasi</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
