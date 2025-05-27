import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';

export default function RegistrationPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password dan konfirmasi harus sama');
      return;
    }

    try {
      await axios.post('http://18.139.110.33:3000/api/register', {
        name: fullName,
        email,
        password
      });

      Alert.alert('Sukses', 'Registrasi berhasil, silakan login');
      router.push('/loginpage');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Registrasi gagal', error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  return (
    <View className="flex-1 bg-[#166d75] pt-20 px-6 items-center">
      <Image source={require('../assets/images/CPI-logo.png')} className="w-80 h-40 mb-8" resizeMode="contain" />
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

        <TouchableOpacity className="w-full bg-[#0f4a50] py-3 rounded-lg" onPress={handleRegister}>
          <Text className="text-white font-semibold text-base text-center">DAFTAR</Text>
        </TouchableOpacity>

        <TouchableOpacity className="mt-4" onPress={() => router.push('/loginpage')}>
          <Text className="text-white text-sm text-center">
            Sudah punya akun? <Text className="font-semibold">Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
