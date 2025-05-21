import Toast from 'react-native-toast-message';

class ToastAlert {
  #toast;
  constructor() {
    this.#toast = Toast;
  }

  success(title = '', message = '') {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
    });
  }

  info(title = '', message = '') {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
    });
  }

  error(title = '', message = '') {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
    });
  }
}

export default new ToastAlert();
