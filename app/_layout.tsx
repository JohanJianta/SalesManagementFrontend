import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#0F7480",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </GestureHandlerRootView>
  );
}
