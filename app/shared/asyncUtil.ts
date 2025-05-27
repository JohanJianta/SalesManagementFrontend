import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveToStorage(key: string, value: any): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    throw err;
  }
}

export async function getFromStorage<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return null;

    const object = JSON.parse(value);
    return object;
  } catch (err) {
    throw err;
  }
}

export default {
  saveToStorage,
  getFromStorage,
};
