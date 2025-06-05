module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native" +
      "|@react-native" +
      "|react-navigation" +
      "|@react-navigation" +
      "|@react-native-community" +
      "|@react-native-firebase" +
      ")/)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"],
  testEnvironment: "node",
  setupFiles: ["./jest.setup.js"],
};
