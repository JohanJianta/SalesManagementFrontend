jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("expo-router", () => {
  return {
    router: {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    },
    useRouter: () => ({
      push: jest.fn(),
    }),
    useLocalSearchParams: () => ({}),
    useNavigation: () => ({
      setOptions: jest.fn(),
    }),
  };
});

jest.mock("@gorhom/bottom-sheet", () => {
  const reactNative = jest.requireActual("react-native");
  const { View, ScrollView } = reactNative;

  return {
    __esModule: true,
    default: View,
    BottomSheetScrollView: ScrollView,
  };
});
