import { StatusBar, View } from "react-native";
import LoginScreen from "./LoginScreen";

export default function Index() {
  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" className="bg-[#0F7480]" />
      <LoginScreen />
    </View>
  );
}
