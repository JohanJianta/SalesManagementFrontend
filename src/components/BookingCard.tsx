import { TouchableOpacity, View, Text } from "react-native";
import { formatLocalDate } from "../shared/formatUtils";
import React from "react";

type Props = {
  booking: BriefBooking;
  onPress: () => void;
};

export default function BookingCard({ booking, onPress }: Props) {
  const renderStatus = () => {
    const statusMap: Record<string, { text: string; className: string }> = {
      completed: { text: "Selesai", className: "bg-green-100 text-green-700" },
      pending: { text: "Menunggu", className: "bg-yellow-100 text-yellow-700" },
      cancelled: { text: "Batal", className: "bg-red-100 text-red-700" },
    };
    const { text, className } = statusMap[booking.status] || statusMap["cancelled"];

    return <Text className={`text-sm font-medium px-3 py-1 rounded-full ${className}`}>{text}</Text>;
  };

  return (
    <TouchableOpacity testID="booking-card" activeOpacity={0.8} onPress={onPress}>
      <View className="bg-[#07484E] rounded-2xl gap-4 p-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-extrabold text-white">{booking.customer_name}</Text>
          {renderStatus()}
        </View>

        <Text className="text-base text-white font-medium">
          {`Unit ${booking.property_data.unit} [ ${booking.property_data.cluster} - ${booking.property_data.product} ]`}
        </Text>

        <Text className="text-base text-gray-400 font-medium">{formatLocalDate(booking.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}
