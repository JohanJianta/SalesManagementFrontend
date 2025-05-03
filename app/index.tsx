import { Text, View, Pressable } from "react-native";
import { router } from "expo-router"; // If you're using expo-router
// Or use useNavigation from @react-navigation/native if not using expo-router

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-blue-500 text-2xl mb-4">
        Edit app/index.tsx to edit this screen.
      </Text>

      <Pressable
        className="bg-blue-500 px-4 py-2 rounded-xl"
        onPress={() => router.push("/loginpage")}
      >
        <Text className="text-white text-lg">Go to Login</Text>
      </Pressable>
    </View>
  );
}
