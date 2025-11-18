import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_PREFIX = 'quick_kode_';
export class LocalStorage {
  static async save(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_PREFIX + key, value);
  }

  static async get(key: string): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_PREFIX + key);
  }

  static async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_PREFIX + key);
  }
}
