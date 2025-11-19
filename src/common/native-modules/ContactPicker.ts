import { NativeModules, PermissionsAndroid, Platform } from 'react-native';
import { showAndroidToast } from '../helpers/utils';
const { ContactPicker: ContactPickerModule } = NativeModules;
interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
}

const requestPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: 'Contacts Permission',
        message: 'This app needs access to your contacts',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

export class ContactPicker {
  static async pickContact(): Promise<Contact | void> {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        throw new Error('Permission denied');
      }
      const contact: Contact = await ContactPickerModule.pickContact();
      return contact;
    } catch (e) {
      console.log(`Failed to pick contact: ${e}`);
      showAndroidToast('Failed to pick contact');
    }
  }
}

export default ContactPicker;
