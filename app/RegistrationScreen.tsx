import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { register } from "@/src/repositories/authRepo";
import React, { useState } from "react";
import { router } from "expo-router";

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export default function RegistrationScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    const inputName = fullName.trim();
    const inputEmail = email.trim();
    const inputPass = password.trim();
    const inputConfirmPass = confirmPassword.trim();

    if (!inputName) {
      Alert.alert("Error", "Nama tidak boleh kosong");
      return;
    }

    if (!inputEmail || !isValidEmail(inputEmail)) {
      Alert.alert("Error", "Email tidak valid");
      return;
    }

    if (!inputPass || inputPass.length < 6) {
      Alert.alert("Error", "Password minimal berisikan 6 karakter");
      return;
    }

    if (inputPass !== inputConfirmPass) {
      Alert.alert("Error", "Konfirmasi password tidak sama");
      return;
    }

    try {
      await register(fullName, email, password);
      Alert.alert("Sukses", "Registrasi berhasil");
      router.push("/MapScreen");
    } catch (error: any) {
      Alert.alert("Registrasi Gagal", error.message || "Terjadi kesalahan");
    }
  };

  return (
    <View className="flex-1 bg-[#0F7480] pt-20 px-6 items-center">
      <Image source={require("@/assets/images/CPI-logo.png")} className="w-80 h-40 mb-8" resizeMode="contain" />
      <View className="w-full max-w-sm">
        <Text className="text-white text-sm font-medium mb-1">Nama Lengkap</Text>
        <TextInput
          placeholder="Masukkan nama lengkap"
          placeholderTextColor="#4B5563"
          className="w-full rounded-lg bg-[#e6f0f1] text-gray-800 px-4 py-3 mb-6 border border-gray-300"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text className="text-white text-sm font-medium mb-1">Email</Text>
        <TextInput
          placeholder="Masukkan email"
          placeholderTextColor="#4B5563"
          className="w-full rounded-lg bg-[#e6f0f1] text-gray-800 px-4 py-3 mb-6 border border-gray-300"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text className="text-white text-sm font-medium mb-1">Password</Text>
        <TextInput
          placeholder="Masukkan password"
          placeholderTextColor="#4B5563"
          className="w-full rounded-lg bg-[#e6f0f1] text-gray-800 px-4 py-3 mb-6 border border-gray-300"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text className="text-white text-sm font-medium mb-1">Konfirmasi Password</Text>
        <TextInput
          placeholder="Konfirmasi password"
          placeholderTextColor="#4B5563"
          className="w-full rounded-lg bg-[#e6f0f1] text-gray-800 px-4 py-3 mb-8 border border-gray-300"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity className="w-full bg-[#07484E] py-3 rounded-lg" onPress={handleRegister}>
          <Text className="text-white font-semibold text-base text-center">DAFTAR</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-4" onPress={() => router.push("/LoginScreen")}>
          <Text className="text-white text-sm text-center">
            Sudah punya akun? <Text className="font-semibold">Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
