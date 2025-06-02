import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { FileUp } from "lucide-react-native";
import React, { useState } from "react";

const AddPromo = () => {
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");

  const handleSubmit = () => {
    // Lakukan sesuatu dengan data form, seperti mengirim ke server
    console.log("Title:", title);
    console.log("Period:", period);
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-xl font-semibold mb-4 text-center">Add Promo</Text>

      {/* Input Title */}
      <View className="mb-4">
        <Text className="text-lg font-medium mb-2">Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter promo title"
          className="border-2 border-gray-300 rounded-lg p-3 text-lg"
        />
      </View>

      {/* Input Period */}
      <View className="mb-4">
        <Text className="text-lg font-medium mb-2">Period</Text>
        <TextInput
          value={period}
          onChangeText={setPeriod}
          placeholder="Enter promo period"
          className="border-2 border-gray-300 rounded-lg p-3 text-lg"
        />
      </View>
      <View className="border-2 border-dashed border-blue-600 p-6 rounded-xl w-full max-w-sm">
        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-blue-600 py-4 rounded-xl shadow-lg mt-4 flex items-center justify-center"
        >
          <FileUp size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddPromo;
