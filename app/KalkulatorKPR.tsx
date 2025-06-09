import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Slider from '@react-native-community/slider';

export default function KalkulatorKPR() {
  const [price, setPrice] = useState<number>(100000000);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(7);
  const [tenor, setTenor] = useState<number>(10);
  const [monthlyInstallment, setMonthlyInstallment] = useState<number>(0);

  // Hitung cicilan otomatis tiap input slider berubah
  useEffect(() => {
    if (downPayment >= price) {
      setMonthlyInstallment(0);
      return;
    }
    const P = price - downPayment;
    const r = interestRate / 100 / 12;
    const n = tenor * 12;

    if (P > 0 && r > 0 && n > 0) {
      const C = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setMonthlyInstallment(C);
    } else {
      setMonthlyInstallment(0);
    }
  }, [price, downPayment, interestRate, tenor]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white p-6 justify-center"
    >
      <Text className="text-2xl font-bold mb-6 text-center">Kalkulator KPR</Text>

      {/* Harga Rumah */}
      <View className="mb-6">
        <Text className="mb-1 font-semibold">
          Harga Rumah: Rp {price.toLocaleString('id-ID')}
        </Text>
        <Slider
          minimumValue={100000000}
          maximumValue={5000000000}
          step={10000000}
          value={price}
          onValueChange={value => {
            setPrice(value);
            if (downPayment > value) setDownPayment(value);
          }}
          minimumTrackTintColor="#2563EB"
          maximumTrackTintColor="#D1D5DB"
          thumbTintColor="#2563EB"
          className="h-10"
        />
      </View>

      {/* Uang Muka */}
      <View className="mb-6">
        <Text className="mb-1 font-semibold">
          Uang Muka: Rp {downPayment.toLocaleString('id-ID')}
        </Text>
        <Slider
          minimumValue={0}
          maximumValue={price}
          step={10000000}
          value={downPayment}
          onValueChange={setDownPayment}
          minimumTrackTintColor="#2563EB"
          maximumTrackTintColor="#D1D5DB"
          thumbTintColor="#2563EB"
          className="h-10"
        />
      </View>

      {/* Suku Bunga */}
      <View className="mb-6">
        <Text className="mb-1 font-semibold">
          Suku Bunga per Tahun: {interestRate.toFixed(2)}%
        </Text>
        <Slider
          minimumValue={0}
          maximumValue={20}
          step={0.01}
          value={interestRate}
          onValueChange={setInterestRate}
          minimumTrackTintColor="#2563EB"
          maximumTrackTintColor="#D1D5DB"
          thumbTintColor="#2563EB"
          className="h-10"
        />
      </View>

      {/* Jangka Waktu */}
      <View className="mb-6">
        <Text className="mb-1 font-semibold">
          Jangka Waktu: {tenor} tahun
        </Text>
        <Slider
          minimumValue={1}
          maximumValue={30}
          step={1}
          value={tenor}
          onValueChange={setTenor}
          minimumTrackTintColor="#2563EB"
          maximumTrackTintColor="#D1D5DB"
          thumbTintColor="#2563EB"
          className="h-10"
        />
      </View>

      {/* Tampilkan Cicilan */}
      <View className="mt-4">
        {monthlyInstallment > 0 ? (
          <>
           <Text className="text-center text-xl font-semibold text-green-700">
  Cicilan per bulan: Rp {Math.round(monthlyInstallment).toLocaleString('id-ID')}
</Text>

            <Text className="text-center text-gray-700 mt-1">
              (*disclaimer ini hanya simulasi)
            </Text>
          </>
        ) : (
          <Text className="text-center text-red-600 font-semibold">
            Uang muka tidak boleh sama atau lebih dari harga rumah
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
