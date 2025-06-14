import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { getAvailableProperties } from "@/src/repositories/productRepo";
import { addBooking } from "@/src/repositories/bookingRepo";
import { Dropdown } from "react-native-element-dropdown";
import { formatRupiah } from "@/src/shared/formatUtils";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

export default function AddBookingScreen() {
  const [customerName, setCustomerName] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dpPrice, setDpPrice] = useState<number | null>(null);

  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);

  const [properties, setProperties] = useState<PropertyCluster[]>([]);
  const [loading, setLoading] = useState(true);

  const { clusterId, productId } = useLocalSearchParams();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: true, title: "Pesan Properti" });
    if (clusterId) setSelectedClusterId(Number(clusterId));
    if (productId) setSelectedProductId(Number(productId));
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await getAvailableProperties();
        setProperties(res);
      } catch (error: any) {
        Alert.alert("Error", error.message || "Gagal mengambil data Properti.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const selectedCluster = useMemo(
    () => properties.find((c) => c.id === selectedClusterId),
    [selectedClusterId, properties]
  );

  const selectedProduct = useMemo(
    () => selectedCluster?.products.find((p) => p.id === selectedProductId),
    [selectedCluster, selectedProductId]
  );

  const handleSubmit = async () => {
    const customer = customerName.trim();
    const identification = identificationNumber.trim();
    const phone = phoneNumber.trim();

    const fields = [customer, identification, phone, dpPrice, selectedClusterId, selectedProductId, selectedUnitId];
    if (fields.some((v) => v === null || v === "")) return Alert.alert("Error", "Semua kolom harus diisi");
    if (isNaN(+identification)) return Alert.alert("Error", "Nomor KTP harus berupa angka");
    if (identification.length !== 16) return Alert.alert("Error", "Nomor KTP harus 16 digit");
    if (isNaN(+phone)) return Alert.alert("Error", "Nomor Telepon harus berupa angka");
    if (phone.length < 10 || phone.length > 13) return Alert.alert("Error", "Nomor Telpon harus antara 10-13 digit");

    try {
      await addBooking(customer, identification, phone, dpPrice!, selectedUnitId!);
    } catch (error: any) {
      return Alert.alert("Pemesanan Gagal", error.message || "Periksa kolom yang diisi dan coba lagi.");
    }

    Alert.alert("Sukses", "Properti berhasil dipesan", [
      {
        text: "OK",
        onPress: () => {
          router.dismissAll();
          router.replace("/BookingListScreen");
        },
      },
    ]);
  };

  const RenderDropdown = ({
    label,
    data,
    value,
    onChange,
  }: {
    label: string;
    data: any[];
    value: number | null;
    onChange: (item: any) => void;
  }) => (
    <View className="gap-1">
      <Text className="text-white text-sm font-medium">{label}</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        itemContainerStyle={styles.itemContainer}
        activeColor="#b7d4d8"
        data={data}
        maxHeight={200}
        labelField="name"
        valueField="id"
        placeholder="Pilih"
        value={value}
        onChange={onChange}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0F7480]">
      {loading ? (
        <ActivityIndicator testID="activity-indicator" size="large" color="#fff" className="flex-1" />
      ) : (
        <ScrollView>
          <View className="flex-1 max-w-md gap-4 p-6">
            {[
              { label: "Nama Pelanggan", value: customerName, setter: setCustomerName, keyboard: "default" },
              { label: "Nomor KTP", value: identificationNumber, setter: setIdentificationNumber, keyboard: "numeric" },
              { label: "Nomor Telepon", value: phoneNumber, setter: setPhoneNumber, keyboard: "phone-pad" },
            ].map(({ label, value, setter, keyboard }) => (
              <View className="gap-1" key={label}>
                <Text className="text-white text-sm font-medium">{label}</Text>
                <TextInput
                  className="bg-[#e6f0f1] text-gray-800 text-base rounded-lg px-4 py-3 border border-gray-300"
                  placeholder={label}
                  value={value}
                  onChangeText={setter}
                  keyboardType={keyboard as any}
                />
              </View>
            ))}

            <View className="gap-1">
              <Text className="text-white text-sm font-medium">Nominal DP</Text>
              <TextInput
                className="bg-[#e6f0f1] text-gray-800 text-base rounded-lg px-4 py-3 border border-gray-300"
                placeholder="Pilih properti terlebih dahulu"
                value={dpPrice ? formatRupiah(dpPrice) : ""}
                editable={false}
              />
            </View>

            <RenderDropdown
              label="Kluster"
              data={properties}
              value={selectedClusterId}
              onChange={(item) => {
                setSelectedClusterId(item.id);
                setSelectedProductId(null);
                setSelectedUnitId(null);
                setDpPrice(null);
              }}
            />

            {selectedCluster && (
              <RenderDropdown
                label="Produk"
                data={selectedCluster.products}
                value={selectedProductId}
                onChange={(item) => {
                  setSelectedProductId(item.id);
                  setSelectedUnitId(null);
                  setDpPrice(null);
                }}
              />
            )}

            {selectedProduct && (
              <RenderDropdown
                label="Unit"
                data={selectedProduct.units}
                value={selectedUnitId}
                onChange={(item) => {
                  setSelectedUnitId(item.id);
                  const price = item.type === "corner" ? selectedProduct.corner_price : selectedProduct.default_price;
                  setDpPrice(price);
                }}
              />
            )}

            <TouchableOpacity className="w-full bg-[#07484E] mt-4 py-4 rounded-lg" onPress={handleSubmit}>
              <Text className="text-white font-extrabold text-base text-center">Pesan Properti</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: "#e6f0f1",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  itemContainer: {
    backgroundColor: "#e6f0f1",
  },
  placeholderStyle: {
    fontSize: 16,
    opacity: 0.6,
  },
});
