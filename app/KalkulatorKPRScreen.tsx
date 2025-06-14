import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { formatRupiah } from "@/src/shared/formatUtils";
import Slider from "@react-native-community/slider";

export default function KalkulatorKPR() {
  const [price, setPrice] = useState<number>(100000000);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(7);
  const [tenor, setTenor] = useState<number>(10);
  const [monthlyInstallment, setMonthlyInstallment] = useState<number>(0);

  const { defaultPrice, cornerPrice } = useLocalSearchParams();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Kalkulator KPR",
    });
    price && setPrice(Number(defaultPrice) || 100000000);
  }, [navigation]);

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
      const C = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
      setMonthlyInstallment(C);
    } else {
      setMonthlyInstallment(0);
    }
  }, [price, downPayment, interestRate, tenor]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#0F7480] p-6 justify-center"
    >
      {/* Harga Rumah */}
      <View className="mb-6">
        <Text className="mb-1 text-base text-white font-medium">Harga Rumah: {formatRupiah(price)}</Text>
        <Slider
          minimumValue={100000000}
          maximumValue={5000000000}
          step={10000000}
          value={price}
          onSlidingComplete={(value) => {
            setPrice(value);
            if (downPayment > value && downPayment !== value) {
              setDownPayment(value);
            }
          }}
          minimumTrackTintColor="#07484E"
          thumbTintColor="#07484E"
          className="h-10"
        />
      </View>

      {/* Uang Muka */}
      <View className="mb-6">
        <Text className="mb-1 text-base text-white font-medium">Nominal DP: {formatRupiah(downPayment)}</Text>
        <Slider
          minimumValue={0}
          maximumValue={price}
          step={10000000}
          value={downPayment}
          onSlidingComplete={setDownPayment}
          minimumTrackTintColor="#07484E"
          thumbTintColor="#07484E"
          className="h-10"
        />
      </View>

      {/* Suku Bunga */}
      <View className="mb-6">
        <Text className="mb-1 text-base text-white font-medium">Suku Bunga per Tahun: {interestRate.toFixed(2)}%</Text>
        <Slider
          minimumValue={0}
          maximumValue={20}
          step={0.01}
          value={interestRate}
          onSlidingComplete={setInterestRate}
          minimumTrackTintColor="#07484E"
          thumbTintColor="#07484E"
          className="h-10"
        />
      </View>

      {/* Jangka Waktu */}
      <View className="mb-6">
        <Text className="mb-1 text-base text-white font-medium">Jangka Waktu: {tenor} tahun</Text>
        <Slider
          minimumValue={1}
          maximumValue={30}
          step={1}
          value={tenor}
          onSlidingComplete={setTenor}
          minimumTrackTintColor="#07484E"
          thumbTintColor="#07484E"
          className="h-10"
        />
      </View>

      {/* Tampilkan Cicilan */}
      <View className="mt-4">
        {monthlyInstallment > 0 ? (
          <>
            <Text className="text-center text-2xl text-white font-extrabold">
              Cicilan per bulan: {formatRupiah(Math.round(monthlyInstallment))}
            </Text>

            <Text className="text-center text-base text-gray-300 mt-1">(*disclaimer ini hanya simulasi)</Text>
          </>
        ) : (
          <Text className="text-center text-base text-red-600 font-semibold">
            Uang muka tidak boleh sama atau lebih dari harga rumah
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
